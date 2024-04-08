import {COUNT_PHOTOS, COUNT_AVATARS, MESSAGES, NAMES, DESCRIPTION} from './input-data.js';
import {getRandomInteger, getUniqueInteger, getRandomArrayElement } from './util.js';

const generateId = getUniqueInteger(1, COUNT_PHOTOS);
const generatePhotoId = getUniqueInteger(1, COUNT_PHOTOS);
const generateCommentId = getUniqueInteger(1, 1000);

const createComents = () => Array.from({length: getRandomInteger(0, 5)}, () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, COUNT_AVATARS)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES),
})
);

export const createdPhotoInfo = Array.from({length: COUNT_PHOTOS}, () => ({
  id: generateId(),
  url: `photos/${generatePhotoId()}.jpg`,
  description: getRandomArrayElement(DESCRIPTION),
  likes: getRandomInteger(15, 200),
  comments: createComents(),
}));
