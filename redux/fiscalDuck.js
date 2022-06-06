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
  cat_cfdi_version: [],
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
const CAT_CFDI_VERSION = "CAT_CFDI_VERSION";
const VERSION_CFDI = "VERSION_CFDI";
const CONTRACT_TYPE = "CONTRACT_TYPE";
const JOURNEY_TYPE = "JOURNEY_TYPE";
const HIRING_REGIME = "HIRING_REGIME";

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
    case CAT_CFDI_VERSION:
      return { ...state, cat_cfdi_version: action.payload };
    case VERSION_CFDI:
      return { ...state, version_cfdi: action.payload };
    case CONTRACT_TYPE:
      return { ...state, cat_contract_type: action.payload };
    case JOURNEY_TYPE:
      return { ...state, cat_journey_type: action.payload };
    case HIRING_REGIME:
      return { ...state, cat_hiring_regime: action.payload };
    default:
      return state;
  }
};
export default webReducer;

export const getCfdiVersion = () => async (dispatch, getState) => {
  await WebApiFiscal.getCfdiVersion()
    .then((response) => {
      dispatch({ type: CAT_CFDI_VERSION, payload: response.data.results });
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
  if (version_id && version_id != undefined) {
    setStorage("v", version_id);
    dispatch({ type: VERSION_CFDI, payload: version_id });
    let current_node = getState().userStore.current_node;
    dispatch(
      doFiscalCatalogs(current_node ? current_node.id : null, version_id)
    );
  }
};

export const doFiscalCatalogs =
  (node_id, versionCfdi) => async (dispatch, getState) => {
    try {
      if (versionCfdi && versionCfdi != undefined) {
        dispatch(getFiscalBanks(versionCfdi));
        dispatch(getFiscalTaxRegime(versionCfdi));
        dispatch(getPerceptions(versionCfdi));
        dispatch(getDeductions(versionCfdi));
        dispatch(getOtherPayments(versionCfdi));
        if (node_id) {
          dispatch(getInternalPerceptions(node_id, versionCfdi));
          dispatch(getInternalDeductions(node_id, versionCfdi));
          dispatch(getInternalOtherPayments(node_id, versionCfdi));
        }
        dispatch(getTypeTax(versionCfdi));
        dispatch(getPaymentPeriodicity(versionCfdi));
        dispatch(getJourneyType(versionCfdi));
        dispatch(getContractType(versionCfdi));
        dispatch(getHiringRegime(versionCfdi));
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getFiscalBanks = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getBanks(versionCfdi)
    .then((response) => {
      console.log("fiscal banks", response.data.results);
      dispatch({ type: BANKS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFiscalTaxRegime =
  (versionCfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getTaxRegime(versionCfdi)
      .then((response) => {
        dispatch({ type: TAX_REGIME, payload: response.data.results });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getPerceptions = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getPerseptions(versionCfdi)
    .then((response) => {
      dispatch({ type: PERCEPTIONS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDeductions = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getDeductions(versionCfdi)
    .then((response) => {
      dispatch({ type: DEDUCTIONS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOtherPayments = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getOtherPayments(versionCfdi)
    .then((response) => {
      dispatch({ type: OTHER_PAYMENTS, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getInternalPerceptions =
  (data, versionCfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getInternalPerceptions(data, versionCfdi)
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

export const getInternalDeductions =
  (data, versionCfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getInternalDeductions(data, versionCfdi)
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
  (data, versionCfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getInternalOtherPayments(data, versionCfdi)
      .then((response) => {
        dispatch({ type: OTHER_PAYMENTS_INT, payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getTypeTax = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTypeTax(versionCfdi)
    .then((response) => {
      dispatch({ type: TYPE_TAX, payload: response.data.results });
    })

    .catch((error) => {
      console.log(error);
    });
};
export const getPaymentPeriodicity =
  (versionCfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getPaymentPeriodicity(versionCfdi)
      .then((response) => {
        dispatch({ type: PAYMENT_PERIODICITY, payload: response.data.results });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getContractType = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getContractTypes(versionCfdi)
    .then((response) => {
      dispatch({ type: CONTRACT_TYPE, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getJourneyType = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTypeworkingday(versionCfdi)
    .then((response) => {
      dispatch({ type: JOURNEY_TYPE, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getHiringRegime = (versionCfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getHiringRegimes(versionCfdi)
    .then((response) => {
      dispatch({ type: HIRING_REGIME, payload: response.data.results });
    })
    .catch((error) => {
      console.log(error);
    });
};
