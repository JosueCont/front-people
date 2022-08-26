import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectFamilyMedicalUnit = ({
  disabled,
  viewLabel = true,
  rules = [],
  size = "middle",
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([]);
    if (props.cat_imss_subdelegation) {
      let data = props.cat_imss_subdelegation.map((item, index) => {
        return {
          label: item.code,
          value: item.id,
          key: item.id + index,
        };
      });
      setOptions(data);
    }
  }, [props.cat_imss_subdelegation]);

  return (
    <>
      <Form.Item
        key={"umf"}
        name={props.name ? props.name : "job"}
        label={viewLabel ? "Unidad medica familiar" : ""}
        rules={rules}
      >
        <Select
          disabled={disabled}
          key="SelectFamilyMedicalUnit"
          size={size}
          placeholder="Unidad medica familiar"
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
    cat_family_medical_unit: state.fiscalStore.cat_family_medical_unit,
  };
};

export default connect(mapState)(SelectFamilyMedicalUnit);
