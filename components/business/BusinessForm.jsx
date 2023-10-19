import {
    Alert,
    Breadcrumb,
    Button,
    Col,
    ConfigProvider,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Tooltip,
    Upload
} from "antd";
import { useEffect, useState } from "react";
import {
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
    NodeExpandOutlined,
    PlusOutlined,
    SearchOutlined,
    SyncOutlined,
    SettingOutlined,
    StopOutlined,
    TableOutlined,
    EyeOutlined,
    UserOutlined,
    LinkOutlined,
    EyeInvisibleOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import MainLayout from "../../layout/MainInter";
import NodeTreeView from "./TreeView/treeview";
import { userId } from "../../libs/auth";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";
import { messageDeleteSuccess, messageError, messageSaveSuccess, messageUpdateSuccess } from "../../utils/constant";
import { verifyMenuNewForTenant } from "../../utils/functions";
import esES from "antd/lib/locale/es_ES";
import _, { debounce } from "lodash";
import { setNullCompany } from '../../redux/UserDuck'
import router from "next/router";
import moment from "moment";
import ModalReceipts from "./ModalReceipts";

const { TextArea } = Input;
const { Option } = Select;

const businessForm = ({ currentNode, setNullCompany, ...props }) => {
    let router = useRouter();
    const [business, setBusiness] = useState([]);
    const [allBusiness, setAllBusiness] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [modalSwitch, setModalSwitch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingLogo, setLoadingLogo] = useState(false);
    const currentYear = moment().format("YYYY");
    const [logo, setLogo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formBusiness] = Form.useForm();
    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [treeTable, setTreeTable] = useState(true);
    const [updateModal, setUpdateModal] = useState(false);
    const [businessUpdate, setBusinessUpdate] = useState(null);
    let personId = userId();
    const [admin, setAdmin] = useState(false);
    const [addB, setAddB] = useState(false);

    const [receipts, setReceipts] = useState([]);
    const [itemNode, setItemNode] = useState({});
    const [openReceipts, setOpenReceipts] = useState(false);

    const onFinish = (values) => {
        if (isDeleted) {
            deleteBusiness(values.id);
        } else {
            if (!isEdit) {
                addBusiness(values.name, values.description, values.FNode);
            } else {
                updateBusiness(values);
            }
        }
    };

    const switchModal = () => {
        modalSwitch ? setModalSwitch(false) : setModalSwitch(true);
    };

    const deleteBusiness = async (id) => {
        setLoading(true);

        WebApiPeople.deleteNode(id)
            .then(function (response) {
                message.success(messageDeleteSuccess);
                setIsModalVisible(false);
                setIsModalDeleteVisible(false);
                if (currentNode.id === id) Router.push("/select-company");
                getCopaniesList();
                setLoading(false);
            })
            .catch(function (error) {
                setLoading(false);
                console.log(error);
            });
    };

    const updateBusiness = async (values) => {
        setLoading(true);

        let data = new FormData();
        data.append("id", values.id);
        data.append("name", values.name);
        data.append("description", values.description);
        if (values.FNode) {
            data.append("parent", values.FNode ? values.FNode : null);
        }
        if (logo) {
            data.append("image", logo);
        }

        WebApiPeople.updateNode(values.id, data)
            .then(function (response) {
                setIsModalVisible(false);
                setLoading(false);
                getCopaniesList();
                message.success(messageUpdateSuccess);

                if (response.status === 200) {
                    sessionStorage.setItem("image", response.data.image);
                    setTimeout(function () {
                        Router.reload();
                    }, 1000);
                }
            })
            .catch(function (error) {
                setLoading(false);
                console.log(error);
            });
    };

    const addBusiness = async (name, description, fNode) => {
        let data = new FormData();
        data.append("name", name);
        data.append("description", description);
        fNode && data.append("parent", fNode);
        data.append("active", true);
        setAddB(true);
        setLoading(true)


        data.append("person", personId);
        setLoading(true);
        if (logo) {
            data.append("image", logo);
        }
        // if (logo == null || logo == undefined) {
        //   message.error("Agregue una imagen");
        //   setAddB(false);
        //   return;
        // }
        WebApiPeople.createNode(data)
            .then(function (response) {
                if (response.status === 200) {
                    Router.push("/business/companies");
                }
                setIsModalVisible(false);
                setLoading(false);
                setAddB(false);
                getCopaniesList();
                message.success(messageSaveSuccess);
                setLoading(false)
            })
            .catch(function (error) {
                setAddB(false);
                message.error(messageError);
                setLoading(false);
            });
    };

    const showModal = (type, item) => {
        if (type === "add") {
            setIsDeleted(false);
            setIsEdit(false);
            formBusiness.resetFields();
            setIsModalVisible(true);
            setImageUrl(null);
        } else if (type === "edit") {
            setIsDeleted(false);
            setIsEdit(true);
            setImageUrl(item.image);
            formBusiness.setFieldsValue({
                name: item.name,
                description: item.description,
                FNode: item.parent ? item.parent.id : null,
                id: item.id,
                active: item.active,
            });
            setIsModalVisible(true);
        } else {
            setIsDeleted(true);
            setIsModalDeleteVisible(true);
            setBusinessName(item.name);
            formBusiness.setFieldsValue({
                id: item.id,
            });
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsModalDeleteVisible(false);
    };

    useEffect(() => {
        if (props.user) getCopaniesList();
    }, [props.user]);

    const getCopaniesList = async () => {
        setBusiness([]);
        setLoading(true)
        await WebApiPeople.getCompanys(props?.user?.id, true)
            .then((response) => {
                setBusiness(response.data.results);
                setAllBusiness(response.data.results);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    const showReceipts = async (item) => {
        const key = 'updatable';
        try {
            message.loading({ content: 'Obteniendo información...', key })
            let response = await WebApiPeople.getCfdiReport(item?.id);
            console.log("🚀 ~ file: BusinessForm.jsx:254 ~ showReceipts ~ response:", response)
            setItemNode(item)
            setReceipts(response.data)
            setTimeout(() => {
                message.success({ content: 'Información obtenida', key, duration: 1 })
            }, 1000)
            setTimeout(()=>{
                setOpenReceipts(true)
            },2000)
        } catch (e) {
            console.log(e)
            setTimeout(() => {
                message.error({ content: 'Información no obtenida', key })
            }, 1000)
        }
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            ellipsis: true
        },
        {
            title: "Nodo padre",
            dataIndex: ["parent", "name"],
            key: ["parent", "name"]
        },
        {
            title: "Colaboradores",
            dataIndex: "num_collaborators",
            render: (item) => (
                <Tag icon={<UserOutlined />}>
                    {item}
                </Tag>
            )
        },
        {
            title: "Recibos timbrados",
            render: (item) => item?.total_cfdi > 0
                ? <Tag className="pointer" icon={<FileTextOutlined />} onClick={() => showReceipts(item)} >
                    {item?.total_cfdi}
                </Tag> : <></>
        },
        {
            title: "Estatus",
            key: "id",
            render: (item) => {
                return (
                    <>
                        <Switch
                            size="small"
                            key={item.id}
                            disabled={
                                props.permissions && props.permissions.change_is_active
                                    ? false
                                    : true
                            }
                            defaultChecked={item.active}
                            checkedChildren="Activo"
                            unCheckedChildren="Inactivo"
                            onChange={(value) => modalUpdate(item, value)}
                        />
                    </>
                );
            },
        },
        {
            title: "Acciones",
            align: "center",
            key: "id",
            render: (item) => (
                <Space >
                    {props.permissions &&
                        props.permissions.edit &&
                        (
                            <Link href={`/business/companies/${item.id}`}>
                                <Tooltip title="Configuración">
                                    <SettingOutlined />
                                </Tooltip>
                            </Link>
                        )}
                    {props.permissions && props.permissions.edit && (
                        <Tooltip title="Editar">
                            <EditOutlined onClick={() => showModal("edit", item)} />
                        </Tooltip>
                    )}
                    {props.permissions && props.permissions.delete && (
                        <>
                            {item.id == props.user.node ? (
                                <Tooltip title="No puedes eliminar la empresa a la que estas registrada">
                                    <StopOutlined />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Eliminar">
                                    <DeleteOutlined
                                        onClick={() => showModal("delete", item)}
                                    />
                                </Tooltip>
                            )}
                        </>
                    )}
                    {/* <Clipboard
                        text={
                            window.location.origin + "/ac/urn/" + item.permanent_code
                        }
                        tooltipView={false}
                        border={false}
                        type={"button"}
                        msg={"Copiado en portapapeles"}
                        tooltipTitle={"Copiar link de auto registro"}
                    /> */}
                </Space>
            ),
        },
    ];

    const changeView = () => {
        treeTable ? setTreeTable(false) : setTreeTable(true);
        if (admin) getCopaniesList();
        else getCopaniesList();
    };

    const modalUpdate = (node, status) => {
        setBusinessUpdate(node);
        if (!status) setUpdateModal(true);
        else {
            updateStatus(node);
        }
    };

    const closeModalUpdate = () => {
        setUpdateModal(false);
    };

    const updateStatus = (value) => {
        setIsEdit(true);
        value.active = value.active ? false : true;
        changeStatusBusiness(value);
    };

    const changeStatusBusiness = async (value) => {
        if (value.id) {
            delete value["parent"];
            delete value["image"];
            WebApiPeople.changeStatusNode(value.id, value)
                .then((response) => {
                    closeModalUpdate();
                    message.success(messageUpdateSuccess);
                })
                .catch((error) => {
                    closeModalUpdate();
                    message.error(messageError);
                    console.log(error);
                });
        }
    };

    const filterCompanies = (e) => {
        let name = e.target.value
        let new_liest = allBusiness.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
        console.log(new_liest)
        setBusiness(new_liest)
    }

    const debouncedSearch = debounce(filterCompanies, 500);


    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const uploadButton = (
        <div>
            {loadingLogo ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const configUpload = {
        label: "Logo",

        listType: "picture-card",

        className: "avatar-uploader",
        showUploadList: false,

        beforeUpload: (file) => {
            const isPNG =
                file.type === "image/png" ||
                file.type === "image/jpg" ||
                file.type === "image/jpeg";
            if (!isPNG) {
                message.error(`${file.name} , No es una imagen.`);
            }
            return isPNG || Upload.LIST_IGNORE;
        },
        onChange: (image) => {
            if (image.file.status === "uploading") {
                setLoadingLogo(true);
                return;
            }
            if (image.file.status === "done") {
                if (image.fileList.length > 0) {
                    setLogo(image.file.originFileObj);
                    getBase64(image.file.originFileObj, (imageUrl) => {
                        setLoadingLogo(false);
                        setImageUrl(imageUrl);
                    });
                }
            }
        },
    };

    return (
        <>
            <MainLayout
                currentKey={["business"]} defaultOpenKeys={["security"]}

            >
                <Breadcrumb>
                    <Breadcrumb.Item
                        className={"pointer"}
                        onClick={() => router.push({ pathname: "/home/persons/" })}
                    >
                        Inicio
                    </Breadcrumb.Item>
                    {verifyMenuNewForTenant() &&
                        <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
                    }
                    <Breadcrumb.Item>Empresa</Breadcrumb.Item>
                    <Breadcrumb.Item
                    // className={"pointer"}
                    // onClick={() => (treeTable ? "" : setTreeTable(true))}
                    >
                        Empresas
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="container" style={{ width: "100%" }}>
                    <Row justify={"end"}>
                        <Col>
                            {props.permissions && props.permissions.create && (
                                <Button
                                    style={{
                                        background: "#fa8c16",
                                        fontWeight: "bold",
                                        color: "white",
                                    }}
                                    onClick={switchModal}
                                >
                                    <PlusOutlined />
                                    Agregar empresa
                                </Button>
                            )}
                        </Col>
                    </Row>
                    {/*<Row justify={"end"}>*/}
                    {/*    <Col style={{ margin: "1%" }}>*/}
                    {/*        {treeTable ? (*/}
                    {/*            <Button onClick={changeView}>*/}
                    {/*                <NodeExpandOutlined />*/}
                    {/*                Vista de árbol*/}
                    {/*            </Button>*/}
                    {/*        ) : (*/}
                    {/*            <Button onClick={changeView}>*/}
                    {/*                <TableOutlined />*/}
                    {/*                Tabla*/}
                    {/*            </Button>*/}
                    {/*        )}*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                    <Row>
                        <Col span={24}>
                            {treeTable ? (
                                <ConfigProvider locale={esES}>
                                    <Input placeholder="Buscar empresa" onChange={debouncedSearch} style={{ width: 300 }} allowClear />
                                    <Table
                                        className={"mainTable"}
                                        // scroll={{ x: 300 }}
                                        size="small"
                                        columns={columns}
                                        dataSource={business}
                                        loading={loading}
                                        pagination={{
                                            showSizeChanger: true,
                                        }}
                                        locale={{
                                            emptyText: loading
                                                ? "Cargando..."
                                                : "No se encontraron resultados.",
                                        }}
                                    />
                                </ConfigProvider>
                            ) : (
                                <NodeTreeView />
                            )}
                        </Col>
                    </Row>
                </div>

                <Modal
                    visible={modalSwitch}
                    onCancel={switchModal}
                    title={<b>Agregar empresa</b>}
                    footer={[
                        <Button
                            key="back"
                            onClick={async () => {
                                await setNullCompany()
                                router.push("/payroll/importMasivePayroll")
                            }}
                        >
                            Importar xml
                        </Button>,
                        <Button
                            key="submit"
                            onClick={() => {
                                setModalSwitch(false), showModal("add");
                            }}
                        >
                            Crear manualmente
                        </Button>,
                    ]}
                >
                    <Alert
                        message={
                            <span>
                                <b>Importar xml:</b> Se crea la empresa y el histórico de
                                nómina a base de una carga masiva de xml (nóminas por
                                persona). Por favor importa todo tu año {currentYear}
                            </span>
                        }
                        type="warning"
                    />
                    <br />
                    <Alert
                        message={
                            <span>
                                <b>Crear manualmente:</b> Se crea de manera manual una
                                empresa con la información basica necesaria.
                            </span>
                        }
                        type="warning"
                    />
                </Modal>


                <Modal
                    title={isEdit ? "Actualizar empresa" : "Agregar empresa"}
                    visible={isModalVisible}
                    onCancel={() => handleOk()}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Regresar
                        </Button>,
                        <Button
                            form="addBusinessForm"
                            type="primary"
                            key="submit"
                            loading={loading}
                            htmlType="submit"
                            disabled={addB}
                        >
                            {isEdit ? "Actualizar" : "Agregar"}
                        </Button>,
                    ]}
                >
                    <Form
                        id="addBusinessForm"
                        name="normal_login"
                        onFinish={onFinish}
                        layout={"vertical"}
                        form={formBusiness}
                    >
                        <Form.Item name="id" label="id" style={{ display: "none" }}>
                            <Input type="text" />
                        </Form.Item>
                        <Form.Item label="Logo">
                            <Upload {...configUpload}>
                                {imageUrl ? (
                                    <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Nombre"
                            rules={[{ required: true, message: "Ingresa un nombre" }]}
                        >
                            <Input placeholder="Nombre de la empresa" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Descripción"
                            rules={[{ required: true, message: "Ingresa una descripción" }]}
                        >
                            <TextArea rows={4} showCount maxLength={200} />
                        </Form.Item>
                        <Form.Item name="FNode" label="Nodo padre">
                            <Select
                                allowClear
                                showSearch
                                placeholder="Selecciona una empresa"
                                optionFilterProp="children"
                                name={"fNode"}
                                notFoundContent={"No se encontraron resultados."}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {business.map((bus) => (
                                    <Option value={bus.id} key={bus.key}>
                                        {bus.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title={"Eliminar empresa " + businessName}
                    visible={isModalDeleteVisible}
                    onCancel={() => handleCancel()}
                    footer={[
                        <Button key="back" disabled={loading} onClick={handleCancel}>
                            Cancelar
                        </Button>,
                        <Button
                            form="deleteBusinessForm"
                            type="primary"
                            key="submit"
                            loading={loading}
                            htmlType="submit"
                        >
                            Si, eliminar
                        </Button>,
                    ]}
                >
                    <Form
                        id="deleteBusinessForm"
                        name="normal_login"
                        onFinish={onFinish}
                        layout={"vertical"}
                        form={formBusiness}
                    >
                        <Form.Item name="id" label="id" style={{ display: "none" }}>
                            <Input type="text" />
                        </Form.Item>
                        <Alert
                            type="warning"
                            showIcon
                            message="¿Está seguro de eliminar esta empresa?"
                            description="Al eliminar esta empresa perderá todos los datos relacionados a la misma, incluyendo las sub empresas relacionadas a esta."
                        />
                    </Form>
                </Modal>

                <Modal
                    title="Desactivar empresa"
                    visible={updateModal}
                    onOk={() => updateStatus(businessUpdate)}
                    onCancel={() => {
                        setUpdateModal(false), setBusinessUpdate(null);
                        getCopaniesList();
                    }}
                    okText="Sí, Desactivar"
                    cancelText="Cancelar"
                >
                    Al desactivar esta empresa los usuarios colaboradores que estén
                    asociados a ésta no podrán acceder en la aplicación móvil
                </Modal>
            </MainLayout>
            <ModalReceipts
                visible={openReceipts}
                receipts={receipts}
                itemNode={itemNode}
                close={() => {
                    setOpenReceipts(false)
                    setReceipts([])
                }}
            />
        </>
    );
};

const mapState = (state) => {
    return {
        permissions: state.userStore.permissions.company,
        user: state.userStore.user,
        config: state.userStore.general_config,
        currentNode: state.userStore.current_node,
    };
};

export default connect(mapState, { setNullCompany })(businessForm);
