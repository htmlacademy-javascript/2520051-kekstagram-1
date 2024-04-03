const COUNT_PHOTOS = 25;
const COUNT_AVATARS = 6;

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];
const NAMES = [
  'Кристина',
  'Макар',
  'Лев',
  'Анастасия',
  'Леонид',
  'Максим',
  'Екатерина',
  'Аделина',
  'Павел',
  'Ева',
  'Егор',
  'Мария',
  'Игорь',
  'Татьяна',
  'Дмитрий',
];
const DESCRIPTION = [
  'Обожаю море за то, что в нем водится рыба',
  'Капсульный отель как раз мне по размеру',
  'Моя Киса любит рыбку',
  'Наш отдел выступает с докладом на всекотячей конференции',
  'Общее фото отдела разработки. Кажется не хватает синих и зеленых цветов',
  'Мой отпуск в Рыбатии',
];

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getUniqueInteger = (a, b) => {
  const priviousNums = [];
  return function() {
    let currentNum = getRandomInteger(a, b);
    if (priviousNums.length >= (b - a + 1)) {
      return null;
    }
    while (priviousNums.includes(currentNum)) {
      currentNum = getRandomInteger(a, b);
    }
    priviousNums.push(currentNum);
    return currentNum;
  };
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const generateId = getUniqueInteger(1, COUNT_PHOTOS);
const generatePhotoId = getUniqueInteger(1, COUNT_PHOTOS);
const generateCommentId = getUniqueInteger(1, 1000);

const createComents = Array.from({length: getRandomInteger(0, 3)}, () => ({
  id: generateCommentId(),
  avatar: 'img/avatar-' + getRandomInteger(1, COUNT_AVATARS) + '.svg',
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES),
})
);

const createPhotoInfo = Array.from({length: COUNT_PHOTOS}, () => ({
  id: generateId(),
  url: 'photos/' + generatePhotoId() + '.jpg',
  description: getRandomArrayElement(DESCRIPTION),
  likes: getRandomInteger(15, 200),
  comments: createComents,
}));


// console.log(createPhotoInfo);


// Кексобукинг
const COUNT_AVATAR = 10;
const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'
];
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const TIMELIST = ['12:00', '13:00', '14:00'];
const TYPES = ['palace', 'flat', 'house', 'bungalow', 'hotel'];
const PLACE = [' in the forest', ' on the seashore', ' in the mountains', ' in the center of the garden'];
const VIEWS = [' with mountain views', ' in the city center', ' on the outskirts of the city'];
const LAT = [35.65000, 35.70000];
const LNG = [139.70000, 139.80000];

const getRandomUniqueArrayElement = (elements) => {
  const genUniqIndex = getUniqueInteger(0, elements.length - 1);
  const genOne = () => elements[genUniqIndex()];
  return Array.from({length: getRandomInteger(0, elements.length)}, genOne);
};

const randomFloat = (begin, end, numDigits) => {
  if (begin < 0 || end < 0 || numDigits < 0 || !(Number.isInteger(numDigits))) {
    return NaN;
  }
  if ((end - begin) < Math.pow(10, -numDigits)) {
    return NaN;
  }
  const fractionDifference = Math.random() * (end - begin);
  return +(begin + fractionDifference).toFixed(numDigits);
};

const generateNumImg = getUniqueInteger(1, COUNT_AVATAR);
const generateTitle = (type) => {
  switch (type){
    case 'palace':
    case 'house':
    case 'bungalow':
      return 'The ' + type + getRandomArrayElement(PLACE);
    case 'flat':
    case 'hotel':
      return 'The ' + type + getRandomArrayElement(VIEWS);
  }
};

const createAdvtDescription = Array.from({length: 10}, () => {
  const type = getRandomArrayElement(TYPES);
  const numImg = ('0' + generateNumImg()).slice(-2,);
  const lat = randomFloat(LAT[0], LAT[1], 5);
  const lng = randomFloat(LNG[0], LNG[1], 5);
  const features = getRandomUniqueArrayElement(FEATURES);

  return {
    author: {
      avatar: 'img/avatars/user' + numImg + '.png',
    },
    offer: {
      title: generateTitle(type),
      address:[lat, lng].join(', '),
      price: getRandomInteger(500000, 80000000),
      type: type,
      rooms: getRandomInteger(1, 5),
      guests: getRandomInteger(2, 10),
      checkin: getRandomArrayElement(TIMELIST),
      checkout: getRandomArrayElement(TIMELIST),
      features: features,
      description: features.join(', '),
      photos: getRandomUniqueArrayElement(PHOTOS),
    },
    location: {
      lat: lat,
      lng: lng,
    },
  };
});


// console.log(createAdvtDescription);

