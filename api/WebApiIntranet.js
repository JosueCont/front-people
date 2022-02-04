import WebApi from "./webApi";

class WebApiIntranet {
  static publigationList(data) {
    return WebApi.ApisType(`/intranet/post/${data}`, "get");
  }
}
export default WebApiIntranet;
