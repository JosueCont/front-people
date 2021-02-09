import React, {useState, useEffect} from 'react';
import {Select} from 'antd'
import { useRouter } from "next/router";
import axiosApi from '../../libs/axiosApi'
import { route } from 'next/dist/next-server/server/router';

export default function SelectDepartament (props) {

    const [options, setOptions] = useState([]);
    const [companyId, setCompanyId] = useState(props.companyId);
    

    const getDepartament = async () => {
        try {
            let response = await axiosApi.get(`business/node/${companyId}/department_for_node/`);
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
    },route) */

    useEffect(()=>{
        /* getCompanies(); */
        if(props.companyId){
            setCompanyId(props.companyId)
        }
        
    })

    useEffect(()=>{
        if(companyId){
            console.log('companyId',companyId)
            getDepartament();
        }
    },[companyId])

    return (
        <Select key="SelectDepartament" style={{ width:150 }} options={options} allowClear />
    )
}