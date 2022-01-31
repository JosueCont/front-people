import { connect } from "react-redux";
import { Form, Select } from "antd";

const SelectWorkTitle = ({
  titleLabel = true,
  disabled = false,
  rules = [],
  labelText = "Plaza laboral",
  ...props
}) => {
  return (
    <Form.Item
      key="itemPlace"
      name={"work_title"}
      label={titleLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        key="SelectPlace"
        options={props.work_title}
        placeholder="Plaza laboral"
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={"No se encontraron resultados."}
      />
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    work_title: state.catalogStore.work_title,
  };
};

export default connect(mapState)(SelectWorkTitle);
