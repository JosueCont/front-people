import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { route } from "next/dist/next-server/server/router";

export default function SelectCompany(props) {
  const [options, setOptions] = useState(null);
  const route = useRouter();

  const getCompanies = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results;
      let options = [];
      data.map((item) => {
        options.push({
          value: item.id,
          label: item.name,
          key: item.name + item.id,
        });
      });
      setOptions(options);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, [route]);

  return (
    <Select
      key="SelectCompany"
      placeholder="Empresa"
      style={props.style ? props.style : null}
      options={options}
      onChange={props.onChange}
      allowClear
    />
  );
}
