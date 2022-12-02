import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
const { Option } = Select;
import WebApiFiscal from "../../api/WebApiFiscal";

const SelectMedicineUnity = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Unidad de medicina familiar",
  name = "medicine_unity",
  ...props
}) => {
  useEffect(() => {
    FamilyMedicalUnits();
  }, []);

  const FamilyMedicalUnits = async () => {
    await WebApiFiscal.FamilyMedicalUnit()
      .then((response) => {})
      .catch((error) => {
        console.log("Error", error);
      });
  };

  return (
    <Form.Item
      key="medicine_unity"
      name={name}
      label={viewLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        placeholder="Unidad de medicina familiar"
        key="selected_unity"
        allowClear
        notFoundContent={"No se encontraron resultados."}
        showSearch
        optionFilterProp="children"
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
      ></Select>
    </Form.Item>
  );
};

export default SelectMedicineUnity;
