import React, { useEffect, useState, useRef } from "react";
import { render } from "react-dom";
import MainLayout from "../../../../layout/MainLayout";
import { Row, Col, Typography, Table, Breadcrumb, Button, Form, Input, Select, DatePicker, notification,Space,  Switch} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../../libs/axiosApi";
import { route } from "next/dist/next-server/server/router";
import cookie from "js-cookie";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";

let userToken = cookie.get("userToken") ? cookie.get("userToken") : null;

export default function Newrelease() {
    const [form] = Form.useForm();
    const { Title } = Typography;
    const { TextArea } = Input;
    const { Option } = Select;
    const route = useRouter();

    const [message, setMessage] = useState(null)
    const [sending, setSending] = useState(false);
    const [userId, setUserId] = useState(null);
    const [bussinessList, setBusinessList] = useState([]);
    const [personTypeList, setPersonTypeList] = useState([])
    const [listJobs, setListJobs] = useState([]);

    
    let json = JSON.parse(userToken);
    

    useEffect(() =>{
        if(json){
            console.log('json', json);
            setUserId(json.user_id)
            console.log(json);
        }
        getBussiness();
        getPersontype();
        getJobs();
    }, [route])

    const saveNotification = async (values) =>{
        console.log(userId);
        /* values['created_by'] = "d25d4447bbd5423bbf2d5603cf553b81"; */
        values['khonnect_id'] = userId;
        values['created_by'] = userId;
        
        values.message =  message;
        console.log(values);

        let dat = {
            "title": values.title,
            "message": values.message,
            "created_by": "d25d4447bbd5423bbf2d5603cf553b81"
        }
        //setSending(true);
        try {
            let response = await axiosApi.post(`/noticenter/notification/`, values);
            let data = response.data
            notification['success']({
                message: 'Notification Title',
                description:
                  'Información enviada correctamente.',
              });
              route.push('/comunication/releases');
              console.log('res',response.data);
        } catch (error) {
            console.log('error',error);
        }finally{
            setSending(false);
        }
    }

    const getBussiness = async () =>{
        try {
            let response = await axiosApi.get(`/business/node/`);
            let data = response.data.results
            console.log('data',data);
            
            setBusinessList(data)
        } catch (error) {
            console.log('error',error);
        }
    }

    const getPersontype = async () =>{
        try {
            let response = await axiosApi.get(`/person/person-type/`);
            let data = response.data.results
            console.log('data_personas',data);
            setPersonTypeList(data)
        } catch (error) {
            console.log('error',error);
        }
    }
    
    const getJobs = async () =>{
        try {
            let response = await axiosApi.get(`/person/job/`);
            let data = response.data.results
            console.log('jobs',data);
            setListJobs(data)
        } catch (error) {
            console.log('error',error);
        }
    }

    const onCancel = () => {
        route.push("/comunication/releases");
    };

    return (
        <MainLayout currentKey="4.1">
            <Breadcrumb key="Breadcrumb">
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
                                    <Title key="dats_gnrl" level={3}>
                                        Datos Generales
                                    </Title>
                                </Col>
                                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                                    <Form.Item
                                        name="category"
                                        label="Categoria"
                                        labelAlign={'left'}
                                    >
                                        <Select style={{ width: 250 }}>s    
                                            <Option key="1" value="1">Aviso</Option>
                                            <Option key="2" value="2">Noticia</Option>
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
                                        <FroalaEditorComponent  key="message" tag='textarea' model={message} onModelChange={setMessage}/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Title level={3} key="segmentacion">
                                        Segmentación
                                    </Title>
                                </Col>
                                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                                    <Form.Item  name="send_to_all" label="Enviar a todos" labelAlign="left">
                                        <Switch value={false}  />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                                    <Row>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <Form.Item name={'target_company'}  label="Empresa" labelCol={{ span:10}}>
                                                <Select>
                                                    { bussinessList ? 
                                                        bussinessList.map((item) =>{
                                                            return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                                        }) : null
                                                    }
                                                    {/* <Option value="rmb">RMB</Option>
                                                    <Option value="dollar">Dollar</Option> */}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name={'target_job'}  label="Puesto de trabajo" labelCol={{ span:10}}>
                                                <Select >
                                                    { listJobs ? 
                                                    listJobs.map( (item) => {
                                                        return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                                        }) : null
                                                
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                            <Form.Item name={'target_person_type'}  label="Tipo de persona" labelCol={{ span:10}}>
                                                <Select >
                                                    {
                                                        personTypeList.map( (item) => {
                                                            return (<Option value={item.id} key={'person_'+item.id}>{item.name}</Option>)
                                                        })
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name={'target_gender'}  label="Genero" labelCol={{ span:10}}>
                                                <Select >
                                                    <Option value="1" key="gender_1">Masculino</Option>
                                                    <Option value="2" key="gender_2">Femenino</Option>
                                                    <Option value="3" key="gender_3">Otro</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <Button key="cancel" onClick={() => onCancel() } disabled={sending} style={{ padding:'0 50px', margin: '0 10px' }}>Cancelar</Button>        
                                    <Button key="save" htmlType="submit" loading={sending} type="primary" style={{ padding:'0 50px', margin: '0 10px' }}>Enviar</Button>    
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
    </MainLayout>
  );
}
