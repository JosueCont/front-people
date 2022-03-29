import WebApi from "./webApi";

class WebApiIntranet {
  static publigationList(data) {
    return WebApi.ApisType(`/intranet/post/${data}`, "get");
  }

  static excelFileAction(node, data) {
    return WebApi.ApisType(
      `/intranet/post/?node=${node}&export=true${data}`,
      "get"
    );
  }

  static updateStatusPost(postId, data) {
    return WebApi.ApisType(`/intranet/post/${postId}/`, "patch", data);
  }

  static getGroupList(data) {
    return WebApi.ApisType(`/intranet/group/?node=${data}`, "get");
  }

  static saveGroup(data) {
    return WebApi.ApisType(`/intranet/group/`, "post", data);
  }

  static updGroup(groupId, data) {
    return WebApi.ApisType(`/intranet/group/${groupId}/`, "patch", data);
  }

  static getUsersList(data) {
    return WebApi.ApisType(`/intranet/search-person/?node=${data}`, "get");
  }

  static getConfig(data) {
    return WebApi.ApisType("/setup/site-configuration/", "get");
  }

  static saveIntranetConfig(data) {
    return WebApi.ApisType("/setup/site-configuration/", "post", data);
  }

  static updIntranetConfig(id, data) {
    return WebApi.ApisType(`/setup/site-configuration/${id}/`, "put", data);
  }

  static getUserIntranet(id) {
      return WebApi.ApisType(`/intranet/person-profile/?khonnect_id=${id}`, "get");
  }
}
export default WebApiIntranet;
