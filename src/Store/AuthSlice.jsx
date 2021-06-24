import {createSlice} from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialToken = Cookies.get('token');
const initialUserId = Cookies.get('userId');
const initialAuthState = {
    token:initialToken,
    userId:initialUserId,
    user:{
        email:null
    }
} 
const authSlice = createSlice({
    name:'auth',
    initialState:initialAuthState,
    reducers:{
        login(state,action) {
            state.token = action.payload.idToken;
            state.userId = action.payload.userId
            Cookies.set('token',state.token,{expires: 1/24,sameSite:'strict',secure:true,path:'/'});
            Cookies.set('userId',state.userId,{expires: 1/24,sameSite:'strict',secure:true,path:'/'});
        },
        logout(state) {
            state.token = null;
            Cookies.remove('token');
            Cookies.remove('userId');
        },
        setProfileInfo(state,action) {
            state.user.email = action.payload.email;
            state.user.createdAt = new Date(+action.payload.createdAt).toLocaleDateString();
            state.user.lastLogin = new Date(+action.payload.lastLogin).toLocaleDateString();
        }
    }
})

export default authSlice

