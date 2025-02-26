import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
const { Option } = Select;

const SelectBank = ({ rules = [], bankSelected = null, withDescription=false, ...props }) => {
  const [options, setOptions] = useState([]);
  const route = useRouter();

  useEffect(() => {}, [route]);

  useEffect(() => {
    if (props.banks) {
      let data = props.banks.map((item) => {
        return {
          value: item.id,
          label: `${item.name} ${withDescription? `/ ${item?.description}`:''} `,
          key: item.name + item.id,
        };
      });
      setOptions(data);
    }
  }, [props.banks]);

  return (
    <Form.Item
      key={"SelectBank"}
      name={props.name ? props.name : "bank"}
      label={props.label ? props.label : "Banco"}
      rules={rules}
    >
      <Select
        key="SelectBank"
        placeholder="Banco"
        style={props.style ? props.style : null}
        // options={options}
        onChange={props.onChange ? props.onChange : null}
        allowClear
        notFoundContent={"No se encontraron resultados."}
        value={bankSelected}
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

const mapState = (state) => {
  return {
    banks: state.fiscalStore.banks,
  };
};
export default connect(mapState)(withAuthSync(SelectBank));
