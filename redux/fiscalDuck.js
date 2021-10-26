import WebApiFiscal from "../api/WebApiFiscal";
// import { userCompanyId } from "../libs/auth";

const initialData = {
  banks: [],
};

const BANKS = "BANKS";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case BANKS:
      return { ...state, banks: action.payload, default: false };
    default:
      return state;
  }
};
export default webReducer;

export const doFiscalSelectedData = () => async (dispatch, getState) => {
  try {
    dispatch(getFiscalBanks());
  } catch (error) {
    console.log(error);
  }
};

export const getFiscalBanks = () => async (dispatch, getState) => {
  try {
    let response = await WebApiFiscal.getBanks();
    dispatch({ type: BANKS, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};
