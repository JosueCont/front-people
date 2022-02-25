import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, Select } from "antd";
import { workTitleStatus } from "../../utils/constant";

const SelectWorkTitleStatus = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  companyId,
  ...props
}) => {
  return (
    <Form.Item
      key="itemWorkTitleStatus"
      name={"status_work_title"}
      label={viewLabel ? "Estatus de plaza laboral" : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        key="SelectWorkTitleStatus"
        options={workTitleStatus}
        placeholder="Estatus de Plaza laboral"
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={"No se encontraron resultados."}
      />
    </Form.Item>
  );
};

export default SelectWorkTitleStatus;
