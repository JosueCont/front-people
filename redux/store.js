import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import webReducerUser, { doGetGeneralConfig, changeLanguage } from "./UserDuck";
import webReducerCatalog, {doCompanySelectedCatalog, senData} from "./catalogCompany";
import fiscalDuck from "./fiscalDuck";
import IntranetDuck from "./IntranetDuck";
import PayrollDuck from "./payrollDuck";
import userAndCompanyReducer from "./userAndCompanyFilterDuck";
import assessmentReducer from "./assessmentDuck";
import dataImportCalendar from "./ImportCalendarDuck"
import ynlReducer from "./ynlDuck";
import backdoorReducer from "./backdoorDuck";
import jobBankReducer from "./jobBankDuck";
import NotificationReducer from "./NotificationDuck";
import timeclockReducer from "./timeclockDuck";
import orgReducer from "./orgStructureDuck";

const rootReducer = combineReducers({
  userStore: webReducerUser,
  catalogStore: webReducerCatalog,
  fiscalStore: fiscalDuck,
  intranetStore: IntranetDuck,
  userAndCompanyStore: userAndCompanyReducer,
  payrollStore: PayrollDuck,
  assessmentStore: assessmentReducer,
  importCalendarStore: dataImportCalendar,
  ynlStore: ynlReducer,
  backdoorStore: backdoorReducer,
  jobBankStore: jobBankReducer,
  NotificationStore:NotificationReducer,
  timeclockStore: timeclockReducer,
  orgStore: orgReducer
});
const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default () => {
  changeLanguage()(store.dispatch)
  doGetGeneralConfig()(store.dispatch);
  doCompanySelectedCatalog()(store.dispatch);
  return store;
};
