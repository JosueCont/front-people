import WebApi from "./webApi";

class WebApiYnl {
  static getJobs(data) {
    return WebApi.ApisType(`/business/job/?node=${data}`, "get");
  }
  static getDepartamentsToYnl(node,isActive){
    return WebApi.ApisType(
      `/business/department/?node=${node}&active=${isActive}`,"get"
    );
  }
  
  static getPeoplesToYnl(node,isActive,isDeleted,ynlAccess){
    return WebApi.ApisType(
      `/person/person/?node=${node}&is_active=${isActive}&is_deleted=${isDeleted}&ynl_access=${ynlAccess}`,"get"
    );
  }

  static getTopPersons(data){
    return WebApi.ApisType(`/ynl/report/top-persons/`, "post", data);
  }

  static getEmotionalAspects(data){
    return WebApi.ApisType(`/ynl/report/emotional-aspects/`, "post", data);
  }

  static getDailyEmotions(data){
    return WebApi.ApisType(`/ynl/report/daily-emotions/`, "post", data);
  }

  static getReportUser(data){
    return WebApi.ApisType(`/ynl/report/user/`, "post", data);
  }

  static getEmotionChart(data){
    return WebApi.ApisType(`/ynl/report/emotions-chart/`, "post", data);
  }

  static getPersons(){
    return WebApi.ApisType(`/ynl/get-selects-persons/`, "get");
  }
}

export default WebApiYnl;