import axios from 'axios';

const initialData = {
    fetching: false,
    publicationsList: [],
    excelFileStatus: null,
    error: ''
}

const LOADING_PUBLICATIONS_LIST = 'LOADING_PUBLICATIONS_LIST';
const SUCCESS_PUBLICATIONS_LIST = 'SUCCESS_PUBLICATIONS_LIST';
const ERROR_PUBLICATIONS_LIST = 'ERROR_PUBLICATIONS_LIST';
// Variables Excel
const LOADING_FILE = 'LOADING_FILE';
const SUCCESS_FILE = 'SUCCESS_FILE';
const ERROR_FILE = 'ERROR_FILE'

const publicationsListReducer = (state = initialData, action) => {
    switch(action.type){
        case LOADING_PUBLICATIONS_LIST:
            return {...state, fetching: false, publicationsList: []}
        case SUCCESS_PUBLICATIONS_LIST:
            return {...state, fetching: false, publicationsList: action.payload}
        case ERROR_PUBLICATIONS_LIST:
            return {...state, fetching: false, publicationsList: []}
        case LOADING_FILE:
            return {...state, fetching: true, excelFileStatus: action.payload }
        case SUCCESS_FILE:
            return {...state, fetching: false, excelFileStatus: action.payload}
        case ERROR_FILE:
            return {...state, fetching: false, excelFileStatus: action.payload}
        default:
            return state;
    }
}

export const publicationsListAction = (page = '', parameters = '') => async(dispatch, getState) => {
    dispatch({type: LOADING_PUBLICATIONS_LIST});
    await axios.get(`https://demo.people-api.khorplus.com/intranet/post/?${page && page != '' ? `page=${page}` : ''}${parameters}`).then( ({status, data}) => {
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
            });
        }
    }).catch(error => {
        console.log(error);
        dispatch({
            type: ERROR_PUBLICATIONS_LIST,
            payload: 'Error getting publications list'
        });
    });
}

export const getExcelFileAction = (params='') => async(dispatch, getState) => {
    dispatch({type: LOADING_FILE, fetching: true, payload: 'loading'});
    await axios.get(`https://demo.people-api.khorplus.com/intranet/post/?export=true${params}`).then( response => {
        if(response.status == 200){
            const type = response.headers["content-type"];
            const blob = new Blob([response.data], {
                type: type,
                enconding: "UTF-8",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Estadisticas.csv";
            link.click();
            dispatch({
                type: SUCCESS_FILE,
                payload: blob
            });
        }else{
            dispatch({
                type: ERROR_FILE,
                payload: 'failed'
            });
        }
    }).catch( error => {
        console.log(error);
        dispatch({
            type: ERROR_FILE,
            payload: 'failed'
        });
        console.log('No se muestra el alert de estatus')
    })
}
export default publicationsListReducer;