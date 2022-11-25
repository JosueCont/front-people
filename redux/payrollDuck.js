import WebApiPayroll from "../api/WebApiPayroll";
import { userCompanyId } from "../libs/auth";

const initialData = {
  payment_calendar: [],
  fixed_concept: [],
  group_fixed_concept: [],
  imss_movements:[]
};

const PAYMENT_CALENDAR = "PAYMENT_CALENDAR";
const FIXED_CONCEPT = "FIXED_CONCEPT";
const GROUP_FIXED_CONCEPT = "GROUP_FIXED_CONCEPT";
const MOVEMENTS_IMSS = "MOVEMENTS_IMSS";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case PAYMENT_CALENDAR:
      return { ...state, payment_calendar: action.payload };
    case FIXED_CONCEPT:
      return { ...state, fixed_concept: action.payload };
    case GROUP_FIXED_CONCEPT:
      return { ...state, group_fixed_concept: action.payload };
      case MOVEMENTS_IMSS:
      return { ...state, imss_movements: action.payload };
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
      dispatch({
        type: GROUP_FIXED_CONCEPT,
        payload: response.data.results,
      });
    })
    .catch((error) => {
      dispatch({ type: GROUP_FIXED_CONCEPT, payload: [] });
    });
};



export const getMovementsIMSS=(node)=> async (dispatch, getState) =>{
    try{
        const res = await WebApiPayroll.getMovementsIMSSLog(node?.id);
        dispatch({
            type: MOVEMENTS_IMSS,
            payload: res.data,
        });

    }catch (e){
        dispatch({
            type: MOVEMENTS_IMSS,
            payload: [],
        });
    }
}
