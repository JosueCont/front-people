import React, {useEffect, useRef, useState} from "react";
import MainLayout from "../../../layout/MainInter";
import {Breadcrumb, Button, Col, DatePicker, Form, Input, notification, Row, Select, Typography, Upload,} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import cookie from "js-cookie";
import axiosApi from '../../../api/axiosApi';
import FormItemHTMLPlace from "../../../components/draft";

import {withAuthSync} from "../../../libs/auth";
import {ruleRequired} from "../../../utils/rules";
import {typeMessage} from "../../../utils/constant";
import {verifyMenuNewForTenant} from "../../../utils/functions";
import {connect} from "react-redux";
import locale from "antd/lib/date-picker/locale/es_ES";

const Newrelease = ({...props}) => {
    let userToken = cookie.get("token") ? cookie.get("token") : null;
    const [form] = Form.useForm();
    const {Title} = Typography;
    const route = useRouter();

    const [message, setMessage] = useState(null);
    const [sending, setSending] = useState(false);
    const [userId, setUserId] = useState(null);
    const [messageAlert, setMessageAlert] = useState(false);
    const [fileList, setFileList] = useState([]);

    const inputFileRef = useRef(null);
    const [file, setFile] = useState();

    let json = JSON.parse(userToken);

    const selectedFile = (file) => {
        if (file.target.files.length > 0) {
            setFile(file.target.files[0]);
        } else {
            setFile(null);
        }
    };

    useEffect(() => {
        if (json) {
            setUserId(json.user_id);
        }
    }, []);

    const saveNotification = async (values) => {
        values.target_department = undefined;
        setMessageAlert(false);

        if (!message || (message && message.length <= 8)) {
            setMessageAlert(true);
            return;
        }

        let datos = new FormData();
        datos.append("category", values.category);
        datos.append("title", values.title);
        datos.append("start_date", values.date_1.format('YYYY-MM-DD') + ' 00:00:00');
        datos.append("end_date", values.date_2.format('YYYY-MM-DD') + ' 23:59:59');
        datos.append("message", message);
        datos.append("khonnect_id", userId);
        datos.append("target_company", props.currentNode.id);
        datos.append("send_to_all", true);


        // if (values.send_to_all) {
        //   datos.append("send_to_all", values.send_to_all);
        // }
        // if (values.target_department) {
        //     datos.append("target_department", values.target_department);
        // }
        // if (values.target_job) {
        //     datos.append("target_job", values.target_job);
        // }
        // if (values.target_person_type) {
        //     datos.append("target_person_type", values.target_person_type);
        // }
        //
        // if (values.target_gender !== 0) {
        //     datos.append("gender", values.target_gender);
        // }

        if (file) {
            fileList.map((f) => {
                datos.append("files", f.originFileObj);
            });
        }
        setSending(true);
        try {
            let response = await axiosApi.post(
                `/noticenter/notification/`,
                datos,
                {headers: {"content-type": "multipart/form-data"}}
            );
            let data = response.data;
            notification["success"]({
                message: "Aviso",
                description: "Información enviada correctamente.",
            });
            route.push("/comunication/releases");
        } catch (error) {
            console.log(error);
        } finally {
            setSending(false);
        }
    };

    const onchangeFile = (file) => {
        setFileList(file.fileList);
        setFile(
            file.fileList.map((a) => {
                return a.originFileObj;
            })
        );
    };

    const setHtml = (html) => {
        setMessage(html);
    };

    const onCancel = () => {
        route.push("/comunication/releases");
    };

    return (
        <MainLayout currentKey={["releases"]} defaultOpenKeys={["managementRH", "concierge", "releases"]}>
            <Breadcrumb key="Breadcrumb">
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => route.push({pathname: "/home/persons/"})}
                >
                    Inicio
                </Breadcrumb.Item>
                {verifyMenuNewForTenant() &&
                    <>
                        <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
                        <Breadcrumb.Item>Concierge</Breadcrumb.Item>
                    </>
                }
                <Breadcrumb.Item key="releases">Comunicados</Breadcrumb.Item>
                <Breadcrumb.Item className={"pointer"}
                                 onClick={() => route.push({pathname: "/comunication/releases"})}>Comunicados</Breadcrumb.Item>
                <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className="container back-white"
                style={{width: "100%", padding: "20px"}}
            >
                <Form
                    key="notification_form"
                    form={form}
                    layout="vertical"
                    onFinish={saveNotification}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Title key="dats_gnrl" level={3}>
                                Datos Generales
                            </Title>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                name="category"
                                label="Categoría"
                                labelAlign={"left"}
                                rules={[ruleRequired]}
                            >
                                <Select
                                    style={{width: "100%"}}
                                    options={typeMessage}
                                    notFoundContent={"No se encontraron resultados."}
                                />
                            </Form.Item>
                        </Col>


                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Título"
                                name="title"
                                labelAlign={"left"}
                                rules={[ruleRequired]}
                            >
                                <Input className={"formItemPayment"}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Fecha"
                                name="date_1"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor selecciona una fecha",
                                    },
                                ]}
                            >
                                <DatePicker
                                    style={{width: "100%"}}
                                    // onChange={onChangeDate}
                                    moment={"YYYY-MM-DD"}
                                    placeholder="Fecha"
                                    locale={locale}
                                />
                            </Form.Item>
                        </Col>


                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Fecha"
                                name="date_2"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor selecciona una fecha",
                                    },
                                ]}
                            >
                                <DatePicker
                                    style={{width: "100%"}}
                                    //onChange={onChangeDate}
                                    moment={"YYYY-MM-DD"}
                                    placeholder="Fecha"
                                    locale={locale}
                                />
                            </Form.Item>
                        </Col>


                        <Col span={24}>
                            <FormItemHTMLPlace
                                messageAlert={messageAlert}
                                setMessageAlert={setMessageAlert}
                                html=""
                                setHTML={setHtml}
                            />
                            <Form.Item>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onchangeFile}
                                >
                                    <div>
                                        <PlusOutlined/>
                                        <div style={{marginTop: 8}}>Upload</div>
                                    </div>
                                </Upload>
                                <input
                                    ref={inputFileRef}
                                    type="file"
                                    style={{display: "none"}}
                                    onChange={(e) => selectedFile(e)}
                                />
                            </Form.Item>
                        </Col>

                        {/*<Col span={24}>*/}
                        {/*  <Title level={3} key="segmentacion">*/}
                        {/*    Segmentación*/}
                        {/*  </Title>*/}
                        {/*</Col>*/}
                        {/*<Col span={24}>*/}
                        {/*  <Form.Item*/}
                        {/*    name="send_to_all"*/}
                        {/*    label="Enviar a todos"*/}
                        {/*    labelAlign="left"*/}
                        {/*  >*/}
                        {/*    <Switch value={false} />*/}
                        {/*  </Form.Item>*/}
                        {/*</Col>*/}

                        {/*<Col xs={24} sm={24} md={12} lg={12} xl={12}>*/}
                        {/*  <SelectDepartment name={"target_department"} viewLabel={false} />*/}
                        {/*</Col>*/}
                        {/*<Col xs={24} sm={24} md={12} lg={12} xl={12}>*/}
                        {/*  <SelectJob name={"target_job"} viewLabel={false} />*/}
                        {/*</Col>*/}
                        {/*<Col xs={24} sm={24} md={12} lg={12} xl={12}>*/}
                        {/*  <SelectPersonType />*/}
                        {/*</Col>*/}
                        {/*<Col xs={24} sm={24} md={12} lg={12} xl={12}>*/}
                        {/*  <SelectGender />*/}
                        {/*</Col>*/}

                        <Col span={24} style={{textAlign: "right"}}>
                            <Button
                                key="cancel"
                                onClick={() => onCancel()}
                                disabled={sending}
                                style={{padding: "0 50px", margin: "0 10px"}}
                            >
                                Cancelar
                            </Button>
                            <Button
                                key="save"
                                htmlType="submit"
                                loading={sending}
                                type="primary"
                                disabled={sending}
                            >
                                Enviar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </MainLayout>
    );
};
const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    };
};
export default connect(mapState)(withAuthSync(Newrelease));
