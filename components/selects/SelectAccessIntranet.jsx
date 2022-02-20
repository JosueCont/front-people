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
    <Form.Item
      key="itemAccessIntranet"
      label={viewLabel ? "Acceso a la intranet" : ""}
      name="intranet_access"
      rules={[ruleRequired]}
    >
      <Select
        defaultValue={value}
        onChange={onChange}
        options={intranetAccess}
        placeholder="Acceso a la intranet"
      />
    </Form.Item>
  );
};

export default SelectAccessIntranet;
