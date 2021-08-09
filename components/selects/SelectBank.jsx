import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectBank(props) {
  const [options, setOptions] = useState(null);
  const route = useRouter();

  const getBanks = async () => {
    try {
      let response = await Axios.get(API_URL + `/setup/banks/`);
      let data = response.data.results;
      let options = [];
      data = data.map((item) => {
        return {
          value: item.id,
          label: item.name,
          key: item.name + item.id,
        };
      });
      setOptions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBanks();
  }, [route]);

  return (
    <Form.Item
      key={"SelectBank"}
      name={props.name ? props.name : "bank"}
      label={props.label ? props.label : "Banco"}
    >
      <Select
        key="SelectBank"
        placeholder="Banco"
        style={props.style ? props.style : null}
        options={options}
        onChange={props.onChange ? props.onChange : null}
        allowClear
        notFoundContent={"No se encontraron resultado."}
      />
    </Form.Item>
  );
}
