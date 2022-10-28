import {React, useEffect, useState} from 'react'
import MainLayout from '../../../layout/MainLayout'
import { Breadcrumb, Tabs, Row, Col, Select,Form, Menu, Avatar, Input, Radio, Space} from 'antd'
import TableAssessments from '../../../components/assessment/listAssessments/TableAssessments'
import { useRouter } from 'next/router';
import WebApiPeople from '../../../api/WebApiPeople';

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
    <MainLayout currentKey={["list_assessments"]} defaultOpenKeys={["list_assessments"]}> 
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