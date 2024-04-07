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

const getRandomUniqueArrayElement = (elements) => {
  const genUniqIndex = getUniqueInteger(0, elements.length - 1);
  const genOne = () => elements[genUniqIndex()];
  return Array.from({length: getRandomInteger(0, elements.length)}, genOne);
};

const getRandomFloat = (begin, end, numDigits) => {
  if (begin < 0 || end < 0 || numDigits < 0 || !(Number.isInteger(numDigits))) {
    return NaN;
  }
  if ((end - begin) < Math.pow(10, -numDigits)) {
    return NaN;
  }
  const fractionDifference = Math.random() * (end - begin);
  return +(begin + fractionDifference).toFixed(numDigits);
};

export { getRandomInteger, getUniqueInteger, getRandomArrayElement, getRandomUniqueArrayElement, getRandomFloat };
