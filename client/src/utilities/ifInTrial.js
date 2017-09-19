module.exports = (createdAt, paid) => {
  if (paid) { return false }

  const oneDay = 24 * 60 * 60 * 1000
  const sevenDays = oneDay * 7
  const createdTime = createdAt
  const currentTime = new Date()
  const timeDifference = currentTime - createdTime

  if (timeDifference > sevenDays) {
    console.log('trial has ended')
    return false
  } else {
    console.log('still in trial')
    return true
  }
}
