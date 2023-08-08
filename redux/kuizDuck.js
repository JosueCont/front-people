import WebApiAssessment from '../api/WebApiAssessment';
import { orderBy } from 'lodash';

const initialState = {
    list_assessments: {},
    load_assessments: false,
    list_categories: [],
    load_categories: false,
    list_assessments_options: [],
    load_assessments_options: false,
    list_sections: {},
    load_sections: false,
    list_questions: {},
    load_questions: false,
    kuiz_page: 1,
    kuiz_filters: "",
    kuiz_page_size: 10
}

const GET_ASSESSMENTS = "GET_ASSESSMENTS";
const GET_ASSESSMENTS_OPTIONS = "GET_ASSESSMENTS_OPTIONS";
const GET_CATEGORIES = "GET_CATEGORIES";
const GET_SECTIONS = "GET_SECTIONS";
const GET_QUESTIONS = "GET_QUESTIONS";

const kuizReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ASSESSMENTS:
            return {
                ...state,
                list_assessments: action.payload,
                load_assessments: action.fetching,
                kuiz_filters: action.query
            }
        case GET_CATEGORIES:
            return {
                ...state,
                list_categories: action.payload,
                load_categories: action.fetching
            }
        case GET_ASSESSMENTS_OPTIONS:
            return {
                ...state,
                list_assessments_options: action.payload,
                load_assessments_options: action.fetching
            }
        case GET_SECTIONS:
            return {
                ...state,
                list_sections: action.payload,
                load_sections: action.fetching
            }
        case GET_QUESTIONS:
            return {
                ...state,
                list_questions: action.payload,
                load_questions: action.fetching
            }
        default:
            return state
    }
}

export const getAssessments = (node, query = '') => async (dispatch, getState) => {
    const { kuizStore: { list_assessments } } = getState();
    const type = { type: GET_ASSESSMENTS, payload: list_assessments, fetching: false, query };
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiAssessment.getListSurveys(node, query);
        dispatch({ ...type, payload: { results: response.data } });
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getAssessmentsOptions = (node, query = '') => async (dispatch) => {
    const type = { type: GET_ASSESSMENTS_OPTIONS, payload: [], fetching: false }
    dispatch({ ...type, fetching: true })
    try {
        let params = `&is_active=true${query}`
        let response = await WebApiAssessment.getListSurveys(node, params);
        dispatch({ ...type, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getSections = (id) => async (dispatch) => {
    const type = { type: GET_SECTIONS, payload: {}, fetching: false }
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiAssessment.assessmentSections(id);
        dispatch({ ...type, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getQuestions = (id) => async (dispatch) => {
    const type = { type: GET_QUESTIONS, payload: {}, fetching: false };
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiAssessment.assessmentQuestions(id);
        let records = orderBy(response?.data?.results || [], ['order'], ['asc']);
        const map_ = item => ({ ...item, answer_set: orderBy(item.answer_set, ['order'], ['asc']) });
        dispatch({ ...type, payload: { results: records?.map(map_) } })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getCategories = (node) => async (dispatch) => {
    const type = { type: GET_CATEGORIES, payload: [], fetching: false }
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiAssessment.getCategoriesAssessment();
        dispatch({ ...type, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export default kuizReducer;