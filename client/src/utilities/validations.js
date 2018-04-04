export const validateEmail = (email) => {
  const x = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return x.test(email)
}

export const minimumFiveChars = (password) => {
  const x = new RegExp('^(?=.{5,})')
  return x.test(password)
}

export const containsNumber = (password) => {
  const x = new RegExp('^(?=.*[0-9])')
  return x.test(password)
}

export const containsUppercase = (password) => {
  const x = new RegExp('^(?=.*[A-Z])')
  return x.test(password)
}
