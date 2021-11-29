import axios from 'axios';

const initialData = {
    fetching: false,
    publicationsList: {},
    error: ''
}

const LOADING_PUBLICATIONS_LIST = 'LOADING_PUBLICATIONS_LIST';
const SUCCESS_PUBLICATIONS_LIST = 'SUCCESS_PUBLICATIONS_LIST';
const ERROR_PUBLICATIONS_LIST = 'ERROR_PUBLICATIONS_LIST';

const publicationsListReducer = (state = initialData, action) => {
    switch(action.type){
        case LOADING_PUBLICATIONS_LIST:
            return {...state, fetching: false, publicationsList: {}}
        case SUCCESS_PUBLICATIONS_LIST:
            return {...state, fetching: false, publicationsList: action.payload}
        case ERROR_PUBLICATIONS_LIST:
            return {...state, fetching: false, publicationsList: {}}
        default:
            return state;
    }
}

export const publicationsListAction = (page) => async(dispatch, getState) => {
    dispatch({type: LOADING_PUBLICATIONS_LIST});

    await axios.get(`https://demo.people-api.khorplus.com/intranet/post/?page=${page}`).then( ({status, data}) => {
        console.log(data);
        let dataAndResults = {
            data: data,
            results: data.results
        }
        console.log(dataAndResults);
        if(status == 200){
            dispatch({
                type: SUCCESS_PUBLICATIONS_LIST,
                payload: dataAndResults
            })
        }else{
            dispatch({
                type: ERROR_PUBLICATIONS_LIST,
                payload: 'Error getting publications list'
            })
        }
    }).catch(error => {
        console.log(error);
        dispatch({
            type: ERROR_PUBLICATIONS_LIST,
            payload: 'Error getting publications list'
        });
    });
}
export default publicationsListReducer;