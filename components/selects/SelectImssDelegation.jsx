import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectImssDelegation = ({
  disabled,
  viewLabel = true,
  rules = [],
  size = "middle",
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([]);
    if (props.cat_imss_delegation) {
      let data = props.cat_imss_delegation.map((item, index) => {
        return {
          label: item.description,
          value: item.id,
          key: item.id + index,
        };
      });
      setOptions(data);
    }
  }, [props.cat_imss_delegation]);

  return (
    <>
      <Form.Item
        key={"imss_delegation"}
        name={props.name ? props.name : "imss_delegation"}
        label={viewLabel ? "Delegaciones IMSS" : ""}
        rules={rules}
      >
        <Select
          disabled={disabled}
          key="SelectImssDelegation"
          size={size}
          placeholder="Delegaciones IMSS"
          allowClear
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
          {...props}
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
    </>
  );
};

const mapState = (state) => {
  return {
    cat_imss_delegation: state.fiscalStore.cat_imss_delegation,
  };
};

export default connect(mapState)(SelectImssDelegation);
