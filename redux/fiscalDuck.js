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
              response.data.results.find((item) => item.active === true).version
            )
      );
    })
    .catch((error) => {
      console.log(error);
    });
};

export const setVersionCfdi = (use_cfdi) => async (dispatch, getState) => {
  if (use_cfdi && use_cfdi != undefined) {
    setStorage("v", use_cfdi);
    dispatch({ type: VERSION_CFDI, payload: use_cfdi });
    let current_node = getState().userStore.current_node;
    dispatch(
      doFiscalCatalogs(current_node ? current_node.id : null, Number(use_cfdi))
    );
  }
};

export const doFiscalCatalogs =
  (node_id, use_cfdi) => async (dispatch, getState) => {
    console.log(use_cfdi);
    try {
      if (use_cfdi && use_cfdi != undefined) {
        dispatch(getFiscalBanks(use_cfdi));
        dispatch(getFiscalTaxRegime(use_cfdi));
        dispatch(getPerceptions(use_cfdi));
        dispatch(getDeductions(use_cfdi));
        dispatch(getOtherPayments(use_cfdi));
        if (node_id) {
          dispatch(getInternalPerceptions(node_id, use_cfdi));
          dispatch(getInternalDeductions(node_id, use_cfdi));
          dispatch(getInternalOtherPayments(node_id, use_cfdi));
        }
        dispatch(getTypeTax(use_cfdi));
        dispatch(getPaymentPeriodicity(use_cfdi));
        dispatch(getJourneyType(use_cfdi));
        dispatch(getContractType(use_cfdi));
        dispatch(getHiringRegime(use_cfdi));
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getFiscalBanks = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getBanks()
    .then((response) => {
      dispatch({
        type: BANKS,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFiscalTaxRegime = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTaxRegime()
    .then((response) => {
      dispatch({
        type: TAX_REGIME,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPerceptions = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getPerseptions()
    .then((response) => {
      dispatch({
        type: PERCEPTIONS,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDeductions = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getDeductions()
    .then((response) => {
      dispatch({
        type: DEDUCTIONS,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOtherPayments = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getOtherPayments()
    .then((response) => {
      dispatch({
        type: OTHER_PAYMENTS,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
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
        console.log(error);
      });
  };

export const getInternalOtherPayments =
  (data) => async (dispatch, getState) => {
    await WebApiFiscal.getInternalOtherPayments(data)
      .then((response) => {
        dispatch({
          type: OTHER_PAYMENTS_INT,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getTypeTax = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTypeTax()
    .then((response) => {
      dispatch({
        type: TYPE_TAX,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })

    .catch((error) => {
      console.log(error);
    });
};
export const getPaymentPeriodicity =
  (use_cfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getPaymentPeriodicity()
      .then((response) => {
        dispatch({
          type: PAYMENT_PERIODICITY,
          payload: response.data.results.filter(
            (item) => Number(item.version_cfdi.version) <= use_cfdi
          ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getContractType = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getContractTypes()
    .then((response) => {
      dispatch({
        type: CONTRACT_TYPE,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getJourneyType = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTypeworkingday()
    .then((response) => {
      dispatch({
        type: JOURNEY_TYPE,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getHiringRegime = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getHiringRegimes()
    .then((response) => {
      dispatch({
        type: HIRING_REGIME,
        payload: response.data.results.filter(
          (item) => Number(item.version_cfdi.version) <= use_cfdi
        ),
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
