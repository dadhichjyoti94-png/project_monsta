import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'


var islogin = Cookies.get('user_login');
var islogin = islogin ?? 0;

const initialState = {
  value: islogin,
}

export const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state,action) => {
      state.value =action.payload;
      Cookies.set('user_login',action.payload);
            
    },
    register: (state,action) => {
      state.value =action.payload;
      Cookies.set('user_login',action.payload);
      
    },
    logout: (state, action) => {
      state.value=0;
      Cookies.remove('user_login');
    
    },
  },
})

// Action creators are generated for each case reducer function
export const { login, register, logout } = LoginSlice.actions

export default LoginSlice.reducer