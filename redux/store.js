import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducerUser, {
  companySelected,
  doGetGeneralConfig,
} from "./UserDuck";
import webReducerCatalog, { doCompanySelectedCatalog } from "./catalogCompany";
import fiscalDuck, { doFiscalSelectedData } from "./fiscalDuck";
import IntranetDuck from "./IntranetDuck";
import userAndCompanyReducer from "./userAndCompanyFilterDuck";

const rootReducer = combineReducers({
  userStore: webReducerUser,
  catalogStore: webReducerCatalog,
  fiscalStore: fiscalDuck,
  intranetStore: IntranetDuck,
  userAndCompanyStore: userAndCompanyReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  companySelected()(store.dispatch);
  doGetGeneralConfig()(store.dispatch);
  doCompanySelectedCatalog()(store.dispatch);
  doFiscalSelectedData()(store.dispatch);
  return store;
};
