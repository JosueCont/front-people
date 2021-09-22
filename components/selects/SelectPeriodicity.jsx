import { Select, Form } from "antd";
import { periodicityNom } from "../../utils/constant";

const SelectPeriodicity = ({
  titleLabel = true,
  rules = [],
  companyId,
  ...props
}) => {
  return (
    <>
      <Form.Item
        key="ItemPeriodicity"
        name={props.name ? props.name : "periodicity"}
        label={titleLabel ? "Periocidad" : ""}
        rules={rules}
      >
        <Select
          key="SelectPeriodicity"
          options={periodicityNom}
          placeholder="Periocidad"
          allowClear
          style={props.style ? props.style : {}}
          notFoundContent={"No se encontraron resultados."}
        />
      </Form.Item>
    </>
  );
};

export default SelectPeriodicity;
