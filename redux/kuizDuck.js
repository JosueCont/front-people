import WebApiAssessment from '../api/WebApiAssessment';

const initialState = {
    list_assessments: {},
    load_assessments: false,
    kuiz_page: 1,
    kuiz_filters: "",
    kuiz_page_size: 10
}

const GET_ASSESSMENTS = "GET_ASSESSMENTS";

const kuizReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ASSESSMENTS:
            return {
                ...state,
                list_assessments: action.payload,
                load_assessments: action.fetching,
                kuiz_filters: action.query
            }
        default:
            return state
    }
}

export const getAssessments = (node, query = '') => async (dispatch, getState) => {
    const { kuizStore: { list_assessments } } = getState();
    const type = { type: GET_ASSESSMENTS, payload: list_assessments, fetching: false };
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiAssessment.getListSurveys(node, query);
        dispatch({ ...type, payload: { results: response.data } });
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export default kuizReducer;