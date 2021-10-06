import { userCompanyId } from "../libs/auth";
import Axios from "axios";
import { types} from "../types/assessments";
import _ from 'lodash';
import { asyncForEach } from "../utils/functions";
import { API_ASSESSMENT } from "../config/config"; //"https://humand.kuiz.hiumanlab.com"

const nodeId = Number.parseInt(userCompanyId());

const initialData = {
    assessments: [], 
    assessment_selected: {}, 
    sections: [], 
    questions: [],
    temp:[], 
    active_modal: '', 
    fetching: true, 
};

const assessmentReducer = (state = initialData, action) => {
  switch (action.type) {
    case types.ACTIVE_MODAL:
      return {...state, active_modal: action.payload};
    case types.TEPORAL_STATE:
      return {...state, temp: action.payload};
    case types.FETCHING:
      return {...state, fetching: action.payload};
    case types.LOAD_ASSESSMENTS:
      return {...state, assessments: action.payload, fetching: false};
    case types.SELECTED_ASSESSMENT:
      return {...state, assessment_selected: action.payload};
    case types.CREATE_ASSESSMENTS:
      return {...state, assessments: [...state.assessments, action.payload], active_modal: '', fetching: false};
    case types.UPDATE_ASSESSMENTS:
      return {...state, assessments: state.assessments.map( e => ( e.id === action.payload.id ) ? action.payload : e ), active_modal: '', fetching: false};
    case types.DELETE_ASSESSMENTS:
      return {...state, assessments: state.assessments.filter( e => (e.id !== action.payload) ), active_modal: '', fetching: false}
    case types.LOAD_SECTIONS:
      return {...state, sections: action.payload, fetching: false};
    case types.CREATE_SECTIONS:
      return {...state, sections: [...state.sections, action.payload], active_modal: '', fetching: false};
    case types.UPDATE_SECTIONS:
      return {...state, sections: state.sections.map( e => ( e.id === action.payload.id ) ? action.payload : e ), active_modal: '', fetching: false};
    case types.DELETE_SECTIONS:
      return {...state, sections: state.sections.filter( e => (e.id !== action.payload) ), active_modal: '', fetching: false}
    case types.LOAD_QUESTIONS:
      return {...state, questions: [...state.questions, ...action.payload], fetching: false};
    case types.LOAD_NEW_QUESTIONS:
      return {...state, questions: state.questions, fetching: false};
    case types.CREATE_QUESTIONS:
      return {...state, questions: [...state.questions, action.payload], active_modal: '', fetching: false};
    case types.UPDATE_QUESTIONS:
      return {...state, questions: state.questions.map( e => ( e.id === action.payload.id ) ? action.payload : e ), active_modal: '', fetching: false};
    case types.DELETE_QUESTIONS:
      return {...state, questions: state.questions.filter( e => (e.id !== action.payload) ), active_modal: '', fetching: false}
    default:
      return state;
  }
};

//ASSESSMENT LOAD ASSESSMENTS
export const assessmentLoadAction = () => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.get(`${API_ASSESSMENT}/assessments/assessment/?companies=${nodeId}`);
      dispatch({type: types.LOAD_ASSESSMENTS, payload: response.data});
      console.log("RESONSE::", response);
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
    }
  }
}

//ASSESSMENT LOAD DETAILS
export const assessmentDetailsAction = (id) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let sections_ = await Axios.get(`${API_ASSESSMENT}/assessments/section/?assessment=${id}`);
      let sections = _.orderBy(sections_.data.results, ['order'], ['asc']);
      dispatch({type: types.LOAD_SECTIONS, payload: sections});
      sections.length > 0 &&
      sections.forEach(async(element) => {
        let questions_ = await Axios.get(`${API_ASSESSMENT}/assessments/question/?section=${element.id}`);
        let questions = _.orderBy(questions_.data.results, ['order'], ['asc']);
        questions.answer_set = _.orderBy(questions.answer_set, ['order'], ['asc']);
        dispatch({type: types.LOAD_QUESTIONS, payload: questions});
      });
      dispatch(assessmentGetAction(id));
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
    }
  }
}

//GET ACTIVE MODAL
export const assessmentModalAction = (modal) => {
  return async (dispatch) => {
    dispatch({type: types.ACTIVE_MODAL, payload: modal});
  }
}

//GET ASSESSMENT
export const assessmentGetAction = (id) => {
  return async (dispatch) => {
    try {
      let {data} = await Axios.get(`${API_ASSESSMENT}/assessments/assessment/${id}/`);
      dispatch({type: types.SELECTED_ASSESSMENT, payload: data});
    } catch (e) {
      console.error(e.name + ': ' + e.message);
    }
  }
}

