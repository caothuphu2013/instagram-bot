exports.parameters = (params) => {
  // modes
  const likeMode = params.param_like_mode
  const followMode = params.param_follow_mode
  // hashtags & usernames
  const hashtags = params.param_hashtags
  const usernames = params.param_usernames
  // LOCATIONS
  const longitude = params.param_longitude
  const latitude = params.param_latitude
  const timezone = params.param_timezone
  // param mode
  let paramType = 0
  // 0 = has neither
  // 1 = has hashtags only
  // 2 = has usernames only
  // 3 = has hashtags & usernames
  if (hashtags && !usernames) {
    paramType = 1
  } else if (!hashtags && usernames) {
    paramType = 2
  } else if (hashtags && usernames) {
    paramType = 3
  } else if (!hashtags && !usernames) {}

  // location mode
  let locationType = 0
  // 0 = has neither
  // 1 = has timezone only
  // 2 = has lat/long only
  // 3 = has timezone & lat/long
  if (timezone && !latitude && !longitude) {
    locationType = 1
  } else if (!timezone && latitude && longitude) {
    locationType = 2
  } else if (timezone && latitude && longitude) {
    locationType = 3
  } else if (!timezone && !latitude && !longitude) {}

  // run master automator based on parameters
  let automatorType = 0
  // 0 = has neither
  // 1 = has follow only
  // 2 = has like only
  // 3 = has follow and like
  if (likeMode && followMode) {
    automatorType = 3
  } else if (likeMode && !followMode) {
    automatorType = 2
  } else if (!likeMode && followMode) {
    automatorType = 1
  } else if (!likeMode && !followMode) {}

  const types = {
    param: paramType,
    location: locationType,
    automator: automatorType
  }

  return types
}
