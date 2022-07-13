import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
const { Option } = Select;
const SelectTaxRegime = ({ taxRegimeSelected = null, ...props }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (props.tax_regime) {
      let data = props.tax_regime.map((item) => {
        return {
          value: item.id,
          label: item.description,
          key: item.description + item.id,
        };
      });
      setOptions(data);
    }
  }, [props.tax_regime]);

  return (
    <Form.Item
      key={"SelectTaxRegime"}
      name={props.name ? props.name : "tax_regime"}
      label={props.label ? props.label : "Régimen fiscal"}
    >
      <Select
        key="SelectTaxRegime"
        placeholder="Régimen fiscal"
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
};

const mapState = (state) => {
  return {
    tax_regime: state.fiscalStore.tax_regime,
  };
};
export default connect(mapState)(withAuthSync(SelectTaxRegime));
