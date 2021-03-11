import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Table,
    Row,
    Col,
    Select,
    Form,
    DatePicker,
    Button,
    Typography,
} from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import SelectCollaborator from "../../components/selects/SelectCollaboratorItemForm";
import SelectCompany from "../../components/selects/SelectCompany";
import SelectDepartment from "../../components/selects/SelectDepartment";
import jsCookie from "js-cookie";

const HolidaysReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const [form] = Form.useForm();
    const { Title } = Typography;

    /* Variables para el filtro */
    const [colaborator, setColaborator] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [holidayList, setHolidayList] = useState([]);
    const [permissions, setPermissions] = useState({});

    /* Columnas de tabla */
    const columns = [
        {
            title: "Colaborador",
            dataIndex: "collaborator",
            key: "collaborator",
            render: (collaborator) => {
                return (
                    <>
                        {collaborator.first_name ? collaborator.first_name : null}
                        {collaborator.flast_name ? collaborator.flast_name : null}
                    </>
                );
            },
        },
        {
            title: "Empresa",
            dataIndex: "business",
            key: "business",
            render: (bussines) => {
                return bussines == "N/A" ? "" : bussines;
            },
        },
        {
            title: "Departamento",
            dataIndex: "department",
            key: "department",
            render: (department) => {
                return department == "N/A" ? "" : department;
            },
        },
        {
            title: "Días solicitados",
            dataIndex: "days_requested",
            key: "days_requested",
        },
        {
            title: "Días disponibles",
            dataIndex: "collaborator",
            key: "available_days",
            render: (collaborator) => {
                return (
                    <>{collaborator ? collaborator.Available_days_vacation : null}</>
                );
            },
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
            render: (record, item) => {
                return (
                    <>
                        {permissions.vacations && (
                            <DownloadOutlined onClick={() => download(item)} />
                        )}
                    </>
                );
            },
        },
    ];

    const filterHolidays = async (values) => {
        setColaborator(values.collaborator);
        setCompanyId(values.company);
        setDepartmentId(values.department);

        getAllHolidays(values.collaborator, values.company, values.department);
    };

    const getAllHolidays = async (
        collaborator = null,
        company = null,
        department = null,
        status = null
    ) => {
        setHolidayList([]);
        setLoading(true);
        try {
            let url = `/person/vacation/?`;
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
            data.map((item, index) => {
                item.key = index;
                return item;
            });

            setHolidayList(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const download = async (item = null) => {
        let dataId = {};

        if (item) {
            dataId = {
                vacation_id: item.id,
                collaborator: item.collaborator.id,
            };
        } else {
            if (colaborator) {
                dataId.collaborator = colaborator;
            }
            if (companyId) {
                dataId.node = companyId;
            }
            if (departmentId) {
                dataId.department = departmentId;
            }
        }

        try {
            let response = await Axios.post(
                API_URL + `/person/vacation-report-export`,
                dataId
            );
            const type = response.headers["content-type"];
            const blob = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = item ? "Reporte_de_Vacaciones(" +
                (item.collaborator.first_name ? item.collaborator.first_name : null) + "_" +
                (item.collaborator.flast_name ? item.collaborator.flast_name : null) + "_" +
                (item.collaborator.mlast_name ? item.collaborator.mlast_name : null) + ").csv"
                : "Reporte_de_Vacaciones.csv";
            link.click();
        } catch (e) {
            console.log(e);
        }
    };

    const onChangeCompany = (val) => {
        form.setFieldsValue({
            department: null,
        });
        setCompanyId(val);
    };

    useEffect(() => {
        const jwt = JSON.parse(jsCookie.get("token"));
        searchPermissions(jwt.perms);
        getAllHolidays();
    }, []);
    const searchPermissions = (data) => {
        const perms = {};
        data.map((a) => {
            if (a.includes("people.report.function.export_vacations"))
                perms.vacations = true;
        });
        setPermissions(perms);
    };

    return (
        <>
            <Row justify="space-between" style={{ paddingRight: 20 }}>
                <Col span={24}>
                    <Title level={5}>Vacaciones</Title>
                    <hr />
                </Col>
                <Col>
                    <Form
                        form={form}
                        name="filter"
                        layout="vertical"
                        key="formFilter"
                        className="formFilterReports"
                        onFinish={filterHolidays}
                    >
                        <Row gutter={[24, 8]}>
                            <Col>
                                <SelectCollaborator
                                    name="collaborator"
                                    style={{ width: 150 }}
                                />
                            </Col>
                            <Col>
                                <SelectCompany
                                    name="company"
                                    onChange={onChangeCompany}
                                    key="SelectCompany"
                                    style={{ width: 150 }}
                                />
                            </Col>
                            <Col>
                                <SelectDepartment
                                    name="department"
                                    companyId={companyId}
                                    key="selectDepartament"
                                />
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
                    {permissions.vacations && (
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
                    )}
                </Col>
            </Row>
            <Row style={{ padding: "10px 20px 10px 0px" }}>
                <Col span={24}>
                    <Table
                        loading={loading}
                        dataSource={holidayList}
                        key="tableHolidays"
                        columns={columns}
                    ></Table>
                </Col>
            </Row>
        </>
    );
};

export default HolidaysReport;
