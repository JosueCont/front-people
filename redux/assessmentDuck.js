import Axios from "axios";
import { types } from "../types/assessments";
import _ from "lodash";
import { asyncForEach } from "../utils/functions";
import { API_ASSESSMENT, typeHttp } from "../config/config";
import WebApiAssessment from "../api/WebApiAssessment";

let tenant = "demo";

if (process.browser) {
  let splitDomain = window.location.hostname.split(".");
  if (splitDomain.length > 0 && !splitDomain[0].includes('localhost') ) {
    tenant = splitDomain[0];
  }
}

// Set url Kuiz Base Api with Tenant
const urlKuizBaseApiWithTenant = `${typeHttp}://${tenant}.${API_ASSESSMENT}`

const initialData = {
  assessments: [],
  pagination: {
    current: 1,
    total: 0,
    hideOnSinglePage: true,
    showSizeChanger: false,
  },
  assessment_selected: {},
  sections: [],
  questions: [],
  temp: [],
  active_modal: "",
  fetching: true,
  categories_assessment: [],
  competences: {},
  load_competences: false,
  load_profiles: false,
  profiles: [],
  pagination_profiles: 1,
  error_form_add: false,
  open_modal_create_group: false,
  open_modal_edit_group: false,
  list_assessments: [],
  load_assessments: false,
  list_groups_assets: [],
  load_groups_assets: false
};

const assessmentReducer = (state = initialData, action) => {
  switch (action.type) {
    case types.ACTIVE_MODAL:
      return { ...state, active_modal: action.payload };
    case types.TEPORAL_STATE:
      return { ...state, temp: action.payload };
    case types.FETCHING:
      return { ...state, fetching: action.payload };
    case types.LOAD_ASSESSMENTS:
      return {
        ...state,
        assessments: action.payload,
        pagination: { ...state.pagination, total: action.payload.count },
        fetching: false,
      };
    case types.SELECTED_ASSESSMENT:
      return { ...state, assessment_selected: action.payload };
    case types.CREATE_ASSESSMENTS:
      return {
        ...state,
        assessments: [...state.assessments, action.payload],
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
        sections: [...state.sections, action.payload],
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
    case types.LOAD_NEW_QUESTIONS:
      return { ...state, questions: action.payload, fetching: false };
    case types.CREATE_QUESTIONS:
      return {
        ...state,
        questions: [...state.questions, action.payload],
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
    case types.GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories_assessment: action.payload,
        fetching: false
      };
    case types.UPD_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, current: action.payload },
      };
    case types.GET_COMPETENCES:
      return {...state,
        load_competences: action.fetching,
        competences: action.payload
      }
    case types.GET_PROFILES:
      return {...state,
        load_profiles: action.fetching,
        profiles: action.payload
      }
    case types.SET_PAGE:
      return {...state, pagination_profiles: action.payload}
    case types.SET_ERROR_FORM_ADD:
      return { ...state, error_form_add: action.payload }
    case types.SET_MODAL_GROUP:
      return { ...state, open_modal_create_group: action.payload}
    case types.SET_MODAL_GROUP_EDIT:
      return { ...state, open_modal_edit_group: action.payload}
    case types.LIST_ASSETS:
      return {...state,
        list_assessments: action.payload,
        load_assessments: action.fetching
      }
    case types.GROUPS_ASSETS:
      return {...state,
        list_groups_assets: action.payload,
        load_groups_assets: action.fetching
      }
    default:
      return state;
  }
};

