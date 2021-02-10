import React, {useState, useEffect} from 'react';
import {Select, Form} from 'antd'
import { useRouter } from "next/router";
import axiosApi from '../../libs/axiosApi'
import { route } from 'next/dist/next-server/server/router';

export default function SelectDepartament (props) {

    const [options, setOptions] = useState([]);
    const [companyId, setCompanyId] = useState(props.companyId);
    

    const getDepartament = async () => {
        try {
            let response = await axiosApi.get(`business/node/${props.companyId}/department_for_node/`);
            let data = response.data;
            console.log("data", data);
            let options = [];
            data.map((item) => {
              options.push({ value: item.id, label: item.name, key: item.name+item.id });
            });
            setOptions(options);
          } catch (error) {
            console.log("error", error);
          }
    }

    /* useEffect(()=>{
        getCompanies();
        if(props.companyId){
            setCompanyId(props.companyId)
        }
        
    }) */

    useEffect(()=>{
        if(props.companyId){
            console.log('companyId',props.companyId)
            getDepartament();
        }
    },[props.companyId])

    return (
        <Form.Item key="department_select" name="department" label="Departamento">
            <Select key="SelectDepartament" style={{ width:150 }} options={options} allowClear />
        </Form.Item>
    )
}