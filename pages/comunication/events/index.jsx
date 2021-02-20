import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../../layout/MainLayout";
import {
    Row,
    Col,
    Table,
    Breadcrumb,
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

const Events = () => {
    const { Column } = Table;
    const { confirm } = Modal;
    const route = useRouter();
    const [formFilter] = Form.useForm();
    const [loading, setLoading] = useState(null);
    const { Option } = Select;
    const [evenstList, setEventList] = useState([]);

    const getAllEvents = (filter) => {
        setLoading(true);
        if (filter === undefined) {
            console.log("SI");
            axios
                .get(API_URL + `/person/event/`)
                .then((response) => {
                    console.log("Reponse-->>> ", response.data);
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
            console.log("NO");
            axios
                .post(API_URL + `/person/event/event_filter/`, filter)
                .then((response) => {
                    console.log("Resultados", response);
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
                    console.log("Elemento Eliminado", id);
                    getAllEvents();
                }
                console.log(response);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const confirmDelete = (id) => {
        confirm({
            title: "Esta seguro de eliminar el elemento?",
            icon: <ExclamationCircleOutlined />,
            content: "Si elimina el elemento no podrá recuperarlo",
            onOk() {
                deleteEvent(id);
            },
            onCancel() { },
        });
    };

    useEffect(() => {
        getAllEvents();
    }, [route]);

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
                <Breadcrumb.Item className={'pointer'} onClick={() => route.push({ pathname: "/home" })}>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item>Eventos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                <Spin tip="Cargando..." spinning={loading}>
                    <Row>
                        <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                            <Form onFinish={filter} form={formFilter}>
                                <Row>
                                    <Col lg={7} xs={22}>
                                        <Form.Item name="title" label="Título">
                                            <Input placeholder="Título" />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={7} xs={22} offset={1}>
                                        <Form.Item label="Fecha" name="date">
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                moment={"YYYY-MM-DD"}
                                                placeholder="Fecha"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={2} xs={5} offset={1}>
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
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <Row justify={"end"}>
                        <Col style={{ padding: "20px 0" }}>
                            <Button
                                style={{
                                    background: "#fa8c16",
                                    fontWeight: "bold",
                                    color: "white",
                                }}
                                onClick={() => route.push("events/add")}
                            >
                                <PlusOutlined />
                Agregar nuevo evento
              </Button>
                        </Col>
                        <Col span={24}>
                            <Table dataSource={evenstList} key="table_events">
                                <Column title="ID" dataIndex="id" key="id"></Column>
                                <Column title="Título" dataIndex="title" key="title"></Column>
                                <Column title="Fecha" dataIndex="date" key="date"></Column>
                                <Column
                                    title="Acciones"
                                    key="actions"
                                    render={(text, record) => (
                                        <>
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
                                            <DeleteOutlined
                                                className="icon_actions"
                                                key={"delete" + record.id}
                                                onClick={() => confirmDelete(record.id)}
                                            />
                                        </>
                                    )}
                                ></Column>
                            </Table>
                        </Col>
                    </Row>
                </Spin>
            </div>
        </MainLayout>
    );
};
export default withAuthSync(Events);
