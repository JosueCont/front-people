import axios from "axios";
import WebApiIntranet from "../api/WebApiIntranet";

const initialData = {
  fetching: false,
  publicationsList: [],
  excelFileStatus: null,
  error: "",
};

const LOADING_PUBLICATIONS_LIST = "LOADING_PUBLICATIONS_LIST";
const SUCCESS_PUBLICATIONS_LIST = "SUCCESS_PUBLICATIONS_LIST";
const ERROR_PUBLICATIONS_LIST = "ERROR_PUBLICATIONS_LIST";
// Variables Excel
const LOADING_FILE = "LOADING_FILE";
const SUCCESS_FILE = "SUCCESS_FILE";
const ERROR_FILE = "ERROR_FILE";

const publicationsListReducer = (state = initialData, action) => {
  switch (action.type) {
    case LOADING_PUBLICATIONS_LIST:
      return { ...state, fetching: false, publicationsList: [] };
    case SUCCESS_PUBLICATIONS_LIST:
      return { ...state, fetching: false, publicationsList: action.payload };
    case ERROR_PUBLICATIONS_LIST:
      return { ...state, fetching: false, publicationsList: [] };
    case LOADING_FILE:
      return { ...state, fetching: true, excelFileStatus: action.payload };
    case SUCCESS_FILE:
      return { ...state, fetching: false, excelFileStatus: action.payload };
    case ERROR_FILE:
      return { ...state, fetching: false, excelFileStatus: action.payload };
    default:
      return state;
  }
};

export const publicationsListAction =
  (node, page = "", parameters = "", queryParam = "") =>
  async (dispatch, getState) => {
    dispatch({ type: LOADING_PUBLICATIONS_LIST });
    let data = `?node=${node}${
      page && page != "" ? `&page=${page}` : ""
    }${parameters && parameters !== "" ? parameters : ''}&is_moderator_view=true&${queryParam ?? ""}`;
    await WebApiIntranet.publigationList(data)
      .then(({ status, data }) => {
        let dataAndResults = {
          data: data,
          results: data.results,
        };
        if (status == 200) {
          dispatch({
            type: SUCCESS_PUBLICATIONS_LIST,
            payload: dataAndResults,
          });
        } else {
          dispatch({
            type: ERROR_PUBLICATIONS_LIST,
            payload: "Error getting publications list",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: ERROR_PUBLICATIONS_LIST,
          payload: "Error getting publications list",
        });
      });
  };

export const getExcelFileAction =
  (node, params = "") =>
  async (dispatch, getState) => {
    dispatch({ type: LOADING_FILE, fetching: true, payload: "loading" });
    await WebApiIntranet.excelFileAction(node, params)
      .then((response) => {
        let regexResponseContent = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
        if (
          response.status == 200 &&
          regexResponseContent.test(response.data)
        ) {
          const type = response.headers["content-type"];
          const blob = new Blob([response.data], {
            type: type,
            enconding: "UTF-8",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "Estadisticas.csv";
          link.click();
          dispatch({
            type: SUCCESS_FILE,
            payload: blob,
          });
        } else {
          dispatch({
            type: ERROR_FILE,
            payload: "failed",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: ERROR_FILE,
          payload: "failed",
        });
      });
  };
export default publicationsListReducer;
