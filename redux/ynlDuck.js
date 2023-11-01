import axios from "axios";
import WebApiYnl from "../api/WebApiYnl";

const initialData = {
  fetching: false,
  loadTopPersons: false,
  topPersons: [],
  loadEmotionalAspects: false,
  emotionalAspects: [],
  loadDailyEmotions: false,
  dailyEmotions: [],
  loadReportUser: false,
  reportUser: [],
  loadEmotionChart: false,
  emotionChart: [],
  stadistics: {},
  loadPersons: false,
  persons: [],
  loadReportPerson: false,
  reportPerson: [],
  dates: {},
  streaksList:[],
  loadReportStreak:false,
  goalsList:[],
  loadReportGoals:false,
  valuesChart:[],
  loadChart:false,
  people:[],
  loadPeople:false
};

const TOPPERSONS = "TOPPERSONS";
const EMOTIONALASPECTS = "EMOTIONALASPECTS";
const DAILYEMOTIONS = "DAILYEMOTIONS";
const REPORTUSER = "REPORTUSER";
const EMOTIONCHART = "EMOTIONCHART";
const PERSONS = "PERSONS";
const REPORTPERSON = "REPORTPERSON";
const REPORTPERSON_FINISH = "REPORTPERSON_FINISH";
const STREAK_TOP = 'streak_top';
const REPORTSTREAK = 'REPORTSTREAK';
const GOALS = 'goals';
const REPORTGOALS='REPORTGOALS';
const LOADING = 'LOADING';
const CHART_GOALS_DATA = 'chart_goals_data';
const CHARTREPORT = 'CHART_REPORT';
const PEOPLEYNL = 'PEOPLEYNL';
const REPORTPEOPLEYNL = 'REPORTPEOPLEYNL';

const ynlReducer = (state = initialData, action) => {
  switch (action.type) {
    case TOPPERSONS:
      return {
        ...state,
        loadTopPersons: action.fetching,
        topPersons: action.payload,
      };
    case EMOTIONALASPECTS:
      return {
        ...state,
        loadEmotionalAspects: action.fetching,
        emotionalAspects: action.payload,
      };
    case DAILYEMOTIONS:
      return {
        ...state,
        loadDailyEmotions: action.fetching,
        dailyEmotions: action.payload,
      };
    case REPORTUSER:
      return {
        ...state,
        loadReportUser: action.fetching,
        reportUser: action.payload,
      };
    case EMOTIONCHART:
      return {
        ...state,
        loadEmotionChart: action.fetching,
        emotionChart: action.payload,
        stadistics: action.stadistics,
      };
    case PERSONS:
      return {
        ...state,
        loadPersons: action.fetching,
        persons: action.payload,
      };
    case REPORTPERSON:
      return { ...state, loadReportPerson: true, reportPerson: action.payload };
    case REPORTPERSON_FINISH:
      return {
        ...state,
        loadReportPerson: false,
        reportPerson: action.payload,
      };
    case STREAK_TOP:
      return {...state, loadReportStreak: action.loadReportStreak, streaksList: action.payload };
    case REPORTSTREAK:
      return {...state, loadReportStreak:false, streaksList:[]}
    case GOALS:
      return {...state, loadReportGoals: action.loadReportGoals, goalsList: action.payload };
    case REPORTGOALS:
      return {...state, loadReportGoals: false, goalsList:[]}
    case LOADING:
      return {...state, loadReportStreak: true, loadReportGoals:true, loadPeople:true}
    case CHART_GOALS_DATA:
      return { ...state, loadChart:action.loadChart ,valuesChart: action.payload}
    case CHARTREPORT:
      return {...state, loadChart: false, valuesChart:[]}
    case PEOPLEYNL:
      return {...state, loadPeople:action.loadPeople, people:action.payload}
    case REPORTPEOPLEYNL:
      return {...state, loadPeople:false, people:[]}
    default:
      return state;
  }
};

export const getTopPersons = (data) => async (dispatch, getState) => {
  dispatch({ type: TOPPERSONS, loadTopPersons: true, payload: [] });
  await WebApiYnl.getTopPersons(data)
    .then((response) => {
      //console.log("response desde el redux TOP", response);
      dispatch({
        type: TOPPERSONS,
        loadTopPersons: false,
        payload: response.data.data.users ?? [],
      });
      return true;
    })
    .catch((error) => {
      console.log(error);
      dispatch({ type: TOPPERSONS, loadTopPersons: false, payload: [] });
      return false;
      //console.log(error);
    });
};

export const getDailyEmotions = (data) => async (dispatch, getState) => {
  dispatch({ type: DAILYEMOTIONS, loadDailyEmotions: true, payload: [] });
  await WebApiYnl.getDailyEmotions(data)
    .then((response) => {
      //console.log("response desde el redux EMOTIONS", response);
      dispatch({
        type: DAILYEMOTIONS,
        loadDailyEmotions: false,
        payload: response.data.data ?? [],
      });
      return true;
    })
    .catch((error) => {
      dispatch({ type: DAILYEMOTIONS, loadDailyEmotions: false, payload: [] });
      return false;
      //console.log(error);
    });
};

