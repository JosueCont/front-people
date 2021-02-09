import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {Row, Col, Typography, Table, Breadcrumb, Descriptions, Image, Button, Form, Input, InputNumber, Select, DatePicker, notification, Space, Switch } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moduleName from '../../../components/forms/LendingForm';
import moment from "moment";
import Lendingform from "../../../components/forms/LendingForm";
import Lending from "..";

export default function HolidaysNew() {
    const route = useRouter();
    const [form] = Form.useForm();
    const { Title } = Typography;
    const [sending, setSending] = useState(false);
    const { Option } = Select;
    const [departure_date, setDepartureDate] = useState(null);
    const [return_date, setReturnDate] = useState(null);
    const [job, setJob] = useState(null);
    const [dateOfAdmission, setDateOfAdmission] = useState(null);
    const [availableDays, setAvailableDays] = useState(null);
    const [personList, setPersonList] = useState(null);
    const [allPersons, setAllPersons] = useState(null);
    const [antiquity, setAntiquity] = useState(null);
    

    const onCancel = () => {
        route.push("/lending");
    };

    const columns = [
        {
          title: 'Plazo',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Pago fijo',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Saldo',
          dataIndex: 'address',
          key: 'address',
        },
        {
            title: 'Fecho de pago',
            dataIndex: 'datePay',
            key: 'datePay',
        },
        {
            title: 'Estatus',
            dataIndex: 'estatus',
            key: 'status',
        },
      ];


    return (
        <MainLayout currentKey="7.1">
            <Breadcrumb key="Breadcrumb" className={'mainBreadcrumb'}>
                <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item href="./">Prestamos</Breadcrumb.Item>
                <Breadcrumb.Item>Detalles</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width: "100%", padding: '20px 0' }}>
                <Row>
                    <Col span={16} offset={1}>
                        <Descriptions title="Detalles del prestamo" column={2} labelStyle={{ width:150, fontWeight: 700 }}>
                            <Descriptions.Item label="Estatus">Zhou Maomao</Descriptions.Item>
                            <Descriptions.Item label="Fecha autorizada">1810000000</Descriptions.Item>
                            <Descriptions.Item label="Colaborador">Hangzhou, Zhejiang</Descriptions.Item>
                            <Descriptions.Item label="Plazos">empty</Descriptions.Item>
                            <Descriptions.Item label="Fecha de solicitud">1810000000</Descriptions.Item>
                            <Descriptions.Item label="Periodicidad">Hangzhou, Zhejiang</Descriptions.Item>
                            <Descriptions.Item label="Tipo de prestamo">empty</Descriptions.Item>
                            <Descriptions.Item label="Pago">empty</Descriptions.Item>
                            <Descriptions.Item label="Motivo" span={16} contentStyle={{ textAlign: 'justify' }}>
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus quidem rem expedita porro autem! Cum eius quidem sit placeat ducimus eligendi minus blanditiis quisquam. Maiores laborum modi dolorum placeat sequi.
                            </Descriptions.Item>
                        </Descriptions>
                        <Table columns={columns} />
                    </Col>
                    <Col span={16} offset={1} style={{ textAlign: 'right', padding: '30px 0' }}>
                        <Button onClick={onCancel}  style={{ padding:'0 40px' }}>Regresar</Button>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    )
}
