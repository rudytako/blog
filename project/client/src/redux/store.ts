import rootReducer from './reducers/index'
import { configureStore, getDefaultMiddleware  } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export default store;