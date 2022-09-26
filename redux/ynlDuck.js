import axios from "axios";
import WebApiYnl from "../api/WebApiYnl";

const initialData = {
  fetching: false,
  loadTopPersons: false,
  topPersons: [],
  loadEmotionalAspects: false,
  emotionalAspects: [],
  loadDailyEmotions:false,
  dailyEmotions:[],
  loadReportUser: false,
  reportUser:[],
  loadEmotionChart:false,
  emotionChart: [],
  stadistics: {}
};

const TOPPERSONS = "TOPPERSONS";
const EMOTIONALASPECTS = "EMOTIONALASPECTS";
const DAILYEMOTIONS = "DAILYEMOTIONS";
const REPORTUSER = "REPORTUSER";
const EMOTIONCHART = "EMOTIONCHART";

const ynlReducer = (state = initialData, action) => {
  switch (action.type) {
    case TOPPERSONS:
      return{ ...state, loadTopPersons:action.fetching, topPersons:action.payload}
    case EMOTIONALASPECTS:
      return{ ...state, loadEmotionalAspects:action.fetching, emotionalAspects:action.payload}
    case DAILYEMOTIONS:
      return{ ...state, loadDailyEmotions:action.fetching, dailyEmotions:action.payload}
    case REPORTUSER:
      return{ ...state, loadReportUser:action.fetching, reportUser:action.payload}
    case EMOTIONCHART:
      return{ ...state, loadEmotionChart:action.fetching, emotionChart:action.payload, stadistics: action.stadistics}       
    default:
      return state;
  }
};

export const getTopPersons = (data) => 
    async(dispatch, getState) =>{
      dispatch({ type: TOPPERSONS, loadTopPersons: true, payload: [] });
      await WebApiYnl.getTopPersons(data)
      .then((response) => {
        //console.log("response desde el redux TOP", response);
        dispatch({ type: TOPPERSONS, loadTopPersons: false, payload: response.data.data.users ?? []});
        return true;
      })
      .catch((error) => {
        console.log("error", error);
        dispatch({ type: TOPPERSONS, loadTopPersons: false, payload: [] });
        return false;
        //console.log(error);
      });
  }

export const getDailyEmotions = (data) => 
  async(dispatch, getState) =>{
    dispatch({ type: DAILYEMOTIONS, loadDailyEmotions: true, payload: [] });
    await WebApiYnl.getDailyEmotions(data)
    .then((response) => {
      //console.log("response desde el redux EMOTIONS", response);
      dispatch({ type: DAILYEMOTIONS, loadDailyEmotions: false, payload: response.data.data ?? [] });
      return true;
    })
    .catch((error) => {
      dispatch({ type: DAILYEMOTIONS, loadDailyEmotions: false, payload: [] });
      return false;
      //console.log(error);
    });
}

export const getEmotionalAspects = (data) => 
  async(dispatch, getState) =>{
    dispatch({ type: EMOTIONALASPECTS, loadEmotionalAspects: true, payload: [] });
    await WebApiYnl.getEmotionalAspects(data)
    .then((response) => {
      //console.log("response desde el redux EMOTIONAL ASPECTS", response.data.data);
      dispatch({ type: EMOTIONALASPECTS, loadEmotionalAspects: false, payload: response.data.data ?? [] });
      return true;
    })
    .catch((error) => {
      dispatch({ type: EMOTIONALASPECTS, loadEmotionalAspects: false, payload: [] });
      return false;
      //console.log(error);
    });
}

export const getReportUser= (data) => 
  async(dispatch, getState) =>{
    dispatch({ type: REPORTUSER, loadReportUser: true, payload: [] });
    await WebApiYnl.getReportUser(data)
    .then((response) => {
      //console.log("response desde el redux REPORT USER", response);
      dispatch({ type: REPORTUSER, loadReportUser: false, payload: response.data ?? [] });
      return true;
    })
    .catch((error) => {
      dispatch({ type: REPORTUSER, loadReportUser: false, payload: [] });
      return false;
      //console.log(error);
    });
}

export const getEmotionChart = (data) =>
  async(dispatch, getState) =>{
    dispatch({ type: EMOTIONCHART, loadEmotionChart: true, payload: [], stadistics: {} });
    await WebApiYnl.getEmotionChart(data)
    .then((response) => {
      //console.log("response desde el redux EMOTION CHART",response.data.data);
      let resultsOrganized = response?.data?.data?.sort((a,b) =>{
        return Number.parseInt(b.count) - Number.parseInt(a.count)
      })
      let obj = { start_date:data.start_date, end_date: data.end_date, feeling: resultsOrganized[0]};
      //console.log('Mayor Valor: ', resultadosOrdenados[0]);
      dispatch({ type: EMOTIONCHART, loadEmotionChart: false, payload: response.data.data ?? [], stadistics: obj});
      return true;
    })
    .catch((error) =>{
      dispatch({ type: EMOTIONCHART, loadEmotionChart: false, payload: [], stadistics: {} });
      return false;
    }) 
  }

export default ynlReducer;
