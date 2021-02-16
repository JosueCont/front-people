import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Table, Row, Col, Select, Form, DatePicker, Button } from "antd";
import HolidayIcon from '../icons/holidays';


const CollaboratorsReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const [form] = Form.useForm();
    const [personList, setPersonList] = useState([]);
    const [collaboratorList, setCollaboratorList] = useState([]);

    /* Columnas de tabla */
    const columns = [
        {
            title: "Colaborador",
            dataIndex: "Colaborador",
            key: "Colaborador",
        },
        {
            title: "Empresa",
            dataIndex: "Empresa",
            key: "Empresa",
        },
        {
            title: "Departamento",
            dataIndex: "Departamento",
            key: "Departamento",
        },
        {
            title: "Puesto",
            dataIndex: "Puesto",
            key: "Puesto",
        },
        {
            title: "Fecha de ingreso",
            dataIndex: "Fecha de ingreso",
            key: "Fecha de ingreso",
        },
        {
            title: "Correo",
            dataIndex: "Correo",
            key: "Correo",
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
        },
    ];

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
                                <Form.Item key="company" name="company" label="Departamento">
                                    <Select style={{ width: 150 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item
                                    key="department_select"
                                    name="department"
                                    label="Puesto"
                                >
                                    <Select style={{ width: 150 }}></Select>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item key="estatus_filter" name="status" label="Fecha">
                                    <DatePicker format={"YYYY/MM/DD"} />
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

export default CollaboratorsReport;