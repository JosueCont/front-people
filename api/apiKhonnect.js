import axios from "axios";
import { APP_ID, LOGIN_URL } from "../config/config";
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
