import {
  Layout,
  Breadcrumb,
  Table,
  Row,
  Col,
  Input,
  Select,
  Switch,
  Button,
  Upload,
  Modal,
  Form,
  message,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  TableOutlined,
  NodeExpandOutlined,
  PlusOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import MainLayout from "../../layout/MainLayout";
import NodeTreeView from "./TreeView/treeview";
import Cookie from "js-cookie";
import { userId } from "../../libs/auth";
import Clipboard from "../Clipboard";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";

const { TextArea } = Input;
const { Content } = Layout;
const { Option } = Select;

const businessForm = ({ permissions, ...props }) => {
  let router = useRouter();
  const [business, setBusiness] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [logo, setLogo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formBusiness] = Form.useForm();
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [treeTable, setTreeTable] = useState(true);
  const [nodesTree, setNodesTree] = useState([]);
  const [updateModal, setUpdateModal] = useState(false);
  const [businessUpdate, setBusinessUpdate] = useState({});
  /* const [permissions, setPermissions] = useState({}); */
  let personId = userId();
  const [admin, setAdmin] = useState(false);
  const [addB, setAddB] = useState(false);

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
  const deleteBusiness = async (id, name, description) => {
    setLoading(true);
    WebApiPeople.deleteNode(id)
      .then(function (response) {
        if (response.status === 200) {
          Router.push("/business");
        }
        getCopaniesList();
        setIsModalVisible(false);
        setIsModalDeleteVisible(false);
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
        person();
        setIsModalVisible(false);
        setLoading(false);
        getCopaniesList();
        message.success("Empresa actualizada correctamente");

        if (response.status === 200) {
          sessionStorage.setItem("image", response.data.image);
          setTimeout(function () {
            Router.reload();
          }, 1000);
        }
      })
      .catch(function (error) {
        person();
        setLoading(false);
        console.log(error);
      });
  };
  const addBusiness = async (name, description, fNode) => {
    let data = new FormData();
    data.append("name", name);
    data.append("description", description);
    fNode && data.append("parent", fNode);
    setAddB(true);

    data.append("image", logo);
    data.append("person", personId);
    setLoading(true);
    if (logo == null || logo == undefined) {
      message.error("Agregue una imagen");
      setAddB(false);
      return;
    }
    WebApiPeople.createNode(data)
      .then(function (response) {
        if (response.status === 200) {
          Router.push("/business");
        }
        person();
        setIsModalVisible(false);
        setLoading(false);
        setAddB(false);
        getCopaniesList();
        message.success("Agregado correctamente.");
      })
      .catch(function (error) {
        setAddB(false);
        message.error("Ocurrio un error, intente de nuevo");
        setLoading(false);
        console.log(error);
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
    personId = userId();
    const jwt = JSON.parse(Cookie.get("token"));
    person();
    getNodesTree();
  }, []);

  const person = () => {
    const jwt = JSON.parse(Cookie.get("token"));
    WebApiPeople.personForKhonnectId({
      id: jwt.user_id,
    })
      .then((response) => {
        setAdmin(response.data.is_admin);
        if (response.data.is_admin) {
          getCopaniesList();
        } else {
          getCopaniesList();
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const getCopaniesList = async () => {
    try {
      let response = await WebApiPeople.getCompanys();
      let data = response.data.results;
      setBusiness(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getBusiness = () => {
    setLoading(true);
    WebApiPeople.getCompaniesPeople(personId)
      .then((response) => {
        setBusiness([]);
        setBusiness(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setBusiness([]);
        console.log(e);
        setLoading(false);
      });
  };

  const getNodesTree = () => {
    WebApiPeople.getNodeTree({
      person: personId,
    })
      .then((response) => {
        setNodesTree(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nodo padre",
      dataIndex: "parent",
      key: "parent",
      render: (parent) => {
        return parent ? parent.name : null;
      },
    },
    {
      title: "Estatus",
      key: "active",
      render: (item) => {
        return (
          <>
            <Switch
              disabled={permissions.change_is_active ? false : true}
              defaultChecked={item.active}
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
              onChange={() => modalUpdate(item)}
            />
          </>
        );
      },
    },
    {
      title: "Acciones",
      align: "center",
      render: (item) => {
        return (
          <div>
            <Row gutter={24}>
              {permissions.edit && (
                <Col className="gutter-row" span={6}>
                  <Link href={`/business/${item.id}`}>
                    <Tooltip title="Configuración">
                      <SettingOutlined />
                    </Tooltip>
                  </Link>
                </Col>
              )}
              {permissions.edit && (
                <Col className="gutter-row" span={6}>
                  <Tooltip title="Editar">
                    <EditOutlined onClick={() => showModal("edit", item)} />
                  </Tooltip>
                </Col>
              )}
              {permissions.delete && (
                <Col className="gutter-row" span={6}>
                  <Tooltip title="Eliminar">
                    <DeleteOutlined onClick={() => showModal("delete", item)} />
                  </Tooltip>
                </Col>
              )}
              <Col className="gutter-row" span={6}>
                <Clipboard
                  text={
                    window.location.origin + "/ac/urn/" + item.permanent_code
                  }
                  border={false}
                  type={"button"}
                  msg={"Copiado en portapapeles"}
                  tooltipTitle={"Copiar link de auto registro"}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const changeView = () => {
    treeTable ? setTreeTable(false) : setTreeTable(true);
    if (admin) getCopaniesList();
    else getCopaniesList();
  };

  const modalUpdate = (value) => {
    setBusinessUpdate(value);
    if (value.active)
      updateModal ? setUpdateModal(false) : setUpdateModal(true);
    else updateStatus(value);
  };

  const closeModalUpdate = () => {
    setUpdateModal(false);
    person();
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
        })
        .catch((error) => {
          message.error("Error al actualizar, intente de nuevo");
          console.log(error);
          closeModalUpdate();
        });
    }
  };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoadingLogo(true);
      return;
    }
    if (info.fileList.length > 0) {
      setLogo(info.file.originFileObj);
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoadingLogo(false);
        setImageUrl(imageUrl);
      });
    }
  };

  const uploadButton = (
    <div>
      {loadingLogo ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <MainLayout currentKey={["business"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => (treeTable ? "" : setTreeTable(true))}
        >
          Empresas
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify={"end"}>
          <Col>
            {permissions.create && (
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={() => showModal("add")}
              >
                <PlusOutlined />
                Agregar empresa
              </Button>
            )}
          </Col>
        </Row>
        <Row justify={"end"}>
          <Col style={{ margin: "1%" }}>
            {treeTable ? (
              <Button onClick={changeView}>
                <NodeExpandOutlined />
                Vista de árbol
              </Button>
            ) : (
              <Button onClick={changeView}>
                <TableOutlined />
                Tabla
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {treeTable ? (
              <Table
                className={"mainTable"}
                scroll={{ x: 300 }}
                size="small"
                columns={columns}
                dataSource={business}
                loading={loading}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
              />
            ) : (
              <NodeTreeView />
            )}
          </Col>
        </Row>
      </div>

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
          <Form.Item label="Logo" required>
            <Upload
              label="Logo"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleChange}
            >
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
              placeholder="Select a person"
              optionFilterProp="children"
              name={"fNode"}
              notFoundContent={"No se encontraron resultados."}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {business.map((bus) => (
                <Option value={bus.id}>{bus.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={"Eliminar empresa " + businessName}
        visible={isModalDeleteVisible}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button
            form="deleteBusinessForm"
            type="primary"
            key="submit"
            htmlType="submit"
          >
            Si, Eliminar
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
          <div className="float-label">
            <label>¿Está seguro de eliminar esta empresa?</label>
          </div>
          <Form.Item name="id" label="id" style={{ display: "none" }}>
            <Input type="text" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Desactivar empresa"
        visible={updateModal}
        onOk={() => updateStatus(businessUpdate)}
        onCancel={() => closeModalUpdate()}
        okText="Si, Desactivar"
        cancelText="Cancelar"
      >
        Al desactivar esta empresa los usuarios colaboradores que estén
        asociados a ésta no podrán acceder en la aplicación móvil
      </Modal>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.company,
  };
};

export default connect(mapState)(businessForm);
