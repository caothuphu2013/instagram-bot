module.exports = (createdAt, paid) => {
  if (paid) { return false }
  const oneDay = 24 * 60 * 60 * 1000
  const sevenDays = oneDay * 7
  const createdTime = createdAt
  const currentTime = new Date()
  const timeDifference = currentTime - createdTime
  // const timeDifference = 604800001

  if (timeDifference > sevenDays) {
    return false
  }

  return true
}
