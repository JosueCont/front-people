import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducer, { companySelected, doGetGeneralConfig } from "./UserDuck";

const rootReducer = combineReducers({
  userStore: webReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  companySelected()(store.dispatch);
  doGetGeneralConfig()(store.dispatch);
  return store;
};
