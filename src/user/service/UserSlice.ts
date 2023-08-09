import {UserState} from "user/service/model/User";
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    name: ""
} as UserState

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsername(state, action) {
            state.name = action.payload
        },
        clearUserData(state){
          state.name = initialState.name;
        }
    }
})

export const {
    setUsername,
    clearUserData
} = userSlice.actions

export default userSlice.reducer