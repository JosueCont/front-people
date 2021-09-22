import { getGroups } from "../api/apiKhonnect";
import WebApi from "../api/webApi";
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
  cat_groups: [],
  people_company: [],
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
      return { ...state, cat_person_type: action.payload };
    case PROFILE_GROUP:
      return { ...state, cat_groups: action.payload };
    case PEOPLE_COMPANY:
      return { ...state, people_company: action.payload };
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
        dispatch(getBanks(data));
        dispatch(getExperienceType(data));
        dispatch(getReasonSeparation(data));
        dispatch(getLaborRelation(data));
        dispatch(getTreatment(data));
        dispatch(getDocumentType(data));
        dispatch(getDepartmets(data));
        dispatch(getJobs(data));
        dispatch(getPersonType(data));
        dispatch(getProfileGroups(data));
        dispatch(getPeopleCompany(data));
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getRelationship = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getCatalogs("relationship", data);
    dispatch({ type: RELATIONSHIP, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getBanks = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getCatalogs("banks", data);
    dispatch({ type: BANK, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getExperienceType = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getCatalogs("experience-type", data);
    dispatch({ type: EXPERIENCE_TYPE, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getReasonSeparation = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getCatalogs("reason-separation", data);
    dispatch({ type: REASON_SEPARATION, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getLaborRelation = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getCatalogs("labor-relationship", data);
    dispatch({ type: LABOR_RELATION, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getTreatment = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getCatalogs("treatment", data);
    dispatch({ type: TREATMENT, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getDocumentType = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getCatalogs("document-type", data);
    dispatch({ type: DOCUMENT_TYPE, payload: response.data });
  } catch (error) {
    console.log(error);
  }
};

export const getDepartmets = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.filterDepartmentByNode(data);
    dispatch({ type: DEPARTMENT, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getJobs = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getJobs(data);
    dispatch({ type: JOB, payload: response.data });
  } catch (error) {
    console.log(error);
  }
};

export const getPersonType = (data) => async (dispatch, getState) => {
  try {
    let response = await WebApi.getPersontype(data);
    dispatch({ type: PERSON_TYPE, payload: response.data.results });
  } catch (error) {
    console.log(error);
  }
};

export const getProfileGroups = (data) => async (dispatch, getState) => {
  try {
    let response = await getGroups(data);
    if (response) dispatch({ type: PROFILE_GROUP, payload: response });
  } catch (error) {
    console.log(error);
  }
};

export const getPeopleCompany = () => async (dispatch, getState) => {
  try {
    let data = await userCompanyId();
    let response = await WebApi.filterPerson({ node: data });
    let people = response.data.map((a, i) => {
      return {
        label: a.first_name + " " + a.flast_name,
        value: a.id,
        key: a.id + i,
      };
    });
    dispatch({ type: PEOPLE_COMPANY, payload: people });
  } catch (error) {
    console.log(error);
  }
};
