import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";

const SelectLevel = ({
  disabled,
  viewLabel = true,
  rules = [],
  value_form = "id",
  textLabel = null,
  ...props
}) => {
  const [options, setOptions] = useState(null);

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
          options={options}
          placeholder="Nivel"
          allowClear
          style={props.style ? props.style : {}}
          onChange={props.onChange ? props.onChange : null}
          notFoundContent={"No se encontraron resultados."}
        />
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
