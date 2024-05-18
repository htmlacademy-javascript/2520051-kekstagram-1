// import {createdPhotoInfo as dataGalery} from './generate-data.js';
import { getDataGalery } from './fetch-source.js';
import { getArrayRandomUniqueElements, debounce } from './util.js';


const NUMBER_PICTURES = 10;
const RERENDER_DELAY = 500;
let dataGalery = [];

const pictureTemplate = document.querySelector('#picture').content;
const similarListElement = document.querySelector('.pictures');
const similarListFragment = document.createDocumentFragment();
const imgFilters = document.querySelector('.img-filters');

const renderGalery = (data) => {
  data.forEach((pic) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = pic.url;
    pictureElement.querySelector('.picture__img').dataset.indexNumber = pic.id;
    pictureElement.querySelector('.picture__comments').textContent = pic.comments.length;
    pictureElement.querySelector('.picture__likes').textContent = pic.likes;
    similarListFragment.appendChild(pictureElement);
  });
  Array.from(similarListElement.children).forEach((child) => {
    if (child.classList.contains('picture')) {
      similarListElement.removeChild(child);
    }
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

try {
  dataGalery = await getDataGalery();
  renderGalery(dataGalery);
  imgFilters.classList.remove('img-filters--inactive');
} catch (err) {
  onErrorLoad();
}

const defaultSort = () => dataGalery;
const randomSort = () => getArrayRandomUniqueElements(dataGalery, NUMBER_PICTURES);
const discussedSort = () => dataGalery.slice().sort((a, b) => b.comments.length - a.comments.length);


const sortFunction = {
  'filter-random': randomSort,
  'filter-discussed': discussedSort,
  'filter-default': defaultSort,
};

const imgFiltersForm = document.querySelector('.img-filters__form');
imgFiltersForm.addEventListener('click', debounce((evt) => {
  for (const btn of imgFiltersForm.children) {
    btn.classList.remove('img-filters__button--active');
  }
  evt.target.classList.add('img-filters__button--active');
  const typeSort = evt.target.id;
  const datas = sortFunction[typeSort]();
  renderGalery(datas);
}), RERENDER_DELAY);

export {dataGalery};
