import { combineReducers } from 'redux'
import authReducer from './authReducer'
import userStatsReducer from './userStatsReducer'
import userParamsReducer from './userParamsReducer'

export default combineReducers({
  authenticatedUser: authReducer,
  userStats: userStatsReducer,
  userParams: userParamsReducer
})
