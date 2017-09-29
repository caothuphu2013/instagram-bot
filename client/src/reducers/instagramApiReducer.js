import { FETCH_USER_ACCESS_TOKEN } from '../actions/types'
import InstagramAPI from 'instagram-api'

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_USER_ACCESS_TOKEN:
      return new InstagramAPI(action.payload.accessToken) || null
    default:
      return state
  }
}
