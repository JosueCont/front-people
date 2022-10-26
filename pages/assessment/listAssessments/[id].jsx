import {React, useEffect, useState} from 'react'
import MainLayout from '../../../layout/MainLayout'
import { Breadcrumb, Tabs, Row, Col, Select,Form, Menu, Avatar, Input, Radio, Space} from 'antd'
import TableAssessments from '../../../components/assessment/listAssessments/TableAssessments'
import { useRouter } from 'next/router';

const ListAssessments = () => {
  const router = useRouter();
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
            <TableAssessments/>
        </div>
    </MainLayout>
  )
}

export default ListAssessments