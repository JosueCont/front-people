import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../../layout/MainLayout";
import {
    Row,
    Col,
    Table,
    Breadcrumb,
    Tooltip,
    Form,
    Select,
    Button,
    message,
    Modal,
    Spin,
    Input,
    DatePicker,
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";

import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import axios from "axios";
import { API_URL } from "../../../config/config";
import jsCookie from "js-cookie";

const Events = () => {
    const { Column } = Table;
    const { confirm } = Modal;
    const route = useRouter();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(null);
    const { Option } = Select;
    const [evenstList, setEventList] = useState([]);
    const [permissions, setPermissions] = useState({});

    const getAllEvents = (filter) => {
        setLoading(true);
        if (filter === undefined) {
            axios
                .get(API_URL + `/person/event/`)
                .then((response) => {
                    response.data.results.forEach((element) => {
                        element.date = moment(element.date).format("DD-MM-YYYY");
                    });
                    let data = response.data.results;
                    setLoading(false);
                    setEventList(data);
                })
                .catch((e) => {
                    setEventList([]);
                    setLoading(false);
                    console.log(e);
                });
        } else {
            axios
                .post(API_URL + `/person/event/event_filter/`, filter)
                .then((response) => {
                    response.data.forEach((element) => {
                        element.date = moment(element.date).format("DD-MM-YYYY");
                    });
                    let data = response.data;
                    setLoading(false);
                    setEventList(data);
                })

                .catch((e) => {
                    setEventList([]);
                    setLoading(false);
                    console.log(e);
                });
        }
    };

    const deleteEvent = async (id) => {
        setLoading(true);
        axios
            .delete(API_URL + `/person/event/${id}/`)
            .then((response) => {
                if (response.status === 204) {
                    setLoading(false);
                    message.success({
                        content: "Evento eliminado satisfactoriamente",
                        className: "custom-class",
                        style: {
                            marginTop: "20vh",
                        },
                    });
                    getAllEvents();
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const confirmDelete = (id) => {
        confirm({
            title: "¿Está seguro de eliminar este evento?",
            icon: <ExclamationCircleOutlined />,
            content: "Si lo elimina no podrá recuperarlo",
            onOk() {
                deleteEvent(id);
            },
            okText: "Eliminar",
            okType: "primary",
            okButtonProps: {
                danger: true,
            },
            cancelText: "Cancelar",
        });
    };

    useEffect(() => {
        const jwt = JSON.parse(jsCookie.get("token"));
        searchPermissions(jwt.perms);
        getAllEvents();
    }, [route]);

    const searchPermissions = (data) => {
        const perms = {};
        data.map((a) => {
            if (a.includes("people.event.can.view")) perms.view = true;
            if (a.includes("people.event.can.create")) perms.create = true;
            if (a.includes("people.event.can.edit")) perms.edit = true;
            if (a.includes("people.event.can.delete")) perms.delete = true;
        });
        setPermissions(perms);
    };

    const filter = (value) => {
        let tit = false;
        let date = false;
        if (value.title !== undefined && value.title !== "") {
            tit = true;
        } else {
            value.title = undefined;
        }
        if (value.date !== null && value.date !== undefined) {
            date = true;
            value.date = moment(value.date).format("YYYY-MM-DD");
        } else {
            value.date = undefined;
        }
        if (tit || date) {
            getAllEvents(value);
        } else {
            getAllEvents();
        }
    };

    return (
        <MainLayout currentKey="4.2">
            <Breadcrumb>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => route.push({ pathname: "/home" })}
                >
                    Inicio
        </Breadcrumb.Item>
                <Breadcrumb.Item>Eventos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                {permissions.view ? (
                    <Spin tip="Cargando..." spinning={loading}>
                        <Row justify={"space-between"}>
                            <Col>
                                <Form
                                    onFinish={filter}
                                    form={formFilter}
                                    layout="vertical"
                                    className={"formFilter"}
                                >
                                    <Row gutter={[24, 8]}>
                                        <Col lg={10} xs={22}>
                                            <Form.Item name="title" label="Título">
                                                <Input placeholder="Título" />
                                            </Form.Item>
                                        </Col>
                                        <Col lg={10} xs={22} offset={1}>
                                            <Form.Item label="Fecha" name="date">
                                                <DatePicker
                                                    style={{ width: "100%" }}
                                                    moment={"YYYY-MM-DD"}
                                                    placeholder="Fecha"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col lg={2} xs={5} offset={1} style={{ display: "flex" }}>
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
                                                    htmlType="submit"
                                                >
                                                    <SearchOutlined />
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col style={{ display: "flex" }}>
                                {permissions.create && (
                                    <Button
                                        style={{
                                            background: "#fa8c16",
                                            fontWeight: "bold",
                                            color: "white",
                                            marginTop: "auto",
                                        }}
                                        onClick={() => route.push("events/add")}
                                    >
                                        <PlusOutlined />
                    Agregar evento
                                    </Button>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Table
                                    className={"mainTable"}
                                    dataSource={evenstList}
                                    key="table_events"
                                    loading={loading}
                                >
                                    <Column title="ID" dataIndex="id" key="id"></Column>
                                    <Column title="Título" dataIndex="title" key="title"></Column>
                                    <Column title="Fecha" dataIndex="date" key="date"></Column>
                                    <Column
                                        title="Acciones"
                                        key="actions"
                                        render={(text, record) => (
                                            <>
                                                {permissions.edit && (
                                                    <a
                                                        onClick={() =>
                                                            route.push({
                                                                pathname: "/comunication/events/detail",
                                                                query: { type: "edit", id: record.id },
                                                            })
                                                        }
                                                    >
                                                        <EditOutlined
                                                            className="icon_actions"
                                                            key={"edit_" + record.id}
                                                        />
                                                    </a>
                                                )}
                                                {permissions.delete && (
                                                    <DeleteOutlined
                                                        className="icon_actions"
                                                        key={"delete" + record.id}
                                                        onClick={() => confirmDelete(record.id)}
                                                    />
                                                )}
                                            </>
                                        )}
                                    ></Column>
                                </Table>
                            </Col>
                        </Row>
                    </Spin>
                ) : (
                    "No tiene permisos suficientes, contacte con un administrador"
                )}
            </div>
        </MainLayout>
    );
};
export default withAuthSync(Events);
