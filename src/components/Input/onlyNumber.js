const onlyNumber = (value) => {
  if (value) {
    if (value[value.length - 1].match(/\d/g)) {
      return value
    }

    return value.substring(0, value.length - 1)
  }

  return ''
} 

export default onlyNumber