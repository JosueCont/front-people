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
  Modal,
  Form,
  message,
  Tree,
} from "antd";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  TableOutlined,
  NodeExpandOutlined,
  PlusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { API_URL } from "../../config/config";
import Router from "next/router";
import MainLayout from "../../layout/MainLayout";
import NodeTreeView from "./TreeView/treeview";
import Cookie from "js-cookie";

const { TextArea } = Input;
const { Content } = Layout;
const { Option } = Select;

const businessForm = () => {
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [permissions, setPermissions] = useState({});

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
    Axios.delete(API_URL + "/business/node/" + id + "/")
      .then(function (response) {
        if (response.status === 200) {
          Router.push("/business");
        }
        getBusiness();
        setIsModalVisible(false);
        setIsModalDeleteVisible(false);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };
  const updateBusiness = async (data) => {
    setLoading(true);
    Axios.put(API_URL + "/business/node/" + data.id + "/", data)
      .then(function (response) {
        if (response.status === 200) {
          Router.push("/business");
        }
        getBusiness();
        setIsModalVisible(false);
        setLoading(false);
      })
      .catch(function (error) {
        getBusiness();
        setLoading(false);
        console.log(error);
      });
  };
  const addBusiness = async (name, description, fNode) => {
    const data = {
      name: name,
      description: description,
      parent: fNode ? fNode : null,
    };
    setLoading(true);
    Axios.post(API_URL + "/business/node/", data)
      .then(function (response) {
        if (response.status === 200) {
          Router.push("/business");
        }
        getBusiness();
        setIsModalVisible(false);
        setLoading(false);
      })
      .catch(function (error) {
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
    } else if (type === "edit") {
      setIsDeleted(false);
      setIsEdit(true);
      formBusiness.setFieldsValue({
        name: item.name,
        description: item.description,
        FNode: item.parent ? item.parent.id : null,
        id: item.id,
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

  const getBusiness = () => {
    setLoading(true);
    Axios.get(API_URL + "/business/node/")
      .then((response) => {
        setBusiness([]);
        setBusiness(response.data.results);
        setLoading(false);
      })
      .catch((e) => {
        setBusiness([]);
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    const jwt = JSON.parse(Cookie.get("token"));
    searchPermissions(jwt.perms);
    getBusiness();
    getNodesTree();
  }, []);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.company.can.view")) perms.view = true;
      if (a.includes("people.company.can.create")) perms.create = true;
      if (a.includes("people.company.can.edit")) perms.edit = true;
      if (a.includes("people.company.can.delete")) perms.delete = true;
      if (a.includes("people.company.function.change_is_active"))
        perms.change_status;
    });
    setPermissions(perms);
  };

  const getNodesTree = () => {
    Axios.post(API_URL + `/business/node/node_in_cascade/`)
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
              disabled={permissions.change_status ? false : true}
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
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              {permissions.edit && (
                <Col className="gutter-row" span={6}>
                  <EditOutlined onClick={() => showModal("edit", item)} />
                </Col>
              )}
              {permissions.delete && (
                <Col className="gutter-row" span={6}>
                  <DeleteOutlined onClick={() => showModal("delete", item)} />
                </Col>
              )}
            </Row>
          </div>
        );
      },
    },
  ];

  const changeView = () => {
    treeTable ? setTreeTable(false) : setTreeTable(true);
    getBusiness();
  };

  const modalUpdate = (value) => {
    setBusinessUpdate(value);
    updateModal ? setUpdateModal(false) : setUpdateModal(true);
    if (!value.id) {
      getBusiness();
    }
  };

  const updateStatus = () => {
    setIsEdit(true);
    businessUpdate.active = businessUpdate.active ? false : true;
    delete businessUpdate["parent"];
    changeStatusBusiness();
  };

  const changeStatusBusiness = async () => {
    Axios.put(API_URL + `/business/node/${businessUpdate.id}/`, businessUpdate)
      .then(function (response) {
        modalUpdate({});
      })
      .catch(function (error) {
        message.error("Error al actualizar, intente de nuevo");
        console.log(error);
      });
  };

  return (
    <MainLayout currentKey="2">
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
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
                size="small"
                columns={columns}
                dataSource={business}
                loading={loading}
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
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="FNode" label="Nodo padre">
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              name={"fNode"}
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
        onOk={updateStatus}
        onCancel={() => modalUpdate({})}
        okText="Si, Desactivar"
        cancelText="Cancelar"
      >
        Al desactivar esta empresa los usuarios colaboradores que estén
        asociados a ésta no podrán acceder en la aplicación móvil
      </Modal>
    </MainLayout>
  );
};
export default businessForm;
