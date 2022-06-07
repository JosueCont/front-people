import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";

const SelectTypeTax = ({ rules = [], ...props }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (props.type_tax) {
      let data = props.type_tax.map((item) => {
        return {
          value: item.id,
          label: item.description,
          key: item.description + item.id,
        };
      });
      setOptions(data);
    }
  }, [props.type_tax]);

  return (
    <Form.Item
      key={"SelectTypeTax"}
      name={props.name ? props.name : "type_tax"}
      label={props.label ? props.label : "Tipo de impuesto"}
      rules={rules}
    >
      <Select
        key="SelectTypeTax"
        placeholder="Tipo de impuesto"
        style={props.style ? props.style : { width: "100% !important" }}
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
};

const mapState = (state) => {
  return {
    type_tax: state.fiscalStore.type_tax,
  };
};
export default connect(mapState)(withAuthSync(SelectTypeTax));
