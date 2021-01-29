import React, {useEffect, useState, useRef} from 'react'
import { render } from 'react-dom'
import MainLayout from '../../../layout/MainLayout'
import {Row, Col, Table, Breadcrumb, Button, Form, Input, Select, DatePicker, Space} from 'antd'
import {DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import axiosApi from "../../../libs/axiosApi";
import Moment from 'moment';
import ModalCreateNotification from '../../../components/modals/ModalCreateNotification'
import { useRouter } from 'next/router';
import cookie from "js-cookie";
import { EyeOutlined } from '@ant-design/icons';


export default function Releases() {
    /* React */
    const {Column} = Table;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    /* const childRef = useRef(); */
    const route = useRouter();
    /* Variables */
    const [list, setList] = useState([])




    const getNotifications   = async () => {
        try{
            let response = await axiosApi.get(`/noticenter/notification/`);
            let data = response.data
            setList(data.results)
        }catch (e) {
            console.log("error")
            /* setLoading(false); */
        }
    }

    const GotoDetails = (details) =>{
        console.log('details', details);
        route.push('./releases/'+details.id+'/details');
    }

    useEffect(()=>{
        getNotifications();
    },[])

    return (
        <MainLayout currentKey="4.1">
            <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Comunicados</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width:'100%' }}>
                <Row justify="space-between" style={{ padding:'20px 0' }}>
                    <Col >
                        <Form
                            name="filter"
                            layout="inline"
                        >
                            <Form.Item
                                name="price"
                                label="Enviado por"
                            >
                                <Input />
                            </Form.Item>    
                            <Form.Item
                                name="category"
                                label="Categoria"
                            >
                                <Select style={{ width: 150 }}>
                                    <Option value="rmb">RMB</Option>
                                    <Option value="dollar">Dollar</Option>
                                </Select>
                            </Form.Item> 
                            <Form.Item
                                name="send_date"
                                label="Fecha de envio"
                            >
                                <RangePicker />
                            </Form.Item> 

                        </Form>
                    </Col>
                    <Col>
                        {/* <Button onClick={() => childRef.current.showModal()}  style={{background: "#fa8c16", fontWeight: "bold", color: "white" }} > */}
                        <Button onClick={() => route.push('releases/new')}  style={{background: "#fa8c16", fontWeight: "bold", color: "white" }} >
                            <PlusOutlined />
                            Agregar nuevo comunicado
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table dataSource={list}>
                            <Column title="Categoria" dataIndex="title" key="title"/>
                            <Column title="Enviado por" dataIndex="created_by" key="send_by" />
                            <Column title="Categoría" dataIndex="category" key="cat" />
                            <Column title="Fecha" dataIndex="timestamp" key="date" 
                            render={(text, record) => (
                                Moment(text).format('DD / MM / YYYY')
                            )} />
                            <Column title="Acciones" key="action"
                            render={(text, record) => (
                                <EyeOutlined onClick={() => GotoDetails(record)}  />
                            )}
                            />
                        </Table>
                    </Col>
                </Row>
            </div>
            {/* <ModalCreateNotification  reloadData={getNotifications} /> */}
        </MainLayout>
    )
}