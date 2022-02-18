import axios from "axios";
import { LOGIN_URL } from "../config/config";
import { headersApiKhonnect } from "../utils/constant";

export const getGroups = async (node, type = 1) => {
  let group = [];
  await axios
    .get(LOGIN_URL + `/group/list/?company=${node}`, {
      headers: headersApiKhonnect,
    })
    .then((response) => {
      if (response.status === 200) {
        group = response.data.data;
      }
    })
    .catch((e) => {
      return false;
    });
  return group;
};

export const getGroupPerson = async (config, khonnect_id) => {
  let groups = [];
  await axios
    .post(
      config.url_server_khonnect + `/user/get-info/`,
      {
        user_id: khonnect_id,
      },
      {
        headers: headersApiKhonnect,
      }
    )
    .then((response) => {
      if (response.data.data.groups[0]) {
        let array_group = response.data.data.groups;
        groups = array_group.map((a) => {
          return a._id.$oid;
        });
      }
    })
    .catch((e) => {
      return [];
    });
  console.log("GURPOS PERSON-->> ", groups);
  return groups;
};

export const deleteGroups = async (config, data) => {
  let return_data = false;
  await axios
    .post(config.url_server_khonnect + `/group/delete/`, data, {
      headers: headersApiKhonnect,
    })
    .then(function (response) {
      if (response.status === 200) {
        if (response.data.level == "associated") {
          return_data = "associated";
        } else {
          return_data = true;
        }
      }
    })
    .catch(function (error) {
      return_data = false;
    });
  return return_data;
};

export const createGroup = async (config, data) => {
  let return_data = false;
  await axios
    .post(config.url_server_khonnect + "/group/create/", data, {
      headers: headersApiKhonnect,
    })
    .then(function (response) {
      return_data = true;
    })
    .catch(function (error) {
      return_data = false;
    });
  return return_data;
};

export const editGroups = async (config, data) => {
  let return_data = false;

  await axios
    .post(config.url_server_khonnect + "/group/edit/", data, {
      headers: headersApiKhonnect,
    })
    .then(function (response) {
      return_data = true;
    })
    .catch(function (error) {
      return_data = false;
    });
  return return_data;
};

export const getGroupById = async (config, data) => {
  let return_data = false;

  await axios
    .post(config.url_server_khonnect + "/group/get/", data, {
      headers: headersApiKhonnect,
    })
    .then((response) => {
      return_data = response.data.data;
    })
    .catch((e) => {
      return_data = false;
    });
  return return_data;
};
