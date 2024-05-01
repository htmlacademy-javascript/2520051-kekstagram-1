const uploadFile = document.querySelector('#upload-file');
const cancelUploadFile = document.querySelector('#upload-cancel');
const selectImageForm = document.querySelector('#upload-select-image');
const inputHashtags = selectImageForm.querySelector('.text__hashtags');
const inputDescription = selectImageForm.querySelector('.text__description');


const onClosePicture = () => {
  document.querySelector('.img-upload__overlay').classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  uploadFile.value = '';
  inputHashtags.value = '';
  inputDescription.value = '';
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onLoadPicture = () => {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
  // document.querySelector('.img-upload__preview').querySelector('img').src =
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
