import React from "react";
import { Form, Select } from "antd";
import { SukhaAccess } from "../../utils/constant";
import { ruleRequired } from "../../utils/rules";

const SelectAccessSukha = ({
  viewLabel = false,
  onChange,
  value,
  ...props
}) => {
  return (
    <Select
      defaultValue={value||undefined}
      onChange={onChange}
      options={SukhaAccess}
      //placeholder="Acceso a Khor Connect"
    />
  );
};

export default SelectAccessSukha;
