import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Table,
    Row,
    Col,
    Tooltip,
    Select,
    Form,
    DatePicker,
    Button,
    Typography,

} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    InfoCircleOutlined,
    SyncOutlined,
    SearchOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import Link from "next/link";
import SelectCompany from "../selects/SelectCompany";
import SelectDepartment from "../selects/SelectDepartment";
import SelectJob from "../selects/SelectJob";
import SelectCollaborator from "../selects/SelectCollaboratorItemForm";
import jsCookie from "js-cookie";

const CollaboratorsReport = (props) => {
    const route = useRouter();
    const { Option } = Select;
    const [form] = Form.useForm();
    const { Title } = Typography;

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [dateOfAdmission, SetDateOfAdmission] = useState(null);
    const [personList, setPersonList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [collaboratorList, setCollaboratorList] = useState([]);
    const [jobList, SetJobList] = useState([]);

    /* for filter */
    const [collaborator, setCollaborator] = useState(null);
    const [company, setCompany] = useState(null);
    const [department, setDepartment] = useState(null);
    const [job, setJob] = useState(null);

    /* for selects */
    const [companyId, setCompanyId] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);
    const [permissions, setPermissions] = useState({});

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
                return date ? moment(date).format("DD / MM / YYYY") : null;
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
            render: (record, item) => {
                return (
                    <>
                        {permissions.collaborators && (
                            <DownloadOutlined onClick={() => download(item)} />
                        )}
                    </>
                );
            },
        },
    ];

    /* Events for selects  */
    const onChangeCompany = (val) => {
        form.setFieldsValue({
            department: null,
            job: null,
        });
        setCompanyId(val);
    };

    const onChangeDepartment = (val) => {
        form.setFieldsValue({
            job: null,
        });
        setDepartmentId(val);
    };

    const download = async (item = null) => {
        let dataId = {};
        if (item) {
            dataId = {
                id: item.id,
            };
        } else {
            if (collaborator) {
                dataId.collaborator = collaborator;
            }
            if (department) {
                dataId.department = department;
            }
            if (job) {
                dataId.job = job;
            }
            if (dateOfAdmission) {
                dataId.date_of_admission = dateOfAdmission;
            }
        }

        try {
            let response = await Axios.post(
                API_URL + `/person/employee-report-export`,
                dataId
            );

            const type = response.headers["content-type"];
            const blob = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = item
                ? "Reporte_de_colaboradores(" + item.name + ").csv"
                : "Reporte_de_colaboradores.csv";
            link.click();
        } catch (e) {
            console.log(e);
        }
    };

    const getAllPersons = async () => {
        try {
            let response = await Axios.get(API_URL + `/person/person/`);
            let data = response.data.results;
            data = data.map((a, index) => {
                return {
                    label: a.first_name + " " + a.flast_name,
                    value: a.id,
                    /* value: a.id, */
                    key: a.id + index,
                };
            });
            setPersonList(data);
        } catch (e) {
            console.log(e);
        }
    };

    const getCollaborators = async (values = null) => {
        setCollaboratorList([]);
        setLoading(true);
        let QueryData = {};
        if (values && values.collaborator) {
            QueryData["collaborator"] = values.collaborator;
        }

        if (values && values.company) {
            QueryData["node"] = values.company.toString();
        }

        if (values && values.department) {
            QueryData["department"] = values.department;
        }
        if (values && values.job) {
            QueryData["job"] = values.job;
        }
        if (values && values.date_of_admission) {
            QueryData["date_of_admission"] = values.date_of_admission;
        }
        try {
            let response = await Axios.post(
                API_URL + `/person/employee-report`,
                QueryData
            );
            let data = response.data;
            if (data.lenght === 1) {
                data = [data];
            }
            setCollaboratorList(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getDepartaments = async () => {
        try {
            let response = await Axios.get(API_URL + `/business/department/`);
            let data = response.data.results;
            data = data.map((a, index) => {
                let item = {
                    label: a.name,
                    value: a.id,
                    key: a.id + index,
                };
                return item;
            });
            setDepartmentList(data);
        } catch (error) {
            console.log(error);
        }
    };
    /* /business/department/ */


    const clearFilter = () => {
        form.setFieldsValue({
            collaborator: null,
            company: null,
            date_of_admission: null,
            department: null,
            job: null,
        });
        getCollaborators();
    }

    const filterReport = async (values) => {
        values["date_of_admission"] = dateOfAdmission;
        setCompany(values.company);
        setCollaborator(values.collaborator);
        setDepartment(values.department);
        setJob(values.job);
        getCollaborators(values);
    };

    const changeDate = (date, dateString) => {
        SetDateOfAdmission(dateString);
    };

    useEffect(() => {
        const jwt = JSON.parse(jsCookie.get("token"));
        searchPermissions(jwt.perms);
        getCollaborators();
        getAllPersons();
        getDepartaments();
    }, [route]);

    const searchPermissions = (data) => {
        const perms = {};
        data.map((a) => {
            if (a.includes("people.report.function.export_collaborators"))
                perms.collaborators = true;
        });
        setPermissions(perms);
    };
    return (
        <>
            <Row justify="space-between" style={{ paddingRight: 20 }}>
                <Col span={24}>
                    <Title level={5}>Colaboradores</Title>
                    <hr />
                </Col>
                <Col>
                    <Form
                        name="filter"
                        form={form}
                        layout="vertical"
                        key="formFilter"
                        className="formFilterReports"
                        onFinish={filterReport}
                    >
                        <Row gutter={[10]}>
                            <Col>
                                <SelectCollaborator style={{ width: 150 }} />
                            </Col>
                            <Col>
                                <SelectCompany
                                    onChange={onChangeCompany}
                                    style={{ width: 150 }}
                                    name="company"
                                    label="Empresa"
                                />
                            </Col>
                            <Col>
                                <SelectDepartment
                                    onChange={onChangeDepartment}
                                    name="department"
                                    companyId={companyId}
                                />
                            </Col>
                            <Col>
                                <SelectJob
                                    departmentId={departmentId}
                                    name="job"
                                    label="Puesto"
                                    style={{ maxWidth: 150 }}
                                />
                            </Col>
                            <Col>
                                <Form.Item
                                    key="date_of_admission"
                                    name="date_of_admission"
                                    label="Fecha"
                                >
                                    <DatePicker format={"YYYY-MM-DD"} onChange={changeDate} />
                                </Form.Item>
                            </Col>
                            <Col style={{ display: "flex" }}>
                                <Tooltip
                                    title="Filtrar"
                                    color={"#3d78b9"}
                                    key={"#3d78b9"}
                                >
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
                                        <SearchOutlined />
                                    </Button>
                                </Tooltip>
                            </Col>
                            <Col style={{ display: "flex" }}>
                                <Tooltip
                                    title="Limpiar filtro"
                                    color={"#3d78b9"}
                                    key={"#3d78b9"}
                                >
                                    <Button
                                        onClick={clearFilter}
                                        style={{
                                            fontWeight: "bold",
                                            marginTop: "auto"
                                        }}
                                        key="buttonClearFilter"
                                    >
                                        <SyncOutlined />
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col className="columnRightFilter">
                    {permissions.collaborators && (
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
                    )}
                </Col>

            </Row>
            <Row style={{ paddingRight: 20 }}>
                <Col span={24} style={{ marginTop: 20 }}>
                    <Table
                        dataSource={collaboratorList}
                        key="tableHolidays"
                        columns={columns}
                        loading={loading}
                    ></Table>
                </Col>
            </Row>
        </>
    );
};

export default CollaboratorsReport;
