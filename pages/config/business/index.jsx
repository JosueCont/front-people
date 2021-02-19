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
  message,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import SelectCompany from "../../../components/selects/SelectCompany";

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
  const [selectCompany, setselectCompany] = useState([]);
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);
  const urls = [
    "/business/department/",
    "/person/job/",
    "/person/person-type/",
    "/setup/relationship/",
    "/setup/document-type/",
    "/setup/banks/",
  ];
  const [modal, setModal] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [selectDep, setSelectDep] = useState([]);

  useEffect(() => {
    urls.map((a) => {
      getDepartments();
      getCatalog(a);
    });
  }, []);

  const getCompanies = async () => {
    try {
      let response = await Axios.get(API_URL + `/business/node/`);
      let data = response.data.results;
      let options = [];
      data.map((item) => {
        options.push({
          value: item.id,
          label: item.name,
          key: item.name + item.id,
        });
      });
      setselectCompany(options);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getCatalog = (url) => {
    Axios.get(API_URL + url)
      .then((response) => {
        if (url == "/business/department/") {
          console.log("DEP-->> ", response.data.results);
          setDepartments(response.data.results);
        }
        if (url == "/person/job/") {
          console.log("Job-->> ", response.data.results);
          setJobs(response.data.results);
        }
        if (url == "/person/person-type/")
          setTypesPerson(response.data.results);
        if (url == "/setup/relationship/")
          setRelationsShip(response.data.results);
        if (url == "/setup/document-type/")
          setTypesDocuments(response.data.results);
        if (url == "/setup/banks/") setBanks(response.data.results);
        getCompanies();
        setLoadingTable(false);
      })
      .catch((error) => {
        setLoadingTable(false);
        console.log(error);
      });
  };

  const onFinishForm = (value, url) => {
    if (id != "") {
      value.id = id;
      updateRegister(url, value);
    } else saveRegister(url, value);
  };

  const getDepartments = () => {
    Axios.get(API_URL + `/business/department/`)
      .then((response) => {
        if (response.status === 200) {
          let dep = response.data.results;
          dep = dep.map((a) => {
            return { label: a.name, value: a.id };
          });
          setSelectDep(dep);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveRegister = (url, data) => {
    setLoadingTable(true);
    Axios.post(API_URL + url, data)
      .then((response) => {
        setId("");
        resetForm();
        getCatalog(url);
        message.success("Agregado correctamente.");
      })
      .catch((error) => {
        resetForm();
        setId("");
        setLoadingTable(false);
        console.log(error);
        message.success("Ocurrio un error intente de nuevo.");
      });
  };
  const updateRegister = (url, value) => {
    Axios.put(API_URL + url + `${value.id}/`, value)
      .then((response) => {
        setId("");
        resetForm();
        setLoadingTable(true);
        getCatalog(url);
        setEdit(false);
        message.success("Actualizado correctamente.");
      })
      .catch((error) => {
        setEdit(false);
        setId("");
        setLoadingTable(false);
        resetForm();
        message.success("Ocurrio un error intente de nuevo.");
      });
  };

  const editRegister = (item, param) => {
    setEdit(true);
    if (param == "dep") {
      setId(item.id);
      formDepartment.setFieldsValue({
        node: item.node.id,
        name: item.name,
        description: item.description,
        code: item.code,
      });
    }
    if (param == "job") {
      setId(item.id);
      formJob.setFieldsValue({
        node: item.department.node.id,
        name: item.name,
        code: item.code,
        department: item.department.id,
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
      title: "Empresa",
      render: (item) => {
        return <>{item.node.name}</>;
      },
    },
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
      title: "Código",
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
      title: "Empresa",
      render: (item) => {
        return <>{item.department.name}</>;
      },
    },

    {
      title: "Departamento",
      render: (item) => {
        return <>{item.department.name}</>;
      },
    },
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
                      url: "/person/job/",
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
      title: "Código",
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
      title: "Código",
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
      title: "Código",
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
      title: "Código",
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
    setEdit(false);
  };

  const changeNode = (value) => {
    Axios.get(API_URL + `/business/department/?node=${value}`)
      .then((response) => {
        let data = response.data.results;
        console.log("data", data);
        data = data.map((a) => {
          return { label: a.name, value: a.id, key: a.name + a.id };
        });
        setSelectDep(data);
      })
      .catch((error) => {
        setSelectDep([]);
      });
  };

  return (
    <>
      <MainLayout currentKey="3.1">
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
          <Title style={{ fontSize: "25px" }}>Catálogos</Title>
          <Tabs tabPosition={"left"}>
            <TabPane tab="Departamentos" key="tab_1">
              {edit ? (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
              ) : (
                <></>
              )}
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
                      name="node"
                      label="Empresa"
                      rules={[ruleRequired]}
                    >
                      <Select options={selectCompany} />
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
                      name="description"
                      label="Descripción"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="code" label="Código">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col lg={2} xs={2} offset={1}>
                    <Form.Item label=" ">
                      <Button onClick={resetForm}>Cancelar</Button>
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={2} offset={2}>
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
              {edit ? (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
              ) : (
                <></>
              )}
              <Form
                layout={"vertical"}
                form={formJob}
                onFinish={(values) => onFinishForm(values, "/person/job/")}
              >
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      node="node"
                      label="Empresa"
                      rules={[ruleRequired]}
                    >
                      <Select options={selectCompany} onChange={changeNode} />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="department"
                      label="Departamento"
                      rules={[ruleRequired]}
                    >
                      <Select options={selectDep} />
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
                      label="Código"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col lg={2} xs={2} offset={1}>
                    <Form.Item label=" ">
                      <Button onClick={resetForm}>Cancelar</Button>
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={2} offset={2}>
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
              {edit ? (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
              ) : (
                <></>
              )}
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
                      label="Código"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col lg={2} xs={2} offset={1}>
                    <Form.Item label=" ">
                      <Button onClick={resetForm}>Cancelar</Button>
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={2} offset={2}>
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
              {edit ? (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
              ) : (
                <></>
              )}
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
                      label="Código"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col lg={2} xs={2} offset={1}>
                    <Form.Item label=" ">
                      <Button onClick={resetForm}>Cancelar</Button>
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={2} offset={2}>
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
              {edit ? (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
              ) : (
                <></>
              )}
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
                      label="Código"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col lg={2} xs={2} offset={1}>
                    <Form.Item label=" ">
                      <Button onClick={resetForm}>Cancelar</Button>
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={2} offset={2}>
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
              {edit ? (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
              ) : (
                <></>
              )}
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
                      label="Código"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Col lg={2} xs={2} offset={1}>
                    <Form.Item label=" ">
                      <Button onClick={resetForm}>Cancelar</Button>
                    </Form.Item>
                  </Col>
                  <Col lg={2} xs={2} offset={2}>
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
        title="Eliminar"
        visible={modal}
        onOk={deleteRegister}
        onCancel={showModal}
        okText="Si, Eliminar"
        cancelText="Cancelar"
      >
        Al eliminar este registro perderá todos los datos relacionados a el de
        manera permanente. ¿Está seguro de querer eliminarlo?
      </Modal>
    </>
  );
};

export default withAuthSync(configBusiness);
