import axios from 'axios'
import { FETCH_USER, FETCH_USER_STATS } from './types'

export const fetchUserStats = () => {
  return function (dispatch, email) {
    axios.get('/stats/latest', email)
      .then(res => dispatch({
        type: FETCH_USER_STATS,
        payload: res.data
      }))
      .catch(err => {
        console.log(err)
      })
  }
}

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user')
  dispatch({
    type: FETCH_USER,
    payload: res.data
  })
}

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token)
  dispatch({
    type: FETCH_USER,
    payload: res.data
  })
}

// export const fetchUserStats = () => async dispatch => {
//   const res = await axios.get('/stats/latest')
//   dispatch({
//     type: FETCH_USER_STATS,
//     payload: res.data
//   })
// }
