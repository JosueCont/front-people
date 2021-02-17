import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button, Typography } from "antd";
import Axios from 'axios';
import {API_URL} from '../../config/config'
import moment from 'moment'
import {DownloadOutlined} from '@ant-design/icons'

const CollaboratorsReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const [form] = Form.useForm();
    const { Title } = Typography;

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [dateOfAdmission, SetDateOfAdmission] = useState(null)
    const [personList, setPersonList] = useState([]);
    const [departmentList, setDepartmentList] = useState([])
    const [collaboratorList, setCollaboratorList] = useState([]);
    const [jobList, SetJobList] = useState([]);

    /* Columnas de tabla */
    const columns = [
        {
            title: "Colaborador",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Empresa",
            dataIndex: "business",
            key: "business",
        },
        {
            title: "Departamento",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Puesto",
            dataIndex: "job",
            key: "job",
        },
        {
            title: "Fecha de ingreso",
            dataIndex: "date_of_admission",
            key: "date_of_admission",
            render: (date) => {
                return ( date ? moment(date).format("DD / MM / YYYY") : null );
              },
        },
        {
            title: "Correo",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
            render: (item) => {
                return (<DownloadOutlined />)
            }
        },
    ];

    const getAllPersons = async () => {
        try {
          let response = await Axios.get(API_URL+`/person/person/`);
          let data = response.data.results;
          data = data.map((a,index) => {
            return {
              label: a.first_name + " " + a.flast_name,
              value: a.id,
              /* value: a.id, */
              key: a.id+index,
            };
          });
          setPersonList(data);
        } catch (e) {
          console.log(e);
        }
    };


    const getCollaborators = async (values = null) =>{
        setCollaboratorList([])
        setLoading(true);
        let QueryData = {};
        if(values && values.collaborator){
            QueryData['collaborator'] = values.collaborator
        }
        if(values && values.department){
            QueryData['department'] = values.department
        }
        if(values && values.job){
            QueryData['job'] = values.job
        }
        if(values && values.date_of_admission){
            QueryData['date_of_admission'] = values.date_of_admission
        }
        console.log(QueryData)
        try {
            let response = await Axios.post(API_URL+`/person/employee-report`,QueryData)
            let data = response.data;
            console.log(data.lenght)
            if(data.lenght === 1){
                data = [data];
            }
            setCollaboratorList(data);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
        }
    }

    const getJobs = async (idDepartment) => {
        try {
            let response = await Axios.get(API_URL+`/business/department/${idDepartment}/job_for_department/`)
            let data = response.data;
            console.log(data);
            data = data.map((item,index) => {
                return {
                    label: item.name,
                    value: item.id,
                    key: item.id+index,
                  };
            })
            SetJobList(data)
        } catch (error) {
            console.log(error);
        }
    }

    const getDepartaments = async () => {
        try {
            let response = await Axios.get(API_URL+`/business/department/`)
            let data = response.data.results;
            data = data.map((a, index) => {
                let item = {
                    label: a.name,
                    value: a.id,
                    key: a.id+index,
                };
                return item;
            });
            setDepartmentList(data);
        } catch (error) {
            console.log(error);
        }
    }
    /* /business/department/ */

    const filterReport = async (values) => {
        values['date_of_admission'] = dateOfAdmission;
        console.log(values);
        getCollaborators(values);
    }

    const changeDate = (date, dateString) => {
        SetDateOfAdmission(dateString);
      };

    useEffect(() =>{
        getCollaborators();
        getAllPersons();
        getDepartaments();
    },[route])

    return (
        <>
            <Row justify="space-between" style={{ paddingRight: 20 }}>
                <Col span={24}>
                    <Title level={5}>
                        Colaboradores
                    </Title>
                    <hr/>
                </Col>
                <Col>
                    <Form
                        name="filter"
                        layout="vertical"
                        key="formFilter"
                        className="formFilterReports"
                        onFinish={filterReport}
                    >
                        <Row gutter={[24, 8]}>
                            <Col>
                                <Form.Item
                                    key="collaborator"
                                    name="collaborator"
                                    label="Colaborador"
                                >
                                    <Select
                                        key="selectPerson"
                                        showSearch
                                        /* options={personList} */
                                        style={{ width: 150 }}
                                        allowClear
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) =>
                                            optionA.children
                                                .toLowerCase()
                                                .localeCompare(optionB.children.toLowerCase())
                                        }
                                    >
                                        {personList
                                            ? personList.map((item) => {
                                                return (
                                                    <Option key={item.key} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                );
                                            })
                                            : null}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="department" name="department" label="Departamento">
                                    <Select options={departmentList} style={{ width: 150 }} onChange={getJobs} allowClear />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    key="job"
                                    name="job"
                                    label="Puesto"
                                >
                                    <Select style={{ width: 150 }} options={jobList}  allowClear/>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="date_of_admission" name="date_of_admission" label="Fecha">
                                    <DatePicker format={"YYYY-MM-DD"} onChange={changeDate} />
                                </Form.Item>
                            </Col>
                            <Col style={{ display: "flex" }}>
                                <Button
                                    style={{
                                        background: "#fa8c16",
                                        fontWeight: "bold",
                                        color: "white",
                                        marginTop: "auto",
                                    }}
                                    key="buttonFilter"
                                    htmlType="submit"
                                >
                                    Filtrar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col className="columnRightFilter">
                    <Button
                        style={{
                            background: "#fa8c16",
                            fontWeight: "bold",
                            color: "white",
                        }}
                        onClick={() => route.push("holidays/new")}
                        key="btn_new"
                    >
                        Descargar
                    </Button>
                </Col>
            </Row>
            <Row style={{ paddingRight: 20 }}>
                <Col span={24} style={{ marginTop: 20 }}>
                    <Table
                        dataSource={collaboratorList}
                        key="tableHolidays"
                        columns={columns}
                    ></Table>
                </Col>
            </Row>
        </>
    );
};

export default CollaboratorsReport;
