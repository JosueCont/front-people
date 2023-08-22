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
    load_departments: false,
    load_jobs: false,
    load_cost_center: false,
    load_tags: false,
    load_person_type: false,
    load_relationship: false,
    load_documents: false,
    load_accounts: false,
    load_branches: false,
    load_patronal_registration: false,
    cat_patronal_registration: [],
    list_modules_permissions: [],
    load_modules_permissions: false,
    list_admin_roles: {},
    load_admin_roles: false,
    list_admin_roles_options: [],
    load_admin_roles_options: false,
    config_page: 1,
    config_filters: ""
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
const GET_MODULES_PERMISSIONS = "GET_MODULES_PERMISSIONS";
const GET_ADMIN_ROLES = "GET_ADMIN_ROLES";
const GET_ADMIN_ROLES_OPTIONS = "GET_ADMIN_ROLES_OPTIONS";

const webReducer = (state = initialData, action) => {
    switch (action.type) {
        case RELATIONSHIP:
            return {
                ...state,
                cat_relationship: action.payload,
                load_relationship: action.fetching
            };
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
            return {
                ...state,
                cat_document_type: action.payload,
                load_documents: action.fetching
            };
        case JOB:
            return {
                ...state,
                cat_job: action.payload,
                load_jobs: action.fetching
            };
        case DEPARTMENT:
            return {
                ...state,
                cat_departments: action.payload,
                load_departments: action.fetching
            };
        case PERSON_TYPE:
            return {
                ...state,
                cat_person_type: action.payload,
                load_person_type: action.fetching
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
            return {
                ...state,
                cat_cost_center: action.payload,
                load_cost_center: action.fetching
            };
        case TAGS:
            return {
                ...state,
                cat_tags: action.payload,
                load_tags: action.fetching,
                errorData: action.error,
            };
        case ACCOUNT:
            return {
                ...state,
                cat_accounts: action.payload,
                load_accounts: action.fetching,
                errorData: action.error,
            };
        case BRANCHES:
            return {
                ...state,
                cat_branches: action.payload,
                load_branches: action.fetching
            };
        case PATRONAL_REGISTRATION:
            return {
                ...state,
                cat_patronal_registration: action.payload,
                load_patronal_registration: action.fetching,
                errorData: action?.error,
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
        case GET_MODULES_PERMISSIONS:
            return {
                ...state,
                list_modules_permissions: action.payload,
                load_modules_permissions: action.fetching
            }
        case GET_ADMIN_ROLES:
            return {
                ...state,
                list_admin_roles: action.payload,
                load_admin_roles: action.fetching,
                config_page: action.page,
                config_filters: action.query
            }
        case GET_ADMIN_ROLES_OPTIONS:
            return {
                ...state,
                list_admin_roles_options: action.payload,
                load_admin_roles_options: action.fetching
            }
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
                //dispatch(getJobRiskClass(idCompany));
                //dispatch(getFractions(idCompany));
                //dispatch(getExperienceType(idCompany));
                //dispatch(getReasonSeparation(idCompany));
                //dispatch(getLaborRelation(idCompany));
                //dispatch(getTreatment(idCompany));
                //dispatch(getDocumentType(idCompany));
                dispatch(getDepartmets(idCompany));
                dispatch(getJobs(idCompany));
                //dispatch(getPersonType(idCompany));
                dispatch(getPeopleCompany(idCompany));
                dispatch(getLevel(idCompany));
                dispatch(getWorkTitle(idCompany));
                dispatch(getCostCenter(idCompany));
                dispatch(getTags(idCompany));
                //dispatch(getAccountantAccount(idCompany));
                dispatch(getBranches(idCompany));
                dispatch(getPatronalRegistration(idCompany));
                return true;
            }
        } catch (error) {
            console.log(error);
        }
    };

export const getRelationship = (idCompany) => async (dispatch, getState) => {
    const type = { type: RELATIONSHIP, payload: [], fetching: false }
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiPeople.getCatalogs("relationship", idCompany);
        dispatch({ ...type, payload: response.data?.results });
    } catch (error) {
        dispatch(type)
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
    const type = { type: DOCUMENT_TYPE, payload: [], fetching: false };
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiPeople.getCatalogs("document-type", idCompany)
        dispatch({ ...type, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
};

export const getDepartmets = (idCompany) => async (dispatch, getState) => {
    const type = { type: DEPARTMENT, payload: [], fetching: false };
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiPeople.filterDepartmentByNode(idCompany);
        dispatch({ ...type, payload: response.data?.results });
    } catch (e) {
        dispatch(type)
        console.log(e)
    }
};

export const getJobs = (idCompany) => async (dispatch, getState) => {
    const type = { type: JOB, payload: [], fetching: false };
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiPeople.getJobs(idCompany);
        dispatch({ ...type, payload: response.data })
    } catch (error) {
        dispatch(type)
    }
};

export const getPersonType = (idCompany) => async (dispatch, getState) => {
    const type = { type: PERSON_TYPE, payload: [], fetching: false };
    dispatch({ ...type, fetching: true })
    try {
        if (!idCompany) idCompany = userCompanyId();
        let response = await WebApiPeople.getPersontype(idCompany);
        dispatch({ ...type, payload: response.data.results });
    } catch (error) {
        dispatch(type)
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
        if (!idCompany) idCompany = userCompanyId();
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
    const type = { type: COST_CENTER, payload: [], fetching: false }
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiPeople.centerCost(idCompany);
        let costs = _.orderBy(response.data.results, ['code'], ['asc']);
        dispatch({ ...type, payload: costs })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
};

export const getTags = (idCompany) => async (dispatch, getState) => {
    const type = { type: TAGS, payload: [], fetching: false, error: null }
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiPeople.tags(idCompany);
        let tags = _.orderBy(response.data.results, ['name'], ['asc']);
        dispatch({ ...type, payload: tags })
    } catch (e) {
        console.log(e)
        dispatch({ ...type, error: e })
    }
};

export const getAccountantAccount = (idCompany) => async (dispatch, getState) => {
    if (!idCompany) idCompany = userCompanyId();
    const type = { type: ACCOUNT, payload: [], fetching: false, error: null };
    dispatch({ ...type, fetching: true })
    try {
        let response = await WebApiPeople.accountantAccount(idCompany);
        dispatch({ ...type, payload: response.data?.results })
    } catch (e) {
        dispatch({ ...type, error: e })
        console.log(e)
    }
};

export const getBranches = (idCompany) => async (dispatch, getState) => {
    const type = {type: BRANCHES, payload: [], fetching: false};
    dispatch({...type, fetching: true})
    try {
        let response = await WebApiPeople.getBranches(`?node=${idCompany}`);
        dispatch({...type, payload: response.data?.results})
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
};

export const getPatronalRegistration = (idCompany = null) => async (dispatch, getState) => {
    const type = {type: PATRONAL_REGISTRATION, payload: [], fetching: false, error: null}
    dispatch({...type, fetching: true})
    try {
        if (!idCompany) idCompany = userCompanyId();
        let response = await WebApiPeople.getPatronalRegistration(idCompany);
        dispatch({...type, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch({...type, error: e})
    }
    // if (!idCompany) idCompany = userCompanyId();
    // await WebApiPeople.getPatronalRegistration(idCompany)
    //     .then((response) => {
    //         dispatch({
    //             type: PATRONAL_REGISTRATION,
    //             payload: { data: response.data, error: null },
    //         });
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //         dispatch({
    //             type: PATRONAL_REGISTRATION,
    //             payload: { data: [], error: error },
    //         });
    //     });
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

export const getFractions = (idCompany = null) => async (dispatch, getState) => {
    if (!idCompany) idCompany = userCompanyId();
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

export const getAdminRoles = (node, query = '', page = 1) => async (dispatch) => {
    const typeFunction = { type: GET_ADMIN_ROLES, payload: {}, fetching: false, query, page };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiPeople.getAdminRoles(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getAdminRolesOptions = (node, query = '') => async (dispatch) => {
    const typeFunction = { type: GET_ADMIN_ROLES_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let params = `&paginate=0${query}`;
        let response = await WebApiPeople.getAdminRoles(node, params);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getModulesPermissions = () => async (dispatch) => {
    const typeFunction = { type: GET_MODULES_PERMISSIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiPeople.getModulesPermissions();
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}
