import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
import { FamilyMedicalUnit } from "../../redux/fiscalDuck";
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
    props.FamilyMedicalUnit
  },[])

  useEffect(() => {
    setOptions([]);
    if (props.cat_family_medical_unit) {
      let data = props.cat_family_medical_unit.map((item, index) => {
        return {
          label: item.description,
          value: item.id,
          key: item.id + index,
        };
      });
      setOptions(data);
    }
  }, [props.cat_family_medical_unit]);

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

export default connect(mapState, { FamilyMedicalUnit })(SelectFamilyMedicalUnit);
