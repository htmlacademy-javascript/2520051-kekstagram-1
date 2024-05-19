
const dataSource = 'https://28.javascript.htmlacademy.pro/kekstagram/data';
const postPhoto = 'https://28.javascript.htmlacademy.pro/kekstagram';

const selectImageForm = document.querySelector('#upload-select-image');
const submitButton = selectImageForm.querySelector('[type=submit]');

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Сохранение...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

export const sendPhoto = (onSuccess, onError) => {
  blockSubmitButton();
  const formData = new FormData(document.querySelector('#upload-select-image'));
  fetch(
    postPhoto,
    {
      method: 'POST',
      body: formData,
    },
  ).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      onError();
    }
  }).finally(unblockSubmitButton);
};

export const getDataGalery = () => fetch(dataSource)
  .then((response) => {
    if (response.ok) {
      return response;
    }

    throw new Error(`${response.status} — ${response.statusText}`);
  })
  .then((response) => response.json());


