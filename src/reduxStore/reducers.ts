import { combineReducers } from "redux";
import { Action } from "typesafe-actions";

import { api } from "./services/api/api";
import { EntireState } from "./types";

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});

const rootReducer = (state: EntireState, action: Action) => {
  return appReducer(state, action);
};

export default rootReducer;
