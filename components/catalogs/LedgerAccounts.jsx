import React, { useEffect, useState } from "react";
import {
    Typography,
    Form,
    Row,
    Col,
    Button,
    Table,
    Spin,
    Input,
    message,
    Modal,
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import WebApiPeople from "../../api/WebApiPeople";
import {
    messageDeleteSuccess,
    messageError,
    messageSaveSuccess,
    messageUpdateSuccess,
} from "../../utils/constant";
import SelectLedgerAccount from "../selects/SelectLedgerAccount";

const LedgerAccounts = ({ permissions, currentNode, ...props }) => {
    const { Title } = Typography;

    const [edit, setEdit] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState({});
    const [id, setId] = useState("");

    const colJob = [
        {
            title: "Nombre",
            render: (item) => {
                return <>{item.name}</>;
            },
            key: "key",
        },
        {
            title: "Código",
            render: (item) => {
                return <>{item.code}</>;
            },
        },
        {
            title: "Acciones",
            render: (item) => {
                return (
                    <div>
                        <Row gutter={16}>
                            {permissions.edit && (
                                <Col className="gutter-row" offset={1}>
                                    <EditOutlined onClick={() => editRegister(item, "job")} />
                                </Col>
                            )}
                            {permissions.delete && (
                                <Col className="gutter-row" offset={1}>
                                    <DeleteOutlined
                                        onClick={() => {
                                            setDeleteRegister({
                                                id: item.id,
                                                url: "/business/job/",
                                            });
                                        }}
                                    />
                                </Col>
                            )}
                        </Row>
                    </div>
                );
            },
        },
    ];

    const resetForm = () => {
        form.resetFields();
        setEdit(false);
        setId("");
    };

    const onFinishForm = (value, url) => {

        /**
         * Validamos que no puedan meter datos con puros espacios
         */
        if(!(value?.name && value.name.trim())){
            form.setFieldsValue({name:undefined})
            value.name=undefined
        }

        if(!(value?.code && value.code.trim())){
            form.setFieldsValue({code:undefined})
            value.code=undefined
        }
        /**
         * Validamos que no puedan meter datos con puros espacios
         */

        if(value.name===undefined || value.code===undefined){
            form.validateFields()
            return
        }

        if (edit) {
            updateRegister(url, value);
        } else saveRegister(url, value);
    };

    const saveRegister = async (url, data) => {
        data.node = currentNode.id;

    };

    const editRegister = (item, param) => {
        setEdit(true);
        setId(item.id);
        form.setFieldsValue({
            node: item.node.id,
            name: item.name,
            code: item.code,
        });
    };

    const updateRegister = async (url, value) => {
        try {
            let response = await WebApiPeople.updateRegisterCatalogs(
                `/business/job/${id}/`,
                value
            );
            props
                .getJobs(currentNode.id)
                .then((response) => {
                    setId("");
                    resetForm();
                    message.success(messageUpdateSuccess);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    message.error(messageError);
                });
        } catch (error) {
            setId("");
            setEdit(false);
            setLoading(false);
            resetForm();
            message.error("Ocurrio un error intente de nuevo.");
        }
    };

    const setDeleteRegister = (data) => {
        setDeleted(data);
    };

    useEffect(() => {
        if (deleted.id) {
            Modal.confirm({
                title: "¿Está seguro de eliminar este registro?",
                content: "Si lo elimina no podrá recuperarlo",
                icon: <ExclamationCircleOutlined />,
                okText: "Sí, eliminar",
                okButtonProps: {
                    danger: true,
                },
                cancelText: "Cancelar",
                onOk() {
                    deleteRegister();
                },
            });
        }
    }, [deleted]);

    const deleteRegister = async () => {
        try {
            let response = await WebApiPeople.deleteRegisterCatalogs(
                deleted.url + `${deleted.id}/`
            );
            props
                .getJobs(currentNode.id)
                .then((response) => {
                    resetForm();
                    message.success(messageDeleteSuccess);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    message.error(messageError);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}

            {permissions.create && (
                <Form
                    layout={"vertical"}
                    form={form}
                    onFinish={(values) =>
                        onFinishForm(values, `/business/job/?node=${currentNode.id}`)
                    }
                >
                    <Row gutter={20}>
                        <Col lg={6} xs={22} md={12}>
                            <Form.Item name="account" label="Cuenta" rules={[ruleRequired]}>
                                <Input maxLength={150} />
                            </Form.Item>
                        </Col>
                        <Col lg={6} xs={22} md={12}>
                            <Form.Item name="code" label="Código" rules={[ruleRequired]}>
                                <SelectLedgerAccount/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
                        <Col>
                            <Button onClick={resetForm}>Cancelar</Button>
                        </Col>
                        <Col>
                            <Button type="primary" htmlType="submit">
                                Guardar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}
            <Spin tip="Cargando..." spinning={loading}>
                <Table
                    columns={colJob}
                    dataSource={props.cat_job}
                    locale={{
                        emptyText: loading
                            ? "Cargando..."
                            : "No se encontraron resultados.",
                    }}
                />
            </Spin>
        </>
    );
};

const mapState = (state) => {
    return {
        cat_job: state.catalogStore.cat_job,
    };
};

export default connect(mapState, {  })(LedgerAccounts);
