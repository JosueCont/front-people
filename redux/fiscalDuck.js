import WebApiFiscal from "../api/WebApiFiscal";
// import { userCompanyId } from "../libs/auth";

const initialData = {
  banks: [],
  tax_regime: [],
  cat_perceptions: [],
  cat_deductions: [],
  cat_other_payments: [],
};

const BANKS = "BANKS";
const TAX_REGIME = "TAX_REGIME";
const PERCEPTIONS = "PERCEPTIONS";
const DEDUCTIONS = "DEDUCTIONS";
const OTHER_PAYMENTS = "OTHER_PAYMENTS";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case BANKS:
      return { ...state, banks: action.payload, default: false };
    case TAX_REGIME:
      return { ...state, tax_regime: action.payload, default: false };
    case PERCEPTIONS:
      return { ...state, cat_perceptions: action.payload, default: false };
    case DEDUCTIONS:
      return { ...state, cat_deductions: action.payload, default: false };
    case OTHER_PAYMENTS:
      return { ...state, cat_other_payments: action.payload, default: false };
    default:
      return state;
  }
};
export default webReducer;

export const doFiscalSelectedData = () => async (dispatch, getState) => {
  try {
    dispatch(getFiscalBanks());
    dispatch(getFiscalTaxRegime());
    dispatch(getPerceptions());
    dispatch(getDeductions());
    dispatch(getOtherPayments());
  } catch (error) {
    console.log(error);
  }
};

export const getFiscalBanks = () => async (dispatch, getState) => {
  await WebApiFiscal.getBanks()
    .then((response) => {
      dispatch({ type: BANKS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFiscalTaxRegime = () => async (dispatch, getState) => {
  await WebApiFiscal.getTaxRegime()
    .then((response) => {
      dispatch({ type: TAX_REGIME, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPerceptions = () => async (dispatch, getState) => {
  await WebApiFiscal.getPerseptions()
    .then((response) => {
      dispatch({ type: PERCEPTIONS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDeductions = () => async (dispatch, getState) => {
  await WebApiFiscal.getDeductions()
    .then((response) => {
      dispatch({ type: DEDUCTIONS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOtherPayments = () => async (dispatch, getState) => {
  await WebApiFiscal.getOtherPayments()
    .then((response) => {
      dispatch({ type: OTHER_PAYMENTS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};
