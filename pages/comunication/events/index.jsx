import React, {useEffect} from 'react'
import { render } from 'react-dom'
import MainLayout from '../../../layout/MainLayout'
import {Row, Col, Table, Breadcrumb, Button} from 'antd'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";

export default function Releases() {
    const {Column} = Table;
    return (
        <MainLayout currentKey="4.2">
            <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Eventos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width:'100%' }}>
                <Row justify={'end'}>
                    <Col style={{ padding:'20px 0' }}>
                        <Button style={{background: "#fa8c16", fontWeight: "bold", color: "white" }} >
                            <PlusOutlined />
                            Agregar nuevo evento
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Table>
                            <Column title="ID" dataIndex="id" key="id" >
                            </Column>
                            <Column title="name" dataIndex="name" key="name">
                            </Column>
                            <Column title="Message" dataIndex="message" key="message"></Column>
                        </Table>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    )
}