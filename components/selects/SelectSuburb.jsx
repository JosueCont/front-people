import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import WebApiFiscal from "../../api/WebApiFiscal";
const { Option } = Select;
const SelectSuburb = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Colonia",
  name,
  postal_code = null,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (postal_code) getSuburb();
  }, [postal_code]);

  const getSuburb = (description) => {
    setOptions([]);
    WebApiFiscal.getSuburb(description)
      .then((response) => {
        let suburbs = response.data.results.map((item) => {
          return {
            key: item.id + item.code,
            value: item.id,
            label: item.postal_code
              ? `${item.postal_code.state.name} - ${item.description}`
              : item.description,
          };
        });
        setOptions(suburbs);
      })
      .catch((e) => {
        setOptions([]);
        console.log(e);
      });
  };

  return (
    <Form.Item
      key="itemPlace"
      name={name ? name : "suburb"}
      label={viewLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        showSearch
        showArrow={false}
        notFoundContent={"No se encontraron resultados."}
        onSearch={getSuburb}
        filterOption={false}
        filterSort={false}
      >
        {options.length > 0 &&
          options.map((item) => {
            return (
              <>
                (
                <Option key={item.id} value={item.id}>
                  {item.label}
                </Option>
                ; )
              </>
            );
          })}
      </Select>
    </Form.Item>
  );
};

export default SelectSuburb;
