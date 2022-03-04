import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { useSelector } from "react-redux";
import { ruleRequired, ruleMinArray } from "../../../utils/rules";

const SelectMembers = ({...props}) => {
  
  const { Option } = Select;
  const currenNode = useSelector(state => state.userStore.current_node)
  const [personList, setPersonList] = useState([]);
  const [properties, setProperties] = useState({});

  useEffect(() => {
    getPersons(currenNode?.id);
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

  const getPersons = async (nodeId) => {
    try {
      let response = await WebApiAssessment.getListPersons({node: nodeId});
      let list = [];
      response.data.map((item) => {
        let row = {
          label: `${item.first_name} ${item.flast_name} ${item.mlast_name}`,
          value: item.id,
          key: item.id,
        }
        list.push(row);
      })
      setPersonList(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (value)=>{
    props.setMembers(value)
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
          placeholder="Seleccionar persona"
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
          {personList && personList.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    )
}

export default SelectMembers
