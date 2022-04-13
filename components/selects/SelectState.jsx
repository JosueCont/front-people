import { connect } from "react-redux";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import WebApiFiscal from "../../api/WebApiFiscal";

const SelectState = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Estado",
  name,
  setState,
  country = null,
  ...props
}) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    getStates();
  }, []);

  const getStates = (country) => {
    WebApiFiscal.getStates(country)
      .then((response) => {
        if (response.data.results.length > 0) {
          let states = response.data.results.map((a) => {
            return { value: a.id, label: a.name_state };
          });
          setOptions(states);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Form.Item
      key="itemPlace"
      name={name ? name : "state"}
      label={viewLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        key="SelectState"
        options={options}
        placeholder="Estado"
        allowClear
        style={props.style ? props.style : {}}
        onChange={(value) => (setState ? setState(value) : null)}
        notFoundContent={"No se encontraron resultados."}
      />
    </Form.Item>
  );
};

export default SelectState;
