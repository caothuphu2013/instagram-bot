module.exports = (param) => {
  let x = 0

  if (param.param_hashtags.length > 0) {
    if (param.param_hashtags[0] !== '') x++
  } else {
    if (param.param_hashtags.length !== 0) x++
  }

  if (param.param_usernames.length > 0) {
    if (param.param_usernames[0] !== '') x++
  } else {
    if (param.param_usernames.length !== 0) x++
  }

  if (param.param_latitude !== '' && param.param_longitude !== '') x++

  if (x > 0) return true

  return false
}
