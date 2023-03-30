import { Select, Form } from "antd";
import { genders } from "../../utils/constant";
const { Option } = Select;

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
          // options={genders}
          placeholder="Género"
          allowClear
          style={style ? style : {}}
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
        >
          {genders.map((item) => {
            return (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
            );
          })}
        </Select>
      </Form.Item>
    </>
  );
};

export default SelectGender;
