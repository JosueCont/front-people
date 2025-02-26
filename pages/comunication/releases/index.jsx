import React, {useEffect, useState} from "react";
import MainLayout from "../../../layout/MainInter";
import {
    Alert,
    Breadcrumb,
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    Form,
    Modal,
    Row,
    Select,
    Table,
    Tooltip
} from "antd";
import {DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined, SyncOutlined} from "@ant-design/icons";
import moment from "moment-timezone";
import axiosApi from '../../../api/axiosApi';
import {useRouter} from "next/router";
import cookie from "js-cookie";
import Cookies from "js-cookie";
import jsCookie from "js-cookie";
import SelectCollaborator from "../../../components/selects/SelectCollaborator";

import {withAuthSync} from "../../../libs/auth";
import {connect} from "react-redux";
import locale from "antd/lib/date-picker/locale/es_ES";
import {verifyMenuNewForTenant} from "../../../utils/functions";
import esES from "antd/lib/locale/es_ES";

const Releases = ({permissions,node, ...props}) => {
    /* React */
    const {Column} = Table;
    const {Option} = Select;
    const {RangePicker} = DatePicker;
    /* const childRef = useRef(); */
    const route = useRouter();
    /* Variables */
    const [list, setList] = useState([]);
    const [personList, setPersonList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [dateOne, setDateOne] = useState(null);
    const [dateTwo, setDateTwo] = useState(null);
    /* const [permissions, setPermissions] = useState({}); */
    const [form] = Form.useForm();
    const [modalDeleteVisible, setModalDeleteVisible] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    let userToken = cookie.get("toke") ? cookie.get("token") : null;


    useEffect(() => {
        const jwt = JSON.parse(jsCookie.get("token"));
        getNotifications();
        getAllPersons();
    }, []);

    const getNotifications = async (
        created_by = null,
        category = null,
        dateOne = null,
        dateTwo = null
    ) => {
        setLoading(true);
        let url = `/noticenter/notification/?showAll=true&`;

        if(node){
            url += `target_company__id=${node?.id}&`;
        }

        if (created_by) {
            url += `created_by__id=${created_by}&`;
        }
        if (category) {
            url += `category=${category}&`;
        }
        if (dateOne && dateTwo) {
            let d1 = moment(`${dateOne} 00:00:01`).tz("America/Merida").format();
            let d2 = moment(`${dateTwo} 23:59:00`).tz("America/Merida").format();
            url += `timestamp__gte=${d1}&timestamp__lte=${d2}&`;
        }
        try {
            const token = JSON.parse(Cookies.get("token", token));
            let k_id = "";
            if (token) k_id = token.user_id;
            const header = {
                "content-type": "application/json",
                khonnect_id: k_id,
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "https://www.example.com",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            };
            let response = await axiosApi.get(url);
            console.log(response.data)
            let data = response.data;
            setList(data.results)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const getAllPersons = async () => {
        try {
            let response = await axiosApi.get(`/person/person/`);
            let data = response.data.results;
            data = data.map((a) => {
                return {
                    label: a.first_name + " " + a.flast_name,
                    value: a.id,
                    key: a.name + a.id,
                };
            });
            setPersonList(data);
        } catch (e) {
            console.log(e);
        }
    };

    const GotoDetails = (details) => {
        route.push("./releases/" + details.id + "/details");
    };

    const GoToUserNotifications = (props) => {
        return (
            <Button
                onClick={() =>
                    route.push("./releases/" + props.notification_id + "/users")
                }
                type="text"
            >
                Ver
            </Button>
        );
    };

    const onchangeRange = (date, dateString) => {
        setDateOne(dateString[0]);
        setDateTwo(dateString[1]);
    };

    const sendFilter = (values) => {
        setSearching(true);
        getNotifications(values.send_by, values.category, dateOne, dateTwo);
    };


    const resetFilter = () => {
        form.resetFields();
        getNotifications();
        getAllPersons();
    };

    const deleteFunction = async (v) => {
        try {
            let response = await axiosApi.delete(`/noticenter/notification/${v}/`);
            setModalDeleteVisible(false);
            setDeleteId(null);
            getNotifications();
            getAllPersons();

            console.log(response.data)
        } catch (e) {
            console.log(e);
        }
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
            </Breadcrumb>
            <div className="container" style={{width: "100%"}}>
                {permissions.view ? (
                    <>
                        <div className="top-container-border-radius">
                            <Row justify="space-between" key="row1">
                                <Col>
                                    <Form
                                        name="filter"
                                        layout="vertical"
                                        key="form"
                                        form={form}
                                        className={"formFilter"}
                                        onFinish={sendFilter}
                                    >
                                        <Row gutter={[24, 8]}>
                                            <Col>
                                                <SelectCollaborator
                                                    name="send_by"
                                                    label="Enviado por"
                                                    style={{width: 150}}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Item
                                                    key="category"
                                                    name="category"
                                                    label="Categoría"
                                                >
                                                    <Select
                                                        style={{width: 150}}
                                                        key="select"
                                                        allowClear
                                                        notFoundContent={"No se encontraron resultados."}
                                                    >
                                                        <Option key="item_1" value="1">
                                                            Aviso
                                                        </Option>
                                                        <Option key="item_2" value="2">
                                                            Noticia
                                                        </Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item
                                                    name="send_date"
                                                    label="Fecha de envío"
                                                    key="send_date"
                                                >
                                                    <RangePicker onChange={onchangeRange} locale={locale}/>
                                                </Form.Item>
                                            </Col>
                                            <Col style={{display: "flex"}}>
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
                                                        key="submit"
                                                        htmlType="submit"
                                                        loading={searching}
                                                    >
                                                        <SearchOutlined/>
                                                    </Button>
                                                </Tooltip>
                                            </Col>
                                            <Col style={{display: "flex"}}>
                                                <Tooltip
                                                    title="Limpiar filtros"
                                                    color={"#3d78b9"}
                                                    key={"#3d78b9"}
                                                >
                                                    <Button
                                                        onClick={() => resetFilter()}
                                                        style={{marginTop: "auto"}}
                                                    >
                                                        <SyncOutlined/>
                                                    </Button>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col style={{display: "flex"}}>
                                    {permissions.create && (
                                        <Tooltip
                                            title="Agregar nuevo"
                                            color={"#3d78b9"}
                                            key={"#3d78b9"}
                                        >
                                            <Button
                                                key="add"
                                                onClick={() => route.push("releases/new")}
                                                style={{
                                                    background: "#fa8c16",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                    marginTop: "auto",
                                                }}
                                            >
                                                <PlusOutlined/>
                                                Agregar comunicado
                                            </Button>
                                        </Tooltip>
                                    )}
                                </Col>
                            </Row>
                        </div>

                        <Row key="row2">
                            <Col span={24}>
                                <ConfigProvider locale={esES}>
                                    <Table
                                        dataSource={list}
                                        key="releases_table"
                                        className={"mainTable"}
                                        loading={loading}
                                        pagination={{showSizeChanger: true}}
                                        locale={{
                                            emptyText: loading
                                                ? "Cargando..."
                                                : "No se encontraron resultados.",
                                        }}
                                    >
                                        <Column title="Categoría" dataIndex="title" key="title"/>
                                        <Column
                                            title="Enviado por"
                                            dataIndex="created_by"
                                            key="send_by"
                                            render={(text, record) =>
                                                text.first_name + " " + text.flast_name
                                            }
                                        />
                                        <Column
                                            title="Categoría"
                                            dataIndex="category"
                                            key="cat"
                                            render={(text, record) => (text == 1 ? "Aviso" : "Noticia")}
                                        />
                                        <Column
                                            title="Fecha de inicio"
                                            dataIndex="start_date"
                                            key="date"
                                            render={(text, record) =>
                                                <>
                                                { text ?
                                                moment(text).format("DD/MM/YYYY")
                                                :
                                                null
                                                }
                                                </>
                                            }
                                        />
                                        <Column
                                            title="Fecha vigencia"
                                            dataIndex="end_date"
                                            key="date"
                                            render={(text, record) =>
                                                {
                                                <>
                                                { text ?
                                                moment(text).format("DD/MM/YYYY")
                                                :
                                                null
                                                }
                                                </>
                                                }
                                            }
                                        />
                                        {/*<Column*/}
                                        {/*    title="Recibieron"*/}
                                        {/*    key="recibieron"*/}
                                        {/*    render={(text, record) => (*/}
                                        {/*        <GoToUserNotifications*/}
                                        {/*            key={"goUser" + record.id}*/}
                                        {/*            notification_id={record.id}*/}
                                        {/*        />*/}
                                        {/*    )}*/}
                                        {/*/>*/}
                                        <Column
                                            title="Acciones"
                                            key="action"
                                            render={(text, record) => (
                                                <div style={{flex: 1, flexDirection: 'row'}}>

                                                    <EyeOutlined
                                                        key={"goDetails_" + record.id}
                                                        onClick={() => GotoDetails(record)}
                                                        style={{marginRight: 10}}
                                                    />

                                                    <DeleteOutlined
                                                        key={"delete_" + record.id}
                                                        onClick={() => {
                                                            setModalDeleteVisible(true);
                                                            setDeleteId(record.id)
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </Table>
                                </ConfigProvider>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className="notAllowed"/>
                )}
            </div>

            <Modal
                title={"Eliminar registro"}
                visible={modalDeleteVisible}
                onCancel={() => {
                    setModalDeleteVisible(false);
                    setDeleteId(null);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setModalDeleteVisible(false);
                            setDeleteId(null);
                        }}>
                        Cancelar
                    </Button>,
                    <Button
                        form="deleteBusinessForm"
                        type="primary"
                        key="submit"
                        htmlType="submit"
                    >
                        Si, eliminar
                    </Button>,
                ]}
            >
                <Form
                    id="deleteBusinessForm"
                    name="normal_login"
                    onFinish={() => deleteFunction(deleteId)}
                    layout={"vertical"}
                >
                    <Alert
                        type="warning"
                        showIcon
                        message="¿Está seguro de eliminar este registro?"
                        description=""
                    />
                </Form>
            </Modal>

        </MainLayout>
    );
};

const mapState = (state) => {
    return {
        permissions: state.userStore.permissions.comunication,
        node: state.userStore?.current_node
    };
};

export default connect(mapState)(withAuthSync(Releases));
