import React, { useEffect, useState } from 'react';
import { Tabs, Radio, Row, Col, Breadcrumb, Typography, notification, Button, Select, Form, Image, Input } from 'antd';
import MainLayout from "../../../layout/MainLayout";
import { render } from "react-dom";
import { useRouter } from "next/router";
import axiosApi from '../../../libs/axiosApi';
import moment from "moment";
import Vacationform from '../../../components/vacations/Vacationform';
import BreadcrumbHome from '../../../components/BreadcrumbHome'

export default function HolidaysDetails() {
    const route = useRouter()
    const [formVacation] = Form.useForm();

    const { TabPane } = Tabs;
    const { Title } = Typography;
    const { Options } = Select;
    const [details, setDetails] = useState(null);
    const { id } = route.query;

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [departure_date, setDepartureDate] = useState(null);
    const [return_date, setReturnDate] = useState(null);

    const onCancel = () => {
        route.push("/holidays");
    };


    const getDetails = async () => {
        try {
            let response = await axiosApi.get(`/person/vacation/${id}/`);
            let data = response.data
            console.log("data", data);
            setDetails(data);
            setDepartureDate(data.departure_date)
            setReturnDate(data.return_date)
            setLoading(false);

        } catch (e) {
            console.log("error", e)
            setLoading(false);
        } 
    }

    const onChangeDepartureDate = (date, dateString) => {
        console.log(date);
        console.log(dateString);
        setDepartureDate(dateString);
    };
    
    const onChangeReturnDate = (date, dateString) => {
        setReturnDate(dateString);
    };
      
    const saveRequest = async (values) => {
        values["departure_date"] = departure_date;
        values["return_date"] = return_date;
        console.log(values);
        try {
            let response = await axiosApi.patch(`person/vacation/${id}/`, values);
            let data = response.data;
            notification["success"]({
              message: "Aviso",
              description: "Información enviada correctamente.",
            });
            route.push("/holidays");
            console.log("res", response.data);
          } catch (error) {
            console.log("error", error);
          } finally {
            setSending(false);
          }
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
                <BreadcrumbHome/>
                <Breadcrumb.Item href="/holidays">Vacaciones</Breadcrumb.Item>
                <Breadcrumb.Item>Editar solicitud</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width: "100%", padding: '20px 0' }}>
                <Row justify={'center'}>
                    <Col span={23}> 
                        {/* initialValues={{ 
                            'availableDays': collaborator ? collaborator.Available_days_vacation : null,
                            'khonnect_id' : collaborator ? collaborator.id : null
                             }} */}
                        <Vacationform details={details} onFinish={saveRequest} loading={loading} sending={sending} onChangeDepartureDate={onChangeDepartureDate} onChangeReturnDate={onChangeReturnDate} onCancel={onCancel} />
                    </Col>
                </Row>
            </div>
        </MainLayout >
    )
}