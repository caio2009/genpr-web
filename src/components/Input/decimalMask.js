const decimalMask = (value, { isBackspace = false }) => {
  let chars = value.split('')

  if (isBackspace) {
    const temp = chars[chars.length - 3]
    chars[chars.length - 3] = chars[chars.length - 2]
    chars[chars.length - 2] = temp

    if (chars[0] === '.') {
      chars = ['0', ...chars]
    }

    return chars.join('')
  }

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