// Дві функції для спрощення пошуку за селекторами
const getS = selector => document.querySelector(selector);
const getSAll = selector => document.querySelectorAll(selector);

// Змінна, що містить дані про однорідність
let isHomogeneous;

// Додавання подій до певних кнопок
getS('.type-formula-button').addEventListener('click', () => {
    isHomogeneous = Boolean(getS('.type-formula:checked').value);
    getS('.choose-type').style.display = 'none';
    getS('.choose-grade').style.display = 'flex';
})

getS('.grade-button').addEventListener('click', () => {
    // Вибір кількості розрядів рівняння
    let amountGrades = getS('.grade-input').value;
    homogeneousEquation(amountGrades);
})

// Функція для надання значень змінним
function homogeneousEquation(amountGrades) {
    getS('.choose-grade').style.display = 'none';

    // Перевірка на однорідність
    if (isHomogeneous) {
        getS('.homogeneous-equation').style.display = 'flex';
        for (let i = 0; i < amountGrades; i++) {
            let setBlock = document.createElement('div');
            let grade = document.createElement('input');
            let zeroGrade = document.createElement('input');

            grade.setAttribute('type', 'number');
            grade.setAttribute('placeholder', 'Введіть коефіцієнт розряда')

            zeroGrade.setAttribute('type', 'radio');
            zeroGrade.setAttribute('name', 'zeroGrade');

            setBlock.classList.add('dischargeBlock')
            setBlock.append(grade);
            setBlock.append(zeroGrade);
            getS('.homogeneous-discharges').append(setBlock);
        }

        getS('.homogeneous-button').addEventListener('click', () => {
            let dischargeBlocks = getSAll('.dischargeBlock');
            let dischargeData = [];

            let dischargeValue = getS('.value-grade').value;
            dischargeBlocks.forEach((block) => {
                const getSBlock = selector => block.querySelector(selector);
                let numberInput = getSBlock('input[type="number"]');
                let radioInput = getSBlock('input[type="radio"]');

                dischargeData.push({
                    number: Number(numberInput.value),
                    isChecked: radioInput ? radioInput.checked : false,
                })

            })
            homogeneousCalc(dischargeData, dischargeValue)
        })
    }
    else if (!isHomogeneous) {
        getS('.inhomogeneous-equation').style.display = 'flex';
        for (let i = 0; i < amountGrades; i++) {
            let setBlock = document.createElement('div');
            let grade = document.createElement('input');
            let zeroGrade = document.createElement('input');

            grade.setAttribute('type', 'number');
            grade.setAttribute('placeholder', 'Введіть коефіцієнт розряда');

            zeroGrade.setAttribute('type', 'radio');
            zeroGrade.setAttribute('name', 'zeroGrade');

            setBlock.classList.add('dischargeBlock');
            setBlock.append(grade);
            setBlock.append(zeroGrade);
            getS('.inhomogeneous-grade').append(setBlock);
        }
        getS('.inhomogeneous-button').addEventListener('click', () => {
            let dischargeBlocks = getSAll('.dischargeBlock');
            let dischargeData = [];

            dischargeBlocks.forEach((block) => {
                const getSBlock = selector => block.querySelector(selector);
                let numberInput = getSBlock('input[type="number"]');
                let radioInput = getSBlock('input[type="radio"]');

                dischargeData.push({
                    number: Number(numberInput.value),
                    isChecked: radioInput ? radioInput.checked : false,
                })
            })

            getS('.inhomogeneous-equation').style.display = 'none';
            getS('.inhomogeneous-equation-second').style.display = 'flex';


            for (let i = 0; i < amountGrades; i++) {
                let setBlock = document.createElement('div');
                let additionalSetBlock = document.createElement('div');
                let valueGrade = document.createElement('input');
                let zeroGrade = document.createElement('p');
                let numberGrade = document.createElement('p');

                valueGrade.setAttribute('type', 'number');
                valueGrade.classList.add('inhomo-grade');
                zeroGrade.classList.add('zeroGrade');
                numberGrade.classList.add('numberGrade');
                valueGrade.setAttribute('placeholder', 'Введіть значення розряда');

                additionalSetBlock.classList.add('additionalSetBlock')
                setBlock.classList.add('dischargeBlockSecond')
                setBlock.append(zeroGrade);
                setBlock.append(additionalSetBlock);
                additionalSetBlock.append(numberGrade);
                additionalSetBlock.append(valueGrade);
                getS('.inhomogeneous-grade-second').append(setBlock);
            }

            const ZeroIndex = dischargeData.findIndex(obj => obj.isChecked === true);
            getSAll('.inhomo-grade')[ZeroIndex].disabled = true;
            getSAll('.inhomo-grade')[ZeroIndex].value = '1';
            for (let i = ZeroIndex; i >= 0; i--) {
                getSAll('.numberGrade')[i].innerText = dischargeData[i].number;
                getSAll('.zeroGrade')[i].innerText = ZeroIndex - i;
            }
            for (let i = 1 + ZeroIndex; i < dischargeData.length; i++) {
                getSAll('.numberGrade')[i].innerText = dischargeData[i].number;
                getSAll('.zeroGrade')[i].innerText = -i + ZeroIndex;
            }

            getS('.inhomogeneous-button-second').addEventListener('click', () => {
                for (let i = 0; i < dischargeData.length; i++) {
                    let numberInput = getSAll('.inhomo-grade')[i];
                    dischargeData[i].converterValue = parseInt(numberInput.value);
                }

                inhomogeneousCalc(dischargeData)
            })
        })
    }
}

// Функція обрахунку однорідного рівняння
function homogeneousCalc(dischargeData, dischargeValue) {
    dischargeData = dischargeData.reverse();
    let result = dischargeData[0].number;
    for (let i = 1; i < dischargeData.length; i++) {
        result = result * dischargeValue + dischargeData[i].number;
    }
    getS('.homogeneous-equation').style.display = 'none';
    getS('.homogeneous-calc').style.display = 'flex';

    let textResult = document.createElement('p');
    textResult.innerText = `Корінь однорідного многочлена: ${result}`;
    getS('.homogeneous-calc').append(textResult);
}

// Функція обрахуну неоднорідного рівняння
function inhomogeneousCalc(dischargeData) {
    let result = 0, temporaryCounter = 0;
    positiveCharge:
    for (let i = 0; ; i++) {
        if (dischargeData[i].isChecked) {
            result += dischargeData[i].converterValue * dischargeData[i].number;
            break positiveCharge;
        }
        temporaryCounter = dischargeData[i].number;
        temporaryLabel:
        for (let j = i; ; j++) {
            temporaryCounter *= dischargeData[j].converterValue;
            if (dischargeData[j].isChecked) {
                result += temporaryCounter;
                break temporaryLabel;
            }
        }
    }

    const ZeroIndex = dischargeData.findIndex(obj => obj.isChecked === true);
    negativeCharge:
    for (let i = dischargeData.length - 1; ; i--) {
        temporaryCounter = dischargeData[i].number;
        if (dischargeData[i].isChecked) {
            break negativeCharge;
        }
        temporaryLabel:
        for (let j = dischargeData.length - 1; ; j--) {
            if (dischargeData[j].isChecked) {
                result += temporaryCounter;
                break temporaryLabel;
            }
            temporaryCounter /= dischargeData[j].converterValue;
        }
    }
    console.log(dischargeData);
    console.log(result);
}
