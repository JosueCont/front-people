import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import webReducer, { doGetGeneralConfig } from "./assessmentDuck";

const rootReducer = combineReducers({
  storeAssessment: webReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  // doGetGeneralConfig()(store.dispatch);
  return store;
};
