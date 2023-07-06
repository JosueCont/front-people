import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectJob = ({
  disabled,
  viewLabel = true,
  rules = [],
  size = "middle",
  ...props
}) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions([]);
    if (props.cat_job) {
      let data = props.cat_job.map((item, index) => {
        return {
          label: item.name,
          value: item.id,
          key: item.id + index,
        };
      });
      setOptions(data);
    }
  }, [props.cat_job]);

  return (
    <>
      <Form.Item
        key={"ItemJob"}
        name={props.name ? props.name : "job"}
        label={viewLabel ? "Puesto de trabajo" : ""}
        rules={rules}
      >
        <Select
          disabled={disabled}
          key="SelectJob"
          // options={options}
          size={size}
          //placeholder="Puesto de trabajo"
          allowClear
          style={props.style ? props.style : {}}
          onChange={props.onChange ? props.onChange : null}
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
          mode={props.multiple ? "multiple" : null}
          maxTagCount="responsive"
        >
          {options.map((item) => {
            return (
                <Option key={item.key} value={item.value}>
                  {item.label}
                </Option>
            );
          })}
        </Select>
      </Form.Item>
    </>
  );
};

const mapState = (state) => {
  return {
    cat_job: state.catalogStore.cat_job,
  };
};

export default connect(mapState)(SelectJob);
