import WebApi from "../api/webApi";

const initialData = {
  default: true,
  fetching: true,
  error: false,
};

const LOADING_WEB = "LOADING_WEB";
const LOADING_WEB_SUCCESS = "LOADING_WEB_SUCCESS";
const ERROR = "ERROR";
const JWT = "JWT";
const GENERAL_CONFIG = "GENERAL_CONFIG";
const COMPANY_SELCTED = "COMPANY_SELECTED";

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
      return { ...state, current_company: action.payload };
    default:
      return state;
  }
};
export default webReducer;

export const doGetGeneralConfig = () => async (dispatch, getState) => {
  try {
    let response = await WebApi.getGeneralConfig();
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
    dispatch({ type: COMPANY_SELCTED, payload: data });
    return true;
  } catch (error) {
    return false;
  }
};
