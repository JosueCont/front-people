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
} from "antd";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import HeaderCustom from "../../components/Header";
import { API_URL } from "../../config/config";
import Router from "next/router";
import MainLayout, {} from "../../layout/MainLayout"

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
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    if (isDeleted) {
      deleteBusiness(values.id);
    } else {
      if (!isEdit) {
        addBusiness(values.name, values.description, values.FNode);
      } else {
        updateBusiness(
          values.id,
          values.name,
          values.description,
          values.FNode
        );
      }
    }
  };
  const deleteBusiness = async (id, name, description) => {
    Axios.delete(API_URL + "/business/node/" + id + "/")
      .then(function (response) {
        console.log(response.data);
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
  const updateBusiness = async (id, name, description, fNode) => {
    const data = {
      name: name,
      description: description,
      parent: fNode ? fNode : null,
    };
    Axios.put(API_URL + "/business/node/" + id + "/", data)
      .then(function (response) {
        console.log(response.data);
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

  const addBusiness = async (name, description, fNode) => {
    const data = {
      name: name,
      description: description,
      parent: fNode ? fNode : null,
    };
    Axios.post(API_URL + "/business/node/", data)
      .then(function (response) {
        console.log(response.data);
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
        console.log("RESPONSE-->> ", response);
        setBusiness(response.data.results);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getBusiness();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
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
      title: "Activo",
      dataIndex: "active",
      key: "active",
      render: (text) => {
        return text === true ? <p>Sí</p> : <p>No</p>;
      },
    },
    {
      title: "Opciones",
      render: (item) => {
        console.log("table", item);
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <EditOutlined onClick={() => showModal("edit", item)} />
              </Col>
              <Col className="gutter-row" span={6}>
                <DeleteOutlined onClick={() => showModal("delete", item)} />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <MainLayout currentKey="2">
        <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Empresa</Breadcrumb.Item>
          </Breadcrumb>

          <div style={{ padding: "20px 0", float: "right" }}>
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
          </div>
          <div className="site-layout-background" >
            <Table
              size="small"
              columns={columns}
              dataSource={business}
              loading={loading}
            />
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
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
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
                Regresar
              </Button>,
              <Button
                form="deleteBusinessForm"
                type="primary"
                key="submit"
                htmlType="submit"
              >
                Eliminar
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
    </MainLayout>
  );
};
export default businessForm;