//ASSESSMENT LOAD ASSESSMENTS
export const assessmentLoadAction = (id, queryParam = "") => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await WebApiAssessment.getListSurveys(id, queryParam);
      // let response = await Axios.get(
      //   `${API_ASSESSMENT}/assessments/assessment/?companies=${id}`
      // );
      dispatch({
        type: types.LOAD_ASSESSMENTS,
        payload: response.data,
      });
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
      let sections_ = await WebApiAssessment.assessmentSections(id);
      // let sections_ = await Axios.get(
      //   `${API_ASSESSMENT}/assessments/section/?assessment=${id}`
      // );
      let sections = _.orderBy(sections_.data.results, ["order"], ["asc"]);
      dispatch({ type: types.LOAD_SECTIONS, payload: sections });
      sections.length > 0 &&
        sections.forEach(async (element) => {
          let questions_ = await WebApiAssessment.assessmentQuestions(
            element.id
          );
          // let questions_ = await Axios.get(
          //   `${API_ASSESSMENT}/assessments/question/?section=${element.id}`
          // );
          let questions = _.orderBy(
            questions_.data.results,
            ["order"],
            ["asc"]
          );
          questions.answer_set = _.orderBy(
            questions.answer_set,
            ["order"],
            ["asc"]
          );
          dispatch({ type: types.LOAD_QUESTIONS, payload: questions });
        });
      dispatch(assessmentGetAction(id));
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
    }
  };
};

export const updPagination = (currentPage) => {
  return async (dispatch) => {
    dispatch({ type: types.UPD_PAGINATION, payload: currentPage });
  };
};

//GET ACTIVE MODAL
export const assessmentModalAction = (modal) => {
  return async (dispatch) => {
    dispatch({ type: types.ACTIVE_MODAL, payload: modal });
  };
};

