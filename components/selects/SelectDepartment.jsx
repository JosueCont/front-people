import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";

const SelectDepartment = ({
  disabled,
  viewLabel = true,
  rules = [],
  size = "middle",
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
          // options={options}
          size={size}
          //placeholder="Departamento"
          allowClear
          style={props.style ? props.style : {}}
          onChange={props.onChange ? props.onChange : null}
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
          mode={props.multiple ? "multiple" : null}
          maxTagCount="responsive"
        >
          {options.map((item) => {
            return (
                <Option key={item.key} value={item.value}>
                  {item.label}
                </Option>
            );
          })}
        </Select>
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
