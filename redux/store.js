import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducerUser, {
  companySelected,
  doGetGeneralConfig,
} from "./UserDuck";
import webReducerCatalog, { doCompanySelectedCatalog } from "./catalogCompany";
import assessmentReducer, { assessmentLoadAction } from "./assessmentDuck";
import fiscalDuck, { doFiscalSelectedData } from "./fiscalDuck";
import publicationsListReducer from "./publicationsListDuck";
import userAndCompanyReducer from "./userAndCompanyFilterDuck";

const rootReducer = combineReducers({
  userStore: webReducerUser,
  catalogStore: webReducerCatalog,
  assessmentStore: assessmentReducer,
  fiscalStore: fiscalDuck,
  publicationsListStore: publicationsListReducer,
  userAndCompanyStore: userAndCompanyReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  companySelected()(store.dispatch);
  doGetGeneralConfig()(store.dispatch);
  doCompanySelectedCatalog()(store.dispatch);
  // assessmentLoadAction()(store.dispatch);
  doFiscalSelectedData()(store.dispatch);
  return store;
};
