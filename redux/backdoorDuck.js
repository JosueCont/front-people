import axios from "axios";
import WebApiIntranet from "../api/WebApiIntranet";
import WebApiBackdoor from "../api/webApiBackdoor";

const initialData = {
    fetching: false,
    configurationBackdoor: [],
    loadBackdoor : false,
};

//variables backddor
const CONFIGBACKDOOR = "CONFIGBACKDOOR";

const backdoorReducer = (state = initialData, action) => {
    switch (action.type) {
        case CONFIGBACKDOOR:
            return{ ...state, loadBackdoor:action.fetching, configurationBackdoor:action.payload}
        default:
            return state;
    }
};

export const updateConfiguration = (data,node) =>
    async (dispatch,getState) => {
        try {
            await WebApiBackdoor.updateConfiguration(data);
            dispatch(getListAppsBackdoor(node,1))
            return true;
        } catch (e) {
            console.log(error);
            return false;
        }
    }

export const getListAppsBackdoor = (node,status) =>
    async(dispatch, getState) =>{
        dispatch({ type: CONFIGBACKDOOR, fetching: true, payload: [] });
        await WebApiBackdoor. getConfigurationBackdoor(node,status)
            .then((response) => {
                dispatch({ type: CONFIGBACKDOOR, fetching: false, payload: response.data.results});
                return true;
            })
            .catch((error) => {
                dispatch({ type: CONFIGBACKDOOR, fetching: false, payload: [] });
                return false;
                //console.log(error);
            });
    }
export default backdoorReducer;
