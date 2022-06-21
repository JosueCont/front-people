import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectCompany(props) {
  const [options, setOptions] = useState([]);
  const route = useRouter();

  const getCompanies = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
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
    getCompanies();
  }, [route]);

  return (
    <Form.Item
      key={"Selectcompany"}
      name={props.name ? props.name : "company"}
      label={props.label ? props.label : "Empresa"}
      labelCol={props.labelCol ? props.labelCol : null}
      rules={props.rules ? props.rules : null}
    >
      <Select
        key="SelectCompany"
        placeholder="Empresa"
        style={props.style ? props.style : null}
        // options={options}
        onChange={props.onChange ? props.onChange : null}
        allowClear
        notFoundContent={"No se encontraron resultados."}
        showSearch
        optionFilterProp="children"
      >
        {options.map((item) => {
          return (
            <>
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
              ;
            </>
          );
        })}
      </Select>
    </Form.Item>
  );
}
