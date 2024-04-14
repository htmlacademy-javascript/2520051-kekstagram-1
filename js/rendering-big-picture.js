import {createdPhotoInfo} from './generate-data.js';

const pictureContainer = document.querySelector('.pictures');
const bigPicture = document.querySelector('.big-picture');
const btnCloseBigPicture = bigPicture.querySelector('#picture-cancel');

const findPhotoById = function(id) {
  for (let i = 0; i < createdPhotoInfo.length; i++){
    if(createdPhotoInfo[i].id === id){
      return createdPhotoInfo[i];
    }
  }
};

const renderOneComment = function(name, avatar, message) {
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

const renderComments = function(comments){
  const commentsContainer = bigPicture.querySelector('.social__comments');
  commentsContainer.innerHTML = '';

  for (let i = 0; i < comments.length; i++){
    const commentItem = renderOneComment(comments[i]['name'], comments[i]['avatar'], comments[i]['message']);
    commentsContainer.appendChild(commentItem);
  }
};

const renderBigPicture = function(data){
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img > img').src = data['url'];
  bigPicture.querySelector('.social__caption').textContent = data['description'];
  bigPicture.querySelector('.likes-count').textContent = data['likes'];
  renderComments(data['comments']);
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

function closeBigPicture(){
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

const openBigPicture = function(evt){
  if (evt.target.parentNode.matches('a.picture')){
    evt.preventDefault();
  }
  if (evt.target.matches('.picture__img')){
    const prewId = evt.target.dataset.indexNumber;
    const previewData = findPhotoById(+prewId);
    renderBigPicture(previewData);
  }
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

};

pictureContainer.addEventListener('click', openBigPicture);

btnCloseBigPicture.addEventListener('click', closeBigPicture);
