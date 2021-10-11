import { Select, Form } from "antd";
import { generateYear } from "../../utils/constant";

const SelectYear = ({ titleLabel = true, rules = [], companyId, ...props }) => {
  return (
    <>
      <Form.Item
        key="ItemPeriod"
        name={props.name ? props.name : "period"}
        label={titleLabel ? "Periodo" : ""}
        rules={rules}
      >
        <Select
          key="SelectPeriod"
          options={generateYear()}
          placeholder="Periodo"
          allowClear
          style={props.style ? props.style : {}}
          notFoundContent={"No se encontraron resultados."}
        />
      </Form.Item>
    </>
  );
};

export default SelectYear;
