import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {rootReducer, RootState} from "redux/rootReducer";
import {persistStore} from "redux-persist";

const store = configureStore({
  reducer: rootReducer,
});

const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>

export {store, persistor}
