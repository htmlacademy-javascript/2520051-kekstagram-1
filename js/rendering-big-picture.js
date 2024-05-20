import { createNumByStep } from './util.js';

const Avatar = {
  WIDTH: 35,
  HEIGHT: 35,
};
const COUNT_COMMENTS_PAGINATION = 5;

const bigPictureElement = document.querySelector('.big-picture');
const closeBigPictureElement = bigPictureElement.querySelector('#picture-cancel');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');

const renderOneComment = (name, avatar, message) => {
  const liElement = document.createElement('li');
  liElement.classList.add('social__comment');

  const imgElement = document.createElement('img');
  imgElement.classList.add('social__picture');
  imgElement.width = Avatar.WIDTH;
  imgElement.height = Avatar.HEIGHT;
  imgElement.src = avatar;
  imgElement.alt = name;

  const pElement = document.createElement('p');
  pElement.classList.add('social__text');
  pElement.textContent = message;

  liElement.appendChild(imgElement);
  liElement.appendChild(pElement);
  return liElement;
};

const renderComments = (comments, n) => {
  const commentsContainer = bigPictureElement.querySelector('.social__comments');
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

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

export const renderBigPicture = (data) => {
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  bigPictureElement.classList.remove('hidden');
  bigPictureElement.querySelector('.big-picture__img > img').src = data.url;
  bigPictureElement.querySelector('.social__caption').textContent = data.description;
  bigPictureElement.querySelector('.likes-count').textContent = data.likes;
  renderComments(data['comments'], COUNT_COMMENTS_PAGINATION);
  bigPictureElement.querySelector('.comments-count').textContent = data.comments.length;
  const nextNumber = createNumByStep(COUNT_COMMENTS_PAGINATION);
  bigPictureElement.querySelector('.comments-loader').addEventListener('click', () => renderComments(data.comments, nextNumber()));
};

function closeBigPicture() {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

closeBigPictureElement.addEventListener('click', closeBigPicture);
