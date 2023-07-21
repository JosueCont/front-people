import WebApiPeople from "../api/WebApiPeople";
import jsCookie from "js-cookie";
import { userCompanyId } from "../libs/auth";
import { UserPermissions } from "../utils/functions";
import { doCompanySelectedCatalog, getProfileGroups } from "./catalogCompany";
import { doCompanySelectedPayroll } from "./payrollDuck";
import { getCfdiVersion } from "./fiscalDuck";
import { getListAppsBackdoor } from "./backdoorDuck";

const initialData = {
  default: true,
  fetching: true,
  error: false,
  people_company: [],
  user: null,
  permissions: UserPermissions(),
  current_node: null,
  general_config: null,
  applications: {},
  persons_company: [],
  load_persons: false,
  info_current_rol: {},
  load_current_rol: false,
  lang: 'es-mx'
};

const LOADING_WEB = "LOADING_WEB";
const LOADING_WEB_SUCCESS = "LOADING_WEB_SUCCESS";
const ERROR = "ERROR";
const JWT = "JWT";
const GENERAL_CONFIG = "GENERAL_CONFIG";
const COMPANY_SELCTED = "COMPANY_SELECTED";
const PEOPLE_COMPANY = "PEOPLE_COMPANY";
const DATA_UPLOAD = "DATA_UPLOAD";
const USER = "USER";
const PERMISSIONS = "PERMISSIONS";
const APPLICATIONS = "APPLICATIONS";
const PERSONS_COMPANY = "PERSONS_COMPANY";
const GET_CURRENT_ROL = "GET_CURRENT_ROL";
const CHANGE_LANG = "CHANGE_LANG";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case LOADING_WEB:
      return { ...state, fetching: true, default: false };
    case LOADING_WEB_SUCCESS:
      return { ...state, fetching: false, default: false };
    case ERROR:
      return { ...state, error: true, default: true };
    case JWT:
      return { ...state, jwt: action.payload };
    case GENERAL_CONFIG:
      return { ...state, general_config: action.payload };
    case COMPANY_SELCTED:
      return { ...state, current_node: action.payload };
    case PEOPLE_COMPANY:
      return { ...state, people_company: action.payload };
    case DATA_UPLOAD:
      return { ...state, data_upload: action.payload };
    case USER:
      return { ...state, user: action.payload };
    case PERMISSIONS:
      return { ...state, permissions: action.payload };
    case APPLICATIONS:
      return { ...state, applications: action.payload };
    case CHANGE_LANG:
      return { ...state, lang: action.payload };
    case PERSONS_COMPANY:
      return {
        ...state,
        persons_company: action.payload,
        load_persons: action.fetching
      }
    case GET_CURRENT_ROL:
      return {
        ...state,
        info_current_rol: action.payload,
        load_current_rol: action.fetching
      }
    default:
      return state;
  }
};
export default webReducer;

export const doGetGeneralConfig = () => async (dispatch, getState) => {
  await WebApiPeople.getGeneralConfig()
    .then((response) => {
      sessionStorage.setItem("aid", response.data.client_khonnect_id);
      sessionStorage.setItem("accessIntranet", response.data.intranet_enabled);
      dispatch({ type: GENERAL_CONFIG, payload: response.data });
      dispatch(setUser());
      const apps = {};
      if (response.data.applications) {
        response.data.applications.map((item) => {
          apps[item.app.toLowerCase()] = {
            active: item.is_active,
            back: item.url_backend,
            front: item.url_frontend,
          };
        });
        dispatch({ type: APPLICATIONS, payload: apps });
        if (apps.payroll && apps.payroll.active) {
          dispatch(getCfdiVersion());
        }
      }
    })

    .catch((error) => { });
};

export const showScreenError = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ERROR,
    });
  } catch (error) { }
};

export const showLoading = (data) => async (dispatch, getState) => {
  try {
    if (data) dispatch({ type: LOADING_WEB });
    else dispatch({ type: LOADING_WEB_SUCCESS });
  } catch (error) { }
};

