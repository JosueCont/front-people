import id from "faker/lib/locales/id_ID";
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
  cat_job_risk: [],
  cat_departments: [],
  cat_person_type: [],
  person_type_table: [],
  cat_groups: [],
  cat_fractions: [],
  people_company: [],
  cat_level: [],
  cat_work_title: [],
  fixed_concept: [],
  cat_cost_center: [],
  cat_tags: [],
  cat_accounts: [],
  errorData: null,
  cat_branches: [],
  cat_patronal_registration: [],
};

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
const JOB_RISK = "JOB_RISK";
const FRACTIONS = "FRACTIONS";
const LEVEL = "LEVEL";
const WORK_TITLE = "WORK_TITLE";
const FIXED_CONCEPT = "FIXED_CONCEPT";
const GROUP_FIXED_CONCEPT = "GROUP_FIXED_CONCEPT";
const COST_CENTER = "COST_CENTER";
const TAGS = "TAGS";
const ACCOUNT = "ACCOUNT";
const BRANCHES = "BRANCHES";
const PATRONAL_REGISTRATION = "PATRONAL_REGISTRATION";

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
    case FIXED_CONCEPT:
      return { ...state, fixed_concept: action.payload };
    case GROUP_FIXED_CONCEPT:
      return { ...state, fixed_concept: action.payload };
    case COST_CENTER:
      return { ...state, cat_cost_center: action.payload };
    case TAGS:
      return {
        ...state,
        cat_tags: action.payload.data,
        errorData: action.payload?.error,
      };
    case ACCOUNT:
      return {
        ...state,
        cat_accounts: action.payload.data,
        errorData: action.payload?.error,
      };
    case BRANCHES:
      return {
        ...state,
        cat_branches: action.payload,
      };
    case PATRONAL_REGISTRATION:
      return {
        ...state,
        cat_patronal_registration: action.payload.data,
        errorData: action.payload?.error,
      };
    case JOB_RISK:
      return {
        ...state,
        cat_job_risk: action.payload.data,
        errorData: action.payload?.error,
      };
    case FRACTIONS:
      return {
        ...state,
        cat_fractions: action.payload.data,
        errorData: action.payload?.error,
      };
    default:
      return state;
  }
};
export default webReducer;

export const doCompanySelectedCatalog =
  (idCompany) => async (dispatch, getState) => {
    try {
      if (!idCompany) idCompany = userCompanyId();
      if (idCompany) {
        dispatch(getRelationship(idCompany));
        dispatch(getJobRiskClass(idCompany));
        dispatch(getFractions(idCompany));
        dispatch(getExperienceType(idCompany));
        dispatch(getReasonSeparation(idCompany));
        dispatch(getLaborRelation(idCompany));
        dispatch(getTreatment(idCompany));
        dispatch(getDocumentType(idCompany));
        dispatch(getDepartmets(idCompany));
        dispatch(getJobs(idCompany));
        dispatch(getPersonType(idCompany));
        dispatch(getPeopleCompany(idCompany));
        dispatch(getLevel(idCompany));
        dispatch(getWorkTitle(idCompany));
        dispatch(getCostCenter(idCompany));
        dispatch(getTags(idCompany));
        dispatch(getAccountantAccount(idCompany));
        dispatch(getBranches(idCompany));
        dispatch(getPatronalRegistration(idCompany));
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  };

export const getRelationship = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("relationship", idCompany);
    dispatch({ type: RELATIONSHIP, payload: response.data.results });
  } catch (error) {
    dispatch({ type: RELATIONSHIP, payload: [] });
  }
};

export const getBanks = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("banks", idCompany);
    dispatch({ type: BANK, payload: response.data.results });
  } catch (error) {
    dispatch({ type: BANK, payload: [] });
  }
};

export const getExperienceType = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("experience-type", idCompany);
    dispatch({ type: EXPERIENCE_TYPE, payload: response.data.results });
  } catch (error) {
    dispatch({ type: EXPERIENCE_TYPE, payload: [] });
  }
};

export const getReasonSeparation =
  (idCompany) => async (dispatch, getState) => {
    try {
      let response = await WebApiPeople.getCatalogs(
        "reason-separation",
        idCompany
      );
      dispatch({ type: REASON_SEPARATION, payload: response.data.results });
    } catch (error) {
      dispatch({ type: REASON_SEPARATION, payload: [] });
    }
  };

export const getLaborRelation = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs(
      "labor-relationship",
      idCompany
    );
    dispatch({ type: LABOR_RELATION, payload: response.data.results });
  } catch (error) {
    dispatch({ type: LABOR_RELATION, payload: [] });
  }
};

