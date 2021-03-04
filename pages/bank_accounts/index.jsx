import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import moment from 'moment'
import Axios from 'axios';
import { API_URL } from '../../config/config'

import SelectCollaborator from '../../components/selects/SelectCollaboratorItemForm';
import SelectCompany from "../../components/selects/SelectCompany";
/* import SelectDepartment from "../../components/selects/SelectDepartment"; */
import BreadcrumbHome from "../../components/BreadcrumbHome";

import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    PlusOutlined,
    EyeOutlined,
    FileDoneOutlined
} from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";

const BankAccounts = () => {
    const { Column } = Table;
    const route = useRouter();
    const [form] = Form.useForm();
    const { Option } = Select;

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [incapacityList, setIncapacityList] = useState([]);
    const [personList, setPersonList] = useState(null);

    /* Variables */
    const [companyId, setCompanyId] = useState(null);
    const [departamentId, setDepartamentId] = useState(null);

    /* Select estatus */
    const optionStatus = [
        { value: 1, label: "Pendiente", key: "opt_1" },
        { value: 2, label: "Aprobado", key: "opt_2" },
        { value: 3, label: "Rechazado", key: "opt_3" },
    ];

    /* Select type */
    const optionType = [
        { value: 1, label: "Verificación", key: "opt_1" },
        { value: 2, label: "Actualización", key: "opt_2" }
    ];

    /* Columns */
    const columns = [
        {
            title: "Colaborador",
            dataIndex: "collaborator",
            key: "collaborator"
        },
        {
            title: "Empresa",
            dataIndex: "business",
            key: "business"
        },
        {
            title: "Numero de cuenta",
            dataIndex: "account",
            key: "AccountNumber",
        },
        {
            title: "Banco",
            dataIndex: "bank",
            key: "bank",
        },
        {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Estatus",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Acciones",
            key: "actions"
        }

    ]

    const getIncapacity = async (collaborator = null, company = null, department = null, status = null) => {
        setLoading(true);
        try {
            let url = `/person/incapacity/?`;
            if (collaborator) {
                url += `person__id=${collaborator}&`;
            }
            if (status) {
                url += `status=${status}&`;
            }

            if (company) {
                url += `person__job__department__node__id=${company}&`;
            }

            if (department) {
                url += `person__job__department__id=${department}&`;
            }
            let response = await Axios.get(API_URL + url);
            let data = response.data.results;
            console.log('data', data);
            data = data.map((item) => {
                item.key = item.id
                return item;
            });

            setIncapacityList(data);

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setSending(false);
        }
    };

    const GotoDetails = (data) => {
        console.log(data);
        route.push("incapacity/" + data.id + "/details");
    };

    const filter = async (values) => {
        setSending(true);
        setIncapacityList([])
        console.log(values)
        /* getIncapacity(
            values.collaborator,
            values.company,
            values.department,
            values.status
        ); */
    };

    /* Eventos de componentes */
    const onChangeCompany = (val) => {
        form.setFieldsValue({
            department: null,
        });
        setCompanyId(val);
    };

    const changeDepartament = (val) => {
        setDepartamentId(val);
    };

    useEffect(() => {
        /* getIncapacity(); */
    }, [route]);


    return (
        <MainLayout currentKey="7.5">
            <Breadcrumb className={"mainBreadcrumb"}>
                <Breadcrumb.Item className={'pointer'} onClick={() => route.push({ pathname: "/home" })}>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item>Incapacidad</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                <Row justify="space-between" style={{ paddingBottom: 20 }}>
                    <Col>
                        <Form name="filter" onFinish={filter} layout="vertical" key="formFilter" className={'formFilter'}>

                            <Row gutter={[24, 8]}>
                                <Col>
                                    <SelectCollaborator name={'collaborator'} style={{ width: 150 }} />
                                </Col>
                                <Col>
                                    <SelectCompany name="company" label="Empresa" onChange={onChangeCompany} key="SelectCompany" style={{ width: 150 }} />
                                </Col>
                                {/* <Col>
                                    <SelectDepartment companyId={companyId} onChange={changeDepartament} key="SelectDepartment" />
                                </Col> */}
                                <Col>
                                    <Form.Item key="account_number_filter" name="account_number" label="Numero de cuenta">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item key="bank_filter" name="bank" label="Banco">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item key="type_filter" name="type" label="Tipo de solicitud">
                                        <Select style={{ width: 100 }} key="select_type" options={optionType} allowClear />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item key="estatus_filter" name="status" label="Estatus">
                                        <Select style={{ width: 100 }} key="select_status" options={optionStatus} allowClear />
                                    </Form.Item>
                                </Col>
                                <Col style={{ display: 'flex' }}>
                                    <Button
                                        style={{
                                            background: "#fa8c16",
                                            fontWeight: "bold",
                                            color: "white",
                                            marginTop: 'auto'
                                        }}
                                        key="buttonFilter"
                                        htmlType="submit"
                                        loading={loading}
                                    >
                                        <SearchOutlined />
                                    Filtrar
                                </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row justify="end">
                    <Col span={24}>
                        <Table dataSource={incapacityList} key="tableHolidays" loading={loading} columns={columns}>
                        </Table>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default withAuthSync(BankAccounts);
