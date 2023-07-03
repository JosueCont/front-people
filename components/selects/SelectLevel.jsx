import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectLevel = ({
  disabled,
  viewLabel = true,
  rules = [],
  value_form = "id",
  textLabel = null,
  multiple=false,
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([]);
    if (props.cat_level) {
      let data = props.cat_level.map((item, index) => {
        return {
          label: item.name,
          value: value_form == "order" ? item.order : item.id,
          key: item.id + index,
        };
      });
      setOptions(data);
    }
  }, [props.cat_level]);

  return (
    <>
      <Form.Item
        key={"ItemLevel"}
        name={props.name ? props.name : "level"}
        label={viewLabel ? (textLabel ? textLabel : "Nivel") : ""}
        rules={rules}
      >
        <Select
          disabled={disabled}
          key="SelectLevel"
          // options={options}
          placeholder="Nivel"
          allowClear
          style={props.style ? props.style : {}}
          onChange={props.onChange ? props.onChange : null}
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
          mode={multiple&&'multiple'}
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
    </>
  );
};

const mapState = (state) => {
  return {
    cat_level: state.catalogStore.cat_level,
  };
};

export default connect(mapState)(SelectLevel);
