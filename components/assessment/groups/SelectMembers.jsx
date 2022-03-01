import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { useSelector } from "react-redux";

const SelectMembers = ({...props}) => {
  
  const { Option } = Select;
  const currenNode = useSelector(state => state.userStore.current_node)
  const [personList, setPersonList] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([])

  useEffect(()=>{
    getSelectedPersons(props.members)
  },[props.members])

  useEffect(() => {
    getPersons(currenNode?.id);
  }, [currenNode]);

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

  const getSelectedPersons = (members) =>{
    if(members?.length > 0){
      let list = [];
      members.map((item)=>{
        let row = {
          label: `${item.first_name} ${item.flast_name} ${item.mlast_name}`,
          value: item.id,
          key: item.id
        }
        list.push(row)
      })
      setSelectedMembers(list)
    }else{
      setSelectedMembers([])
    }
  }

  const handleChange = (value)=>{
    setSelectedMembers(value)
    props.setMembers(value)
  }

    return (
      <Select
        allowClear
        mode="multiple"
        value={selectedMembers}
        placeholder="Seleccionar integrantes"
        onChange={handleChange}
      >
        {personList && personList.map((item) => (
          <Option key={item.key} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    )
}

export default SelectMembers
