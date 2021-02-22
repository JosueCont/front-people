import React, {useState, useEffect} from 'react';
import {Select, Form} from 'antd'
import { useRouter } from "next/router";
import axiosApi from '../../libs/axiosApi'
import { route } from 'next/dist/next-server/server/router';
import Axios from "axios";
import { API_URL } from "../../config/config";

export default function SelectDepartment (props) {

    const [options, setOptions] = useState([]);
    const [companyId, setCompanyId] = useState(props.companyId);
    
    const { Option } = Select;


    const getDepartament = async () => {
        try {
            console.log(API_URL+`/business/node/${props.companyId}/department_for_node/`)
            let response = await Axios.get(API_URL+`/business/node/${props.companyId}/department_for_node/`);
            
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
        setOptions([])
        if(props.companyId){
            console.log('companyId',props.companyId)
            getDepartament();
        }
    },[props.companyId])

    return (
        <Form.Item key="department_select" name={props.name ? props.name : 'department'} label="Departamento">
            <Select key="SelectDepartament" style={ props.style ? props.style : { width:150 } } options={options} allowClear onChange={props.onChange ? props.onChange : null} />
        </Form.Item>
    )
    /* return (
            <Select key="SelectDepartament" style={{ width:150 }} options={options} onChange={props.onchange ? props.onChange : null} allowClear />
    ) */
}