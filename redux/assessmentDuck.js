import { userCompanyId } from "../libs/auth";
import Axios from "axios";
import { types } from "../types/assessments";
import _ from "lodash";
import { API_ASSESSMENT } from "../config/config"; //"https://humand.kuiz.hiumanlab.com"

const nodeId = Number.parseInt(userCompanyId());

const initialData = {
  assessments: [] /*Encuestas*/,
  assessments_filter: [] /*Encuestas filtradas*/,
  assessment_selected: "" /*Encuesta seleccionada*/,
  sections: [] /*Secciones filtradas*/,
  questions: [] /*Preguntas y respuestas filtradas*/,
  active_modal: "" /*Modal Activo*/,
  fetching: true /*Loading*/,
};

const assessmentReducer = (state = initialData, action) => {
  switch (action.type) {
    case types.ACTIVE_MODAL:
      return { ...state, active_modal: action.payload };
    case types.FETCHING:
      return { ...state, fetching: action.payload };
    case types.LOAD_ASSESSMENTS:
      return { ...state, assessments: action.payload, fetching: false };
    case types.FILTER_ASSESSMENTS:
      return { ...state, assessments_filter: action.payload, fetching: false };
    case types.SELECTED_ASSESSMENT:
      return { ...state, assessment_selected: action.payload };
    case types.CREATE_ASSESSMENTS:
      return {
        ...state,
        assessments: [action.payload, ...state.assessments],
        active_modal: "",
        fetching: false,
      };
    case types.UPDATE_ASSESSMENTS:
      return {
        ...state,
        assessments: state.assessments.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
        active_modal: "",
        fetching: false,
      };
    case types.DELETE_ASSESSMENTS:
      return {
        ...state,
        assessments: state.assessments.filter((e) => e.id !== action.payload),
        active_modal: "",
        fetching: false,
      };
    case types.LOAD_SECTIONS:
      return { ...state, sections: action.payload, fetching: false };
    case types.CREATE_SECTIONS:
      return {
        ...state,
        sections: [action.payload, ...state.sections],
        active_modal: "",
        fetching: false,
      };
    case types.UPDATE_SECTIONS:
      return {
        ...state,
        sections: state.sections.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
        active_modal: "",
        fetching: false,
      };
    case types.DELETE_SECTIONS:
      return {
        ...state,
        sections: state.sections.filter((e) => e.id !== action.payload),
        active_modal: "",
        fetching: false,
      };
    case types.LOAD_QUESTIONS:
      return {
        ...state,
        questions: [...state.questions, ...action.payload],
        fetching: false,
      };
    case types.CREATE_QUESTIONS:
      return {
        ...state,
        questions: [action.payload, ...state.questions],
        active_modal: "",
        fetching: false,
      };
    case types.UPDATE_QUESTIONS:
      return {
        ...state,
        questions: state.questions.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
        active_modal: "",
        fetching: false,
      };
    case types.DELETE_QUESTIONS:
      return {
        ...state,
        questions: state.questions.filter((e) => e.id !== action.payload),
        active_modal: "",
        fetching: false,
      };
    case types.CREATE_ANSWERS:
      return {
        ...state,
        questions: [action.payload, ...state.questions],
        active_modal: "",
        fetching: false,
      };
    case types.UPDATE_ANSWERS:
      return {
        ...state,
        questions: state.questions.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
        active_modal: "",
        fetching: false,
      };
    case types.DELETE_ANSWERS:
      return {
        ...state,
        questions: state.questions.filter((e) => e.id !== action.payload),
        fetching: false,
      };
    default:
      return state;
  }
};

//ASSESSMENT LOAD
export const assessmentLoadAction = () => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.get(
        `${API_ASSESSMENT}/assessments/assessment/?companies=${nodeId}`
      );
      dispatch({ type: types.LOAD_ASSESSMENTS, payload: response.data });
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
    }
  };
};

//ASSESSMENT LOAD DETAILS
export const assessmentDetailsAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let sections_ = await Axios.get(
        `${API_ASSESSMENT}/assessments/section/?assessment=${id}`
      );
      let sections = _.orderBy(sections_.data.results, ["order"], ["desc"]);
      dispatch({ type: types.LOAD_SECTIONS, payload: sections });
      sections.forEach(async (element) => {
        let questions_ = await Axios.get(
          `${API_ASSESSMENT}/assessments/question/?section=${element.id}`
        );
        let questions = _.orderBy(questions_.data.results, ["order"], ["desc"]);
        dispatch({ type: types.LOAD_QUESTIONS, payload: questions });
      });
      dispatch({ type: types.SELECTED_ASSESSMENT, payload: id });
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
    }
  };
};

