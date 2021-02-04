import React, { useEffect, useState } from 'react';
import { Tabs, Radio, Row, Col, Breadcrumb, Typography, Button, Select, Form, Image, Input } from 'antd';
import MainLayout from "../../../../layout/MainLayout";
import { render } from "react-dom";
import { useRouter } from "next/router";
import axiosApi from '../../../../libs/axiosApi';
import moment from "moment";
import Vacationform from '../../../../components/vacations/Vacationform';

export default function HolidaysDetails() {
    const route = useRouter()

    const { TabPane } = Tabs;
    const { Title } = Typography;
    const { Options } = Select;
    const [details, setDetails] = useState(null);
    const { id } = route.query;
    const [form] = Form.useForm();

    const [sending, setSending] = useState(false);
    const [daysRequested, setDaysRequested] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [availableDays, setAvailableDays] = useState(null);
    const [personList, setPersonList] = useState(null);
    const [allPersons, setAllPersons] = useState(null);
    const [job, setJob] = useState(null);
    const [dateOfAdmission, setDateOfAdmission] = useState(null);

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

    const changePerson = (value) => {
        console.log(value);
        let index = allPersons.find(data => data.id === value)
        console.log(index)
        setDateOfAdmission(moment(index.date_of_admission).format('DD/MM/YYYY'))
        if (index.job_department.job) {
            setJob(index.job_department.job.name)
        }

    }

    const getDetails = async () => {
        try {
            let response = await axiosApi.get(`/person/vacation/${id}/`);
            let data = response.data
            console.log("data", data);
            setDaysRequested(data.days_requested);
            setDepartureDate(moment(data.departure_date).format('DD/MM/YYYY'));
            setReturnDate(moment(data.return_date).format('DD/MM/YYYY'));
            setAvailableDays(data.available_days);

            /* setLoading(false); */
            //setList(data.results)
        } catch (e) {
            console.log("error", e)
            /* setLoading(false); */
        }
    }

    const saveRequest = async (values) => {
        console.log(values);
    }

    useEffect(() => {
        if (id) {
            getDetails();
        }
    }, [route])

    return (
        <MainLayout currentKey="5">
            <Breadcrumb key="Breadcrumb" className={'mainBreadcrumb'}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Vacaciones</Breadcrumb.Item>
                <Breadcrumb.Item>Nueva solicitud</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width: "100%", padding: '20px 0' }}>
                <Row justify={'center'}>
                    <Col span={23}>
                        <Form form={form} layout="horizontal" onFinish={saveRequest}>
                            <Vacationform daysRequested={daysRequested} availableDays={availableDays} sending={sending} dateOfAdmission={dateOfAdmission} job={job} personList={personList} onChangeDepartureDate={onChangeDepartureDate} onCancel={onCancel} changePerson={changePerson} />
                        </Form>
                    </Col>
                </Row>
            </div>
        </MainLayout >
    )
}