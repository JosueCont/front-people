import React, {useEffect, useState, useRef} from 'react'
import { render } from 'react-dom'
import MainLayout from '../../../../layout/MainLayout'
import {Row, Col, Typography, Table, Breadcrumb, Button, Form, Input, Select, DatePicker, Space} from 'antd'
import {useRouter} from "next/router";
import axiosApi, {} from "../../../../libs/axiosApi";
import JoditEditor from "jodit-react";


export default function Newrelease() {

    const [form] = Form.useForm();
    const {Title} = Typography;
    const { TextArea } = Input;
    const editor = useRef(null);
    const [content, setContent] = useState('');

    const config = {
        readonly: false, // all options from https://xdsoft.net/jodit/doc/
        toolbarButtonSize: "small",
        removeButtons: ['source','brush','paragraph','image','video', 'hr', 'eraser', 'fullsize',]
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
                    <Col span="23">
                        <Form form={form} layout="horizontal" labelCol={{ xs: 24, sm:24, md:5 }} >
                        <Title level={3}>
                            Datos Generales
                        </Title>
                        <Row>
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
                                <JoditEditor
                                    ref={editor}
                                    config={config}
                                    tabIndex={1} // tabIndex of textarea
                                    onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                        onChange={newContent => {}}
                                />
                                </Form.Item> 
                            </Col>
                        </Row>
                        </Form>
                        
                    </Col>
                </Row>
            </div>
        </MainLayout>
    )

}