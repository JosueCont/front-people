import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectJob({ item = true, ...props }) {
  const [options, setOptions] = useState(null);
  const route = useRouter();
  const { Option } = Select;

  const getJobs = async () => {
    try {
      let response = await Axios.get(
        API_URL +
          // `/business/department/${props.departmentId}/job_for_department/`
          `/person/job/?department=${props.departmentId}`
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
    if (props.departmentId) {
      getJobs();
    }
  }, [props.departmentId]);

  return (
    <>
      {item ? (
        <Form.Item
          key={"ItemJob"}
          name={props.name ? props.name : "job"}
          label={props.label ? props.label : "Empresa"}
        >
          <Select
            key="SelectJob"
            placeholder="Puesto de trabajo"
            style={props.style ? props.style : null}
            options={options}
            onChange={props.onChange ? props.onChange : null}
            allowClear
            notFoundContent={"No se encontraron resultado."}
          />
        </Form.Item>
      ) : (
        <Select
          key="SelectJob"
          placeholder="Puesto de trabajo"
          style={props.style ? props.style : null}
          options={options}
          onChange={props.onChange ? props.onChange : null}
          allowClear
          notFoundContent={"No se encontraron resultado."}
        />
      )}
    </>
  );
}
