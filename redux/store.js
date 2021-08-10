import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducer from "./UserDuck";

const rootReducer = combineReducers({
  userStore: webReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  // doGetGeneralConfig()(store.dispatch);
  return store;
};
