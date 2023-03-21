import thunk from "redux-thunk";
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { uploadReducer } from "../media/redux/reducers";


const loadingReducer = (
  state: {loading: number} = {loading: 0},
  action: {type: "APP_LOADING", payload: number}
): {loading: number} => {
  if (action.type === "APP_LOADING") {
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
  upload: uploadReducer,
});

export type AppState = ReturnType<typeof appReducer>;
export const store = configureStore({reducer: appReducer, middleware: [thunk]})