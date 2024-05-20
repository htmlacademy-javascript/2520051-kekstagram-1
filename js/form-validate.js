export const validateForm = (form) => {
  const inputHashtags = form.querySelector('.text__hashtags');

  const pristine = new Pristine(form, {
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

  const validateHashtagsContext = (value) => {
    if (!value) {
      return true;
    }
    const val = value.trim().split(' ').at(-1);
    return /^#[a-zа-я0-9]{1,19}$/i.test(val);
  };
  const hashtagsContextError = 'после "#" используйте буквы и числа (общая длина 20)';

  const validateHashtagsNums = (value) => {
    const val = value.trim().split(' ').at(-1);
    return !/^#\d{1,19}$/.test(val);
  };
  const hashtagsNumsError = 'нельзя использовать только числа';

  pristine.addValidator(inputHashtags, validateHashtagsCount, hashtagsCountError);
  pristine.addValidator(inputHashtags, validateHashtagsUnique, hashtagsUniqueError);
  pristine.addValidator(inputHashtags, validateHashtagsNums, hashtagsNumsError);
  pristine.addValidator(inputHashtags, validateHashtagsContext, hashtagsContextError);

  return pristine;
};
