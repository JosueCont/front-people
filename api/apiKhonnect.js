import axios from "axios";
import { APP_ID, LOGIN_URL, client_khonnect_id } from "../config/config";
import { headersApi } from "../utils/constant";

export const getGroups = async (node) => {
  let group = [];
  await axios
    .get(LOGIN_URL + `/group/list/?company=${node}`, {
      headers: headersApi(),
    })
    .then((response) => {
      if (response.status === 200) {
        group = response.data.data;
        group = group.map((a) => {
          return { label: a.name, value: a.id };
        });
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
        headers: {
          "client-id": config.client_khonnect_id,
          "Content-Type": "application/json",
        },
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
  return groups;
};
