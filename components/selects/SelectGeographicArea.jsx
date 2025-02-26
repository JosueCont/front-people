import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import {getGeographicArea} from "../../redux/fiscalDuck";
const { Option } = Select;

const SelectGeographicArea = ({
  disabled,
  viewLabel = true,
  rules = [],
  period=null,
  getGeographicArea,
  ...props
}) => {
  const [options, setOptions] = useState([]);


  useEffect(()=>{
    if(period){
      console.log('cambia periodo', period)
      getGeographicArea(period)
    }
  },[period])

  useEffect(() => {
    setOptions([]);
    if (props.cat_geographic_area) {
      let options = props.cat_geographic_area.map((op) => {
        return {
          key: op.id,
          value: op.id,
          label: `${op.area === 1 ? "Frontera Norte" : "Resto del país"} ($${
            op.min_salary
          })`,
        };
      });

      setOptions(options);
    }
  }, [props.cat_geographic_area]);

  return (
    <Form.Item
      key="geograp_area"
      name="geograp_area"
      label={"Área geográfica"}
      rules={rules}
    >
      <Select
        size={props.size ? props.size : "middle"}
        key={"selectGeographicarea"}
        disabled={disabled}
        allowClear
        notFoundContent={"No se encontraron resultados."}
        showSearch
        optionFilterProp="children"
        placeholder="Area geografica"
      >
        {options.length > 0 &&
          options.map((op) => (
            <Option key={op.key} value={op.value}>
              {op.label}
            </Option>
          ))}
      </Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    cat_geographic_area: state.fiscalStore.cat_geographic_area,
  };
};

export default connect(mapState,{getGeographicArea})(SelectGeographicArea);
