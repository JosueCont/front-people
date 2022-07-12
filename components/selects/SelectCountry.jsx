import { connect } from "react-redux";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import WebApiFiscal from "../../api/WebApiFiscal";
const SelectCountry = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "País",
  name,
  ...props
}) => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (props.versionCfdi) getCountries();
  }, [props.versionCfdi]);

  const getCountries = () => {
    WebApiFiscal.getCountries(props.versionCfdi)
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
        placeholder="País"
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
    versionCfdi: state.fiscalStore.version_cfdi,
  };
};

export default connect(mapState)(SelectCountry);
