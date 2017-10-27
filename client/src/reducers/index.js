import { combineReducers } from 'redux'
import authReducer from './authReducer'
import userStatsReducer from './userStatsReducer'

export default combineReducers({
  authenticatedUser: authReducer,
  userStats: userStatsReducer
})
