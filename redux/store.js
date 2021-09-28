import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducer, { companySelected, doGetGeneralConfig } from "./UserDuck";
import assessmentReducer, { assessmentLoadAction } from "./assessmentDuck";

const rootReducer = combineReducers({
  userStore: webReducer,
  assessmentStore: assessmentReducer,
});

export const store = createStore(
  rootReducer, 
  applyMiddleware(thunk)
);

export default () => {
  companySelected()(store.dispatch);
  doGetGeneralConfig()(store.dispatch);
  assessmentLoadAction()(store.dispatch);
  return store;
};
