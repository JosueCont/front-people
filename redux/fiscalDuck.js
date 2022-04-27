import WebApiFiscal from "../api/WebApiFiscal";

const initialData = {
  banks: [],
  tax_regime: [],
  cat_perceptions: [],
  cat_deductions: [],
  cat_other_payments: [],
  perceptions_int: [],
  deductions_int: [],
  other_payments_int: [],
  type_tax: [],
  payment_periodicity: [],
};

const BANKS = "BANKS";
const TAX_REGIME = "TAX_REGIME";
const PERCEPTIONS = "PERCEPTIONS";
const DEDUCTIONS = "DEDUCTIONS";
const OTHER_PAYMENTS = "OTHER_PAYMENTS";
const PERCEPTIONS_INT = "PERCEPTIONS_INT";
const DEDUCTIONS_INT = "DEDUCTIONS_INT";
const OTHER_PAYMENTS_INT = "OTHER_PAYMENTS_INT";
const TYPE_TAX = "TYPE_TAX";
const PAYMENT_PERIODICITY = "PAYMENT_PERIODICITY";

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
    case PERCEPTIONS_INT:
      return { ...state, perceptions_int: action.payload, default: false };
    case DEDUCTIONS_INT:
      return { ...state, deductions_int: action.payload, default: false };
    case OTHER_PAYMENTS_INT:
      return { ...state, other_payments_int: action.payload, default: false };
    case TYPE_TAX:
      return { ...state, type_tax: action.payload, default: false };
    case PAYMENT_PERIODICITY:
      return { ...state, payment_periodicity: action.payload, default: false };
    default:
      return state;
  }
};
export default webReducer;

export const doFiscalCatalogs = (node_id) => async (dispatch, getState) => {
  try {
    dispatch(getFiscalTaxRegime());
    dispatch(getPerceptions());
    dispatch(getDeductions());
    dispatch(getOtherPayments());
    if (node_id) {
      dispatch(getInternalPerceptions(node_id));
      dispatch(getInternalDeductions(node_id));
      dispatch(getInternalOtherPayments(node_id));
    }
    dispatch(getTypeTax());
    dispatch(getPaymentPeriodicity());
  } catch (error) {
    console.log("CATCH: ", error);
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

export const getInternalPerceptions = (data) => async (dispatch, getState) => {
  await WebApiFiscal.getInternalPerceptions(data)
    .then((response) => {
      dispatch({
        type: PERCEPTIONS_INT,
        payload: response.data.filter(
          (item) =>
            item.perception_type.code != "001" &&
            item.perception_type.code != "046"
        ),
      });
    })
    .catch((error) => {
      if (error.response.status !== 400) console.log("PERCEPTION: ", error);
    });
};

export const getInternalDeductions = (data) => async (dispatch, getState) => {
  await WebApiFiscal.getInternalDeductions(data)
    .then((response) => {
      dispatch({
        type: DEDUCTIONS_INT,
        payload: response.data.filter(
          (item) =>
            item.deduction_type.code != "001" &&
            item.deduction_type.code != "002"
        ),
      });
    })
    .catch((error) => {
      // console.log(error);
    });
};

export const getInternalOtherPayments =
  (data) => async (dispatch, getState) => {
    await WebApiFiscal.getInternalOtherPayments(data)
      .then((response) => {
        dispatch({ type: OTHER_PAYMENTS_INT, payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getTypeTax = () => async (dispatch, getState) => {
  await WebApiFiscal.getTypeTax()
    .then((response) => {
      dispatch({ type: TYPE_TAX, payload: response.data.results });
    })

    .catch((error) => {
      console.log(error);
    });
};
export const getPaymentPeriodicity = () => async (dispatch, getState) => {
  await WebApiFiscal.getPaymentPeriodicity()
    .then((response) => {
      dispatch({ type: PAYMENT_PERIODICITY, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};
