import { useEffect, useState } from "react";
import { withAuthSync } from "../../../libs/auth";
import MainLayout from "../../../layout/MainLayout";
import {
  Breadcrumb,
  Tabs,
  Form,
  Row,
  Col,
  Layout,
  Input,
  Button,
  Select,
  Spin,
  Table,
  Modal,
  Alert,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import { API_URL } from "../../../config/config";

const { Content } = Layout;

const configBusiness = () => {
  const { TabPane } = Tabs;
  const ruleRequired = { required: true, message: "Este campo es requerido" };
  const [formDepartment] = Form.useForm();
  const [formJob] = Form.useForm();
  const [formTypePerson] = Form.useForm();
  const [formRelationship] = Form.useForm();
  const [formTypeDocument] = Form.useForm();
  const [formBank] = Form.useForm();
  const [loadingTable, setLoadingTable] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [typesPerson, setTypesPerson] = useState([]);
  const [relationsShip, setRelationsShip] = useState([]);
  const [typesDocument, setTypesDocuments] = useState([]);
  const [banks, setBanks] = useState([]);
  const [id, setId] = useState("");
  const urls = [
    "/business/department/",
    "/person/person-type/",
    "/setup/relationship/",
    "/setup/document-type/",
    "/setup/banks/",
  ];
  const [modal, setModal] = useState(false);
  const [deleted, setDeleted] = useState({});

  useEffect(() => {
    urls.map((a) => {
      getCatalog(a);
    });
  }, []);

  const getCatalog = (url) => {
    Axios.get(API_URL + url)
      .then((response) => {
        if (url == "/business/department/")
          setDepartments(response.data.results);
        if (url == "jobs") setJobs(response.data.results);
        if (url == "/person/person-type/")
          setTypesPerson(response.data.results);
        if (url == "/setup/relationship/")
          setRelationsShip(response.data.results);
        if (url == "/setup/document-type/")
          setTypesDocuments(response.data.results);
        if (url == "/setup/banks/") setBanks(response.data.results);
        setLoadingTable(false);
      })
      .catch((error) => {
        setLoadingTable(false);
        console.log(error);
      });
  };

  const onFinishForm = (value, url) => {
    if (id != "") updateRegister(url, value);
    else saveRegister(url, value);
  };

  const saveRegister = (url, data) => {
    setLoadingTable(true);
    Axios.post(API_URL + url, data)
      .then((response) => {
        setId("");
        resetForm();
        if (response.data) getCatalog(url);
      })
      .catch((error) => {
        resetForm();
        setId("");
        setLoadingTable(false);
        console.log(error);
      });
  };
  const updateRegister = (url, value) => {
    Axios.put(API_URL + url + `${id}/`, value)
      .then((response) => {
        setId("");
        resetForm;
        setLoadingTable(true);
        getCatalog(url);
      })
      .catch((error) => {
        setId("");
        setLoadingTable(false);
        resetForm();
      });
  };

  const editRegister = (item, param) => {
    if (param == "dep") {
      setId(item.id);
      formDepartment.setFieldsValue({
        name: item.name,
        description: item.description,
        code: item.code,
      });
    }
    if (param == "job") {
      setId(item.id);
      formJob.setFieldsValue({
        name: item.name,
        code: item.code,
      });
    }
    if (param == "tp") {
      setId(item.id);
      formTypePerson.setFieldsValue({
        name: item.name,
        code: item.code,
      });
    }
    if (param == "rs") {
      setId(item.id);
      formRelationship.setFieldsValue({
        name: item.name,
        code: item.code,
      });
    }
    if (param == "td") {
      setId(item.id);
      formTypeDocument.setFieldsValue({
        name: item.name,
        code: item.code,
      });
    }
    if (param == "bank") {
      setId(item.id);
      formBank.setFieldsValue({
        name: item.name,
        code: item.code,
      });
    }
  };

  const colDepartment = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Descripción",
      dataIndex: "description",
    },
    {
      title: "Codigo",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => editRegister(item, "dep")}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      url: "/business/department/",
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];
  const colJob = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Departamento",
      dataIndex: "name",
    },
    {
      title: "Codigo",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => editRegister(item, "job")}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      url: "/business/department/",
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];
  const colTypePerson = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Codigo",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => editRegister(item, "tp")}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      url: "/person/person-type/",
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];
  const colRelationShip = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Codigo",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => editRegister(item, "rs")}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      url: "/setup/relationship/",
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];
  const colTypeDocument = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Codigo",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => editRegister(item, "td")}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      url: "/setup/document-type/",
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];
  const colBank = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Codigo",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <EditOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => editRegister(item, "bank")}
                />
              </Col>
              <Col className="gutter-row" offset={1}>
                <DeleteOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => {
                    setDeleteRegister({
                      id: item.id,
                      url: "/setup/banks/",
                    });
                  }}
                />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const showModal = () => {
    modal ? setModal(false) : setModal(true);
  };
  const setDeleteRegister = (props) => {
    setDeleted(props);
    showModal();
  };
  const deleteRegister = () => {
    console.log("Delete-->>> ", deleted);
    Axios.delete(API_URL + deleted.url + `${deleted.id}/`)
      .then((response) => {
        resetForm();
        setId("");
        setLoadingTable(true);
        getCatalog(deleted.url);
        setDeleteRegister({});
        showModal();
      })
      .catch((error) => {
        setId("");
        resetForm();
        showModal();
        setLoadingTable(false);
        console.log(error);
      });
  };

  const resetForm = () => {
    formDepartment.resetFields();
    formJob.resetFields();
    formTypePerson.resetFields();
    formRelationship.resetFields();
    formTypeDocument.resetFields();
    formBank.resetFields();
  };

  return (
    <>
      <MainLayout currentKey="3.2">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item href="/home/">Inicio</Breadcrumb.Item>
          <Breadcrumb.Item>Configuración general</Breadcrumb.Item>
        </Breadcrumb>
        <Content className="site-layout">
          <div style={{ padding: "1%", float: "right" }}></div>
        </Content>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <Title>Catálogos</Title>
          <Tabs tabPosition={"left"}>
            <TabPane tab="Departamentos" key="tab_1">
              <Form
                layout={"vertical"}
                form={formDepartment}
                onFinish={(values) =>
                  onFinishForm(values, "/business/department/")
                }
              >
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="name"
                      label="Nombre"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="description"
                      label="Descripción"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="code" label="Codigo">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={22} offset={1}>
                    <Form.Item label=" ">
                      <Button type="primary" htmlType="submit">
                        Guardar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Spin tip="Loading..." spinning={loadingTable}>
                <Table columns={colDepartment} dataSource={departments} />
              </Spin>
            </TabPane>
            <TabPane tab="Puestos de trabajo" key="tab_2">
              <Form
                layout={"vertical"}
                form={formJob}
                onFinish={(values) =>
                  onFinishForm(values, "/business/department/")
                }
              >
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="department"
                      label="Departamento"
                      rules={[ruleRequired]}
                    >
                      <Select />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="name"
                      label="Nombre"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="code"
                      label="Codigo"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={22} offset={1}>
                    <Form.Item label=" ">
                      <Button type="primary" htmlType="submit">
                        Guardar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Spin tip="Loading..." spinning={loadingTable}>
                <Table columns={colJob} dataSource={jobs} />
              </Spin>
            </TabPane>
            <TabPane tab="Tipos de persona" key="tab_3">
              <Form
                layout={"vertical"}
                form={formTypePerson}
                onFinish={(values) =>
                  onFinishForm(values, "/person/person-type/")
                }
              >
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="name"
                      label="Nombre"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="code"
                      label="Codigo"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={22} offset={1}>
                    <Form.Item label=" ">
                      <Button type="primary" htmlType="submit">
                        Guardar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Spin tip="Loading..." spinning={loadingTable}>
                <Table columns={colTypePerson} dataSource={typesPerson} />
              </Spin>
            </TabPane>
            <TabPane tab="Parentescos" key="tab_4">
              <Form
                layout={"vertical"}
                form={formRelationship}
                onFinish={(values) =>
                  onFinishForm(values, "/setup/relationship/")
                }
              >
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="name"
                      label="Nombre"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="code"
                      label="Codigo"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={22} offset={1}>
                    <Form.Item label=" ">
                      <Button type="primary" htmlType="submit">
                        Guardar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Spin tip="Loading..." spinning={loadingTable}>
                <Table columns={colRelationShip} dataSource={relationsShip} />
              </Spin>
            </TabPane>
            <TabPane tab="Tipos de documento" key="tab_5">
              <Form
                layout={"vertical"}
                form={formTypeDocument}
                onFinish={(values) =>
                  onFinishForm(values, "/setup/document-type/")
                }
              >
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="name"
                      label="Nombre"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="code"
                      label="Codigo"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={22} offset={1}>
                    <Form.Item label=" ">
                      <Button type="primary" htmlType="submit">
                        Guardar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Spin tip="Loading..." spinning={loadingTable}>
                <Table columns={colTypeDocument} dataSource={typesDocument} />
              </Spin>
            </TabPane>
            <TabPane tab="Bancos" key="tab_6">
              <Form
                layout={"vertical"}
                form={formBank}
                onFinish={(values) => onFinishForm(values, "/setup/banks/")}
              >
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="name"
                      label="Nombre"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="code"
                      label="Codigo"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={22} offset={1}>
                    <Form.Item label=" ">
                      <Button type="primary" htmlType="submit">
                        Guardar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Spin tip="Loading..." spinning={loadingTable}>
                <Table columns={colBank} dataSource={banks} />
              </Spin>
            </TabPane>
          </Tabs>
        </div>
      </MainLayout>
      <Modal
        title="Modal"
        visible={modal}
        onOk={deleteRegister}
        onCancel={showModal}
        okText="Si, Eliminar"
        cancelText="Cancelar"
      >
        <Alert
          message="Warning"
          description="Al eliminar este registro perderá todos los datos
                    relacionados a el de manera permanente.
                    ¿Está seguro de querer eliminarlo?"
          type="warning"
          showIcon
        />
      </Modal>
    </>
  );
};

export default withAuthSync(configBusiness);
