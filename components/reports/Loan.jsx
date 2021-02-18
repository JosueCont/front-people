import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button, Typography } from "antd";
import Axios from 'axios';
import { API_URL } from '../../config/config'
import { DownloadOutlined } from '@ant-design/icons'
import Link from "next/link";
import moment from "moment-timezone";
import SelectCollaborator from '../selects/SelectCollaboratorItemForm'

const LoanReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const [form] = Form.useForm();
    const { Title } = Typography;

    const [dateLoan, setDateLoan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [personList, setPersonList] = useState([]);
    const [lendingList, setLendingList] = useState([]);

    /* PAra la descarga */
    const [person_id, setPerson_id] = useState(null);
    const [type, setType] = useState(null);
    const [periodicity, setPeriodicity] = useState(null);

    /* Columnas de tabla */
    const columns = [
        {
            title: "Colaborador",
            dataIndex: "periodicity",
            key: "Colaborador",
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

    /* Options for select */
    const optionsType = [
        {
            label: 'Empresa' ,
            value: 'EMP',
            key: 'EMP',
        },
        /* {
            label: 'E-Pesos' ,
            value: 'EPS',
            key: 'EPS',
        } */
    ]
    const optionPeriodicity = [
        {
            label: 'Semanal' ,
            value: '1',
            key: 'Semanal',
        },
        {
            label: 'Catorcenal' ,
            value: '2',
            key: 'Catorcenal',
        },
        {
            label: 'Quincenal' ,
            value: '3',
            key: 'Quincenal',
        },
        {
            label: 'Mensual' ,
            value: '4',
            key: 'Mensual',
        }
    ]

    const changeDate = (date, strDate) =>{
        setDateLoan(strDate);
    }

    const download = async (item = null) => {
        console.log(item);
        let dataId = {}
        
        if (item) {
            dataId = {
                "loan_id": item.id
            }
        } else {
            if (person_id) {
                dataId.person__id = person_id;
            }
            if (type) {
                dataId.type = type;
            }
            if (periodicity) {
                dataId.periodicity = periodicity;
            }
            if (dateLoan) {
                dataId.perioditimestampcity = dateLoan;
            }
        }
        console.log('dataID', dataId);
        
        try {
            let response = await Axios.post(API_URL + `/payroll/loan/download_data/`, dataId);
            
            const type = response.headers["content-type"];
            const blob = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = item ? item.person.first_name+'_'+item.person.mlast_name + ".csv" : "Reporte_de_prestamos.csv";
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
                url += `person__id=${personID}&`
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
            
            setLendingList(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const filterReport =  (values) => {
        setPerson_id(values.person__id);
        setType(values.type);
        setPeriodicity(values.periodicity);
        getLending( values.person__id, values.type, values.periodicity, dateLoan);
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
                    form={form}
                        name="filter"
                        layout="vertical"
                        key="formFilter"
                        className="formFilterReports"
                        onFinish={filterReport}
                    >
                        <Row gutter={[24, 8]}>
                            <Col>
                            <SelectCollaborator name="person__id" />
                            </Col>
                            <Col>
                                <Form.Item key="type" name="type" label="Tipo">
                                    <Select style={{ width: 150 }} options={optionsType} allowClear />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    key="periodicity"
                                    name="periodicity"
                                    label="Periodicidad"
                                >
                                    <Select style={{ width: 150 }} options={optionPeriodicity} allowClear />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="timestamp" name="timestamp" label="Fecha">
                                    <DatePicker format={"YYYY/MM/DD"} onChange={changeDate} />
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
                                    loading={loading}
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
                        disabled={loading}

                    >
                        Descargar
          </Button>
                </Col>
            </Row>
            <Row style={{ padding: "10px 20px 10px 0px" }}>
                <Col span={24}>
                    <Table
                        loading={loading}
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
