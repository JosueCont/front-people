import WebApiFiscal from "../api/WebApiFiscal";
import { getStorage, setStorage } from "../libs/auth";

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
  cfdi_version: [],
  version_cfdi: null,
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
const CFDI_VERSION = "CFDI_VERSION";
const VERSION_CFDI = "VERSION_CFDI";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case BANKS:
      return { ...state, banks: action.payload };
    case TAX_REGIME:
      return { ...state, tax_regime: action.payload };
    case PERCEPTIONS:
      return { ...state, cat_perceptions: action.payload };
    case DEDUCTIONS:
      return { ...state, cat_deductions: action.payload };
    case OTHER_PAYMENTS:
      return { ...state, cat_other_payments: action.payload };
    case PERCEPTIONS_INT:
      return { ...state, perceptions_int: action.payload };
    case DEDUCTIONS_INT:
      return { ...state, deductions_int: action.payload };
    case OTHER_PAYMENTS_INT:
      return { ...state, other_payments_int: action.payload };
    case TYPE_TAX:
      return { ...state, type_tax: action.payload };
    case PAYMENT_PERIODICITY:
      return { ...state, payment_periodicity: action.payload };
    case CFDI_VERSION:
      return { ...state, cfdi_version: action.payload };
    case VERSION_CFDI:
      return { ...state, version_cfdi: action.payload };
    default:
      return state;
  }
};
export default webReducer;

export const getCfdiVersion = () => async (dispatch, getState) => {
  await WebApiFiscal.getCfdiVersion()
    .then((response) => {
      dispatch({ type: CFDI_VERSION, payload: response.data.results });
      dispatch(
        getStorage("v")
          ? setVersionCfdi(getStorage("v"))
          : setVersionCfdi(
              response.data.results.find((item) => item.active === true).id
            )
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

export const setVersionCfdi = (version_id) => async (dispatch, getState) => {
  setStorage("v", version_id);
  dispatch({ type: VERSION_CFDI, payload: version_id });
  let current_node = getState().userStore.current_node;
  dispatch(doFiscalCatalogs(current_node ? current_node.id : null, version_id));
};

export const doFiscalCatalogs =
  (node_id, version_cfdi) => async (dispatch, getState) => {
    try {
      dispatch(getFiscalBanks(version_cfdi));
      dispatch(getFiscalTaxRegime(version_cfdi));
      dispatch(getPerceptions(version_cfdi));
      dispatch(getDeductions(version_cfdi));
      dispatch(getOtherPayments(version_cfdi));
      if (node_id) {
        dispatch(getInternalPerceptions(node_id));
        dispatch(getInternalDeductions(node_id));
        dispatch(getInternalOtherPayments(node_id));
      }
      dispatch(getTypeTax(version_cfdi));
      dispatch(getPaymentPeriodicity(version_cfdi));
    } catch (error) {
      console.log(error);
    }
  };

export const getFiscalBanks = (version_cfdi) => async (dispatch, getState) => {
  if (version_cfdi)
    await WebApiFiscal.getBanks(version_cfdi)
      .then((response) => {
        dispatch({ type: BANKS, payload: response.data.results });
      })
      .catch((error) => {
        console.log(error);
      });
};

export const getFiscalTaxRegime =
  (version_cfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getTaxRegime(version_cfdi)
      .then((response) => {
        dispatch({ type: TAX_REGIME, payload: response.data.results });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getPerceptions = (version_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getPerseptions(version_cfdi)
    .then((response) => {
      dispatch({ type: PERCEPTIONS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDeductions = (version_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getDeductions(version_cfdi)
    .then((response) => {
      dispatch({ type: DEDUCTIONS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOtherPayments =
  (version_cfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getOtherPayments(version_cfdi)
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
      console.log(error);
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

export const getTypeTax = (version_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTypeTax(version_cfdi)
    .then((response) => {
      dispatch({ type: TYPE_TAX, payload: response.data.results });
    })

    .catch((error) => {
      console.log(error);
    });
};
export const getPaymentPeriodicity =
  (version_cfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getPaymentPeriodicity(version_cfdi)
      .then((response) => {
        dispatch({ type: PAYMENT_PERIODICITY, payload: response.data.results });
      })
      .catch((error) => {
        console.log(error);
      });
  };
