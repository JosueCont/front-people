import React, {useState, useEffect} from 'react';
import {Select} from 'antd'
import { useRouter } from "next/router";
import axiosApi from '../../libs/axiosApi'
import { route } from 'next/dist/next-server/server/router';

export default function SelectCompany (props) {

    const [options, setOptions] = useState([]);
    const route = useRouter();

    const getCompanies = async () => {
        try {
            let response = await axiosApi.get(`/business/node/`);
            let data = response.data.results;
            console.log("data", data);
            let options = [];
            data.map((item) => {
              options.push({ value: item.id, label: item.name, key: item.name+item.id  });
            });
            setOptions(options);
          } catch (error) {
            console.log("error", error);
          }
    }

    useEffect(()=>{
        getCompanies();
    },route)

    return (
        <Select key="SelectCompany" style={{ width:150 }} options={options} onChange={props.onChange} allowClear />
    )
}