//ASSESSMENT FILTER *
export const assessmentFilterAction = (name) => {
  return async (dispatch, getState) => {
    name = name.toLowerCase();
    let registros = await getState().assessmentStore.assessments;
    let filtradas = await registros.filter((filtro) =>
      filtro.name.toLowerCase().includes(name)
    );
    name === ""
      ? dispatch({ type: types.FILTER_ASSESSMENTS, payload: [] })
      : dispatch({ type: types.UPDATE_ASSESSMENTS, payload: filtradas });
  };
};

//ASSESSMENT CREATE
export const assessmentCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.post(
        API_ASSESSMENT + "/assessments/assessment/",
        data
      );
      dispatch({ type: types.CREATE_ASSESSMENTS, payload: response.data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ASSESSMENT UPDATE
export const assessmentUpdateAction = (id, data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.patch(
        `${API_ASSESSMENT}/assessments/assessment/${id}/`,
        data
      );
      dispatch({ type: types.UPDATE_ASSESSMENTS, payload: response.data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ASSESSMENT DELETE
export const assessmentDeleteAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/assessment/${id}`);
      dispatch({ type: types.DELETE_ASSESSMENTS, payload: id });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ASSESSMENT STATUS *
export const assessmentStatusAction = (id, status) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.patch(
        API_ASSESSMENT + "/assessments/assessment/" + id,
        { is_active: status }
      );
      dispatch({ type: types.UPDATE_ASSESSMENTS, payload: response.data });
      return true;
    } catch (error) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ASSESSMENT ORDER

//GET ACTIVE MODAL
export const assessmentModalAction = (modal) => {
  return async (dispatch) => {
    dispatch({ type: types.ACTIVE_MODAL, payload: modal });
  };
};

//SECTION CREATE
export const sectionCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.post(
        API_ASSESSMENT + "/assessments/section/",
        data
      );
      dispatch({ type: types.CREATE_SECTIONS, payload: response.data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//SECTION UPDATE
export const sectionUpdateAction = (id, data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.patch(
        `${API_ASSESSMENT}/assessments/section/${id}/`,
        data
      );
      dispatch({ type: types.UPDATE_SECTIONS, payload: response.data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//SECTION DELETE
export const sectionDeleteAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/section/${id}`);
      dispatch({ type: types.DELETE_SECTIONS, payload: id });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//SECTION ORDER

//QUESTION CREATE
export const questionCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.post(
        API_ASSESSMENT + "/assessments/question/",
        data
      );
      dispatch({ type: types.CREATE_QUESTIONS, payload: response.data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//QUESTION UPDATE
export const questionUpdateAction = (id, data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.patch(
        `${API_ASSESSMENT}/assessments/question/${id}/`,
        data
      );
      dispatch({ type: types.UPDATE_QUESTIONS, payload: response.data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//QUESTION DELETE
export const questionDeleteAction = (id) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/question/${id}`);
      dispatch({ type: types.DELETE_QUESTIONS, payload: id });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//QUESTION ORDER

//ANSWER ADD
export const answerCreateAction = (values) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.post(
        API_ASSESSMENT + "/assessments/answer/",
        values
      );
      let { data } = await Axios.get(
        `${API_ASSESSMENT}/assessments/question/${response.data.question}/`
      );
      dispatch({ type: types.UPDATE_QUESTIONS, payload: data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ANSWER UPDATE
export const answerUpdateAction = (id, values) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await Axios.patch(
        `${API_ASSESSMENT}/assessments/answer/${id}/`,
        values
      );
      let { data } = await Axios.get(
        `${API_ASSESSMENT}/assessments/question/${response.data.question}/`
      );
      dispatch({ type: types.UPDATE_QUESTIONS, payload: data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ANSWER DELETE
export const answerDeleteAction = (item) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      await Axios.delete(`${API_ASSESSMENT}/assessments/answer/${item.id}/`);
      let { data } = await Axios.get(
        `${API_ASSESSMENT}/assessments/question/${item.question}/`
      );
      dispatch({ type: types.UPDATE_QUESTIONS, payload: data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ANSWER ORDER

export default assessmentReducer;
