import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from './user/userSlice'

export const store = configureStore({
  reducer: {user:userReducer},
  //do this middleware to prevent any error in browser
  middleware:(getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:false,
  })
})