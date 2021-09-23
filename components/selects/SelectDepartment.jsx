import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { connect } from "react-redux";

const SelectDepartment = ({
  titleLabel = true,
  rules = [],
  companyId,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  const { Option } = Select;

  const getDepartament = async () => {
    try {
      let response = await Axios.get(
        API_URL + `/business/node/${companyId}/department_for_node/`
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
};

const mapState = (state) => {
  return {
    cat_departments: state.catalogStore.cat_departments,
  };
};

export default connect(mapState)(SelectDepartment);
