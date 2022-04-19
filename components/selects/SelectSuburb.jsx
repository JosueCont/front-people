import { connect } from "react-redux";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import WebApiFiscal from "../../api/WebApiFiscal";

const SelectSuburb = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Colonia",
  name,
  postal_code,
  ...props
}) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = () => {
    WebApiFiscal.getSuburb(postal_code)
      .then((response) => {
        let suburbs = response.data.results.map((item) => {
          return { value: item.id, label: item.description };
        });
        setOptions(suburbs);
      })
      .catch((e) => {
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
        disabled={disabled}
        key="SelectSuburb"
        options={options}
        placeholder="Colonia"
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={"No se encontraron resultados."}
      />
    </Form.Item>
  );
};

export default SelectSuburb;
