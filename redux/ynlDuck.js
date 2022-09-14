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
  emotionChart: []
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
      return{ ...state, loadEmotionChart:action.fetching, emotionChart:action.payload}       
    default:
      return state;
  }
};

export const getTopPersons = (data) => 
    async(dispatch, getState) =>{
      dispatch({ type: TOPPERSONS, loadTopPersons: true, payload: [] });
      await WebApiYnl.getTopPersons(data)
      .then((response) => {
        console.log("response desde el redux TOP", response);
        dispatch({ type: TOPPERSONS, loadTopPersons: false, payload: response.data.data.users ?? [] });
        return true;
      })
      .catch((error) => {
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
      console.log("response desde el redux EMOTIONS", response);
      dispatch({ type: DAILYEMOTIONS, loadDailyEmotions: false, payload: response.data.data });
      return true;
    })
    .catch((error) => {
      dispatch({ type: DAILYEMOTIONS, loadDailyEmotions: false, payload: [] });
      return false;
      //console.log(error);
    });
}

export default ynlReducer;
