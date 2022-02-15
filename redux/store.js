import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducerUser, { doGetGeneralConfig } from "./UserDuck";
import webReducerCatalog, { doCompanySelectedCatalog } from "./catalogCompany";
import fiscalDuck from "./fiscalDuck";
import IntranetDuck from "./IntranetDuck";
import userAndCompanyReducer from "./userAndCompanyFilterDuck";
import assessmentReducer from "./assessmentDuck";

const rootReducer = combineReducers({
  userStore: webReducerUser,
  catalogStore: webReducerCatalog,
  fiscalStore: fiscalDuck,
  intranetStore: IntranetDuck,
  userAndCompanyStore: userAndCompanyReducer,
  assessmentStore: assessmentReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  doGetGeneralConfig()(store.dispatch);
  doCompanySelectedCatalog()(store.dispatch);
  return store;
};
