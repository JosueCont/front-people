import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectDepartment(props) {
  const [options, setOptions] = useState([]);
  const [companyId, setCompanyId] = useState(props.companyId);

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
    <Form.Item
      key="ItemDepartment"
      name={props.name ? props.name : "department"}
      label="Departamento"
    >
      <Select
        key="SelectDepartament"
        style={props.style ? props.style : { width: 150 }}
        options={options}
        allowClear
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={"No se encontraron resultado."}
      />
    </Form.Item>
  );
  /* return (
              <Select key="SelectDepartament" style={{ width:150 }} options={options} onChange={props.onchange ? props.onChange : null} allowClear />
      ) */
}
