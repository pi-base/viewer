const lpad = (str: string, padChar: string, toLength: number) => {
  const padLen = toLength - str.length
  let pad = ''
  while (pad.length < padLen) {
    pad += padChar
  }
  return pad + str
}

export default (prefix: string, num: number | string) => {
  if (typeof (num) === 'string' && num[0] === prefix) { return num }

  return prefix + lpad('' + num, '0', 6)
}
