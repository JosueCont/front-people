import { Select, Form } from "antd";
import { genders } from "../../utils/constant";

const SelectGender = ({
  viewLabel = true,
  rules = [],
  companyId,
  name = null,
  size = null,
  style = null,
  ...props
}) => {
  return (
    <>
      <Form.Item
        key="ItemGender"
        name={name ? name : "gender"}
        label={viewLabel ? "Género" : ""}
        rules={rules}
      >
        <Select
          size={size ? size : "middle"}
          key="SelectGender"
          options={genders}
          placeholder="Género"
          allowClear
          style={style ? style : {}}
          notFoundContent={"No se encontraron resultados."}
        />
      </Form.Item>
    </>
  );
};

export default SelectGender;
