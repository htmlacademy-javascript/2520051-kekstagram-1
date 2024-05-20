const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const createNumByStep = (step) => {
  let lastGeneratedId = step;
  return function () {
    lastGeneratedId += step;
    return lastGeneratedId;
  };
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

const getArrayRandomUniqueElements = (elements, count = NaN) => {
  count = count ? count : elements.length;
  const genUniqIndex = getUniqueInteger(0, elements.length - 1);
  const genOne = () => elements[genUniqIndex()];
  return Array.from({length: count}, genOne);
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export { createNumByStep, getArrayRandomUniqueElements, debounce };
