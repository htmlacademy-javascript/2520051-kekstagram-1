import {validateForm} from './form-validate.js';
import {sendPhoto} from './fetch-source.js';

const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const effectOptions = {
  chrome:{
    range: {
      min: 0,
      max: 1,
    },
    step: 0.1,
  },
  sepia:{
    range: {
      min: 0,
      max: 1,
    },
    step: 0.1,
  },
  marvin: {
    range: {
      min: 0,
      max: 100,
    },
    step: 1,
  },
  phobos:{
    range: {
      min: 0,
      max: 3,
    },
    step: 0.1,
  },
  heat:{
    range: {
      min: 0,
      max: 3,
    },
    step: 0.1,
  }
};

const uploadingFileElement = document.querySelector('#upload-file');
const cancelUploadingElement = document.querySelector('#upload-cancel');
const selectImageForm = document.querySelector('#upload-select-image');
const inputHashtags = selectImageForm.querySelector('.text__hashtags');
const inputDescription = selectImageForm.querySelector('.text__description');
const scaleSmallerControl = document.querySelector('.scale__control--smaller');
const scaleBiggerControl = document.querySelector('.scale__control--bigger');
const scaleValueControl = document.querySelector('.scale__control--value');
const uploadingImgPreview = document.querySelector('.img-upload__preview > img');
const effectLevelElement = document.querySelector('.effect-level__value');
const effectSlider = document.querySelector('.effect-level__slider');
const effectListElement = document.querySelector('.effects__list');

const cancelEscElements = [inputHashtags, inputDescription];

noUiSlider.create(effectSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
});

effectSlider.noUiSlider.on('update', () => {
  const effectValue = effectSlider.noUiSlider.get();
  effectLevelElement.value = effectValue;
  const effectTitle = uploadingImgPreview.className.split('--')[1];
  let filter = 'none';
  switch (effectTitle) {
    case 'chrome':
      filter = `grayscale(${effectValue})`;
      break;
    case 'sepia':
      filter = `sepia(${effectValue})`;
      break;
    case 'marvin':
      filter = `invert(${effectValue}%)`;
      break;
    case 'phobos':
      filter = `blur(${effectValue}px)`;
      break;
    case 'heat':
      filter = `brightness(${effectValue})`;
      break;
  }
  uploadingImgPreview.style.filter = filter;
});

effectListElement.addEventListener('change', (evt) => {
  if (evt.target.matches('input[type="radio"]')) {
    uploadingImgPreview.removeAttribute('class');
    uploadingImgPreview.classList.add(`effects__preview--${evt.target.value}`);
    effectSlider.parentNode.style.display = evt.target.value === 'none' ? 'none' : 'block';
    if (evt.target.value === 'none') {
      uploadingImgPreview.style.filter = 'none';
    } else {
      effectSlider.noUiSlider.updateOptions(effectOptions[evt.target.value]);
      effectSlider.noUiSlider.set(effectOptions[evt.target.value].range.max);
    }
  }
});

const changeScaleVal = (scale) => {
  const currentValue = Number(scaleValueControl.value.slice(0,-1));
  let newValue = currentValue + scale;
  if (newValue > MAX_SCALE) {
    newValue = MAX_SCALE;
  }
  if (newValue < MIN_SCALE) {
    newValue = MIN_SCALE;
  }
  scaleValueControl.value = `${newValue}%`;
  uploadingImgPreview.style.transform = `scale(${newValue / 100})`;
};

scaleSmallerControl.addEventListener('click', () => changeScaleVal(-SCALE_STEP));
scaleBiggerControl.addEventListener('click', () => changeScaleVal(SCALE_STEP));

const onClosePicture = () => {
  document.querySelector('.img-upload__overlay').classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  uploadingFileElement.value = '';
  inputHashtags.value = '';
  inputDescription.value = '';
  uploadingImgPreview.removeAttribute('style');
  uploadingImgPreview.removeAttribute('class');
  const pristineErrors = document.querySelectorAll('.pristine-error');
  Array.from(pristineErrors).forEach ((elem) => {
    elem.style.display = 'none';
  });
  scaleValueControl.value = '100%';
  effectSlider.parentNode.style.display = 'none';
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onLoadPicture = () => {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  const imgFile = uploadingFileElement.files[0];
  const fileName = imgFile.name.toLowerCase();
  effectSlider.parentNode.style.display = 'none';
  scaleValueControl.value = '100%';
  const isValidFormat = FILE_TYPES.some((extension) => fileName.endsWith(extension));
  if (isValidFormat) {
    document.querySelector('.img-upload__preview > img').src = URL.createObjectURL(imgFile);
  }

  document.addEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    const alertSect = document.querySelector('body > section');
    if (alertSect) {
      document.querySelector('body').removeChild(alertSect);
    } else {
      onClosePicture();
    }
  }
}

uploadingFileElement.addEventListener('change', onLoadPicture);
cancelUploadingElement.addEventListener('click', onClosePicture);

const pristine = validateForm(selectImageForm);

const onSubmitForm = (tmp) => {
  const template = document.querySelector(`#${tmp}`).content.cloneNode(true);
  const closeBtn = template.querySelector(`.${tmp}__button`);
  document.querySelector('body').appendChild(template);
  const mess = document.querySelector(`.${tmp}`);
  mess.addEventListener('click', onDocumentClick);
  closeBtn.addEventListener('click', ()=>{
    document.querySelector('body').removeChild(mess);
    document.removeEventListener('keydown', onDocumentKeydown);
  });
};

const onSuccessSendData = () => {
  onSubmitForm('success');
  onClosePicture();
  document.addEventListener('keydown', onDocumentKeydown);
};

const onErrorSendData = () => {
  onSubmitForm('error');
};

selectImageForm.addEventListener('submit', (evt) =>{
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    sendPhoto(onSuccessSendData, onErrorSendData);
  }
});

function onDocumentClick (evt) {
  if (evt.target === this) {
    document.querySelector('body').removeChild(this);
  }
}

cancelEscElements.forEach ((elem) => {
  elem.addEventListener('focus', () => document.removeEventListener('keydown', onDocumentKeydown));
  elem.addEventListener('blur', () => document.addEventListener('keydown', onDocumentKeydown));
});
