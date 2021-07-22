import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { route } from "next/dist/next-server/server/router";
import { userCompanyId } from "../../libs/auth";

export default function SelectCollaborator({ setAllPersons, ...props }) {
  const { Option } = Select;

  const route = useRouter();

  const [personList, setPersonList] = useState([]);
  let nodeId = userCompanyId();

  const filterPerson = () => {
    Axios.post(API_URL + `/person/person/get_list_persons/`, { node: nodeId })
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
      });
  };

  useEffect(() => {
    // getPersons();
    filterPerson();
  }, [route]);

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
        optionFilterProp="children"
        placeholder="Todos"
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
