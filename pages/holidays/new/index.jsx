import React, {useEffect, useState} from 'react'
import MainLayout from '../../../layout/MainLayout';
import { Row, Col, Typography, Table, Breadcrumb, Image, Button, Form, Input, InputNumber, Select, DatePicker, notification, Space, Switch } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";



export default function HolidaysNew() {
    const route = useRouter();
    const [form] = Form.useForm();
    const {Title} = Typography;
    const [sending, setSending] = useState(false);
    const { Option } = Select;
    const [departure_date, setDepartureDate] = useState(null);
    const [return_date, setReturnDate] = useState(null);
    const [job, setJob] = useState(null);
    const [dateOfAdmission, setDateOfAdmission] = useState(null);

    const [personList, setPersonList] = useState(null);
    const [allPersons, setAllPersons] = useState(null);


    const onCancel = () => {
        route.push("/holidays");
    };
    
    const changePerson = (value) => {
        console.log(value);
        let index = allPersons.find(data => data.id === value)
        console.log(index)
        setDateOfAdmission(moment(index.date_of_admission).format('DD/MM/YYYY'))
        if(index.job_department.job){
            setJob(index.job_department.job.name)
        }
        
    }

    const saveRequest =  async(values) =>{
        values['departure_date'] = departure_date;
        values['return_date'] = return_date;
        setSending(true);
        try {
            let response = await axiosApi.post(`/person/vacation/`, values);
            let data = response.data;
            notification["success"]({
              message: "Notification Title",
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

    const onChangeDepartureDate = (date, dateString) => {
        console.log('date', date);
        console.log('dateString', dateString);
        setDepartureDate(dateString)
    }

    const onChangeReturnDate = (date, dateString) =>{
        setReturnDate(dateString)
    }

    const getAllPersons = async () => {
        try {
            let response = await axiosApi.get(`/person/person/`);
            let data = response.data.results;
            setAllPersons(data);
            console.log(data);
            data = data.map((a) => {
                return { label: a.first_name+' '+a.flast_name, value: a.id, key: a.name+a.id };
              });
            setPersonList(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect( () => {
        getAllPersons();
    },[route])
    
    return (
        <MainLayout currentKey="5">
            <Breadcrumb key="Breadcrumb" className={'mainBreadcrumb'}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Vacaciones</Breadcrumb.Item>
                <Breadcrumb.Item>Nueva solicitud</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container back-white" style={{ width: "100%", padding:'20px 0' }}>
                <Row justify={'center'}>
                    <Col span={23}>
                        <Form form={form} layout="horizontal" onFinish={saveRequest}>
                            <Row>
                                <Col span={20} offset={4}>
                                    <Title key="dats_gnrl" level={4}>
                                        Solicitud
                                    </Title>
                                </Col>
                                <Col span="4">
                                <Image
                                    style={{ width: '80%' }}
                                    src="error"
                                    fallback="data:image/png;base64,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"

                                />
                                </Col>
                                <Col span="8">
                                    <Form.Item label="Empleado" labelCol={{ span: 9 }} labelAlign={'left'}>
                                        <Select options={personList} onChange={changePerson} />
                                    </Form.Item>
                                    <Form.Item label="Puesto" labelCol={{ span: 9 }} labelAlign={'left'}>
                                        <Input readOnly value={job} />
                                    </Form.Item>
                                    <Form.Item name="days_requested" label="Dias solicitados" labelCol={{ span: 9 }} labelAlign={'left'}>
                                        <InputNumber/>
                                    </Form.Item>
                                </Col>
                                <Col span="8" offset={1}>
                                    <Form.Item name="departure_date" label="Fecha de salida" labelCol={{ span: 9 }} labelAlign={'left'}>
                                        <DatePicker key="departure_date" onChange={onChangeDepartureDate} />
                                    </Form.Item>
                                    <Form.Item name="return_date" label="Fecha de rereso" labelCol={{ span: 9 }} labelAlign={'left'}>
                                    <DatePicker key="return_date" onChange={onChangeReturnDate} />
                                    </Form.Item>
                                    <Form.Item label="Dias disponibles" labelCol={{ span: 9 }} labelAlign={'left'}>
                                        <Select options={[]} />
                                    </Form.Item>
                                </Col>
                                <Col span={20} offset={4}>
                                    <Title key="dats_gnrl" level={4} style={{ marginTop: 10 }}>
                                        Información
                                    </Title>
                                </Col>
                                <Col span={8} offset={4}>
                                    <Form.Item label="Fecha de ingreso" labelCol={{ span: 9 }} labelAlign={'left'}>
                                        <Input readOnly value={dateOfAdmission}></Input>
                                    </Form.Item>
                                </Col>
                                <Col span={8} offset={1}>
                                    <Form.Item label="Antiguedad" labelCol={{ span: 9 }} labelAlign={'left'}>
                                        <Input readOnly></Input>
                                    </Form.Item>
                                </Col>
                                <Col span={24} style={{ textAlign: 'right' }}>
                                <Button key="cancel" onClick={() => onCancel()}  disabled={sending} style={{ padding: "0 50px", margin: "0 10px" }} >
                                    Cancelar
                                </Button>
                                <Button key="save" htmlType="submit" loading={sending} type="primary" style={{ padding: "0 50px", margin: "0 10px" }}>
                                    Guardar
                                </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    )
}