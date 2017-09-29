import { combineReducers } from 'redux'
import authReducer from './authReducer'
import instagramApiReducer from './instagramApiReducer'

export default combineReducers({
  authenticatedUser: authReducer,
  igAPI: instagramApiReducer
})
