import WebApiPayroll from "../api/WebApiPayroll";
import { userCompanyId } from "../libs/auth";

const initialData = {
    data:{}
};

const SETDATA = "SETDATA";

const webReducer = (state = initialData, action) => {
    switch (action.type) {
        case SETDATA:
            return { ...state, data: {periodSelected: action.payload} };
        default:
            return state;
    }
};
export default webReducer;

export const setDataImport =
    (data) => async (dispatch, getState) => {
        try {
                if (data) {
                    console.log('to redux', data )
                    dispatch({
                        type: SETDATA,
                        payload: data,
                    });
                    return true;
                }
        } catch (error) {
            console.log(error);
        }
    };