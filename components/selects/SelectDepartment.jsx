import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectDepartment({
  item = true,
  titleLabel = true,
  rules = [],
  ...props
}) {
  const [options, setOptions] = useState([]);

  const { Option } = Select;

  const getDepartament = async () => {
    try {
      let response = await Axios.get(
        API_URL + `/business/node/${props.companyId}/department_for_node/`
      );
      let data = response.data;
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
    setOptions([]);
    if (props.companyId) {
      getDepartament();
    }
  }, [props.companyId]);

  return (
    <>
      <Form.Item
        key="ItemDepartment"
        name={props.name ? props.name : "department"}
        label={titleLabel ? "Departamento" : ""}
        rules={rules}
      >
        <Select
          key="SelectDepartament"
          options={options}
          placeholder="Departamento"
          allowClear
          style={props.style ? props.style : {}}
          onChange={props.onChange ? props.onChange : null}
          notFoundContent={"No se encontraron resultados."}
        />
      </Form.Item>
    </>
  );
}
