import {validateForm} from './form-validate.js';
import {sendPhoto} from './fetch-source.js';

const MINSCALE = 25;
const MAXSCALE = 100;
const SCALESTEP = 25;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const uploadFile = document.querySelector('#upload-file');
const cancelUploadFile = document.querySelector('#upload-cancel');
const selectImageForm = document.querySelector('#upload-select-image');
const inputHashtags = selectImageForm.querySelector('.text__hashtags');
const inputDescription = selectImageForm.querySelector('.text__description');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const imgPreview = document.querySelector('.img-upload__preview > img');
const effectLevelValue = document.querySelector('.effect-level__value');
const sliderElement = document.querySelector('.effect-level__slider');
const sliderField = document.querySelector('.img-upload__effect-level');
const radioEffectList = document.querySelector('.effects__list');

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
});

sliderElement.noUiSlider.on('update', () => {
  const effVal = sliderElement.noUiSlider.get();
  effectLevelValue.value = effVal;
  const eff = imgPreview.className.split('--')[1];
  let filter = 'none';
  switch (eff) {
    case 'chrome':
      filter = `grayscale(${effVal})`;
      break;
    case 'sepia':
      filter = `sepia(${effVal})`;
      break;
    case 'marvin':
      filter = `invert(${effVal}%)`;
      break;
    case 'phobos':
      filter = `blur(${effVal}px)`;
      break;
    case 'heat':
      filter = `brightness(${effVal})`;
      break;
  }
  imgPreview.style.filter = filter;
});

radioEffectList.addEventListener('change', (event) => {
  if (event.target.matches('input[type="radio"]')) {
    imgPreview.removeAttribute('class');
    imgPreview.classList.add(`effects__preview--${event.target.value}`);
    sliderField.style.display = 'block';
    switch (event.target.value) {
      case 'chrome':
      case 'sepia':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 1,
          },
          step: 0.1,
        });
        sliderElement.noUiSlider.set(1);
        break;
      case 'marvin':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 100,
          },
          step: 1,
        });
        sliderElement.noUiSlider.set(100);
        break;
      case 'phobos':
      case 'heat':
        sliderElement.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 3,
          },
          step: 0.1,
        });
        sliderElement.noUiSlider.set(3);
        break;
      default:
        sliderField.style.display = 'none';
        imgPreview.style.filter = 'none';
        break;
    }
  }
});

const changeScaleVal = (scale) => {
  const val = Number(scaleValue.value.slice(0,-1));
  let newVal = val + scale;
  if (newVal > MAXSCALE) {
    newVal = MAXSCALE;
  }
  if (newVal < MINSCALE) {
    newVal = MINSCALE;
  }
  scaleValue.value = `${newVal} %`;
  imgPreview.style.transform = `scale(${newVal / 100})`;
};

scaleSmaller.addEventListener('click', () => changeScaleVal(-SCALESTEP));
scaleBigger.addEventListener('click', () => changeScaleVal(SCALESTEP));

const onClosePicture = () => {
  document.querySelector('.img-upload__overlay').classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  uploadFile.value = '';
  inputHashtags.value = '';
  inputDescription.value = '';
  imgPreview.removeAttribute('style');
  imgPreview.removeAttribute('class');
  scaleValue.value = '100%';
  sliderField.style.display = 'none';
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onLoadPicture = () => {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  const imgFile = uploadFile.files[0];
  const fileName = imgFile.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
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

uploadFile.addEventListener('change', onLoadPicture);
cancelUploadFile.addEventListener('click', onClosePicture);

const pristine = validateForm(selectImageForm);

const onSendData = (tmp) => {
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
  onSendData('success');
  onClosePicture();
  document.addEventListener('keydown', onDocumentKeydown);
};

const onErrorSendData = () => {
  onSendData('error');
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

const elems = [inputHashtags, inputDescription];
elems.forEach ((elem) => {
  elem.addEventListener('focus', () => document.removeEventListener('keydown', onDocumentKeydown));
  elem.addEventListener('blur', () => document.addEventListener('keydown', onDocumentKeydown));
});
