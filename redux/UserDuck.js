import Axios from "axios";
import { getGroups } from "../api/apiKhonnect";
import WebApi from "../api/webApi";
import { API_URL } from "../config/config";
import { userCompanyId } from "../libs/auth";

const initialData = {
  default: true,
  fetching: true,
  error: false,
  people_company: [],
};

const LOADING_WEB = "LOADING_WEB";
const LOADING_WEB_SUCCESS = "LOADING_WEB_SUCCESS";
const ERROR = "ERROR";
const JWT = "JWT";
const GENERAL_CONFIG = "GENERAL_CONFIG";
const COMPANY_SELCTED = "COMPANY_SELECTED";
const PEOPLE_COMPANY = "PEOPLE_COMPANY";
const DATA_UPLOAD = "DATA_UPLOAD";

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
    default:
      return state;
  }
};
export default webReducer;

export const doGetGeneralConfig = () => async (dispatch, getState) => {
  try {
    let response = await WebApi.getGeneralConfig();
    sessionStorage.setItem("accessIntranet", response.data.intranet_enabled);
    dispatch({ type: GENERAL_CONFIG, payload: response.data });
  } catch (error) {}
};

export const showScreenError = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ERROR,
    });
  } catch (error) {}
};

export const showLoading = (data) => async (dispatch, getState) => {
  try {
    if (data) dispatch({ type: LOADING_WEB });
    else dispatch({ type: LOADING_WEB_SUCCESS });
  } catch (error) {}
};

export const companySelected = (data) => async (dispatch, getState) => {
  try {
    if (!data) data = await userCompanyId();
    if (data) {
      let response = await WebApi.getCompany(data);
      dispatch({ type: COMPANY_SELCTED, payload: response.data });
      dispatch(getPeopleCompany(data));
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
    let response = await WebApi.filterPerson({ node: data });
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
