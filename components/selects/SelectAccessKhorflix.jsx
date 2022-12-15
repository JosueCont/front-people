import React from "react";
import { Form, Select } from "antd";
import { KhorflixAccess } from "../../utils/constant";
import { ruleRequired } from "../../utils/rules";

const SelectAccessKhorflix = ({
  viewLabel = false,
  onChange,
  value,
  ...props
}) => {
  return (
    <Select
      defaultValue={value||undefined}
      onChange={onChange}
      options={KhorflixAccess}
    />
  );
};

export default SelectAccessKhorflix;
