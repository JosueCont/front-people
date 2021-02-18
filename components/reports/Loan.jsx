import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button, Typography } from "antd";
import Axios from 'axios';
import { API_URL } from '../../config/config'
import { DownloadOutlined } from '@ant-design/icons'
import Link from "next/link";
import moment from "moment-timezone";

const LoanReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const [form] = Form.useForm();
    const { Title } = Typography;

    const [loading, setLoading] = useState(false);
    const [personList, setPersonList] = useState([]);
    const [lendingList, setLendingList] = useState([]);

    /* Columnas de tabla */
    const columns = [
        {
            title: "Colaborador",
            dataIndex: "periodicity",
            key: "Colaborador",
            width: 200,
            fixed: "left",
            render: (person, item) => {
                return (<>
                    {item.person.first_name} {item.person.mlast_name ? item.person.mlast_name : null}
                </>)
            }
        },
        {
            title: "Tipo de préstamo",
            dataIndex: "type",
            key: "type",
            render: (type) => {
                return (type == 'EMP' ? 'Empresa' : 'E-Pesos')
            }
        },
        {
            title: "Estatus",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                return (status === 1 ? 'Pendiente' : status === 2 ? 'Aprobado' : 'Rechazado')
            }
        },
        {
            title: "Plazo",
            dataIndex: "deadline",
            key: "deadline",
        },
        {
            title: "Periodicidad",
            dataIndex: "periodicity",
            key: "periodicity",
            render: (periodicity) => {
                return (periodicity === 1 ? 'Semanal' : periodicity === 2 ? 'Catorcenal' : periodicity === 3 ? 'Quincenal' : 'Mensual')
            }
        },
        {
            title: "Fecha de solicitud",
            dataIndex: "timestamp",
            key: "timestamp",
            render: (timestamp) => {
                return (moment(timestamp).format("DD/MM/YYYY"))
            }
        },
        {
            title: "Cantidad solicitada",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Pago realizado",
            dataIndex: "",
            key: "",
        },
        {
            title: "Saldo",
            dataIndex: "Saldo",
            key: "Saldo",
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
            render: (record, item) => {
                return (<DownloadOutlined onClick={() => download(item)} />)
            }
        },
    ];

    const download = async (item = null) => {

        let dataId = {}
        console.log(item);
        /* if (item) {
            dataId = {
                "id": item.id
            }
        } else {
            let collaborator = form.getFieldValue("collaborator");
            let department = form.getFieldValue("department");
            let job = form.getFieldValue("job");
            let date_of_admission = form.getFieldValue("date_of_admission");

            console.log('name', collaborator);
            if (collaborator) {
                dataId.collaborator = collaborator;
            }
            if (department) {
                dataId.department = department;
            }
            if (job) {
                dataId.job = job;
            }
            if (date_of_admission) {
                dataId.date_of_admission = date_of_admission;
            }
        } */
        console.log(dataId);
        try {
            let response = await Axios.post(API_URL + `/payroll/loan/download_data/`, dataId);
            const type = response.headers["content-type"];
            const blob = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = item.name ? item.name + ".csv" : "Reporte_de_prestamos.csv";
            link.click();
        } catch (e) {
            console.log(e);
        }
    }

    const getAllPersons = async () => {
        try {
            let response = await axiosApi.get(`/person/person/`);
            let data = response.data.results;
            let list = [];
            data = data.map((a, index) => {
                let item = {
                    label: a.first_name + " " + a.flast_name,
                    value: a.id,
                    key: a.id + index,
                };
                list.push(item);
            });
            setPersonList(list);
        } catch (e) {
            console.log(e);
        }
    };

    const getLending = async (personID = null, type = null, periodicity = null, date = null) => {
        setLoading(true);
        try {
            let url = API_URL + `/payroll/loan/?`;
            if (personID) {
                url += `  =${personID}&`
            }
            if (type) {
                url += `type=${type}&`;
            }
            if (periodicity) {
                url += `periodicity=${periodicity}`
            }
            if (date) {
                date = moment(`${date} 00:00:01`).tz("America/Merida").format();
                url += `timestamp=${date}`
            }

            let response = await Axios.get(url);
            let data = response.data.results;
            console.log(data);
            setLendingList(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const filterReport =  (values) => {
        console.log(values);
        /* getLending(values.person, values.type) */
    }

    useEffect(() => {
        getLending()
    }, [])

    return (
        <>
            <Row justify="space-between" style={{ paddingRight: 20 }}>
                <Col span={24}>
                    <Title level={5}>
                        Préstamos
                    </Title>
                    <hr />
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
                                    name="person__id"
                                    label="Colaborador"
                                >
                                    {props.selectCollaborator}

                                    
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="type" name="type" label="Tipo">
                                    <Select style={{ width: 150 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    key="periodicity"
                                    name="periodicity"
                                    label="Periodicidad"
                                >
                                    <Select style={{ width: 150 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="timestamp" name="timestamp" label="Fecha">
                                    <DatePicker format={"YYYY/MM/DD"} />
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
            <Row style={{ padding: "10px 20px 10px 0px" }}>
                <Col span={24}>
                    <Table
                        loading={loading}
                        scroll={{ x: 1500 }}
                        dataSource={lendingList}
                        key="tableHolidays"
                        columns={columns}
                    ></Table>
                </Col>
            </Row>
        </>
    );
};

export default LoanReport;