export const getTreatment = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("treatment", idCompany);
    dispatch({ type: TREATMENT, payload: response.data.results });
  } catch (error) {
    dispatch({ type: TREATMENT, payload: [] });
  }
};

export const getDocumentType = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.getCatalogs("document-type", idCompany)
    .then((response) => {
      dispatch({ type: DOCUMENT_TYPE, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: DOCUMENT_TYPE, payload: [] });
    });
};

export const getDepartmets = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.filterDepartmentByNode(idCompany)
    .then((response) => {
      dispatch({ type: DEPARTMENT, payload: response.data.results });
    })
    .catch((err) => {
      dispatch({ type: DEPARTMENT, payload: [] });
    });
};

export const getJobs = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getJobs(idCompany);
    dispatch({ type: JOB, payload: response.data });
  } catch (error) {
    dispatch({ type: JOB, payload: [] });
  }
};

export const getPersonType = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getPersontype(idCompany);
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
  (idCompany, config, filter) => async (dispatch, getState) => {
    try {
      let response = await getGroups(idCompany, config, filter);
      if (response) dispatch({ type: PROFILE_GROUP, payload: response });
    } catch (error) {
      dispatch({ type: PROFILE_GROUP, payload: [] });
    }
  };

export const getPeopleCompany = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.filterPerson({ node: idCompany });
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

export const getLevel = (idCompany) => async (dispatch, getState) => {
  try {
    let response = await WebApiPeople.getCatalogs("level", idCompany);
    dispatch({ type: LEVEL, payload: response.data.results });
  } catch (error) {
    dispatch({ type: LEVEL, payload: [] });
  }
};

export const getWorkTitle = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.getCatalogs("work-title", idCompany)
    .then((response) => {
      dispatch({ type: WORK_TITLE, payload: response.data.results });
    })
    .catch((error) => {
      dispatch({ type: WORK_TITLE, payload: [] });
    });
};

export const getCostCenter = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.centerCost(idCompany)
    .then((response) => {
      let costs = _.orderBy(response.data.results, ['code'],['asc']);
      dispatch({ type: COST_CENTER, payload: costs });
    })
    .catch((error) => {
      dispatch({ type: COST_CENTER, payload: [] });
    });
};

export const getTags = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.tags(idCompany)
    .then((response) => {
      let tags = _.orderBy(response.data.results, ['name'],['asc']);
      dispatch({
        type: TAGS,
        payload: { data: tags, error: null },
      });
    })
    .catch((error) => {
      dispatch({ type: TAGS, payload: { data: [], error: error } });
    });
};

export const getAccountantAccount =
  (idCompany) => async (dispatch, getState) => {
    await WebApiPeople.accountantAccount(idCompany)
      .then((response) => {
        dispatch({
          type: ACCOUNT,
          payload: { data: response.data.results, error: null },
        });
      })
      .catch((error) => {
        dispatch({ type: ACCOUNT, payload: { data: [], error: error } });
      });
  };

export const getBranches = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.getBranches(`?node=${idCompany}`)
    .then((response) => {
      dispatch({
        type: BRANCHES,
        payload: response.data.results,
      });
    })
    .catch((error) => {
      dispatch({ type: BRANCHES, payload: [] });
    });
};

export const getPatronalRegistration =
  (idCompany=null) => async (dispatch, getState) => {

    if (!idCompany) idCompany = userCompanyId();
    await WebApiPeople.getPatronalRegistration(idCompany)
      .then((response) => {
        dispatch({
          type: PATRONAL_REGISTRATION,
          payload: { data: response.data, error: null },
        });
      })
      .catch((error) => {
        console.log(error)
        dispatch({
          type: PATRONAL_REGISTRATION,
          payload: { data: [], error: error },
        });
      });
  };

export const getJobRiskClass = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.getJobRiskClass(idCompany)
    .then((response) => {
      let unOrder = response.data.results;

      let ordered = unOrder
        ? unOrder.sort((a, b) => {
            if (a.percent > b.percent) return 1;
            if (a.percent < b.percent) return -1;
            return 0;
          })
        : [];

      dispatch({
        type: JOB_RISK,
        payload: { data: ordered, error: null },
      });
    })
    .catch((error) => {
      dispatch({ type: JOB_RISK, payload: { data: [], error: error } });
    });
};

export const getFractions = (idCompany) => async (dispatch, getState) => {
  await WebApiPeople.getFractions(idCompany)
    .then((response) => {
      dispatch({
        type: FRACTIONS,
        payload: { data: response.data.results, error: null },
      });
    })
    .catch((error) => {
      dispatch({ type: FRACTIONS, payload: { data: [], error: error } });
    });
};
