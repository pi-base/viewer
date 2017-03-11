const lpad = (str, pad, len) => {
  const padLen = len - str.length
  while (pad.length < padLen) {
    pad += pad
  }
  return pad + str
}

export default (pre, num) => {
  if (typeof(num) === 'string' && num[0] === pre) { return num }
  
  return pre + lpad(num, '0', 6)
}
