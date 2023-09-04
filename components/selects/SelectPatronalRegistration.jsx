import React, { useEffect, useState } from "react";
import { Row, Col, Select, Form } from "antd";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";
import { getPatronalRegistration } from "../../redux/catalogCompany";

const SelectPatronalRegistration = ({
  name,
  value_form,
  textLabel,
  currentNode = null,
  cat_patronal_registration,
  placeHolder = true,
  showLabel = true,
  ...props
}) => {
  const { Option } = Select;
  const [options, setOptions] = useState([]);


  useEffect(() => {
    getPatronalRegistration();
  }, []);

  useEffect(() => {
    if (cat_patronal_registration.length > 0) {
      setOptions(cat_patronal_registration);
    }
  }, [cat_patronal_registration]);

  return (
    <>
      <Form.Item
        name={name ? name : "patronal_registration"}
        label={
            showLabel == true ?
              textLabel ? textLabel : "Registro patronal"
              : ''
            }
        style={props.style && props.style}
      >
        <Select
          key="SelectPatronalRegistration"
          allowClear
          mode={props.multiple ? "multiple" : ""}
          placeholder={placeHolder && "Registro Patronal"}
          onChange={props.onChange ? props.onChange : null}
          notFoundContent={"No se encontraron resultados."}
          showSearch
          optionFilterProp="children"
          maxTagCount="responsive"
        >
          {options.map((item) => {
            return (
                <Option key={item.id} value={item.id}>
                  {item.code}
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
    cat_patronal_registration: state.catalogStore.cat_patronal_registration,
    errorData: state.catalogStore.errorData,
  };
};
export default connect(mapState, { getPatronalRegistration })(
  SelectPatronalRegistration
);
