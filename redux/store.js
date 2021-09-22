import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import webReducerUser, {
  companySelected,
  doGetGeneralConfig,
} from "./UserDuck";
import webReducerCatalog, { doCompanySelectedCatalog } from "./catalogCompany";

const rootReducer = combineReducers({
  userStore: webReducerUser,
  catalogStore: webReducerCatalog,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => {
  companySelected()(store.dispatch);
  doGetGeneralConfig()(store.dispatch);
  doCompanySelectedCatalog()(store.dispatch);
  return store;
};
