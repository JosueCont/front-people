import WebApi from "./webApi";

class WebApiIntranet {
  static publigationList(data) {
    return WebApi.ApisType(`/intranet/post/${data}`, "get");
  }

  static excelFileAction(node, data) {
    return WebApi.ApisType(
      `/intranet/post/?node=${node}&&export=true${data}`,
      "get"
    );
  }

  static updateStatusPost(postId, data){
    return WebApi.ApisType(`/intranet/post/${postId}/`, "patch", data);
  }

  static getGroupList(data) {
    return WebApi.ApisType(`/intranet/group/?node=${data}`, "get");
  }

  static getUsersList(data) {
    return WebApi.ApisType(`/intranet/search-person/?node=${data}`, "get");
  }
}
export default WebApiIntranet;
