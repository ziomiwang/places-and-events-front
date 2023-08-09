import {combineReducers} from "@reduxjs/toolkit";
import eventSlice from "components/events/service/EventSlice";
import userSlice from "user/service/UserSlice";

const rootReducer = combineReducers({
    events: eventSlice,
    user: userSlice
});

export type RootState = ReturnType<typeof rootReducer>;
export { rootReducer }