export const setNullCompany = () => async (dispatch, getState) => {
  try {
    sessionStorage.removeItem("image");
    sessionStorage.removeItem("data");
    dispatch({ type: COMPANY_SELCTED, payload: null });
  } catch (error) {
    console.log('error', error)
  }
}

export const companySelected = (data, config, hideCompany = false) => async (dispatch, getState) => {
  try {

    if (!data && !hideCompany) data = userCompanyId();
    if (data && config) {
      let response = await WebApiPeople.getCompany(data);
      dispatch({ type: COMPANY_SELCTED, payload: response.data });
      dispatch(doCompanySelectedCatalog(response.data.id));
      dispatch(getPeopleCompany(response.data.id));
      dispatch(getProfileGroups(response.data.id, config));
      dispatch(getListAppsBackdoor(response.data.id, 1))
      if (config.nomina_enabled) {
        dispatch(doCompanySelectedPayroll(response.data.id));
        dispatch(getCfdiVersion());
      }
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getPeopleCompany = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.filterPerson({ node: data });
    let people = response.data.map((a, i) => {
      return {
        label: a.first_name + " " + a.flast_name,
        value: a.id,
        key: a.id + i,
      };
    });
    dispatch({ type: PEOPLE_COMPANY, payload: people });
  } catch (error) {
    console.log(error);
  }
};

export const setDataUpload = (data) => async (dispatch, getState) => {
  try {
    dispatch({ type: DATA_UPLOAD, payload: data });
    return true;
  } catch (error) {
    return false;
  }
};

export const changeLanguage = (lang = 'es-mx') => async (dispatch, getState) => {
  try {
    if (!lang) {
      lang = localStorage.getItem("userLang");
    } else {
      localStorage.setItem('userLang', lang)
    }

    dispatch({ type: CHANGE_LANG, payload: lang });
    return true;
  } catch (error) {
    return false;
  }
};


export const setUser = () => async (dispatch, getState) => {
  try {
    let jwt = JSON.parse(jsCookie.get("token"));
    let response = await WebApiPeople.personForKhonnectId({ id: jwt.user_id });
    dispatch({ type: USER, payload: response.data });
    dispatch(setUserPermissions(response.data.jwt_data.perms, response.data.is_admin));
    let profile = response?.data?.administrator_profile;
    let have_rol = profile ? Object.keys(profile).length > 0 : false;
    if (!(response.data?.is_admin && have_rol)) return;
    dispatch(getCurrentRol(profile.id))
    return true;
  } catch (error) {
    return false;
  }
};

export const setUserPermissions =
  (permits, is_admin) => async (dispatch, getState) => {
    try {
      let perms = await UserPermissions(permits, is_admin);

      dispatch({ type: PERMISSIONS, payload: perms });
      return true;
    } catch (error) {
      return false;
    }
  };

export const resetCurrentnode = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPANY_SELCTED, payload: null });
  } catch (error) {
    dispatch({ type: COMPANY_SELCTED, payload: null });
  }
};

export const saveCurrentNode = (data) => async (dispatch) => {
  dispatch({ type: COMPANY_SELCTED, payload: data });
}

export const getPersonsCompany = (data) => async (dispatch, getState) => {
  dispatch({ type: PERSONS_COMPANY, payload: [], fetching: true });
  try {
    let response = await WebApiPeople.filterPerson({ node: data });
    dispatch({ type: PERSONS_COMPANY, payload: response.data, fetching: false });
  } catch (error) {
    dispatch({ type: PERSONS_COMPANY, payload: [], fetching: false });
    console.log(error);
  }
};

export const getCurrentRol = (id_rol) => async (dispatch) => {
  const typeFunction = { type: GET_CURRENT_ROL, payload: {}, fetching: false };
  dispatch({ ...typeFunction, fetching: true })
  try {
    let response = await WebApiPeople.getInfoAdminRole(id_rol);
    dispatch({ ...typeFunction, payload: response.data })
  } catch (e) {
    console.log(e)
    dispatch(typeFunction)
  }
}