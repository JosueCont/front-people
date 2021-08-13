import { useEffect, useState } from "react";
import {
  userCompanyId,
  withAuthSync,
  userCompanyName,
} from "../../../libs/auth";
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
  Switch,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import Router from "next/router";
import SelectCompany from "../../../components/selects/SelectCompany";
import jsCookie from "js-cookie";

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
  const [modal, setModal] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [selectDep, setSelectDep] = useState([]);
  const [permissions, setPermissions] = useState({});
  let nodeId = userCompanyId();
  let nodePeople = userCompanyName();
  const urls = [
    `/business/department/?node=${nodeId}`,
    `/person/job/?node=${nodeId}`,
    "/person/person-type/",
    "/setup/relationship/",
    `/setup/document-type/?node=${nodeId}`,
    "/setup/banks/",
  ];

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);

    urls.map((a) => {
      getDepartments();
      getCatalog(a);
    });
  }, []);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.department.can.view"))
        perms.view_department = true;
      if (a.includes("people.department.can.create"))
        perms.create_department = true;
      if (a.includes("people.department.can.edit"))
        perms.edit_department = true;
      if (a.includes("people.department.can.delete"))
        perms.delete_department = true;
      if (a.includes("people.job.can.view")) perms.view_job = true;
      if (a.includes("people.job.can.create")) perms.create_job = true;
      if (a.includes("people.job.can.edit")) perms.edit_job = true;
      if (a.includes("people.job.can.delete")) perms.delete_job = true;
      if (a.includes("people.person_type.can.view"))
        perms.view_persontype = true;
      if (a.includes("people.person_type.can.create"))
        perms.create_persontype = true;
      if (a.includes("people.person_type.can.edit"))
        perms.edit_persontype = true;
      if (a.includes("people.person_type.can.delete"))
        perms.delete_persontype = true;
      if (a.includes("people.relationship.can.view"))
        perms.view_relationship = true;
      if (a.includes("people.relationship.can.create"))
        perms.create_relationship = true;
      if (a.includes("people.relationship.can.edit"))
        perms.edit_relationship = true;
      if (a.includes("people.relationship.can.delete"))
        perms.delete_relationship = true;
      if (a.includes("people.document_type.can.view"))
        perms.view_documenttype = true;
      if (a.includes("people.document_type.can.create"))
        perms.create_documenttype = true;
      if (a.includes("people.document_type.can.edit"))
        perms.edit_documenttype = true;
      if (a.includes("people.document_type.can.delete"))
        perms.delete_documenttype = true;
      if (a.includes("people.bank.can.view")) perms.view_bank = true;
      if (a.includes("people.bank.can.create")) perms.create_bank = true;
      if (a.includes("people.bank.can.edit")) perms.edit_bank = true;
      if (a.includes("people.bank.can.delete")) perms.delete_bank = true;
    });
    setPermissions(perms);
  };

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
      console.log(error);
    }
  };

  const getCatalog = (url) => {
    Axios.get(API_URL + url)
      .then((response) => {
        if (url == `/business/department/?node=${nodeId}`)
          setDepartments(response.data.results);
        if (url == `/person/job/?node=${nodeId}`) setJobs(response.data);
        if (url == "/person/person-type/")
          setTypesPerson(response.data.results);
        if (url == "/setup/relationship/")
          setRelationsShip(response.data.results);
        if (url == `/setup/document-type/?node=${nodeId}`)
          setTypesDocuments(response.data);
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
      if (url.includes("document-type")) url = "/setup/document-type/";
      if (url.includes("job")) url = "/person/job/";
      if (url.includes("department")) url = "/business/department/";
      updateRegister(url, value);
    } else saveRegister(url, value);
  };

  const getDepartments = () => {
    Axios.get(API_URL + `/business/department/?node=${nodeId}`)
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
    data.node = nodeId;
    setLoadingTable(true);
    Axios.post(API_URL + url, data)
      .then((response) => {
        setId("");
        resetForm();
        getCatalog(url);
        urls.map((a) => {
          getDepartments();
          getCatalog(a);
        });
        message.success("Agregado correctamente.");
      })
      .catch((error) => {
        resetForm();
        setId("");
        setLoadingTable(false);
        console.log(error);
        message.error(error.response.data.code[0]);
      });
  };
  const updateRegister = (url, value) => {
    Axios.put(API_URL + url + `${value.id}/`, value)
      .then((response) => {
        if (url.includes("document-type"))
          url = `/setup/document-type/?node=${nodeId}`;
        if (url.includes("job")) url = `/person/job/?node=${nodeId}`;
        if (url.includes("department"))
          url = `/business/department/?node=${nodeId}`;
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
        message.error("Ocurrio un error intente de nuevo.");
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

  const onchangeVisible = (value) => {
    value.is_visible ? (value.is_visible = false) : (value.is_visible = true);
    let data = {
      id: value.id,
      is_visible: value.is_visible,
      node: nodeId,
    };
    Axios.post(API_URL + `/setup/document-type/change_is_visible/`, data)
      .then((response) => {
        setLoadingTable(true);
        getCatalog(`/setup/document-type/?node=${nodeId}`);
      })
      .catch((error) => {
        message.error("Ocurrio un error intente de nuevo.");
        setLoadingTable(false);
        getCatalog("/setup/document-type/");
        console.log(error);
      });
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
              {permissions.edit_department && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "dep")} />
                </Col>
              )}
              {permissions.delete_department && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/business/department/",
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
  const colJob = [
    {
      title: "Empresa",
      render: (item) => {
        return <>{userCompanyName()}</>;
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
              {permissions.edit_job && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "job")} />
                </Col>
              )}
              {permissions.delete_job && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/person/job/",
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
              {permissions.edit_persontype && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "tp")} />
                </Col>
              )}
              {permissions.delete_persontype && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/person/person-type/",
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
              {permissions.edit_relationship && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "rs")} />
                </Col>
              )}
              {permissions.delete_relationship && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/setup/relationship/",
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
      title: "Visible",
      render: (item) => {
        return (
          <>
            <Switch
              defaultChecked={item.is_visible}
              checkedChildren="Visible"
              unCheckedChildren="No visible"
              onChange={() => onchangeVisible(item)}
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
              {permissions.edit_documenttype && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "td")} />
                </Col>
              )}
              {permissions.delete_documenttype && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/setup/document-type/",
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
              {permissions.edit_bank && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "bank")} />
                </Col>
              )}
              {permissions.delete_bank && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/setup/banks/",
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

  const showModal = () => {
    modal ? setModal(false) : setModal(true);
  };
  const setDeleteRegister = (props) => {
    setDeleted(props);
  };
  const deleteRegister = async () => {
    let node = "";
    if (
      deleted.url.includes("document-type") ||
      deleted.url.includes("job") ||
      deleted.url.includes("department")
    )
      node = `?node=${nodeId}`;

    Axios.delete(API_URL + deleted.url + `${deleted.id}/${node}`)
      .then((response) => {
        resetForm();
        setId("");
        setLoadingTable(true);
        getCatalog(deleted.url + node);
        setDeleteRegister({});
      })
      .catch((error) => {
        setId("");
        resetForm();
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
    formJob.setFieldsValue({
      department: "",
    });
    Axios.get(API_URL + `/business/department/?node=${value}`)
      .then((response) => {
        let data = response.data.results;
        data = data.map((a) => {
          return { label: a.name, value: a.id, key: a.name + a.id };
        });
        setSelectDep(data);
      })
      .catch((error) => {
        setSelectDep([]);
      });
  };

  useEffect(() => {
    if (deleted.id) {
      Modal.confirm({
        title: "¿Está seguro de eliminar este registro?",
        content: "Si lo elimina no podrá recuperarlo",
        icon: <ExclamationCircleOutlined />,
        okText: "Si, eliminar",
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

  return (
    <>
      <MainLayout currentKey="3.1">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => Router.push({ pathname: "/home" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Catálogos</Breadcrumb.Item>
        </Breadcrumb>
        <Content className="site-layout">
          <div style={{ padding: "1%", float: "right" }}></div>
        </Content>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          {permissions.view_department ||
          permissions.view_bank ||
          permissions.view_documenttype ||
          permissions.view_job ||
          permissions.view_persontype ||
          permissions.view_relationship ? (
            <>
              <Title style={{ fontSize: "25px" }}>Catálogos</Title>
              <Tabs tabPosition={"left"}>
                {permissions.view_department && (
                  <TabPane tab="Departamentos" key="tab_1">
                    {edit ? (
                      <Title style={{ fontSize: "20px" }}>Editar</Title>
                    ) : (
                      <></>
                    )}
                    {permissions.create_department && (
                      <Form
                        layout={"vertical"}
                        form={formDepartment}
                        onFinish={(values) =>
                          onFinishForm(
                            values,
                            `/business/department/?node=${nodeId}`
                          )
                        }
                      >
                        <Row>
                          <Col lg={6} xs={22} offset={1}>
                            <Form.Item label="Empresa" rules={[ruleRequired]}>
                              <Input readOnly value={nodePeople} />
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
                        <Row
                          justify={"end"}
                          gutter={20}
                          style={{ marginBottom: 20 }}
                        >
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
                    <Spin tip="Cargando..." spinning={loadingTable}>
                      <Table
                        columns={colDepartment}
                        dataSource={departments}
                        locale={{
                          emptyText: loadingTable
                            ? "Cargando..."
                            : "No se encontraron resultadoss.",
                        }}
                      />
                    </Spin>
                  </TabPane>
                )}

                {permissions.view_job && (
                  <TabPane tab="Puestos de trabajo" key="tab_2">
                    {edit ? (
                      <Title style={{ fontSize: "20px" }}>Editar</Title>
                    ) : (
                      <></>
                    )}
                    {permissions.create_job && (
                      <Form
                        layout={"vertical"}
                        form={formJob}
                        onFinish={(values) =>
                          onFinishForm(values, `/person/job/?node=${nodeId}`)
                        }
                      >
                        <Row>
                          <Col lg={6} xs={22} offset={1}>
                            <Form.Item label="Empresa" rules={[ruleRequired]}>
                              <Input readOnly value={nodePeople} />
                            </Form.Item>
                          </Col>

                          <Col lg={6} xs={22} offset={1}>
                            <Form.Item
                              name="department"
                              label="Departamento"
                              rules={[ruleRequired]}
                            >
                              <Select
                                options={selectDep}
                                notFoundContent={
                                  "No se encontraron resultados."
                                }
                              />
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
                        <Row
                          justify={"end"}
                          gutter={20}
                          style={{ marginBottom: 20 }}
                        >
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
                    )}{" "}
                    <Spin tip="Cargando..." spinning={loadingTable}>
                      <Table
                        columns={colJob}
                        dataSource={jobs}
                        locale={{
                          emptyText: loadingTable
                            ? "Cargando..."
                            : "No se encontraron resultadoss.",
                        }}
                      />
                    </Spin>
                  </TabPane>
                )}

                {permissions.view_persontype && (
                  <TabPane tab="Tipos de persona" key="tab_3">
                    {edit ? (
                      <Title style={{ fontSize: "20px" }}>Editar</Title>
                    ) : (
                      <></>
                    )}
                    {permissions.create_persontype && (
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
                        <Row
                          justify={"end"}
                          gutter={20}
                          style={{ marginBottom: 20 }}
                        >
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
                    <Spin tip="Cargando..." spinning={loadingTable}>
                      <Table
                        columns={colTypePerson}
                        dataSource={typesPerson}
                        locale={{
                          emptyText: loadingTable
                            ? "Cargando..."
                            : "No se encontraron resultadoss.",
                        }}
                      />
                    </Spin>
                  </TabPane>
                )}

                {permissions.view_relationship && (
                  <TabPane tab="Parentescos" key="tab_4">
                    {edit ? (
                      <Title style={{ fontSize: "20px" }}>Editar</Title>
                    ) : (
                      <></>
                    )}
                    {permissions.create_relationship && (
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
                        <Row
                          justify={"end"}
                          gutter={20}
                          style={{ marginBottom: 20 }}
                        >
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
                    <Spin tip="Cargando..." spinning={loadingTable}>
                      <Table
                        columns={colRelationShip}
                        dataSource={relationsShip}
                        locale={{
                          emptyText: loadingTable
                            ? "Cargando..."
                            : "No se encontraron resultadoss.",
                        }}
                      />
                    </Spin>
                  </TabPane>
                )}

                {permissions.view_documenttype && (
                  <TabPane tab="Tipos de documento" key="tab_5">
                    {edit ? (
                      <Title style={{ fontSize: "20px" }}>Editar</Title>
                    ) : (
                      <></>
                    )}
                    {permissions.create_documenttype && (
                      <Form
                        layout={"vertical"}
                        form={formTypeDocument}
                        onFinish={(values) =>
                          onFinishForm(
                            values,
                            `/setup/document-type/?node=${nodeId}`
                          )
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
                        <Row
                          justify={"end"}
                          gutter={20}
                          style={{ marginBottom: 20 }}
                        >
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
                    <Spin tip="Cargando..." spinning={loadingTable}>
                      <Table
                        columns={colTypeDocument}
                        dataSource={typesDocument}
                        locale={{
                          emptyText: loadingTable
                            ? "Cargando..."
                            : "No se encontraron resultadoss.",
                        }}
                      />
                    </Spin>
                  </TabPane>
                )}

                {permissions.view_bank && (
                  <TabPane tab="Bancos" key="tab_6">
                    {edit ? (
                      <Title style={{ fontSize: "20px" }}>Editar</Title>
                    ) : (
                      <></>
                    )}
                    {permissions.create_bank && (
                      <Form
                        layout={"vertical"}
                        form={formBank}
                        onFinish={(values) =>
                          onFinishForm(values, "/setup/banks/")
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
                        <Row
                          justify={"end"}
                          gutter={20}
                          style={{ marginBottom: 20 }}
                        >
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
                    <Spin tip="Cargando..." spinning={loadingTable}>
                      <Table
                        columns={colBank}
                        dataSource={banks}
                        locale={{
                          emptyText: loadingTable
                            ? "Cargando..."
                            : "No se encontraron resultadoss.",
                        }}
                      />
                    </Spin>
                  </TabPane>
                )}
              </Tabs>
            </>
          ) : (
            <div className="notAllowed" />
          )}
        </div>
      </MainLayout>

      {/* <Modal
                title="Eliminar"
                visible={modal}
                onOk={deleteRegister}
                onCancel={showModal}
                okText="Si, Eliminar"
                cancelText="Cancelar"
            >
                Al eliminar este registro perderá todos los datos relacionados a el de
                manera permanente. ¿Está seguro de querer eliminarlo?
      </Modal> */}
    </>
  );
};

export default withAuthSync(configBusiness);
