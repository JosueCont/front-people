import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button, Input } from "antd";
import HolidayIcon from '../icons/holidays';


const PayrollReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const [form] = Form.useForm();
    const [personList, setPersonList] = useState([]);
    const [collaboratorList, setCollaboratorList] = useState([]);

    /* Columnas de tabla */
    const columns = [
        {
            title: "Núm. de trabajador",
            dataIndex: "Colaborador",
            key: "Colaborador",
            fixed: 'left'
        },
        {
            title: "Nombre",
            dataIndex: "Empresa",
            key: "Empresa",
            fixed: 'left'
        },
        {
            title: "Departamento",
            dataIndex: "Departamento",
            key: "Departamento",
        },
        {
            title: "Puesto",
            dataIndex: "Dias solicitados",
            key: "Dias solicitados",
        },
        {
            title: "Fecha emisión",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
        },
        {
            title: "Percepción",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
        },
        {
            title: "Deducción",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
        },
        {
            title: "Total",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
        },
        {
            title: "Descuento",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
        },
        {
            title: "IMSS",
            dataIndex: "Dias disponibles",
            key: "Dias disponibles",
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

    return (
        <>
            <Row justify="space-between" style={{ padding: '10px 20px 10px 0px' }}>
                <Col>
                    <Form name="filter" layout="vertical" key="formFilter" className="formFilterReports">
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
                                <Form.Item key="numUSer" name="company" label="Num. trabajador">
                                    <Input style={{ width: 120 }} />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="department" name="company" label="Departamento">
                                    <Select style={{ width: 150 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="job" name="company" label="Puesto">
                                    <Select style={{ width: 120 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col style={{ 'display': 'flex' }}>
                                <Button
                                    style={{
                                        background: "#fa8c16",
                                        fontWeight: "bold",
                                        color: "white",
                                        marginTop: 'auto'
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
            <Row>
                <Col span={24}>
                    <Table
                        dataSource={collaboratorList}
                        key="tableHolidays"
                        columns={columns}
                    ></Table>
                </Col>
            </Row>
        </>
    );
}

export default PayrollReport;