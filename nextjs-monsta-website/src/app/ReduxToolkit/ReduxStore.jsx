import { configureStore } from '@reduxjs/toolkit'
import  LoginSlice  from './LoginSlice'
import AdminLoginSlice from './AdminLoginSlice'


export const store = configureStore({
  reducer: {
    login: LoginSlice,
    adminLogin: AdminLoginSlice,
  },
})
