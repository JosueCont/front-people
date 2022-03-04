import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { useSelector } from "react-redux";
import { ruleRequired, ruleMinArray } from "../../../utils/rules";

const SelectSurveys = ({...props}) => {
  
  const { Option } = Select;
  const currenNode = useSelector(state => state.userStore.current_node)
  const [listSurveys, setListSurveys] = useState([]);
  const [properties, setProperties] = useState({});

  useEffect(() => {
    getSurveys(currenNode?.id);
  }, [currenNode]);

  useEffect(()=>{
    if(props.multiple){
      setProperties({
        mode: {mode: 'multiple'},
        rules: [ruleRequired, ruleMinArray(2)]
      })
    }else{
      setProperties({
        mode: {},
        rules: [ruleRequired]
      })
    }
  },[props.multiple])

  const getSurveys = async (nodeId) => {
    try {
      let response = await WebApiAssessment.getListSurveys(nodeId);
      let list = [];
      response.data.map((item) => {
        let row = {
          label: item.name_es,
          value: item.id,
          key: item.id,
        }
        list.push(row);
      })
      setListSurveys(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (value)=>{
    props.setSurveys(value)
  }

    return (
      <Form.Item
        name={props.name}
        label={props.label}
        rules={properties.rules}
      >
        <Select
          allowClear
          showSearch
          {...properties.mode}
          placeholder="Seleccionar encuesta"
          onChange={handleChange}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
          }
          notFoundContent='No se encontraron resultados'
        >
          {listSurveys && listSurveys.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    )
}

export default SelectSurveys