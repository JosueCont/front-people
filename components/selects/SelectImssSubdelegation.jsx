import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectImssSubdelegation = ({
  disabled,
  viewLabel = true,
  rules = [],
  size = "middle",
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([]);
    if (props.cat_imss_subdelegation) {
      let data = props.cat_imss_subdelegation.map((item, index) => {
        return {
          label: item.description,
          value: item.id,
          key: item.id + index,
        };
      });
      setOptions(data);
    }
  }, [props.cat_imss_subdelegation]);

  return (
    <>
      <Form.Item
        key={"imss_subdelegation"}
        name={props.name ? props.name : "imss_subdelegation"}
        label={viewLabel ? "Subdelegaciones IMSS" : ""}
        rules={rules}
      >
        <Select
          disabled={disabled}
          key="SelectImssSubdelegation"
          size={size}
          placeholder="Subdelegaciones IMSS"
          allowClear
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
          {...props}
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
    cat_imss_subdelegation: state.fiscalStore.cat_imss_subdelegation,
  };
};

export default connect(mapState)(SelectImssSubdelegation);
