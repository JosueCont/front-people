import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, Row, Col, Input, Image, Select, InputNumber, DatePicker } from 'antd';
import moment from "moment";
import { useRouter } from "next/router";


const Lendingform = (props) => {
    const {Title} = Typography;
    const {TextArea} = Input
    const route = useRouter();

    return(
    <Form  layout="horizontal" >
        <Row justify={'start'}>
            <Col span={24}>
                <Title key="dats_gnrl" level={4}>
                    Nueva solicitud de prestamo
                </Title>
            </Col>
            <Col span="8">
                <Form.Item label="Colaborador" name="khonnect_id" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <Select options={[]} />
                </Form.Item>
                <Form.Item label="Tipo de prestamo" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <Select options={[]} />
                </Form.Item>
                <Form.Item label="Cantidad solicitada" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Plazos" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Periodicidad" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <Select options={[]} />
                </Form.Item>
                <Form.Item label="Pago" labelCol={{ span: 10 }} labelAlign={'left'}>
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
            </Col>
            <Col span={18} style={{ textAlign: 'right' }}>
                <Form.Item label="Motivo" labelCol={{ span: 4 }} labelAlign={'left'}>
                    <TextArea rows="4" />
                </Form.Item>
                <Button onClick={() => route.push("/lending")} type="dashed" key="cancel" style={{ padding: "0 50px",  }} >
                    { props.edit ? 'Regresar' : 'Cancelar' }
                </Button>
                { props.edit ? <Button danger onClick={props.onReject} key="save" type="primary" style={{ padding: "0 50px", marginLeft: 15 }}>
                    Rechazar
                </Button> : null }
                { props.edit ? <Button onClick={props.onApprove} type="primary" key="cancel" style={{ padding: "0 50px", marginLeft: 15 }} >
                    Aprobar prestamo
                </Button> : null }
                
                <Button  key="save" htmlType="submit"  style={{ padding: "0 50px", marginLeft: 15 }}>
                    { props.edit ? 'Actualizar Datos' : 'guardar' }
                </Button>
            </Col>
        </Row>
    </Form>
    )

}

export default Lendingform;