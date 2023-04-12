import thunk from "redux-thunk";
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { uploadReducer } from "../media/redux/reducers";
import { filtersReducer } from "../filters/redux/reducers";
import { playerReducer } from "../player/redux/reducers";
import { authReducer } from "../auth/redux/reducers";


const APP_LOADING = "APP_LOADING";


const loadingReducer = (
  state: {loading: number} = {loading: 0},
  action: {type: typeof APP_LOADING, payload: number}
): {loading: number} => {
  if (action.type === APP_LOADING) {
    return {
      ...state,
      loading: state.loading + action.payload
    }
  }
  else {
    return state;
  }
}


const appReducer = combineReducers({
  appLoading: loadingReducer,
  auth: authReducer,
  filters: filtersReducer,
  player: playerReducer,
  upload: uploadReducer,
});

export type AppState = ReturnType<typeof appReducer>;
export const store = configureStore({reducer: appReducer, middleware: [thunk]})