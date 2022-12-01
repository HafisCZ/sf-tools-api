function getRandomKey () {
  let _sym = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let str = '';

  for (var i = 0; i < 12; i++) {
      str += _sym[parseInt(Math.random() * _sym.length)];
  }

  return str;
}

module.exports = { getRandomKey }