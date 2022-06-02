import { Select, Form } from "antd";
import { generateYear } from "../../utils/functions";

const SelectYear = ({
  viewLabel = true,
  rules = [],
  placeholder = "Periodo",
  ...props
}) => {
  return (
    <>
      <Form.Item
        key="ItemPeriod"
        name={props.name ? props.name : "period"}
        label={viewLabel ? props.label : "Periodo"}
        rules={rules}
      >
        <Select
          size={props.size ? props.size : "middle"}
          key="SelectPeriod"
          options={generateYear()}
          placeholder={placeholder}
          allowClear
          style={props.style ? props.style : {}}
          notFoundContent={"No se encontraron resultados."}
        />
      </Form.Item>
    </>
  );
};

export default SelectYear;
