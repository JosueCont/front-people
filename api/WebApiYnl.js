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

  static getPersons(data){
    return WebApi.ApisType(`/ynl/get-selects-persons/`, "post", data);
  }

  static getReportPerson(data){
    return WebApi.ApisType(`/ynl/report/personal-report/`, "post", data);
  }

  static getSelectsData(){
    return WebApi.ApisType(`/ynl/get-selects-data/`, "get");
  }

  static synchronizePersonYNL(data){
    return WebApi.ApisType(`/ynl/register/multiple-people/`, "post", data)
  }

  static getToptenStreaks(data){
    return WebApi.ApisType('/ynl/report/top-streaks/', 'post', data)
  }

  static getDataGoalsGrap(data){
    return WebApi.ApisType('/ynl/report/objectives-chart/', "post", data)
  }

  static getTopTenGoals(data){
    return WebApi.ApisType('/ynl/report/plans-report/', 'post', data)
  }

  static getPeopleYNL(data){
    return WebApi.ApisType('/ynl/get-ynl-persons/', 'post', data)
  }
}

export default WebApiYnl;