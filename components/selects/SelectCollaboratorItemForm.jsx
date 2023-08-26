import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { userCompanyId } from "../../libs/auth";
import WebApiPeople from '../../api/WebApiPeople'

export default function SelectCollaborator({ setAllPersons, ...props }) {
  const { Option } = Select;

  const route = useRouter();

  const [personList, setPersonList] = useState([]);
  let nodeId = userCompanyId();

  const filterPerson = () => {
    let filters = { node: nodeId }
    if(props.department_id)filters['department'] = props.department_id
    if(props.job_id)filters['job'] = props.job_id
    //Axios.post(API_URL + `/person/person/get_list_persons/`, filters )
        WebApiPeople.getListPersons(filters)
      .then((response) => {
        let list = [];
        if (setAllPersons) {
          setAllPersons(response.data);
        }
        response.data.map((a, i) => {
          let item = {
            label: a.first_name + " " + a.flast_name,
            value: a.id,
            key: a.id + i,
          };
          list.push(item);
        });
        setPersonList(list);
      })
      .catch((e) => {
        console.log(e);
        setPersonList([]);
      });
  };

  useEffect(() => {
    // getPersons();
    filterPerson();
  }, [route]);

  useEffect(() => {
    filterPerson()
  }, [props.job_id, props.department_id ])
  

  return (
    <Form.Item
      label={props.label ? props.label : "Colaborador"}
      name={props.name ? props.name : "collaborator"}
      labelCol={props.labelCol ? props.labelCol : { span: 24 }}
      labelAlign={"left"}
      rules={props.rules ? props.rules : null}
    >
      <Select
        key="selectPerson"
        showSearch
        style={props.style ? props.style : null}
        allowClear
        size={props.size}
        optionFilterProp="children"
        placeholder="Todos"
        mode={props?.multiple ? 'multiple' : null}
        notFoundContent={"No se encontraron resultado."}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
        onChange={props.onChange ? props.onChange : null}
      >
        {personList
          ? personList.map((item) => {
              return (
                <Option key={item.key} value={item.value}>
                  {item.label}
                </Option>
              );
            })
          : null}
      </Select>
    </Form.Item>
  );
}
