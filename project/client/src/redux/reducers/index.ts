import { combineReducers } from 'redux'
import authReducer from './authReducer'
import alertReducer from './alertReducer'
import categoryReducer from './categoryReducer'
import homeBlogsReducer from './homeBlogsReducer'
import blogsCategoryReducer from './blogsCategoryReducer'
import otherInfoReducer from './otherInfoReducer'
import blogsUserReducer from './blogsUserReducer'
import commentReducer from './commentReducer'

export default combineReducers({
  authReducer,
  alertReducer,
  categoryReducer,
  homeBlogsReducer,
  blogsCategoryReducer,
  otherInfoReducer,
  blogsUserReducer,
  commentReducer,
})