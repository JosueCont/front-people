import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { connect } from "react-redux";

const SelectDepartment = ({
  disabled,
  viewLabel = true,
  rules = [],
  companyId,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  const { Option } = Select;

  useEffect(() => {
    setOptions([]);
    if (props.cat_departments) {
      let data = props.cat_departments.map((item) => {
        return {
          value: item.id,
          label: item.name,
          key: item.name + item.id,
        };
      });
      setOptions(data);
    }
  }, [props.cat_departments]);

  return (
    <>
      <Form.Item
        key="ItemDepartment"
        name={props.name ? props.name : "department"}
        label={viewLabel ? "Departamento" : ""}
        rules={rules}
      >
        <Select
          disabled={disabled}
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
};

const mapState = (state) => {
  return {
    cat_departments: state.catalogStore.cat_departments,
  };
};

export default connect(mapState)(SelectDepartment);
