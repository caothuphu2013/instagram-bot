import { FETCH_USER_PARAMS } from '../actions/types'

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_USER_PARAMS:
      return Object.assign({}, action.payload)
    default:
      return state
  }
}
