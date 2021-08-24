import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectJob({
  titleLabel = true,
  rules = [],
  departmentId,
  ...props
}) {
  const [options, setOptions] = useState(null);
  const route = useRouter();
  const { Option } = Select;

  const getJobs = async () => {
    try {
      let response = await Axios.get(
        API_URL + `/person/job/?department=${departmentId}`
      );
      let data = response.data;

      data = data.map((item, index) => {
        return {
          label: item.name,
          value: item.id,
          key: item.id + index,
        };
      });
      setOptions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setOptions([]);
    if (departmentId) {
      getJobs();
    }
  }, [departmentId]);

  return (
    <>
      <Form.Item
        key={"ItemJob"}
        name={props.name ? props.name : "job"}
        label={titleLabel ? "Puesto de trabajo" : ""}
        rules={rules}
      >
        <Select
          key="SelectJob"
          options={options}
          placeholder="Puesto de trabajo"
          allowClear
          style={props.style ? props.style : {}}
          onChange={props.onChange ? props.onChange : null}
          notFoundContent={"No se encontraron resultados."}
        />
      </Form.Item>
    </>
  );
}
