import WebApiFiscal from "../api/WebApiFiscal";
// import { userCompanyId } from "../libs/auth";

const initialData = {
  banks: [],
  tax_regime: [],
};

const BANKS = "BANKS";
const TAX_REGIME = "TAX_REGIME";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case BANKS:
      return { ...state, banks: action.payload, default: false };
    case TAX_REGIME:
      return { ...state, tax_regime: action.payload, default: false };
    default:
      return state;
  }
};
export default webReducer;

export const doFiscalSelectedData = () => async (dispatch, getState) => {
  try {
    dispatch(getFiscalBanks());
    dispatch(getFiscalTaxRegime());
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
