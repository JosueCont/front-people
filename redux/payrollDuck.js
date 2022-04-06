import WebApiPayroll from "../api/WebApiPayroll";
import { userCompanyId } from "../libs/auth";

const initialData = {
  payment_calendar: [],
  fixed_concept: [],
  group_fixed_concept: [],
};

const PAYMENT_CALENDAR = "PAYMENT_CALENDAR";
const FIXED_CONCEPT = "FIXED_CONCEPT";
const GROUP_FIXED_CONCEPT = "GROUP_FIXED_CONCEPT";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case PAYMENT_CALENDAR:
      return { ...state, payment_calendar: action.payload };
    case FIXED_CONCEPT:
      return { ...state, fixed_concept: action.payload };
    case GROUP_FIXED_CONCEPT:
      return { ...state, group_fixed_concept: action.payload };
    default:
      return state;
  }
};
export default webReducer;

export const doCompanySelectedPayroll =
  (data) => async (dispatch, getState) => {
    try {
      if (!data) data = userCompanyId();
      if (data) {
        dispatch(getPaymentCalendar(data));
        dispatch(getFixedConcept(data));
        dispatch(getGroupFixedConcept(data));
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getPaymentCalendar = (data) => async (dispatch, getState) => {
  await WebApiPayroll.getPaymentCalendar(data)
    .then((response) => {
      const datas = response.data.results.map((item) => {
        item.key = item.id;
        return item;
      });
      dispatch({
        type: PAYMENT_CALENDAR,
        payload: datas,
      });
    })
    .catch((error) => {
      dispatch({ type: PAYMENT_CALENDAR, payload: [] });
    });
};

export const getFixedConcept = (data) => async (dispatch, getState) => {
  await WebApiPayroll.fixedConcept("get", null, `?node=${data}`)
    .then((response) => {
      const datas = response.data.results.map((item) => {
        item.key = item.id;
        return item;
      });
      dispatch({
        type: FIXED_CONCEPT,
        payload: datas,
      });
    })
    .catch((error) => {
      dispatch({ type: FIXED_CONCEPT, payload: [] });
    });
};

export const getGroupFixedConcept = (data) => async (dispatch, getState) => {
  await WebApiPayroll.groupFixedConcept("get", null, `?node=${data}`)
    .then((response) => {
      console.log("GET-->> ", response.data.results);
      dispatch({
        type: GROUP_FIXED_CONCEPT,
        payload: response.data.results,
      });
    })
    .catch((error) => {
      dispatch({ type: GROUP_FIXED_CONCEPT, payload: [] });
    });
};
