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
    const [currentDetails, setCurrentDetails] = useState(null);
    const [newDetails, setNewDetails] = useState(null);

    const { id } = route.query;
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const onCancel = () => {
        route.push("/incapacity");
    };

    const getDetails = async () => {
        setLoading(true);
        try {
            let response = await Axios.get(API_URL + `/person/bank-account-request/${id}/`);
            let data = response.data;
            console.log("get_details", data);

            setNewDetails({
                account_number: data.new_account_number,
                interbank_key: data.new_interbank_key,
                bank: data.new_bank.name,
                expiration_month: data.new_expiration_month,
                expiration_year: data.new_expiration_year
            });

            if (data.previous_account_number) {
                setUpdate(true);
                setCurrentDetails({
                    account_number: data.previous_account_number,
                    interbank_key: data.previous_interbank_key,
                    bank: data.previous_bank,
                    expiration_month: data.previous_expiration_month,
                    expiration_year: data.previous_expiration_year
                })
            }

            console.log(currentDetails);
            console.log('newsDetails', newDetails)
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
        try {
            let data = {
                id: id,
                status: 2
            }
            await Axios.post(API_URL + `/person/bank-account-request/change_request_status/`, data)
            let res = response.data;
            console.log(res);
        } catch (error) {


        }

        /* success({
            keyboard: false,
            maskClosable: false,
            content: update ? "Cuenta bancaria Actualizada" : "Su solicitud de cuenta bancaria ha sido aceptada",
            okText: "Aceptar",
            onOk() {
                route.push("/bank_accounts");
            },
        }); */
    };

    useEffect(() => {
        if (id) {
            getDetails();
        }
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
                                {update ?
                                    <Col span={10} >
                                        <Title level={5}> Datos actuales </Title>

                                        <BankAccountsForm data={currentDetails} />
                                    </Col>
                                    : null}
                                <Col span={10} offset={update ? 1 : 0}>
                                    <Title level={5}> Nuevos datos </Title>

                                    <BankAccountsForm data={newDetails} />
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
