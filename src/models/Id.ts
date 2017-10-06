const lpad = (str, padChar, len) => {
  const padLen = len - str.length
  let pad = ''
  while (pad.length < padLen) {
    pad += padChar
  }
  return pad + str
}

export default (pre, num) => {
  if (typeof(num) === 'string' && num[0] === pre) { return num }

  return pre + lpad(num, '0', 6)
}