//ASSESSMENT SECTION ORDER 
export const sectionOrderAction = (method, item) => {
  return async (dispatch) => {
    try {
      await getOrderApi(method, item.id);
      let sections_ = await Axios.get(`${API_ASSESSMENT}/assessments/section/?assessment=${item.assessment.id}`);
      let sections = _.orderBy(sections_.data.results, ['order'], ['asc']);
      dispatch({type: types.LOAD_SECTIONS, payload: sections});
      let questions_ = [];
      sections.length > 0 &&
      await asyncForEach(sections, async(element) => {
        let { data } = await Axios.get(`${API_ASSESSMENT}/assessments/question/?section=${element.id}`);
        data.results.answer_set = _.orderBy(data.results.answer_set, ['order'], ['asc']);
        questions_.push(data.results);
      });
      let questions = _.orderBy(questions_, ['order'], ['asc']);
      dispatch({type: types.LOAD_NEW_QUESTIONS, payload: questions});
      return true;
    } catch (e) {
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//ASSESSMENT QUESTION ORDER 
export const questionOrderAction = (method, item) => {
  return async (dispatch) => {
    try {
      await getOrderApi(method, item.id);
      let sections = getState().assessmentStore.sections;
      let questions_ = [];
      sections.length > 0 &&
      await asyncForEach(sections, async(element) => {
        let { data } = await Axios.get(`${API_ASSESSMENT}/assessments/question/?section=${element.id}`);
        data.results.answer_set = _.orderBy(data.results.answer_set, ['order'], ['asc']);
        questions_.push(data.results);
      });
      let questions = _.orderBy(questions_, ['order'], ['asc']);
      dispatch({type: types.LOAD_NEW_QUESTIONS, payload: questions});
      return true;
    } catch (e) {
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

export const getOrderApi = (method, id) => {
  switch (method) {
    case types.UP_ORDER_SECTION:
      return Axios.post(`${API_ASSESSMENT}/assessments/section/move_section_up/`, {'section_id': id});
      break;
      case types.DOWN_ORDER_SECTION:
      return Axios.post(`${API_ASSESSMENT}/assessments/section/move_section_down/`, {'section_id': id});
      break;
    case types.UP_ORDER_QUESTION:
      return Axios.post(`${API_ASSESSMENT}/assessments/question/move_question_up/`, {'question_id': id});
      break;
    case types.DOWN_ORDER_QUESTION:
      return Axios.post(`${API_ASSESSMENT}/assessments/question/move_question_down/`, {'question_id': id});
      break;
    case types.UP_ORDER_ANSWER:
      return Axios.post(`${API_ASSESSMENT}/assessments/answer/move_answer_up/`, {'answer_id': id});
      break;
    case types.DOWN_ORDER_ANSWER:
      return Axios.post(`${API_ASSESSMENT}/assessments/answer/move_answer_up/`, {'answer_id': data});
      break;
    default:
      return;
  }
}

//ASSESSMENT CREATE
export const assessmentCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.post(API_ASSESSMENT+'/assessments/assessment/', data);
      dispatch({type: types.CREATE_ASSESSMENTS, payload: response.data});
      console.log("RESONSE::", response);
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//ASSESSMENT UPDATE
export const assessmentUpdateAction = (id, data) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.patch(`${API_ASSESSMENT}/assessments/assessment/${id}/`, data);
      dispatch({type: types.UPDATE_ASSESSMENTS, payload: response.data});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//ASSESSMENT DELETE
export const assessmentDeleteAction = (id) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/assessment/${id}`);
      dispatch({type: types.DELETE_ASSESSMENTS, payload: id});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//ASSESSMENT STATUS
export const assessmentStatusAction = (id, status) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true})
    try {
      let {data} = await Axios.patch(`${API_ASSESSMENT}/assessments/assessment/${id}/`, {"is_active": status});
      dispatch({type: types.UPDATE_ASSESSMENTS, payload: data})
      return true;
    } catch (error) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//SECTION CREATE
export const sectionCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.post(API_ASSESSMENT+'/assessments/section/', data);
      dispatch({type: types.CREATE_SECTIONS, payload: response.data})
      console.log("RESONSE::", response);
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//SECTION UPDATE
export const sectionUpdateAction = (id, data) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.patch(`${API_ASSESSMENT}/assessments/section/${id}/`, data);
      dispatch({type: types.UPDATE_SECTIONS, payload: response.data});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//SECTION DELETE
export const sectionDeleteAction = (id) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/section/${id}`);
      dispatch({type: types.DELETE_SECTIONS, payload: id});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//QUESTION CREATE
export const questionCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.post(API_ASSESSMENT+'/assessments/question/', data);
      dispatch({type: types.CREATE_QUESTIONS, payload: response.data})
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//QUESTION UPDATE
export const questionUpdateAction = (id, data) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.patch(`${API_ASSESSMENT}/assessments/question/${id}/`, data);
      dispatch({type: types.UPDATE_QUESTIONS, payload: response.data});
      console.log("RESPONSE UPDATE::", response);
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//QUESTION DELETE
export const questionDeleteAction = (id) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/question/${id}`);
      dispatch({type: types.DELETE_QUESTIONS, payload: id});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false});
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//ANSWER CREATE
export const answerCreateAction = (values) => { 
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.post(API_ASSESSMENT+'/assessments/answer/', values);
      let {data} = await Axios.get(`${API_ASSESSMENT}/assessments/question/${response.data.question}/`);
      dispatch({type: types.UPDATE_QUESTIONS, payload: data});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false})
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//ANSWER UPDATE
export const answerUpdateAction = (id, values) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      let response = await Axios.patch(`${API_ASSESSMENT}/assessments/answer/${id}/`, values);
      let {data} = await Axios.get(`${API_ASSESSMENT}/assessments/question/${response.data.question}/`);
      dispatch({type: types.UPDATE_QUESTIONS, payload: data});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false})
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

//ANSWER DELETE
export const answerDeleteAction = (item) => {
  return async (dispatch) => {
    dispatch({type: types.FETCHING, payload: true});
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/answer/${item.id}/`);
      let {data} = await Axios.get(`${API_ASSESSMENT}/assessments/question/${item.question}/`);
      dispatch({type: types.UPDATE_QUESTIONS, payload: data});
      return true;
    } catch (e) {
      dispatch({type: types.FETCHING, payload: false})
      console.error(e.name + ': ' + e.message);
      return false;
    }
  }
}

export default assessmentReducer;