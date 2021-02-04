import React, { useEffect, useState, useRef } from "react";
import { render } from "react-dom";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axiosApi from "../../../libs/axiosApi";
import Moment from "moment";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { EyeOutlined } from '@ant-design/icons';

export default function Releases() {
  /* React */
    const { Column } = Table;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    /* const childRef = useRef(); */
    const route = useRouter();
    /* Variables */
    const [list, setList] = useState([]);

    let userToken = cookie.get("userToken") ? cookie.get("userToken") : null;

    const getNotifications = async () => {
        try {
        let response = await axiosApi.get(`/noticenter/notification/`);
        let data = response.data;
        setList(data.results);
        } catch (e) {
        console.log(e);
        /* setLoading(false); */
        }
    };

    const GotoDetails = (details) =>{
        console.log('details', details);
        route.push('./releases/'+details.id+'/details');
    }

    const GoToUserNotifications =  (props) => {
        return (
            <Button onClick={() => route.push('./releases/'+props.notification_id+'/users') } type="text">Ver</Button>
        )
    }

    useEffect(()=>{
        getNotifications();
    },[])

    return (
        <MainLayout currentKey="4.1">
            <Breadcrumb key="Breadcrumb">
                <Breadcrumb.Item key="home">Home</Breadcrumb.Item>
                <Breadcrumb.Item key="releases">Comunicados</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width:'100%' }}>
                <Row justify="space-between" key="row1" style={{ padding:'20px 0' }}>
                    <Col>
                        <Form
                            name="filter"
                            layout="inline"
                            key="form"
                        >
                            <Form.Item
                                key="send_by"
                                name="send_by"
                                label="Enviado por"
                            >
                                <Input />
                            </Form.Item>    
                            <Form.Item
                                key="category"
                                name="category"
                                label="Categoria"
                            >
                                <Select style={{ width: 150 }} key="select">
                                    <Option key="item_1" value="rmb">RMB</Option>
                                    <Option key="item_2" value="dollar">Dollar</Option>
                                </Select>
                            </Form.Item> 
                            <Form.Item
                                name="send_date"
                                label="Fecha de envio"
                                key="send_date"
                            >
                                <RangePicker />
                            </Form.Item> 

                        </Form>
                    </Col>
                    <Col>
                        {/* <Button onClick={() => childRef.current.showModal()}  style={{background: "#fa8c16", fontWeight: "bold", color: "white" }} > */}
                        <Button key="add" onClick={() => route.push('releases/new')}  style={{background: "#fa8c16", fontWeight: "bold", color: "white" }} >
                            <PlusOutlined />
                            Agregar nuevo comunicado
                        </Button>
                    </Col>
                </Row>
                <Row key="row2">
                    <Col span={24}>
                        <Table dataSource={list} key="releases_table">
                            <Column title="Categoria" dataIndex="title" key="title"/>
                            <Column title="Enviado por" dataIndex="created_by" key="send_by" />
                            <Column title="Categoría" dataIndex="category" key="cat" />
                            <Column title="Fecha" dataIndex="timestamp" key="date" 
                            render={(text, record) => (
                                Moment(text).format('DD / MM / YYYY')
                            )} />
                            <Column title="Recibieron" key="recibieron"
                            render={(text, record) => (
                                <GoToUserNotifications key={'goUser'+record.id} notification_id={record.id} />
                            )}
                            />
                            <Column title="Acciones" key="action"
                            render={(text, record) => (
                                <EyeOutlined key={'goDetails_'+record.id} onClick={() => GotoDetails(record)}  />
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
