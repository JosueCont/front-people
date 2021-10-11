import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectPerson(props) {
  const { Option } = Select;

  const route = useRouter();

  const [personList, setPersonList] = useState([]);

  const getPersons = async () => {
    try {
      let response = await Axios.get(API_URL + `/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: props.khonnect_id ? a.khonnect_id : a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (error) {
      console.log(error);
    }
  };

  const DropDownList = () => {
    return (
      <Select
        key="selectPerson"
        showSearch
        style={props.style ? props.style : null}
        allowClear
        optionFilterProp="children"
        placeholder="Todos"
        value={props.defaultValue}
        notFoundContent={"No se encontraron resultados."}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={(optionA, optionB) =>
          optionA.children
            .toLowerCase()
            .localeCompare(optionB.children.toLowerCase())
        }
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
    );
  };

  useEffect(() => {
    getPersons();
  }, [route]);

  return props.withLabel ? (
    <Form.Item
      label="Colaborador"
      name={props.name ? props.name : "khonnect_id"}
      labelCol={{ span: 10 }}
      labelAlign={"left"}
    >
      <DropDownList />
    </Form.Item>
  ) : (
    <DropDownList />
  );
}
