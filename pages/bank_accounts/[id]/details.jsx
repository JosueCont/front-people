import { React, useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
    Row,
    Col,
    Typography,
    Breadcrumb,
    Image,
    Button,
    Form,
    Input,
    Select,
    Modal,
    notification,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import BankAccountsForm from '../../../components/forms/BankAccountsForm';
import { withAuthSync } from "../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import cookie from "js-cookie";

const BankAccountsDetails = () => {
    let userToken = cookie.get("token") ? cookie.get("token") : null;
    const route = useRouter();
    const [form] = Form.useForm();
    const { Title, Text } = Typography;
    const { TextArea } = Input;
    const { confirm, success } = Modal;


    let json = JSON.parse(userToken);
    const [visibleModalReject, setVisibleModalReject] = useState(false);

    const [update, setUpdate] = useState(false);
    const [details, setDetails] = useState(null);
    const { id } = route.query;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const onCancel = () => {
        route.push("/incapacity");
    };

    const getDetails = async () => {
        setLoading(true);
        try {
            let response = await Axios.get(API_URL + `/person/incapacity/${id}/`);
            let data = response.data;
            console.log("get_details", data);
            setDetails(data);
            setDepartureDate(data.departure_date);
            setReturnDate(data.return_date);

            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const rejectCancel = () => {
        setVisibleModalReject(false);
        setMessage(null);
    };

    const rejectRequest = async () => {
        setLoading(true);
        setVisibleModalReject(false);
        success({
            keyboard: false,
            maskClosable: false,
            content: update ? "Actualización de cuenta bancaria rechazada" : "Cuenta bancaria rechazada",
            okText: "Aceptar",
            onOk() {
                route.push("/bank_accounts");
            },
        });
        /* if (json) {
            console.log(json);
            try {
                let values = {
                    khonnect_id: json.user_id,
                    id: id,
                    comment: message,
                };
                let response = await Axios.post(
                    API_URL + `/person/incapacity/reject_request/`,
                    values
                );
                setVisibleModalReject(false);
                setMessage(null);
                success({
                    keyboard: false,
                    maskClosable: false,
                    content: "Incapacidad rechazada",
                    okText: "Aceptar",
                    onOk() {
                        route.push("/incapacity");
                    },
                });
            } catch (e) {
                console.log(e);
            }
        } */
    };

    const modalAprobe = () => {
        confirm({
            title: update ? "¿Está seguro de aprobar la siguiente solicitud de actualización?" : "¿Está seguro de aprobar la siguiente cuenta bancaria?",
            icon: <ExclamationCircleOutlined />,
            confirmLoading: loading,
            onOk() {
                setLoading(true)
                approveRequest();
            },
            okText: 'Aceptar y notificar',
            okType: 'primary',
            cancelText: 'Cancelar'
        });
    }

    const approveRequest = async () => {
        setLoading(false);
        success({
            keyboard: false,
            maskClosable: false,
            content: update ? "Cuenta bancaria Actualizada" : "Su solicitud de cuenta bancaria ha sido aceptada",
            okText: "Aceptar",
            onOk() {
                route.push("/bank_accounts");
            },
        });


        /* if (json) {
            console.log(json);
            setLoading(true);
            try {
                let values = {
                    khonnect_id: json.user_id,
                    id: id,
                };
                let response = await Axios.post(
                    API_URL + `/person/incapacity/approve_request/`,
                    values
                );
                if (response.status == 200) {
                    Modal.success({
                        keyboard: false,
                        maskClosable: false,
                        content: "Su solicitud de incapacidad  ha sido aceptada",
                        okText: "Aceptar",
                        onOk() {
                            route.push("/incapacity");
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        } */
    };

    useEffect(() => {
        let { update } = route.query
        if (update) {
            console.log("update")
            setUpdate(true);
        }
        /* if (id) {
            getDetails();
        } */
    }, [route]);

    return (
        <MainLayout currentKey="5">
            <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => route.push({ pathname: "/home" })}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => {
                        route.push("/bank_accounts");
                    }}
                >
                    Cuentas bancarias
        </Breadcrumb.Item>
                <Breadcrumb.Item>Detalles de solicitud</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className="container back-white"
                style={{ width: "100%", padding: "20px 0" }}
            >
                <Row justify={"center"}>
                    {/* <Col span={23}>
                        <Title key="dats_gnrl" level={4}>
                            Solicitud de revisión
                        </Title>
                    </Col> */}
                    <Col span={23}>
                        <Form
                            layout="horizontal"
                            className={"formPermission"}
                        >
                            <Row>
                                <Col span={10}>
                                    <Title level={5}> Datos actuales </Title>

                                    <BankAccountsForm />
                                </Col>
                                <Col span={10} offset={1}>
                                    <Title level={5}> Nuevos datos </Title>

                                    <BankAccountsForm />
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col span={17} offset={4}>
                        <Button
                            key="cancel"
                            style={{ padding: "0 50px" }}
                        >
                            Regresar
                        </Button>

                        <Button
                            danger
                            key="reject"
                            type="primary"
                            onClick={() => setVisibleModalReject(true)}
                            style={{ padding: "0 50px", marginLeft: 15 }}
                        >
                            Rechazar
                        </Button>


                        <Button
                            key="save"
                            onClick={modalAprobe}
                            type="primary"
                            style={{ padding: "0 50px", marginLeft: 15 }}
                        >
                            {update ? "Actualizar" : "Guardar"}
                        </Button>
                    </Col>
                </Row>
            </div>
            <Modal
                title={update ? "Rechazar solicitud de actualización de cuenta bancaria" : "Rechazar solicitud de cuenta bancaria"}
                visible={visibleModalReject}
                onOk={rejectRequest}
                onCancel={rejectCancel}
                footer={[
                    <Button
                        key="back"
                        onClick={rejectCancel}
                        style={{ padding: "0 50px", marginLeft: 15 }}
                    >
                        Cancelar
                    </Button>,
                    <Button
                        key="submit_modal"
                        type="primary"
                        loading={loading}
                        onClick={rejectRequest}
                        style={{ padding: "0 50px", marginLeft: 15 }}
                    >
                        Aceptar y notificar
            </Button>,
                ]}
            >
                <Text>Comentarios</Text>
                <TextArea rows="4" />
            </Modal>
        </MainLayout>
    );
};

export default withAuthSync(BankAccountsDetails);
