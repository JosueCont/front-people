import {React, useEffect, useState} from 'react'
import MainLayout from '../../../layout/MainInter'
import { Breadcrumb, Tabs, Row, Col, Select,Form, Menu, Avatar, Input, Radio, Space} from 'antd'
import TableAssessments from '../../../components/assessment/persons/TableAssessments'
import { useRouter } from 'next/router';
import WebApiPeople from '../../../api/WebApiPeople';
import { css, Global } from "@emotion/core";

const ListAssessments = () => {
  const router = useRouter();
  const [person, setPerson] = useState({});
  useEffect(()=>{
    if(router.query.id){
        getPerson(router.query.id);
    }
  },[router])

  const getPerson = async (id) =>{
    try {
        let response = await WebApiPeople.getPerson(id);
        setPerson(response.data)
    } catch (e) {
        console.log(e)
    }
  }
  return (
    <MainLayout currentKey={["persons"]} defaultOpenKeys={["people"]}>
      <Global
        styles={css`
            :root {
                --orange: #FF5E00;
            }
          .ant-card{
            cursor: auto!important;
          }
        `}
        
      /> 
        <Breadcrumb>
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item>Colaboradores</Breadcrumb.Item>
            <Breadcrumb.Item 
                className={"pointer"}
                onClick={() => router.push({ pathname: "/home/persons/" })} 
            >Personas</Breadcrumb.Item>
            <Breadcrumb.Item>Lista de asignaciones</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{ width: "100%" }}>
            <TableAssessments user_profile={person}/>
        </div>
    </MainLayout>
  )
}

export default ListAssessments