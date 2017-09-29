module.exports = (createdAt) => {
  const oneDay = 24 * 60 * 60 * 1000
  const sevenDays = oneDay * 7
  const createdTime = createdAt
  const currentTime = new Date()
  const timeDifference = currentTime - createdTime

  if (timeDifference > sevenDays) {
    return 'Trial has ended'
  } else {
    return ((sevenDays / oneDay) - Math.floor(timeDifference / oneDay)) + ' trial days remaining'
  }
}
