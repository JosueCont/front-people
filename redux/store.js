import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducer, { companySelected } from "./UserDuck";

const rootReducer = combineReducers({
  userStore: webReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  companySelected()(store.dispatch);
  return store;
};
