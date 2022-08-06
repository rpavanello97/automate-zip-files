const form = document.getElementById('form');
const directoryPath = document.getElementById('directoryPath');
const resultPath = document.getElementById('resultPath');
const chunkSize = document.getElementById('chunkSize');
const fields = [directoryPath, resultPath, chunkSize]

/** Functions */
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
    element.isValid = false;
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
    element.isValid = true;
}

const validateInput = (input, msg) => {
    const inputValue = input.value.trim();

    inputValue === '' ? setError(input, msg) : setSuccess(input);
}

const validateAllInputs = () => {
    validateInput(directoryPath, 'Pasta origem é obrigatório');
    validateInput(resultPath, 'Pasta destino é obrigatório');
    validateInput(chunkSize, 'Arquivo por pasta é obrigatório');
}

/** Listeners */
form.addEventListener('submit', e => {
    validateAllInputs();

    if (fields.some(e => e.isValid == false)) {
        console.log('has invalid field');
        e.preventDefault();
    }
});

directoryPath.addEventListener('blur', e => {
    validateInput(directoryPath, 'Pasta origem é obrigatório');
});

resultPath.addEventListener('blur', e => {
    validateInput(resultPath, 'Pasta destino é obrigatório');
});

chunkSize.addEventListener('blur', e => {
    validateInput(chunkSize, 'Arquivo por pasta é obrigatório');
    if (chunkSize.value.trim() == 0) setError(chunkSize, 'Número 0 é inválido');

});