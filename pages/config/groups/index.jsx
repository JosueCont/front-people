import {
    Form,
    Input,
    Layout,
    Table,
    Breadcrumb,
    Tabs,
    Button,
    Row,
    Col,
    Modal,
    message,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
const { Content } = Layout;
const { TabPane } = Tabs;
const { confirm } = Modal;
import Axios from "axios";
import { API_URL, LOGIN_URL } from "../../../config/config";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import moment from "moment";
import { withAuthSync } from "../../../libs/auth";

const Groups = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState([]);

    const headers = {
        "client-id": "5f417a53c37f6275fb614104",
        "Content-Type": "application/json",
    };

    const getGroups = (name = "") => {
        setLoading(true);

        Axios.get(LOGIN_URL + `/group/list/${name}`, { headers: headers })
            .then((response) => {
                response.data.data.map((item) => {
                    item["key"] = item.id;
                    item.timestamp = moment(item.timestamp).format("DD/MM/YYYY");
                });
                setGroups(response.data.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const deleteGroup = async (id) => {
        let data = { id: id };

        Axios.post(LOGIN_URL + `/group/delete/`, data, {
            headers: headers,
        })
            .then(function (response) {
                if (response.status === 200) {
                    message.success({
                        content: "Grupo eliminado exitosamente",
                        className: "custom-class",
                        style: {
                            marginTop: "20vh",
                        },
                    });
                    getGroups();
                }
            })
            .catch(function (error) {
                message.error({
                    content: "Ocurrió un error",
                    className: "custom-class",
                    style: {
                        marginTop: "20vh",
                    },
                });
                console.log(error);
            });
    };

    const confirmDelete = (id) => {
        confirm({
            title: "¿Está seguro de eliminar este perfil de seguridad?",
            icon: <ExclamationCircleOutlined />,
            content: "Si lo elimina no podrá recuperarlo",
            onOk() {
                deleteGroup(id);
            },
            okType: 'primary',
            okText: "Eliminar",
            cancelText: "Cancelar",
            okButtonProps: {
                danger: true
            }
        });
    };

    useEffect(() => {
        getGroups();
    }, []);

    const filter = (value) => {
        let filt = "";
        if (value.name != "" && value.name != undefined) {
            filt = "?name=" + value.name;
        }
        getGroups(filt);
    };

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Fecha de creación",
            render: (item) => {
                return <div>{item.timestamp}</div>;
            },
        },
        {
            title: "Acciones",
            key: "id",
            render: (text, record) => {
                return (
                    <div>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <a
                                    onClick={() =>
                                        router.push({
                                            pathname: "/config/groups/add",
                                            query: { type: "edit", id: record.id },
                                        })
                                    }
                                >
                                    <EditOutlined />
                                </a>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <DeleteOutlined onClick={() => confirmDelete(record.id)} />
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
    ];

    return (
        <MainLayout currentKey="3.2">
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => router.push({ pathname: "/home" })}
                >
                    Inicio
        </Breadcrumb.Item>
                <Breadcrumb.Item>Perfiles de seguridad</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                <Row>
                    <Col span={20}>
                        <Form
                            form={form}
                            onFinish={filter}
                            initialValues={{
                                id: "",
                                name: "",
                                perms: [],
                            }}
                            scrollToFirstError
                        >
                            <Row>
                                <Col xl={10} md={10} xs={24}>
                                    <Form.Item name="name" label="Nombre">
                                        <Input placeholder="Nombre" />
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <div style={{ float: "left", marginLeft: "5px" }}>
                                        <Form.Item>
                                            <Button
                                                style={{
                                                    background: "#fa8c16",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                }}
                                                htmlType="submit"
                                            >
                                                Filtrar
                      </Button>
                                        </Form.Item>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Col >
                    <Col style={{ display: "flex" }}>
                        <Button
                            style={{
                                background: "#fa8c16",
                                fontWeight: "bold",
                                color: "white",
                            }}
                            onClick={() => router.push({ pathname: "/config/groups/add" })}
                        >
                            <PlusOutlined />
              Agregar
            </Button>
                    </Col>
                </Row >
                <Row>
                    <Col span={24}>
                        <Table columns={columns} dataSource={groups} loading={loading} />
                    </Col>
                </Row>
            </div >
        </MainLayout >
    );
};
export default withAuthSync(Groups);
