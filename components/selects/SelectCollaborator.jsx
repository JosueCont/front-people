import React, {useEffect, useState} from "react";
import { Select, Form } from "antd";
import { connect } from "react-redux";
const { Option } = Select;
const SelectCollaborator = ({
  showLabel = true,
  setAllPersons,
  val = false,
  onlyUsersKhonnect=null,
  isDisabled = false,
  ...props
}) => {
  const { Option } = Select;
  const [personList,setPersonList] = useState(null)

  useEffect(()=>{
    if(props.peopleCompany){
      if(onlyUsersKhonnect){
        setPersonList(props.peopleCompany.filter((ele)=> ele.khonnect_id))
      }else{
        setPersonList(props.peopleCompany)
      }
    }
  },[props.peopleCompany])

  return (
    <Form.Item
      label={showLabel ? (props.label ? props.label : "Colaborador") : null}
      name={props.name ? props.name : "collaborator"}
      labelCol={props.labelCol ? props.labelCol : { span: 24 }}
      labelAlign={"left"}
      rules={props.rules ? props.rules : null}
    >
      <Select
        mode={props.mode ? props.mode : null}
        size={props.size ? props.size : "middle"}
        key="selectPerson"
        showSearch={props.showSearch ? props.showSearch : false}
        style={props.style ? props.style : { width: "100% !important" }}
        allowClear
        optionFilterProp="children"
        placeholder={props.placeholder ? props.placeholder : "Todos"}
        notFoundContent={"No se encontraron resultados."}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
        onChange={props.onChange ? props.onChange : props.onChangeSelect ? (val) => props.onChangeSelect(val, personList) : null}
        defaultValue={props.value || undefined}
        disabled={isDisabled}
      >
        {personList
          ? personList.map((item) => {
              return (
                <Option
                  key={item.key}
                  value={val ? item.khonnect_id : item.value}
                >
                  {item.label}
                </Option>
              );
            })
          : null}
      </Select>
    </Form.Item>
  );
};

const mapState = (state) => {
  return {
    peopleCompany: state.catalogStore.people_company,
  };
};

export default connect(mapState)(SelectCollaborator);
