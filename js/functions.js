function isPalindrome(str) {
  str = str.toLowerCase().replaceAll(' ', '');
  let res = '';

  for (let i = 1; i <= str.length; i++) {
    res += str[str.length - i];
  }
  return res === str;
}
// Строка является палиндромом
console.log(isPalindrome('топот')); // true
// Несмотря на разный регистр, тоже палиндром
console.log(isPalindrome('ДовОд')); // true
// Это не палиндром
console.log(isPalindrome('Кекс')); // false
// Это палиндром
console.log(isPalindrome('Лёша на полке клопа нашёл ')); // true


function getNums(str) {
  str = String(str);
  return parseInt(str.replace(/\D/g, ''), 10);
}

console.log(getNums('2023 год')); // 2023
console.log(getNums('ECMAScript 2022')); // 2022
console.log(getNums('1 кефир, 0.5 батона')); // 105
console.log(getNums('агент 007')); // 7
console.log(getNums('а я томат')); // NaN

console.log(getNums(2023)); // 2023
console.log(getNums(-1)); // 1
console.log(getNums(1.5)); // 15


function formatStr(str, length, prefix) {
  if (str.length >= length) {
    return str;
  }
  while (str.length < length) {
    str = prefix.slice(0, length - str.length) + str;
  }
  return str;
}

// Добавочный символ использован один раз
console.log(formatStr('1', 2, '0')); // '01'
// Добавочный символ использован три раза
console.log(formatStr('1', 4, '0')); // '0001'
// Добавочные символы обрезаны с конца
console.log(formatStr('q', 4, 'werty')); // 'werq'
// Добавочные символы использованы полтора раза
console.log(formatStr('q', 4, 'we')); // 'wweq'
// Добавочные символы не использованы, исходная строка не изменена
console.log(formatStr('qwerty', 4, '0')); // 'qwerty'

console.log(formatStr('qwer', 18, 'mar'));


function checkLenght(str, length) {
  return str.length <= length;
}

// Cтрока короче 20 символов
console.log(checkLenght('проверяемая строка', 20)); // true
// Длина строки ровно 18 символов
console.log(checkLenght('проверяемая строка', 18)); // true
// Строка длиннее 10 символов
console.log(checkLenght('проверяемая строка', 10)); // false


function randomFloat(begin, end, numDigits) {
  if (typeof (begin) !== 'number' || typeof (end) !== 'number' || typeof (numDigits) !== 'number') {
    return NaN;
  }
  if (begin < 0 || end < 0 || numDigits < 0 || !(Number.isInteger(numDigits))) {
    return NaN;
  }
  if (begin > end) {
    [begin, end] = [end, begin];
  }
  if ((end - begin) < Math.pow(10, -numDigits)) {
    return NaN;
  }
  const fractionDifference = Math.random() * (end - begin);
  return +(begin + fractionDifference).toFixed(numDigits);
}


console.log(randomFloat(2, 7, 3));
console.log(randomFloat(0.4, 50, 0));
console.log(randomFloat(0.8, 42.6, 4));
console.log(randomFloat(-2, 6, 3));
console.log(randomFloat(2, '6', 3));
console.log(randomFloat(2, 6, 0.3));
console.log(randomFloat(8, 6, 2));
console.log(randomFloat(8, 7, 0));
console.log(randomFloat(6.661, 6.6665, 2));
console.log(randomFloat(6.6613, 6.6627, 3));
console.log(randomFloat(6.6618, 6.6627, 3));
console.log(randomFloat(6.6618, 6.6679, 3));
