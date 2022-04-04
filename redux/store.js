import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducerUser, { doGetGeneralConfig } from "./UserDuck";
import webReducerCatalog, { doCompanySelectedCatalog } from "./catalogCompany";
import fiscalDuck, { getFiscalBanks } from "./fiscalDuck";
import IntranetDuck from "./IntranetDuck";
import PayrollDuck from "./payrollDuck";
import userAndCompanyReducer from "./userAndCompanyFilterDuck";
import assessmentReducer from "./assessmentDuck";

const rootReducer = combineReducers({
  userStore: webReducerUser,
  catalogStore: webReducerCatalog,
  fiscalStore: fiscalDuck,
  intranetStore: IntranetDuck,
  userAndCompanyStore: userAndCompanyReducer,
  payrollStore: PayrollDuck,
  assessmentStore: assessmentReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  doGetGeneralConfig()(store.dispatch);
  doCompanySelectedCatalog()(store.dispatch);
  getFiscalBanks()(store.dispatch);
  return store;
};
