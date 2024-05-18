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

const getArrayRandomUniqueElements = (elements, count = NaN) => {
  count = count ? count : elements.length;
  const genUniqIndex = getUniqueInteger(0, elements.length - 1);
  const genOne = () => elements[genUniqIndex()];
  return Array.from({length: count}, genOne);
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

const debounce = (callback, timeoutDelay = 500) => {
  // Используем замыкания, чтобы id таймаута у нас навсегда приклеился
  // к возвращаемой функции с setTimeout, тогда мы его сможем перезаписывать
  let timeoutId;

  return (...rest) => {
    // Перед каждым новым вызовом удаляем предыдущий таймаут,
    // чтобы они не накапливались
    clearTimeout(timeoutId);

    // Затем устанавливаем новый таймаут с вызовом колбэка на ту же задержку
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);

    // Таким образом цикл «поставить таймаут - удалить таймаут» будет выполняться,
    // пока действие совершается чаще, чем переданная задержка timeoutDelay
  };
};

export { getRandomInteger, getUniqueInteger, getRandomArrayElement, getArrayRandomUniqueElements, getRandomFloat, debounce };
