import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button, Input, Typography } from "antd";
import { API_URL } from "../../config/config";
import Axios from 'axios';
import moment from 'moment';
import SelectCompany from '../selects/SelectCompany';
import SelectDepartment from '../selects/SelectDepartment';
import SelectCollaborator from '../selects/SelectCollaboratorItemForm';



const PayrollReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const {Title, Text} = Typography; 
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)
    const [personList, setPersonList] = useState([]);
    const [payrollList, setPayrollList] = useState([]);
    const [jobList, setJobList] = useState([])
    
    /* Variables para el filtro */
    const [collaborator, setCollaborator] = useState(null);
    const [code, setCode] = useState(null);
    const [companyId ,setCompanyId] = useState(null);
    
    const [departmentId, setDepartmentId] = useState(null);
    const [job, setJob] = useState(null);
    

    /* Columnas de tabla */
    const columns = [
        {
            title: "Núm. de trabajador",
            dataIndex: "Colaborador",
            key: "Colaborador",
            
        },
        {
            title: "Nombre",
            dataIndex: "Empresa",
            key: "Empresa",
            
        },
        {
            title: "Departamento",
            dataIndex: "Ddepartment",
            key: "Departamento",
        },
        {
            title: "Puesto",
            dataIndex: "job",
            key: "job",
        },
        {
            title: "Fecha emisión",
            dataIndex: "timestamp",
            key: "timestamp",

            render: (date) => {
                return (
                    moment(date).format("DD-MMM-YYYY")
                )
            }
        },
        {
            title: "Percepción",
            dataIndex: "total_perceptions",
            key: "total_perceptions",
        },
        {
            title: "Deducción",
            dataIndex: "total_deductions",
            key: "total_deductions",
        },
        {
            title: "Total",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Descuento",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
        },
        {
            title: "IMSS",
            dataIndex: "imss",
            key: "imss",
        },
        {
            title: "ISR",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
        },
    ];
    
    const getJobs = async () => {
        try {
            let response = await Axios.get(API_URL+`/business/department/${departmentId}/job_for_department/`)
            let data = response.data;
            console.log(data);
            data = data.map((item,index) => {
                return {
                    label: item.name,
                    value: item.id,
                    key: item.id+index,
                  };
            })
            setJobList(data)
        } catch (error) {
            console.log(error);
        }
    }

    const onChangeCompany = (val) => {
        form.setFieldsValue({
            department: null,
        });
        setCompanyId(val);
    };

    const onChangeDepartment = (val) => {
        form.setFieldsValue({
            job: null,
        });
        setDepartmentId(val);
    };

    const filterReport = (values) => {
        setCollaborator(values.collaborator);
        setCode(values.code);
        setCompanyId(values.company);
        setDepartmentId(values.department);
        setJob(values.job);
        console.log(values);
        getPatroll(values.collaborator, values.code, values.company, values.department, values.job)
        /* let d1 = null;
        let d2 = null;
        if (dateLoan) {
            d1 = moment(`${dateLoan} 00:00:01`).tz("America/Merida").format();
            d2 = moment(`${dateLoan} 23:59:00`).tz("America/Merida").format();
            setTimestampGte(d1);
            setTimestampLte(d2);
        }
        getPatroll(values.person__id, values.type, values.periodicity, d1, d2); */
    }


    const getPatroll = async (collaborator = null, code = null, company = null, department = null, job = null) => {
        setLoading(true);
        setPayrollList([])
        try {
            let info = {};
            if (collaborator) {
                info['collaborator'] = collaborator;
            }
            if (code) {
                info['code'] = code;
            }
            if (company) {
                info['company'] = company;
            }
            if (department) {
                info['department'] = department;
            }
            if(job) {
                info['job'] = job;
            }

            let response = await Axios.post(API_URL+`/payroll/payroll-voucher/get_report/`, info);
            console.log(response);
            let data = response.data;
            data = data.map((item)=>{
                item.key = item.id;
                return item;
            })
            setPayrollList(data);
            /* setLendingList(data); */
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const download = async (item = null) => {
        let dataId = {}

        if (item) {
            dataId = {
                "vacation_id": item.id,
                "collaborator": item.collaborator.id
            }
        } else {
            if (collaborator) {
                dataId.collaborator = collaborator;
            }
            if (code) {
                dataId.code = code;
            }
            /* if (company) {
                dataId.company = company;
            } */
            if (departmentId) {
                dataId.department = departmentId;
            }
            if(job) {
                dataId.job = job;
            }
        }

        try {
            let response = await Axios.post(API_URL+`/payroll/payroll-voucher/export_report/`, dataId);
            const type = response.headers["content-type"];
            const blob = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = item ? item.collaborator.first_name + item.collaborator.flast_name + ".csv" : "Reporte_de_Vacaciones.csv";
            link.click();
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        /* getAllPersons(); */
        getPatroll()
    }, [])

    useEffect(() => {
        getJobs()
    }, [departmentId])

    return (
        <>
            <Row justify="space-between" style={{ padding: "10px 20px 10px 0px" }}>
                <Col span={24}>
                    <Title level={5}>
                        Nominas
                    </Title>
                    <hr />
                </Col>
                <Col>
                    <Form
                        name="filter"
                        fomr={form}
                        layout="vertical"
                        key="formFilter"
                        className="formFilterReports"
                        onFinish={filterReport}
                    >
                        <Row gutter={[24, 8]}>
                            <Col>
                                < SelectCollaborator name="collaborator" />
                            </Col>
                            <Col>
                                <Form.Item key="numUSer" name="code" label="Num. trabajador">
                                    <Input style={{ width: 120 }} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="company" name="company" label="Empresa">
                                    <SelectCompany onChange={onChangeCompany} key="SelectCompany" style={{ width: 150 }} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <SelectDepartment
                                onChange={onChangeDepartment}
                                    name="department"
                                    companyId={companyId}
                                    key="selectDepartament"
                                />
                            </Col>
                            <Col>
                                <Form.Item key="job" name="job" label="Puesto">
                                    <Select style={{ width: 120 }} options={jobList} allowClear/>
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
                        onClick={() => download()}
                        key="btn_new"
                    >
                        Descargar
          </Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        dataSource={payrollList}
                        key="tableHolidays"
                        columns={columns}
                        scroll={{ x: 1300 }}
                    ></Table>
                </Col>
            </Row>
        </>
    );
};

export default PayrollReport;