//GET ASSESSMENT
export const assessmentGetAction = (id) => {
  return async (dispatch) => {
    try {
      let { data } = await WebApiAssessment.getDetailsAssessment(id);
      // let { data } = await Axios.get(
      //   `${API_ASSESSMENT}/assessments/assessment/${id}/`
      // );
      dispatch({ type: types.SELECTED_ASSESSMENT, payload: data });
    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  };
};

//ASSESSMENT SECTION ORDER
export const sectionOrderAction = (method, item) => {
  return async (dispatch) => {
    try {
      await getOrderApi(method, item.id);
      let sections_ = await WebApiAssessment.assessmentSections(
        item.assessment.id
      );
      // let sections_ = await Axios.get(
      //   `${API_ASSESSMENT}/assessments/section/?assessment=${item.assessment.id}`
      // );
      let sections = _.orderBy(sections_.data.results, ["order"], ["asc"]);
      dispatch({ type: types.LOAD_SECTIONS, payload: sections });
      let questions_ = [];
      sections.length > 0 &&
        (await asyncForEach(sections, async (element) => {
          let { data } = await WebApiAssessment.assessmentQuestions(element.id);
          // let { data } = await Axios.get(
          //   `${API_ASSESSMENT}/assessments/question/?section=${element.id}`
          // );
          data.results.answer_set = _.orderBy(
            data.results.answer_set,
            ["order"],
            ["asc"]
          );
          questions_.push(...data.results);
        }));
      let questions = _.orderBy(questions_, ["order"], ["asc"]);
      dispatch({ type: types.LOAD_NEW_QUESTIONS, payload: questions });
      return true;
    } catch (e) {
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ASSESSMENT QUESTION ORDER
export const questionOrderAction = (method, item) => {
  return async (dispatch, getState) => {
    try {
      await getOrderApi(method, item.id);
      let questions_ = [];
      await asyncForEach(
        getState().assessmentStore.sections,
        async (element) => {
          let { data } = await WebApiAssessment.assessmentQuestions(element.id);
          // let { data } = await Axios.get(
          //   `${API_ASSESSMENT}/assessments/question/?section=${element.id}`
          // );
          data.results.answer_set = _.orderBy(
            data.results.answer_set,
            ["order"],
            ["asc"]
          );
          questions_.push(...data.results);
        }
      );
      let questions = _.orderBy(questions_, ["order"], ["asc"]);
      dispatch({ type: types.LOAD_NEW_QUESTIONS, payload: questions });
      return true;
    } catch (e) {
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

export const getOrderApi = (method, id) => {
  switch (method) {
    case types.UP_ORDER_SECTION:
      return Axios.post(
        `${urlKuizBaseApiWithTenant}/assessments/section/move_section_up/`,
        { section_id: id }
      );
      break;
    case types.DOWN_ORDER_SECTION:
      return Axios.post(
        `${urlKuizBaseApiWithTenant}/assessments/section/move_section_down/`,
        { section_id: id }
      );
      break;
    case types.UP_ORDER_QUESTION:
      return Axios.post(
        `${urlKuizBaseApiWithTenant}/assessments/question/move_question_up/`,
        { question_id: id }
      );
      break;
    case types.DOWN_ORDER_QUESTION:
      return Axios.post(
        `${urlKuizBaseApiWithTenant}/assessments/question/move_question_down/`,
        { question_id: id }
      );
      break;
    case types.UP_ORDER_ANSWER:
      return Axios.post(
        `${urlKuizBaseApiWithTenant}/assessments/answer/move_answer_up/`,
        { answer_id: id }
      );
      break;
    case types.DOWN_ORDER_ANSWER:
      return Axios.post(
        `${urlKuizBaseApiWithTenant}/assessments/answer/move_answer_down/`,
        { answer_id: id }
      );
      break;
    default:
      return;
  }
};

//ASSESSMENT CREATE
export const assessmentCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      // let response = await Axios.post(
      //   API_ASSESSMENT + "/assessments/assessment/",
      //   data
      // );
      let response = await WebApiAssessment.createAssessments(data);
      dispatch({ type: types.CREATE_ASSESSMENTS, payload: response.data });
      return response;
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
      let response = await WebApiAssessment.updateAssessments(id, data);
      dispatch({ type: types.UPDATE_ASSESSMENTS, payload: response.data });
      return response;
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
      // await Axios.delete(`${API_ASSESSMENT}/assessments/assessment/${id}`);
      await WebApiAssessment.assessmentDelete(id);
      dispatch({ type: types.DELETE_ASSESSMENTS, payload: id });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ASSESSMENT STATUS
export const assessmentStatusAction = (id, status) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let { data } = await WebApiAssessment.assessmentStatus(id, {
        is_active: status,
      });
      // let { data } = await Axios.patch(
      //   `${API_ASSESSMENT}/assessments/assessment/${id}/`,
      //   { is_active: status }
      // );
      dispatch({ type: types.UPDATE_ASSESSMENTS, payload: data });
      return true;
    } catch (error) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//SECTION CREATE
export const sectionCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await WebApiAssessment.createSection(data);
      // let response = await Axios.post(
      //   API_ASSESSMENT + "/assessments/section/",
      //   data
      // );
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
      let response = await WebApiAssessment.updateSection(id, data);
      // let response = await Axios.patch(
      //   `${API_ASSESSMENT}/assessments/section/${id}/`,
      //   data
      // );
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
      await WebApiAssessment.deleteSection(id);
      // await Axios.delete(`${API_ASSESSMENT}/assessments/section/${id}`);
      dispatch({ type: types.DELETE_SECTIONS, payload: id });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//QUESTION CREATE
export const questionCreateAction = (data) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await WebApiAssessment.createQuestion(data);
      // let response = await Axios.post(
      //   API_ASSESSMENT + "/assessments/question/",
      //   data
      // );
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
      let response = await WebApiAssessment.updateQuestion(id, data);
      // let response = await Axios.patch(
      //   `${API_ASSESSMENT}/assessments/question/${id}/`,
      //   data
      // );
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
      await WebApiAssessment.deleteQuestion(id);
      // await Axios.delete(`${API_ASSESSMENT}/assessments/question/${id}`);
      dispatch({ type: types.DELETE_QUESTIONS, payload: id });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

//ANSWER CREATE
export const answerCreateAction = (values) => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await WebApiAssessment.createAnswer(values);
      // let response = await Axios.post(
      //   API_ASSESSMENT + "/assessments/answer/",
      //   values
      // );

      let { data } = await WebApiAssessment.getAnswer(response.data.question);
      // let { data } = await Axios.get(
      //   `${API_ASSESSMENT}/assessments/question/${response.data.question}/`
      // );
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
      let response = await WebApiAssessment.updateAnswer(id, values);
      // let response = await Axios.patch(
      //   `${API_ASSESSMENT}/assessments/answer/${id}/`,
      //   values
      // );
      let { data } = await WebApiAssessment.getAnswer(response.data.question);
      // let { data } = await Axios.get(
      //   `${API_ASSESSMENT}/assessments/question/${response.data.question}/`
      // );
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
      await WebApiAssessment.deleteAnswer(item.id);
      // await Axios.delete(`${API_ASSESSMENT}/assessments/answer/${item.id}/`);
      let { data } = await WebApiAssessment.getAnswer(item.question);
      // let { data } = await Axios.get(
      //   `${API_ASSESSMENT}/assessments/question/${item.question}/`
      // );
      dispatch({ type: types.UPDATE_QUESTIONS, payload: data });
      return true;
    } catch (e) {
      dispatch({ type: types.FETCHING, payload: false });
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

export const getCategories = () => {
  return async (dispatch) => {
    dispatch({ type: types.FETCHING, payload: true });
    try {
      let response = await WebApiAssessment.getCategoriesAssessment();
      if (response.status === 200) {
        dispatch({
          type: types.GET_CATEGORIES_SUCCESS,
          payload: response.data,
        });
      }
    } catch (error) {}
  };
};

export const getCompetences = (node) => {
  return async (dispatch) => {
    dispatch({
      type: types.GET_COMPETENCES,
      fetching: true,
      payload: {}
    });
    try {
      let response = await WebApiAssessment.getCompetences(node);
      dispatch({
        type: types.GET_COMPETENCES,
        fetching: false,
        payload: response.data
      });
    } catch (e) {
      dispatch({
        type: types.GET_COMPETENCES,
        fetching: false,
        payload: {}
      });
      console.error(e.name + ": " + e.message);
    }
  };
};

export const getProfiles = (node, query) => {
  return async (dispatch) => {
    dispatch({
      type: types.GET_PROFILES,
      fetching: true,
      payload: []
    });
    try {
      let response = await WebApiAssessment.getProfiles(node, query);
      dispatch({
        type: types.GET_PROFILES,
        fetching: false,
        payload: response.data
      });
      dispatch(setCurrentPage(1));
    } catch (e) {
      dispatch({
        type: types.GET_PROFILES,
        fetching: false,
        payload: []
      });
      console.error(e.name + ": " + e.message);
    }
  };
};

export const addProfile = (data) => {
  return async (dispatch) => {
    try {
      await WebApiAssessment.addProfile(data);
      dispatch(getProfiles(data.node_id,""));
      return true;
    } catch (e) {
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

export const editProfile = (id, data) => {
  return async (dispatch) => {
    try {
      await WebApiAssessment.editProfile(id, data);
      dispatch(getProfiles(data.node_id,""));
      return true;
    } catch (e) {
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

export const deleteProfile = (id, node) => {
  return async (dispatch) => {
    try {
      await WebApiAssessment.deleteProfile(id);
      dispatch(getProfiles(node,""));
      return true;
    } catch (e) {
      console.error(e.name + ": " + e.message);
      return false;
    }
  };
};

export const getListAssets = (node, query = '') => async (dispatch) =>{
  const action = {type: types.LIST_ASSETS, payload: [], fetching: false};
  try {
    dispatch({...action, fetching: true})
    let response = await WebApiAssessment.getListSurveys(node, query);
    dispatch({...action, payload: response.data})
  } catch (e) {
    console.log(e)
    dispatch(action)
  }
}

export const getGroupAssets = (node, query = '') => async (dispatch) =>{
  const action = {type: types.GROUPS_ASSETS, payload: [], fetching: false};
  dispatch({...action, fetching: true})
  try {
    let response = await WebApiAssessment.getGroupsAssessments(node, query);
    dispatch({...action, payload: response.data})
  } catch (e) {
    console.log()
    dispatch(action)
  }
}

export const setCurrentPage = (num) => {
  return async (dispatch) => {
    dispatch({
      type: types.SET_PAGE,
      payload: num
    });
  };
};

export const setErrorFormAdd = (flag) => {
  return async (dispatch) => {
    dispatch({
      type: types.SET_ERROR_FORM_ADD,
      payload: flag
    })
  }
}

export const setModalGroup = (flag) => {
  return async (dispatch) => {
    dispatch({
      type: types.SET_MODAL_GROUP,
      payload: flag
    })
  }
}

export const setModalGroupEdit = (flag) => {
  return async (dispatch) => {
    dispatch({
      type: types.SET_MODAL_GROUP_EDIT,
      payload: flag
    })
  }
}

export default assessmentReducer;
