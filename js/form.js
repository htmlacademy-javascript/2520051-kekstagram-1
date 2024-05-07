const MINSCALE = 25;
const MAXSCALE = 100;
const SCALESTEP = 25;
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
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onLoadPicture = () => {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  scaleValue.value = '100%';
  sliderField.style.display = 'none';
  document.addEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    onClosePicture();
  }
}

uploadFile.addEventListener('change', onLoadPicture);
cancelUploadFile.addEventListener('click', onClosePicture);

const pristine = new Pristine(selectImageForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper__error'
});

const validateHashtagsCount = (value) => {
  const values = value.trim().split(' ');
  return values.length <= 5;
};
const hashtagsCountError = 'можете указать максимум 5 хэш-тегов';

const validateHashtagsUnique = (value) => {
  const values = value.toLowerCase().trim().split(' ');
  return values.length === [...new Set(values)].length;
};
const hashtagsUniqueError = 'хэш-теги не должны повторяться';

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }
  const val = value.trim().split(' ').at(-1);
  return /^#[a-zа-я0-9]{1,19}$/i.test(val);
};
const hashtagsError = 'после "#" используйте буквы и числа (общая длина 20)';

const validateHashtagsNums = (value) => {
  const val = value.trim().split(' ').at(-1);
  return !/^#\d{1,19}$/.test(val);
};
const hashtagsNumsError = 'нельзя использовать только числа';

pristine.addValidator(inputHashtags, validateHashtagsCount, hashtagsCountError);
pristine.addValidator(inputHashtags, validateHashtagsUnique, hashtagsUniqueError);
pristine.addValidator(inputHashtags, validateHashtagsNums, hashtagsNumsError);
pristine.addValidator(inputHashtags, validateHashtags, hashtagsError);

selectImageForm.addEventListener('submit', (evt) =>{
  evt.preventDefault();
  pristine.validate();
});

const elems = [inputHashtags, inputDescription];
elems.forEach ((elem) => {
  elem.addEventListener('focus', () => document.removeEventListener('keydown', onDocumentKeydown));
  elem.addEventListener('blur', () => document.addEventListener('keydown', onDocumentKeydown));
});
