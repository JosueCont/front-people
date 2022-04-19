import { connect } from "react-redux";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import WebApiFiscal from "../../api/WebApiFiscal";

const SelectCountry = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Pais",
  name,
  ...props
}) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = () => {
    WebApiFiscal.getCountries()
      .then((response) => {
        let countries = response.data.results.map((item) => {
          return { value: item.id, label: item.description };
        });
        setOptions(countries);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Form.Item
      key="itemPlace"
      name={name ? name : "country"}
      label={viewLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        key="SelectCountry"
        options={options}
        placeholder="Pais"
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={"No se encontraron resultados."}
      />
    </Form.Item>
  );
};

export default SelectCountry;
