import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const isAdminLogin = Cookies.get('admin_token') || Cookies.get('admin_login') || Cookies.get('admin_role') || 0

const initialState = {
  value: isAdminLogin,
}

export const AdminLoginSlice = createSlice({
  name: 'adminLogin',
  initialState,
  reducers: {
    adminLogin: (state, action) => {
      state.value = action.payload
      Cookies.set('admin_role', 'admin')
    },
    adminLogout: (state) => {
      state.value = 0
      Cookies.remove('admin_token')
      Cookies.remove('admin_login')
      Cookies.remove('admin_role')
    },
  },
})

export const { adminLogin, adminLogout } = AdminLoginSlice.actions

export default AdminLoginSlice.reducer
