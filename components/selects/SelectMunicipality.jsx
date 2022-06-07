import { connect } from "react-redux";
import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import WebApiFiscal from "../../api/WebApiFiscal";

const SelectMunicipality = ({
  viewLabel = true,
  disabled = false,
  rules = [],
  labelText = "Municipio",
  name = "municipality",
  state = null,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [municipality, setMunicipality] = useState([]);

  useEffect(() => {
    if (state) {
      getMunicipality();
    }
  }, [state]);

  const getMunicipality = () => {
    WebApiFiscal.getMunicipality(state)
      .then((response) => {
        console.log(response.data.results);
        setMunicipality(response.data.results);
        let municipalities = response.data.results.map((item) => {
          return { value: item.id, label: item.description };
        });
        setOptions(municipalities);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Form.Item
      key="itemPlace"
      name={name}
      label={viewLabel ? labelText : ""}
      rules={rules}
    >
      <Select
        disabled={disabled}
        key="SelectMunicipality"
        // options={options}
        placeholder="Municipio"
        allowClear
        style={props.style ? props.style : {}}
        onChange={props.onChange ? props.onChange : null}
        notFoundContent={"No se encontraron resultados."}
        showSearch
        optionFilterProp="children"
      >
        {options.map((item) => {
          return (
            <>
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
              ;
            </>
          );
        })}
      </Select>
    </Form.Item>
  );
};

export default SelectMunicipality;
