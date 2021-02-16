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
} from "antd";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import { API_URL } from "../../../config/config";

const { Content } = Layout;

const configBusiness = () => {
  const { TabPane } = Tabs;
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

  useEffect(() => {}, []);

  const ruleRequired = { required: true, message: "Este campo es requerido" };

  const onFinishForm = (value, url) => {
    saveRegister(url, value);
  };

  const saveRegister = (rout, data) => {
    console.log("ENVIO-->>> ", rout, " Data-->> ", data);
    Axios.post(API_URL + rout, data)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
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
    { title: "Acciones" },
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
    { title: "Acciones" },
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
    { title: "Acciones" },
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
    { title: "Acciones" },
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
    { title: "Acciones" },
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
    { title: "Acciones" },
  ];

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
    </>
  );
};

export default withAuthSync(configBusiness);
