import React, { useEffect, useState } from 'react';
import { Tabs, Radio, Row, Col, Breadcrumb, Typography, Button, Select, Form, Image, Input } from 'antd';
import MainLayout from "../../../layout/MainLayout";
import { render } from "react-dom";
import { useRouter } from "next/router";
import axiosApi from '../../../libs/axiosApi';
import moment from "moment";
import Vacationform from '../../../components/vacations/Vacationform';

export default function HolidaysDetails() {
    const route = useRouter()

    const { TabPane } = Tabs;
    const { Title } = Typography;
    const { Options } = Select;
    const [details, setDetails] = useState(null);
    const { id } = route.query;
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [daysRequested, setDaysRequested] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [availableDays, setAvailableDays] = useState(null);
    const [personList, setPersonList] = useState(null);
    const [collaborator, setCollaborator] = useState(null);

    const onCancel = () => {
        route.push("/holidays");
    };

    const onChangeDepartureDate = (date, dateString) => {
        console.log('date', date);
        console.log('dateString', dateString);
        setDepartureDate(dateString)
    }

    const onChangeReturnDate = (date, dateString) => {
        setReturnDate(dateString)
    }

    const getDetails = async () => {
        try {
            let response = await axiosApi.get(`/person/vacation/${id}/`);
            let data = response.data
            console.log("data", data);
            setDaysRequested(data.days_requested);
            setDepartureDate(moment(data.departure_date).format('DD/MM/YYYY'));
            setReturnDate(moment(data.return_date).format('DD/MM/YYYY'));
            setCollaborator(data.collaborator);
            setLoading(false);

        } catch (e) {
            console.log("error", e)
            /* setLoading(false); */
        }
    }

    const saveRequest = async (values) => {
        console.log(values);
    }

    useEffect(() => {
        setLoading(true);
        if (id) {
            getDetails();
        }
    }, [route])

    return (
        <MainLayout currentKey="5">
            <Breadcrumb key="Breadcrumb" className={'mainBreadcrumb'}>
                <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item href="/holidays">Vacaciones</Breadcrumb.Item>
                <Breadcrumb.Item>Editar solicitud</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width: "100%", padding: '20px 0' }}>
                <Row justify={'center'}>
                    <Col span={23}>
                        {!loading ? <Form form={form} layout="horizontal" onFinish={saveRequest}  >
                            <Vacationform collaborator={collaborator} returnDate={returnDate} departureDate={departureDate} daysRequested={daysRequested} sending={sending} onChangeDepartureDate={onChangeDepartureDate} onCancel={onCancel} />
                        </Form> : null} 
                        
                    </Col>
                </Row>
            </div>
        </MainLayout >
    )
}