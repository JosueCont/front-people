import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { route } from "next/dist/next-server/server/router";

export default function SelectJob(props) {
    const [options, setOptions] = useState(null);
    const route = useRouter();
    const { Option } = Select;


    const getJobs = async () => {
        try {
            let response = await Axios.get(API_URL + `/business/department/${props.departmentId}/job_for_department/`)
            let data = response.data;
            console.log(data);
            data = data.map((item, index) => {
                return {
                    label: item.name,
                    value: item.id,
                    key: item.id + index,
                };
            })
            setOptions(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setOptions([]);
        if (props.departmentId) {
            getJobs();
        }
    }, [props.departmentId]);

    return (
        <Form.Item
            key={'ItemJob'}
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
            />
        </Form.Item>
    );
}
