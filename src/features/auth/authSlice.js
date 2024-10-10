import { createSlice } from "@reduxjs/toolkit";
import {loadState} from "../../app/localstorage";

const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, token: null},
    reducers: {
        setCredentials: (state, action) => {
            const { login, token } = action.payload
            state.user = login
            state.token = token

        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => {
    state = loadState()
    if (state == null) return null
    return state.auth.user
}
export const selectCurrentToken = (state) => {
    state = loadState()
    if (state == null) return null
    return state.auth.token
}