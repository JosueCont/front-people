import React from "react";
import { Form, Select } from "antd";
import { intranetAccess } from "../../utils/constant";
import { ruleRequired } from "../../utils/rules";

const SelectAccessIntranet = ({
  viewLabel = false,
  onChange,
  value,
  ...props
}) => {
  return (
    <Select
      defaultValue={value||undefined}
      onChange={onChange}
      options={intranetAccess}
      //placeholder="Acceso a Khor Connect"
    />
  );
};

export default SelectAccessIntranet;
