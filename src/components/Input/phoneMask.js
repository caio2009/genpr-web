const phoneMask = (value) => {
  if (value.match(/^\(\d{2}\) \d{4,5}-\d{4}$/g)) {
    return value
  }

  if (value.length === 1) {
    value = `(${value}`
    return value 
  }

  if (value.length === 3) {
    value = `${value}) `
    return value
  }

  if (value.length === 9) {
    value = `${value}-`
    return value
  }

  if (value.length === 15) {
    const chars = value.split('')

    const temp = chars[9]
    chars[9] = chars[10]
    chars[10] = temp

    return chars.join('') 
  }

  return value
}

export default phoneMask