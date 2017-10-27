import { FETCH_USER_STATS } from '../actions/types'

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_USER_STATS:
      return action.payload
    default:
      return state
  }
}
