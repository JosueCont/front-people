import WebApiIntranet from "../api/WebApiIntranet";

const initialData = {
  groupList: [],
  usersList: [],
  fetching: false,
  error: "",
};

const LOADING_GROUPS = "LOADING_GROUPS";
const SUCCESS_GROUPS = "SUCCESS_GROUPS";
const ERROR_GROUPS = "ERROR_GROUPS";
const LOADING_USERS = "LOADING_USERS";
const SUCCESS_USERS = "SUCCESS_USERS";
const ERROR_USERS = "ERROR_USERS";

const userAndCompanyReducer = (state = initialData, action) => {
  switch (action.type) {
    case LOADING_GROUPS:
      return { ...state, fetching: true };
    case SUCCESS_GROUPS:
      return { ...state, fetching: false, groupList: action.payload };
    case ERROR_GROUPS:
      return { ...state, fetching: false, groupList: [] };
    case LOADING_USERS:
      return { ...state, fetching: true };
    case SUCCESS_USERS:
      return { ...state, fetching: false, usersList: action.payload };
    case ERROR_USERS:
      return { ...state, fetching: false, usersList: [] };
    default:
      return state;
  }
};

export const getGroupList = (node) => async (dispatch, getState) => {
  dispatch({ type: LOADING_GROUPS, fetching: true });
  let response = WebApiIntranet.getGroupList(node)
    .then((response) => {
      if (response.status == 200) {
        dispatch({
          type: SUCCESS_GROUPS,
          payload: response.data.results,
        });
      } else {
        dispatch({
          type: ERROR_GROUPS,
          payload: "ERROR GETTING GROUPS",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: ERROR_GROUPS,
        payload: "ERROR GETTING GROUPS",
      });
    });
};

export const getUsersList = (node) => async (dispatch, getState) => {
  dispatch({ type: LOADING_USERS, fetching: true });
  let response = WebApiIntranet.getUsersList(node)
    .then((response) => {
      if ((response.status = 200)) {
        dispatch({
          type: SUCCESS_USERS,
          payload: response.data,
        });
      } else {
        dispatch({
          type: ERROR_USERS,
          payload: "ERROR GETTING USERS",
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: ERROR_USERS,
        payload: "ERROR GETTING USERS",
      });
      console.log(error);
    });
};

export default userAndCompanyReducer;