export const getEmotionalAspects = (data) => async (dispatch, getState) => {
  dispatch({ type: EMOTIONALASPECTS, loadEmotionalAspects: true, payload: [] });
  await WebApiYnl.getEmotionalAspects(data)
    .then((response) => {
      //console.log("response desde el redux EMOTIONAL ASPECTS", response.data.data);
      dispatch({
        type: EMOTIONALASPECTS,
        loadEmotionalAspects: false,
        payload: response.data.data ?? [],
      });
      return true;
    })
    .catch((error) => {
      dispatch({
        type: EMOTIONALASPECTS,
        loadEmotionalAspects: false,
        payload: [],
      });
      return false;
      //console.log(error);
    });
};

export const getReportUser = (data) => async (dispatch, getState) => {
  dispatch({ type: REPORTUSER, loadReportUser: true, payload: [] });
  await WebApiYnl.getReportUser(data)
    .then((response) => {
      //console.log("response desde el redux REPORT USER", response);
      dispatch({
        type: REPORTUSER,
        loadReportUser: false,
        payload: response.data ?? [],
      });
      return true;
    })
    .catch((error) => {
      dispatch({ type: REPORTUSER, loadReportUser: false, payload: [] });
      return false;
      //console.log(error);
    });
};

export const getEmotionChart = (data) => async (dispatch, getState) => {
  dispatch({
    type: EMOTIONCHART,
    loadEmotionChart: true,
    payload: [],
    stadistics: {},
  });
  await WebApiYnl.getEmotionChart(data)
    .then((response) => {
      //console.log("response desde el redux EMOTION CHART",response.data.data);
      let addCount = response?.data?.data.map(elemento => ({
        ...elemento,count: elemento.count || 0
      }))

      let resultsOrganized = addCount.sort((a, b) => {
        return Number.parseInt(b.count) - Number.parseInt(a.count);
      });
      //let addCount = resultsOrganized.forEach((elemento) => {
      //  if(!elemento.hasOwnProperty('count')){
      //    elemento.count = 0
      //  }
      //})
      let obj = {
        start_date: data.start_date,
        end_date: data.end_date,
        feeling: resultsOrganized[0],
      };
      //console.log('Mayor Valor: ', resultadosOrdenados[0]);
      dispatch({
        type: EMOTIONCHART,
        loadEmotionChart: false,
        payload: response.data.data ?? [],
        stadistics: obj,
      });
      return true;
    })
    .catch((error) => {
      dispatch({
        type: EMOTIONCHART,
        loadEmotionChart: false,
        payload: [],
        stadistics: {},
      });
      return false;
    });
};

export const getPersons = (data) => async (dispatch, getState) => {
  dispatch({ type: PERSONS, loadPersons: true, payload: [] });
  let dataSend = {}
  if(data === null) dataSend.ynl_type_response = 'NULL'
  else dataSend.ynl_type_response = data
  await WebApiYnl.getPersons(dataSend)
    .then((response) => {
      //console.log("respuesta desde el redux get persons",response.data.data);
      dispatch({
        type: PERSONS,
        loadPersons: false,
        payload: response?.data?.data ?? [],
      });
      return true;
    })
    .catch((error) => {
      dispatch({ type: PERSONS, loadPersons: true, payload: [] });
      return false;
    });
};

export const getReportPerson = (data) => async (dispatch, getState) => {
  let dates = data;
  dispatch({ type: REPORTPERSON, payload: [] });
  await WebApiYnl.getReportPerson(data)
    .then((response) => {
      console.log("response desde el redux REPORT PERSON", response);
      dispatch({ type: REPORTPERSON_FINISH, payload: response?.data });
      return true;
    })
    .catch((error) => {
      dispatch({ type: REPORTPERSON_FINISH, payload: [] });
      return false;
      //console.log(error);
    });
};

export const getStreakTop = (data) => async(dispatch) => {
  try {
    dispatch({type:LOADING})
    const streaks = await WebApiYnl.getToptenStreaks(data);
    dispatch({type: STREAK_TOP ,loadReportStreak: false,payload: streaks.data.data.slice(0,10)})
    console.log('datos de racha',streaks.data)
  } catch (e) {
    dispatch({type: REPORTSTREAK})
    console.log('error al obtener las rachas',e)
  }
}

export const getDataGraphGoal = (data) => async(dispatch) => {
  try {
    dispatch({type: LOADING})
    const dataGrap = await WebApiYnl.getDataGoalsGrap(data);
    dispatch({type: CHART_GOALS_DATA, loadChart:false, payload: dataGrap?.data?.data})
    console.log('datagrafica',dataGrap)
  } catch (e) {
    dispatch({type: CHARTREPORT})
    console.log('error al obtener datos de grafica',e)
  }
}

export const getTopGoals = (data) => async(dispatch) => {
  try {
    dispatch({type:LOADING})
    const goals = await WebApiYnl.getTopTenGoals(data);
    console.log('goals redux', goals.data)
    dispatch({type: GOALS, loadReportGoals: false, payload: goals.data.data.slice(0,10) })
  } catch (e) {
    dispatch({type: REPORTGOALS})
    console.log('error al obtener top 10 goals',e)

  }
}

export const getListPeopleYNL = (data) => async(dispatch) => {
  try {
    dispatch({type:LOADING})
    const people = await WebApiYnl.getPeopleYNL(data);
    console.log('data people ybl',people.data)
    dispatch({type: PEOPLEYNL, loadPeople: false, payload: people?.data})
  } catch (e) {
    dispatch({type: REPORTPEOPLEYNL})
    console.log('error al obtener peopel',e)
  }
}

export default ynlReducer;
