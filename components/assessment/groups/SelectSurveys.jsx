import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { useSelector } from "react-redux";

const SelectSurveys = ({...props}) => {
  
  const { Option } = Select;
  const currenNode = useSelector(state => state.userStore.current_node)
  const [listSurveys, setListSurveys] = useState([]);
  const [selectedSurveys, setSelectedSurveys] = useState([]);

  useEffect(()=>{
    getSelectedSurveys(props.surveys)
  },[props.surveys])

  useEffect(() => {
    getSurveys(currenNode?.id);
  }, [currenNode]);

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

  const getSelectedSurveys = (surveys) =>{
    if(surveys?.length > 0){
      let list = [];
      surveys.map((item)=>{
        let row = {
          label: item.name_es,
          key: item.id,
          value: item.id
        }
        list.push(row)
      })
      setSelectedSurveys(list)
    }else{
      setSelectedSurveys([])
    }
  }

  const handleChange = (value)=>{
    setSelectedSurveys(value)
    props.setSurveys(value)
  }

    return (
      <Select
        allowClear
        mode="multiple"
        value={selectedSurveys}
        placeholder="Seleccionar encuestas"
        onChange={handleChange}
      >
        {listSurveys && listSurveys.map((item) => (
          <Option key={item.key} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    )
}

export default SelectSurveys