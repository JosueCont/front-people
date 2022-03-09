import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { useSelector } from "react-redux";
import { ruleRequired, ruleMinArray } from "../../../utils/rules";

const SelectCategory = ({...props}) => {
  
  const { Option } = Select;
  const currenNode = useSelector(state => state.userStore.current_node)
  const [categoryList, setCategoryList] = useState([]);
  const [properties, setProperties] = useState({});

  useEffect(() => {
    getCategories(currenNode?.id);
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

  const getCategories = async (nodeId) => {
    try {
      // let response = await WebApiAssessment.getListPersons({node: nodeId});
      let response ={
        data : [
          {name: 'categoria de prueba 1', id: 1},
          {name: 'categoria de prueba 2', id: 2},
          {name: 'categoria de prueba 3', id: 3},
          {name: 'categoria de prueba 4', id: 4},
          {name: 'categoria de prueba 5', id: 5}
        ]
      }
      let list = [];
      response.data.map((item) => {
        let row = {
          label: item.name,
          value: item.id,
          key: item.id,
        }
        list.push(row);
      })
      setCategoryList(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (value)=>{
    props.setCategories(value)
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
          placeholder="Seleccionar categoría"
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
          {categoryList && categoryList.map((item) => (
            <Option key={item.key} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    )
}

export default SelectCategory