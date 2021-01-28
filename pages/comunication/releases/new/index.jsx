import React, {useEffect, useState, useRef} from 'react'
import { render } from 'react-dom'
import MainLayout from '../../../../layout/MainLayout'
import {Row, Col, Typography, Table, Breadcrumb, Button, Form, Input, Select, DatePicker, notification, Space, Switch} from 'antd'
import {useRouter} from "next/router";
import axiosApi, {} from "../../../../libs/axiosApi";
import { route } from 'next/dist/next-server/server/router';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';



export default function Newrelease() {

    const [form] = Form.useForm();
    const {Title} = Typography;
    const { TextArea } = Input;
    const route = useRouter();
    

    const [message, setMessage] = useState(null)
    const [sending, setSending] = useState(false);
    /* const editor = useRef(null)
    const [content, setContent] = useState('') */


    const saveNotification = async (values) =>{

        console.log(message)
        values['created_by'] = "d25d4447bbd5423bbf2d5603cf553b81";
        values.message =  message;
        console.log(values);
        setSending(true);
        try {
            let response = await axiosApi.post(`/noticenter/notification/`, values);
            let data = response.data
            console.log('data',data);
            notification['success']({
                message: 'Notification Title',
                description:
                  'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
              });
              route.push('/comunication/releases');
        } catch (error) {
            console.log(error);
        }finally{
            setSending(false);
        }
    }
    
    const onCancel = () => {
        route.push('/comunication/releases');
    }


    return (
        <MainLayout currentKey="4.1">
            <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Comunicados</Breadcrumb.Item>
                <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width:'100%' }}>
                <Row justify={'center'}>
                    <Col span="23" style={{ padding: '20px 0 30px 0' }}>
                        <Form form={form} layout="horizontal" onFinish={saveNotification} labelCol={{ xs: 24, sm:24, md:5 }} >
                            <Row>
                                <Col span={24}>
                                    <Title level={3}>
                                        Datos Generales
                                    </Title>
                                </Col>
                                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                                    <Form.Item
                                        name="category"
                                        label="Categoria"
                                        labelAlign={'left'}
                                    >
                                        <Select style={{ width: 250 }}>
                                            <Option value="rmb">RMB</Option>
                                            <Option value="dollar">Dollar</Option>
                                        </Select>
                                    </Form.Item> 
                                    <Form.Item 
                                        label="Titulo"
                                        name="title"
                                        labelAlign={'left'}
                                    >
                                        <Input className={'formItemPayment'} />
                                    </Form.Item>
                                    <Form.Item name="message" label="Mensaje" labelAlign="left">
                                        <FroalaEditorComponent tag='textarea' model={message} onModelChange={setMessage}/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Title level={3}>
                                        Segmentación
                                    </Title>
                                </Col>
                                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                                    <Form.Item name="send_to_all" label="Enviar a todos" labelAlign="left">
                                        <Switch  />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                                    <Row>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <Form.Item name={'company'}  label="Empresa" labelCol={{ span:10}}>
                                                <Select >
                                                    <Option value="rmb">RMB</Option>
                                                    <Option value="dollar">Dollar</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name={'company'}  label="Puesto de trabajo" labelCol={{ span:10}}>
                                                <Select >
                                                    <Option value="rmb">RMB</Option>
                                                    <Option value="dollar">Dollar</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <Form.Item name={'person_type'}  label="Tipo de persona" labelCol={{ span:10}}>
                                                <Select >
                                                    <Option value="rmb">RMB</Option>
                                                    <Option value="dollar">Dollar</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name={'gender'}  label="Genero" labelCol={{ span:10}}>
                                                <Select >
                                                    <Option value="rmb">RMB</Option>
                                                    <Option value="dollar">Dollar</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <Button onClick={() => onCancel() } disabled={sending} style={{ padding:'0 50px', margin: '0 10px' }}>Cancelar</Button>        
                                    <Button htmlType="submit" loading={sending} type="primary" style={{ padding:'0 50px', margin: '0 10px' }}>Enviar</Button>    
                                </Col>
                            </Row>
                        </Form>
                        
                    </Col>
                </Row>
            </div>
        </MainLayout>
    )

}