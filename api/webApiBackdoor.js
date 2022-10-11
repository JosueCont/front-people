import WebApi from "./webApi";

class WebApiBackdoor {
    static updateConfiguration(data){
        return WebApi.ApisType(
            `/backdoor/update-configuration`, "post", data)
    }

    static getConfigurationBackdoor(node,status) {
        return WebApi.ApisType(
            `backdoor/node-app/?node=${node}&&status=${status}`, "get");
    }

}

export default WebApiBackdoor;