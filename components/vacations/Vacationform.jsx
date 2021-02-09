import React, { useState, useEffect } from 'react';
import { Typography, Button, Form, Row, Col, Input, Image, Select, InputNumber, DatePicker } from 'antd';
import moment from "moment";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import { set } from 'js-cookie';
import { route } from 'next/dist/next-server/server/router';
/* import SelectPerson from '../../components/selects/SelectPerson' */


const Vacationform = (props) => {
    const { Title } = Typography;

    const [formVacation] = Form.useForm();

    const {Option} = Select;

    const [loading, setLoading] = useState(props.loading ? props.loading : true);

    const [allPersons, setAllPersons] = useState(null);
    const [personList, setPersonList] = useState(null);
    /* const [person, setPerson] = useState(null); */
    /* const [job, setJob] = useState(null); */
    /* const [dateOfAdmission, setDateOfAdmission] = useState(null); */
    /* const [antiquity, setAntiquity] = useState(null); */
    /* const [availableDays, setAvailableDays] = useState(null); */



    const changePerson = (value) => {
        console.log(value);
        if(value){
            let index = allPersons.find(data => data.khonnect_id === value)
            console.log(index);
            formVacation.setFieldsValue({
                /* khonnect_id: index.collaborator.id, */
                /* days_requested: index.days_requested, */
                antiquity: index.antiquity,
                availableDays: index.Available_days_vacation,
                dateOfAdmission: index.date_of_admission ? moment(index.date_of_admission).format('DD-MM-YYYY'): null
            });
            if(index.job_department){
                formVacation.setFieldsValue({
                    job: index.job_department.department.name
                })
            }
        }else{
            formVacation.setFieldsValue({
                antiquity: null,
                availableDays: null,
                days_requested: null,
                dateOfAdmission: null,
                job: null
            });
        }
    }

    const getAllPersons = async () => {
        try {
          let response = await axiosApi.get(`/person/person/`);
          let data = response.data.results;
          setAllPersons(data);
          console.log(data);
          data = data.map((a,index) => {
            return {
              label: a.first_name + " " + a.flast_name,
              value: a.khonnect_id,
              /* value: a.id, */
              key: a.id+index,
            };
          });
          setPersonList(data);
        } catch (e) {
          console.log(e);
        }
    };

    useEffect(() =>{
        /* if(person){
            console.log('perona', person);
            setAntiquity(person.antiquity);
            setAvailableDays(person.Available_days_vacation);
            if (person.job_department.job) {
                setJob(person.job_department.job.name)
            } 
        } */
        if(props.details){
            console.log('details', props.details);
            formVacation.setFieldsValue({
                khonnect_id: props.details.collaborator ? props.details.collaborator.khonnect_id : null,
                days_requested: props.details.days_requested,
                antiquity: props.details.collaborator  ? props.details.collaborator.antiquity : null,
                availableDays: props.details.collaborator ? props.details.collaborator.Available_days_vacation : null,
                dateOfAdmission: props.details.collaborator ? moment(props.details.collaborator.date_of_admission).format('DD-MM-YYYY'): null,
                departure_date: props.details.departure_date ? moment(props.details.departure_date, 'YYYY-MM-DD'): null,
                return_date: props.details.return_date ? moment(props.details.return_date, 'YYYY-MM-DD'): null
            });
            if (props.details.collaborator && props.details.collaborator.job_department.job) {
                formVacation.setFieldsValue({
                    job: props.details.collaborator.job_department.job.name
                })
                
            } 
        }
    },[allPersons])

    useEffect(() =>{
        getAllPersons()
    },[])


    return (
        <Form form={formVacation} layout="horizontal" onFinish={props.onFinish} >
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
                    <Form.Item label="Empleado" name="khonnect_id" labelCol={{ span: 9 }} labelAlign={'left'}>
                        <Select 
                        /* options={personList} */
                            key="selectPerson"
                            onChange={changePerson}
                            showSearch
                            /* options={personList} */
                            style={{ width:150 }}
                            allowClear 
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                        >
                            {
                                    personList ? personList.map((item) => {
                                    return (<Option key={item.key} value={item.value}>{item.label}</Option>)
                                }) : null
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Puesto" name="job" labelCol={{ span: 9 }} labelAlign={'left'}>
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item name="days_requested" label="Días solicitados" labelCol={{ span: 9 }} labelAlign={'left'}>
                        <InputNumber  /* defaultValue={props.daysRequested ? props.daysRequested : null } */ min={1} max={10} style={{ width:'100%' }} />
                    </Form.Item>
            </Col>
            <Col span="8" offset={1}>
                <Form.Item name="departure_date" label="Fecha de salida" labelCol={{ span: 9 }} labelAlign={'left'}>
                    <DatePicker key="departure_date"  style={{ width:'100%' }} onChange={props.onChangeDepartureDate} />
                </Form.Item>
                <Form.Item name="return_date" label="Fecha de regreso" labelCol={{ span: 9 }} labelAlign={'left'}>
                    <DatePicker key="return_date"  style={{ width:'100%' }} onChange={props.onChangeReturnDate} />
                </Form.Item>
                <Form.Item name="availableDays" label="Días disponibles"  labelCol={{ span: 9 }} labelAlign={'left'}>
                    <Input /* defaultValue={availableDays} */   /* value={availableDays} */ readOnly />
                </Form.Item>
            </Col>
            <Col span={20} offset={4}>
                <Title key="dats_gnrl" level={4} style={{ marginTop: 10 }}>
                    Información
                                    </Title>
            </Col>
            <Col span={8} offset={4}>
                <Form.Item label="Fecha de ingreso" name="dateOfAdmission" labelCol={{ span: 9 }} labelAlign={'left'}>
                    <Input readOnly  /* defaultValue={dateOfAdmission ? moment(dateOfAdmission, 'YYYY-MM-DD'): null} */ />
                </Form.Item>
            </Col>
            <Col span={8} offset={1}>
                <Form.Item label="Antigüedad" name="antiquity" labelCol={{ span: 9 }} labelAlign={'left'}>
                    <Input readOnly  />
                </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
                <Button key="cancel" onClick={props.onCancel} disabled={props.sending} style={{ padding: "0 50px", margin: "0 10px" }} >
                    Cancelar
                                </Button>
                <Button key="save" htmlType="submit" loading={props.sending} type="primary" style={{ padding: "0 50px", margin: "0 10px" }}>
                    Guardar
                                </Button>
            </Col>
        </Row>
        </Form>
    )
}

export default Vacationform;