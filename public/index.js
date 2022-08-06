const form = document.getElementById('form');
const directoryPath = document.getElementById('directoryPath');
const resultPath = document.getElementById('resultPath');
const chunkSize = document.getElementById('chunkSize');

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

form.addEventListener('submit', e => {
    e.preventDefault();

    validateAllInputs();
});

directoryPath.addEventListener('blur', e => {
    validateInput(directoryPath, 'Pasta origem é obrigatório');
});

resultPath.addEventListener('blur', e => {
    validateInput(resultPath, 'Pasta destino é obrigatório');
});

chunkSize.addEventListener('blur', e => {
    validateInput(chunkSize, 'Arquivo por pasta é obrigatório');
});