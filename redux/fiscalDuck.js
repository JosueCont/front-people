import WebApiFiscal from "../api/WebApiFiscal";
import moment from "moment";
import { getStorage, setStorage } from "../libs/auth";
import _ from "lodash";

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
  cat_imss_delegation: [],
  cat_imss_subdelegation: [],
  cat_family_medical_unit: [],
  cat_geographic_area: [],
  company_fiscal_information: null,
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
const IMSS_DELEGATION = "IMSS_DELEGATION";
const IMSS_SUBDELEGATION = "IMSS_SUBDELEGATION";
const FAMILY_MEDICAL_UNIT = "FAMILY_MEDICAL_UNIT";
const GEOGRAPHIC_AREA = "GEOGRAPHIC_AREA";
const COMPANY_FISCAL_INFORMATION = "COMPANY_FISCAL_INFORMATION";

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
    case IMSS_DELEGATION:
      return { ...state, cat_imss_delegation: action.payload };
    case IMSS_SUBDELEGATION:
      return { ...state, cat_imss_subdelegation: action.payload };
    case FAMILY_MEDICAL_UNIT:
      return { ...state, cat_family_medical_unit: action.payload };
    case GEOGRAPHIC_AREA:
      return { ...state, cat_geographic_area: action.payload };
    case COMPANY_FISCAL_INFORMATION:
      return { ...state, company_fiscal_information: action.payload}
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
        dispatch(getTypeTax());
        dispatch(getPaymentPeriodicity(use_cfdi));
        dispatch(getJourneyType(use_cfdi));
        dispatch(getContractType(use_cfdi));
        dispatch(getHiringRegime(use_cfdi));
        dispatch(ImssDelegation());
        dispatch(ImssSubDelegation());
        dispatch(FamilyMedicalUnit());
        dispatch(getGeographicArea());
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getFiscalBanks = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getBanks()
    .then((response) => {
      // dispatch({
      //   type: BANKS,
      //   payload: response.data.results.filter(
      //     (item) => Number(item.version_cfdi.version) <= use_cfdi
      //   ),
      // });
      if (response?.data?.results) {
        let _banks = response?.data?.results.filter(
          (bank) => bank.version_cfdi.length > 0
        ); //GDZUL -- para evitar duplicados , revisar con peter
        let newBanks = _.orderBy(_banks, ["name"], ["asc"]);
        dispatch({
          type: BANKS,
          payload: newBanks,
        });
      } else {
        dispatch({
          type: BANKS,
          payload: [],
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getFiscalTaxRegime = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTaxRegime()
    .then((response) => {
      //   dispatch({
      //     type: TAX_REGIME,
      //     payload: response.data.results.filter(
      //       (item) => Number(item.version_cfdi.version) <= use_cfdi
      //     ),
      //   });
      dispatch({
        type: TAX_REGIME,
        payload: response.data.results,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getPerceptions = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getPerseptions()
    .then((response) => {
      // let underorderPerseptions = response.data.results.filter(
      //   (item) => Number(item.version_cfdi.version) <= use_cfdi
      // );
      let underorderPerseptions = response.data.results;

      let orderedPerseptions = underorderPerseptions.sort((a, b) => {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });

      let perseptions = _.orderBy(orderedPerseptions, ["description"], ["asc"]);

      dispatch({
        type: PERCEPTIONS,
        payload: perseptions,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getDeductions = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getDeductions()
    .then((response) => {
      // let unorderDeductions = response.data.results.filter(
      //   (item) => Number(item.version_cfdi.version) <= use_cfdi
      // );
      let unorderDeductions = response.data.results;

      let orderDeductions = unorderDeductions.sort((a, b) => {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });
      dispatch({
        type: DEDUCTIONS,
        payload: orderDeductions,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOtherPayments = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getOtherPayments()
    .then((response) => {
      // let unorderOtherPayments = response.data.results.filter(
      //   (item) => Number(item.version_cfdi.version) <= use_cfdi
      // );
      let unorderOtherPayments = response.data.results;

      let orderOtherPayments = unorderOtherPayments.sort((a, b) => {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });

      dispatch({
        type: OTHER_PAYMENTS,
        payload: orderOtherPayments,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getInternalPerceptions =
  (data, versionCfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getInternalPerceptions(data)
      .then((response) => {
        dispatch({
          type: PERCEPTIONS_INT,
          payload: response.data,
          // .filter(
          //   (item) =>
          //     // item.perception_type.code != "001" &&
          //     item.perception_type.code != "046"
          // ),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getInternalDeductions =
  (data, versionCfdi) => async (dispatch, getState) => {
    await WebApiFiscal.getInternalDeductions(data)
      .then((response) => {
        dispatch({
          type: DEDUCTIONS_INT,
          payload: response.data,
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

export const getTypeTax = () => async (dispatch, getState) => {
  await WebApiFiscal.getTypeTax()
    .then((response) => {
      let taxes = _.orderBy(response.data.results, ["description"], ["asc"]);
      dispatch({
        type: TYPE_TAX,
        payload: taxes,
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
        // dispatch({
        //   type: PAYMENT_PERIODICITY,
        //   payload: response.data.results.filter(
        //     (item) => Number(item.version_cfdi.version) <= use_cfdi
        //   ),
        // });
        dispatch({
          type: PAYMENT_PERIODICITY,
          payload: response.data.results,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const getContractType = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getContractTypes()
    .then((response) => {
      // dispatch({
      //   type: CONTRACT_TYPE,
      //   payload: response.data.results.filter(
      //     (item) => Number(item.version_cfdi.version) <= use_cfdi
      //   ),
      // });
      let contracts = _.orderBy(
        response.data.results,
        ["description"],
        ["asc"]
      );
      dispatch({
        type: CONTRACT_TYPE,
        payload: contracts,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getJourneyType = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getTypeworkingday()
    .then((response) => {
      // dispatch({
      //   type: JOURNEY_TYPE,
      //   payload: response.data.results.filter(
      //     (item) => Number(item.version_cfdi.version) <= use_cfdi
      //   ),
      // });
      let journeys = _.orderBy(response.data.results, ["description"], ["asc"]);
      dispatch({
        type: JOURNEY_TYPE,
        payload: journeys,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getHiringRegime = (use_cfdi) => async (dispatch, getState) => {
  await WebApiFiscal.getHiringRegimes()
    .then((response) => {
      // dispatch({
      //   type: HIRING_REGIME,
      //   payload: response.data.results.filter(
      //     (item) => Number(item.version_cfdi.version) <= use_cfdi
      //   ),
      // });
      let regimens = _.orderBy(response.data.results, ["description"], ["asc"]);
      dispatch({
        type: HIRING_REGIME,
        payload: regimens,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const ImssDelegation = () => async (dispatch, getState) => {
  await WebApiFiscal.ImssDelegation()
    .then((response) => {
      let unOrderList = response.data.results;

      let orderList = unOrderList.sort((a, b) => {
        if (a.description < b.description) return -1;
        if (a.description > b.description) return 1;
        return 0;
      });

      dispatch({
        type: IMSS_DELEGATION,
        payload: response.data.results,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const ImssSubDelegation = () => async (dispatch, getState) => {
  await WebApiFiscal.ImssSubdelegation()
    .then((response) => {
      dispatch({
        type: IMSS_SUBDELEGATION,
        payload: response.data.results,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const FamilyMedicalUnit = () => async (dispatch, getState) => {
  await WebApiFiscal.FamilyMedicalUnit()
    .then((response) => {
      dispatch({
        type: FAMILY_MEDICAL_UNIT,
        payload: response.data.results,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getGeographicArea =
  (year = null) =>
  async (dispatch, getState) => {
    let currentYear = parseInt(moment().format("YYYY"));
    if (year) {
      currentYear = year;
    }

    await WebApiFiscal.get_geograp_area(currentYear)
      .then((response) => {
        dispatch({
          type: GEOGRAPHIC_AREA,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  export const getCompanyFiscalInformation = (company_id) => async (dispatch, getState) => {

      try{
          let current_node = company_id ? company_id : getState().userStore.current_node.id;
          const res = await WebApiFiscal.getfiscalInformationNode(current_node);
          dispatch({
              type: COMPANY_FISCAL_INFORMATION,
              payload: res.data,
          });
      }catch (error){
          dispatch({ type: COMPANY_FISCAL_INFORMATION, payload: null });
          console.log(error);
      }
  };
