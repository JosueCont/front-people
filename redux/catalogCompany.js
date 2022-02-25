import { getGroups } from "../api/apiKhonnect";
import WebApiPeople from "../api/WebApiPeople";
import { userCompanyId } from "../libs/auth";

const initialData = {
  cat_relationship: [],
  cat_bank: [],
  cat_experience_type: [],
  cat_reason_separation: [],
  cat_labor_relation: [],
  cat_treatment: [],
  cat_document_type: [],
  cat_job: [],
  cat_departments: [],
  cat_person_type: [],
  person_type_table: [],
  cat_groups: [],
  people_company: [],
  cat_level: [],
  cat_work_title: [],
};
2;

const RELATIONSHIP = "RELATIONSHIP";
const BANK = "BANK";
const EXPERIENCE_TYPE = "EXPERIENCE_TYPE";
const REASON_SEPARATION = "REASON_SEPARATION";
const LABOR_RELATION = "LABOR_RELATION";
const TREATMENT = "TREATMENT";
const DOCUMENT_TYPE = "DOCUMENT_TYPE";
const DEPARTMENT = "DEPARTMENT";
const PERSON_TYPE = "PERSON_TYPE";
const PROFILE_GROUP = "PROFILE_GROUP";
const PEOPLE_COMPANY = "PEOPLE_COMPANY";
const JOB = "JOB";
const LEVEL = "LEVEL";
const WORK_TITLE = "WORKTITLE";

const webReducer = (state = initialData, action) => {
  switch (action.type) {
    case RELATIONSHIP:
      return { ...state, cat_relationship: action.payload };
    case BANK:
      return { ...state, cat_bank: action.payload };
    case EXPERIENCE_TYPE:
      return { ...state, cat_experience_type: action.payload };
    case REASON_SEPARATION:
      return { ...state, cat_experience_type: action.payload };
    case LABOR_RELATION:
      return { ...state, cat_labor_relation: action.payload };
    case TREATMENT:
      return { ...state, cat_treatment: action.payload };
    case DOCUMENT_TYPE:
      return { ...state, cat_document_type: action.payload };
    case JOB:
      return { ...state, cat_job: action.payload };
    case DEPARTMENT:
      return { ...state, cat_departments: action.payload };
    case PERSON_TYPE:
      return {
        ...state,
        cat_person_type: action.payload,
      };
    case PROFILE_GROUP:
      return { ...state, cat_groups: action.payload };
    case PEOPLE_COMPANY:
      return { ...state, people_company: action.payload };
    case LEVEL:
      return { ...state, cat_level: action.payload };
    case WORK_TITLE:
      return { ...state, cat_work_title: action.payload };
    default:
      return state;
  }
};
export default webReducer;

export const doCompanySelectedCatalog =
  (data) => async (dispatch, getState) => {
    try {
      if (!data) data = userCompanyId();
      if (data) {
        dispatch(getRelationship(data));
        dispatch(getExperienceType(data));
        dispatch(getReasonSeparation(data));
        dispatch(getLaborRelation(data));
        dispatch(getTreatment(data));
        dispatch(getDocumentType(data));
        dispatch(getDepartmets(data));
        dispatch(getJobs(data));
        dispatch(getPersonType(data));
        dispatch(getPeopleCompany(data));
        dispatch(getLevel(data));
        dispatch(getWorkTitle(data));
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getRelationship = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("relationship", data);
    dispatch({ type: RELATIONSHIP, payload: response.data.results });
  } catch (error) {
    dispatch({ type: RELATIONSHIP, payload: [] });
  }
};

export const getBanks = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("banks", data);
    dispatch({ type: BANK, payload: response.data.results });
  } catch (error) {
    dispatch({ type: BANK, payload: [] });
  }
};

export const getExperienceType = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("experience-type", data);
    dispatch({ type: EXPERIENCE_TYPE, payload: response.data.results });
  } catch (error) {
    dispatch({ type: EXPERIENCE_TYPE, payload: [] });
  }
};

export const getReasonSeparation = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("reason-separation", data);
    dispatch({ type: REASON_SEPARATION, payload: response.data.results });
  } catch (error) {
    dispatch({ type: REASON_SEPARATION, payload: [] });
  }
};

export const getLaborRelation = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("labor-relationship", data);
    dispatch({ type: LABOR_RELATION, payload: response.data.results });
  } catch (error) {
    dispatch({ type: LABOR_RELATION, payload: [] });
  }
};

export const getTreatment = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("treatment", data);
    dispatch({ type: TREATMENT, payload: response.data.results });
  } catch (error) {
    dispatch({ type: TREATMENT, payload: [] });
  }
};

export const getDocumentType = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("document-type", data);
    dispatch({ type: DOCUMENT_TYPE, payload: response.data });
  } catch (error) {
    dispatch({ type: DOCUMENT_TYPE, payload: [] });
  }
};

export const getDepartmets = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.filterDepartmentByNode(data);
    dispatch({ type: DEPARTMENT, payload: response.data.results });
  } catch (error) {
    dispatch({ type: DEPARTMENT, payload: [] });
  }
};

export const getJobs = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getJobs(data);
    dispatch({ type: JOB, payload: response.data.results });
  } catch (error) {
    dispatch({ type: JOB, payload: [] });
  }
};

export const getPersonType = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getPersontype(data);
    dispatch({
      type: PERSON_TYPE,
      payload: response.data.results,
    });
  } catch (error) {
    dispatch({
      type: PERSON_TYPE,
      payload: [],
    });
  }
};

export const getProfileGroups =
  (node, config) => async (dispatch, getState) => {
    try {
      let response = await getGroups(node, config);
      if (response) dispatch({ type: PROFILE_GROUP, payload: response });
    } catch (error) {
      dispatch({ type: PROFILE_GROUP, payload: [] });
    }
  };

export const getPeopleCompany = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.filterPerson({ node: data });
    let people = response.data.map((a, i) => {
      return {
        label: a.first_name + " " + a.flast_name,
        value: a.id,
        khonnect_id: a.khonnect_id,
        key: a.khonnect_id + i,
      };
    });
    dispatch({ type: PEOPLE_COMPANY, payload: people });
  } catch (error) {
    dispatch({ type: PEOPLE_COMPANY, payload: [] });
  }
};

export const getLevel = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("level", data);
    dispatch({ type: LEVEL, payload: response.data.results });
  } catch (error) {
    dispatch({ type: LEVEL, payload: [] });
  }
};

export const getWorkTitle = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("work-title", data);
    dispatch({ type: WORK_TITLE, payload: response.data.results });
  } catch (error) {
    dispatch({ type: WORK_TITLE, payload: [] });
  }
};
