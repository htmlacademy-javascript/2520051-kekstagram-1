import {dataGalery} from './rendering-pictures.js';

const pictureContainer = document.querySelector('.pictures');
const bigPicture = document.querySelector('.big-picture');
const btnCloseBigPicture = bigPicture.querySelector('#picture-cancel');
const commentsLoader = bigPicture.querySelector('.comments-loader');

const renderOneComment = (name, avatar, message) => {
  const liElement = document.createElement('li');
  liElement.classList.add('social__comment');

  const imgElement = document.createElement('img');
  imgElement.classList.add('social__picture');
  imgElement.width = 35;
  imgElement.height = 35;
  imgElement.src = avatar;
  imgElement.alt = name;

  const pElement = document.createElement('p');
  pElement.classList.add('social__text');
  pElement.textContent = message;

  liElement.appendChild(imgElement);
  liElement.appendChild(pElement);
  return liElement;
};

const createNumFiveGenerator = () => {
  let lastGeneratedId = 5;
  return function () {
    lastGeneratedId += 5;
    return lastGeneratedId;
  };
};

const renderComments = (comments, n) => {
  const commentsContainer = bigPicture.querySelector('.social__comments');
  commentsContainer.innerHTML = '';
  let commentCount = n;
  commentsLoader.classList.remove('hidden');
  if (n >= comments.length) {
    commentsLoader.classList.add('hidden');
    commentCount = comments.length;
  }
  commentsContainer.previousElementSibling.childNodes[0].textContent = `${commentCount} из `;
  for (let i = 0; i < commentCount; i++) {
    const commentItem = renderOneComment(comments[i]['name'], comments[i]['avatar'], comments[i]['message']);
    commentsContainer.appendChild(commentItem);
  }
};

const renderBigPicture = (data) => {
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img > img').src = data['url'];
  bigPicture.querySelector('.social__caption').textContent = data['description'];
  bigPicture.querySelector('.likes-count').textContent = data['likes'];
  renderComments(data['comments'], 5);
  bigPicture.querySelector('.comments-count').textContent = data['comments'].length;
  const nextFiveComents = createNumFiveGenerator();
  bigPicture.querySelector('.comments-loader').addEventListener('click', () => renderComments(data['comments'], nextFiveComents()));
};

const findPhotoById = (id) => {
  for (let i = 0; i < dataGalery.length; i++) {
    if (dataGalery[i].id === id) {
      return dataGalery[i];
    }
  }
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

const openBigPicture = (evt) => {

  if (evt.target.matches('.picture__img')) {
    evt.preventDefault();
    const prewId = evt.target.dataset.indexNumber;
    const previewData = findPhotoById(+prewId);
    renderBigPicture(previewData);
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  }
};

pictureContainer.addEventListener('click', openBigPicture);
btnCloseBigPicture.addEventListener('click', closeBigPicture);
