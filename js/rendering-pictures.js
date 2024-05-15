// import {createdPhotoInfo as dataGalery} from './generate-data.js';
import {createGalery} from './fetch-source.js';


const pictureTemplate = document.querySelector('#picture').content;
const similarListElement = document.querySelector('.pictures');
const similarListFragment = document.createDocumentFragment();
const dataGalery = [];

const renderGalery = (data) => {
  data.forEach((pic) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = pic.url;
    pictureElement.querySelector('.picture__img').dataset.indexNumber = pic.id;
    pictureElement.querySelector('.picture__comments').textContent = pic.comments.length;
    pictureElement.querySelector('.picture__likes').textContent = pic.likes;
    similarListFragment.appendChild(pictureElement);
    dataGalery.push(pic);
  });
  similarListElement.appendChild(similarListFragment);
};
const onErrorLoad = () => {
  const template = document.querySelector('#error').content.cloneNode(true);
  template.querySelector('h2').textContent = 'Ошибка загрузки данных';
  template.querySelector('button').textContent = 'Закрыть';
  const closeBtn = template.querySelector('.error__button');
  document.querySelector('body').appendChild(template);
  closeBtn.addEventListener('click', ()=>{
    const mess = document.querySelector('.error');
    document.querySelector('body').removeChild(mess);
  });
  setTimeout(() => {
    const mess = document.querySelector('.error');
    if (mess) {
      document.querySelector('body').removeChild(mess);
    }
  }, 1500);
};
const loadGalery = createGalery(renderGalery, onErrorLoad);

loadGalery();

export {dataGalery};
