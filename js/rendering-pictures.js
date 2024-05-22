import { getArrayRandomUniqueElements, debounce } from './util.js';
import { getDataGalery } from './fetch-source.js';
import { renderBigPicture } from './rendering-big-picture.js';


const NUMBER_PICTURES = 10;
const RERENDER_DELAY = 500;
const MESSAGE_DELAY = 1500;

const postTemplate = document.querySelector('#picture').content;
const postListElement = document.querySelector('.pictures');
const postsFilters = document.querySelector('.img-filters');
const imgFiltersForm = document.querySelector('.img-filters__form');

const findPhotoById = (data, id) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i];
    }
  }
};

const renderGalery = (data) => {
  Array.from(postListElement.children).forEach((child) => {
    if (child.classList.contains('picture')) {
      postListElement.removeChild(child);
    }
  });
  const postListFragment = document.createDocumentFragment();
  data.forEach((post) => {
    const postElement = postTemplate.cloneNode(true);
    postElement.querySelector('.picture__img').src = post.url;
    postElement.querySelector('.picture__img').dataset.indexNumber = post.id;
    postElement.querySelector('.picture__comments').textContent = post.comments.length;
    postElement.querySelector('.picture__likes').textContent = post.likes;
    postListFragment.appendChild(postElement);
  });
  postListElement.appendChild(postListFragment);
};

const onErrorUpload = () => {
  const template = document.querySelector('#error').content.cloneNode(true);
  const closeBtn = template.querySelector('.error__button');

  const closeMassege = () => {
    const messageElement = document.querySelector('.error');
    if (messageElement) {
      document.querySelector('body').removeChild(messageElement);
    }
  };
  template.querySelector('h2').textContent = 'Ошибка загрузки данных';
  template.querySelector('button').textContent = 'Закрыть';
  document.querySelector('body').appendChild(template);
  closeBtn.addEventListener('click', closeMassege);
  setTimeout(closeMassege, MESSAGE_DELAY);
};

const openBigPicture = (evt, data) => {
  if (evt.target.matches('.picture__img')) {
    evt.preventDefault();
    const prewId = evt.target.dataset.indexNumber;
    const previewData = findPhotoById(data, +prewId);
    renderBigPicture(previewData);
  }
};

const onSuccessUploadData = (dataGalery) => {
  postsFilters.classList.remove('img-filters--inactive');

  const defaultSort = () => dataGalery;
  const randomSort = () => getArrayRandomUniqueElements(dataGalery, NUMBER_PICTURES);
  const discussedSort = () => dataGalery.slice().sort((a, b) => b.comments.length - a.comments.length);

  const sortFunction = {
    'filter-random': randomSort,
    'filter-discussed': discussedSort,
    'filter-default': defaultSort,
  };


  renderGalery(dataGalery);
  postListElement.addEventListener('click', (event) => openBigPicture(event, dataGalery));

  imgFiltersForm.addEventListener('click', debounce((evt) => {
    for (const btn of imgFiltersForm.children) {
      if (btn.classList.contains('img-filters__button--active')) {
        btn.classList.remove('img-filters__button--active');
      }
    }
    evt.target.classList.add('img-filters__button--active');
    const typeSort = evt.target.id;
    const datas = sortFunction[typeSort]();
    renderGalery(datas);
    postListElement.addEventListener('click', (event) => openBigPicture(event, datas));
  }), RERENDER_DELAY);
};

try {
  const dataGalery = await getDataGalery();
  onSuccessUploadData(dataGalery);
} catch (err) {
  onErrorUpload();
}
