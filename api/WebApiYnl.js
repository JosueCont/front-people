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
}

export default WebApiYnl;