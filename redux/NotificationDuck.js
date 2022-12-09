import axios from "axios";
import WebApiIntranet from "../api/WebApiIntranet";
import WebApiBackdoor from "../api/webApiBackdoor";

const initialData = {
    showMessage: true,
    title: 'ejemplo',
    message : 'detal' +
        'le de ejemplo',
    level: 'info', // info, success, warning, danger,
    type:1 // 1 = modal, 2= notification
};

//variables backddor
const NOTI_MODAL = "NOTI_MODAL";

const NotificationReducer = (state = initialData, action) => {
    switch (action.type) {
        case NOTI_MODAL:
            return{ ...state, ...action.payload}
        default:
            return state;
    }
};

export const showHideMessage = (show=true,data={}) =>
    async (dispatch,getState) => {
        let DataMessage = {
            showMessage: show,
            title: data?.title,
            message : data?.message,
            level: data.level, // info, success, warning, danger,
            type:1, // 1 = modal, 2= notification
        }

        DataMessage = {...DataMessage, ...data}
        console.log('data', DataMessage)
        dispatch({
            type: NOTI_MODAL,
            payload: DataMessage,
        });



        dispatch({
            type: NOTI_MODAL,
            payload: {
                showMessage: false,
                title: '',
                message : '',
                level: 'info', // info, success, warning, danger,
                type:2 // 1 = modal, 2= notification
            },
        });

    }

export default NotificationReducer;
