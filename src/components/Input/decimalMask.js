const decimalMask = (value) => {
  let chars = value.split('')

  if (chars.length >= 5) {
    const temp = chars[chars.length - 4]
    chars[chars.length - 4] = chars[chars.length - 3]
    chars[chars.length - 3] = temp

    if (chars[0] === '0') {
      chars.splice(0, 1)
    }
  } else {
    chars = ['0', '.', '0', ...chars]
  }

  return chars.join('')
}

export default decimalMask