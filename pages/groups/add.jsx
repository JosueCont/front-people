import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Checkbox,
  Button,
  AutoComplete,
  Switch,
  InputNumber,
  Spin,
  message,
  Divider,
  Tabs,
  Table,
} from "antd";
import MainLayout from "../../layout/MainLayout";
import Axios from "axios";
import { LOGIN_URL, APP_ID } from "../../config/config";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const GroupAdd = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [edit, setEdit] = useState(false);
  const [perms, setPerms] = useState([]);
  const [getperms, setGetperms] = useState(false);

  const headers = {
    "client-id": APP_ID,
    "Content-Type": "application/json",
  };
  let data = {};

  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
    data = values;
    data.perms = perms;
    if (!edit) {
      saveGroup();
    } else {
      editGroup();
    }
  };

  const saveGroup = async () => {
    setLoading(true);

    Axios.post(LOGIN_URL + "/group/create/", data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          form.setFieldsValue({
            name: "",
            perms: [],
          });
          setPerms([]);
          router.push({ pathname: "/groups" });
          message.success({
            content: "Grupo guardado exitosamente!",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      })
      .catch(function (error) {
        message.error({
          content: "An error occurred",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        console.log(error);
      });
  };

  const editGroup = async () => {
    setLoading(true);

    Axios.post(LOGIN_URL + "/group/edit/", data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          form.setFieldsValue({
            id: "",
            name: "",
            perms: [],
          });
          setPerms([]);
          router.push({ pathname: "/groups" });
          message.success({
            content: "Groupo editado exitosamente!",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      })
      .catch(function (error) {
        message.error({
          content: "An error occurred",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        console.log(error);
      });
  };

  const getGroup = async (id) => {
    setLoading(true);
    data = {
      id: id,
    };

    Axios.post(LOGIN_URL + "/group/get/", data, {
      headers: headers,
    })
      .then((response) => {
        if (response.status === 200) {
          let group = response.data.data;
          form.setFieldsValue({
            id: group._id.$oid.toString(),
            name: group.name,
            perms: group.perms,
          });
          setPerms(group.perms);
          setLoading(false);
          if (perms >= 0) {
            // setMostrar(true);
            setGetperms(true);
            checkPerms(group.perms);
          }
          // console.log("Perms", perms);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const { id } = router.query;
    if (id !== undefined) {
      getGroup(id);
      setEdit(true);
    } else {
      setEdit(false);
      //   setMostrar(true);
    }
  }, []);

  let arrayPerms = [];
  function handleClick(e) {
    if (getperms == false) {
      let index = perms.indexOf(e.target.name);
      if (index > -1) {
        if (e.target.checked) {
          setPerms([...perms, e.target.name]);
        } else {
          perms.splice(index, 1);
        }
      } else {
        if (e.target.checked) {
          setPerms([...perms, e.target.name]);
        }
      }
    }
  }

  const views = [
    { name: "Personas", value: "people.person" },
    { name: "Empresas", value: "people.company" },
    { name: "Comunicacion", value: "people.comunication" },
  ];

  const checkPerms = (perms) => {
    if (perms.length > 0) {
      perms.forEach((element) => {
        var chkBox = document.getElementById(element);
        if (chkBox != "undefined") {
          if (chkBox.checked == false) {
            chkBox.click();
          }
        }
      });
      setGetperms(false);
    }
  };

  const columns = [
    {
      title: "Modulo",
      id: "modulo",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Ver",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.view"}
              id={item.value + ".can.view"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Crear",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.create"}
              id={item.value + ".can.create"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Editar",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.edit"}
              id={item.value + ".can.edit"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Eliminar",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.delete"}
              id={item.value + ".can.delete"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
  ];

  return (
    <MainLayout currentKey="1">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Person</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="site-layout">
        <Spin tip="Loading..." spinning={loading}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <div style={{ padding: 24 }}>
              <Row>
                <Col span={24}>
                  {edit === true ? (
                    <Title level={3}>Editar Grupos</Title>
                  ) : (
                    <Title level={3}>Crear Grupos</Title>
                  )}
                </Col>
                <Divider style={{ marginTop: "2px" }} />
                <Col span={24}>
                  <Form
                    form={form}
                    onFinish={onFinish}
                    layout={"vertical"}
                    initialValues={{
                      id: "",
                      name: "",
                      perms: [],
                    }}
                    scrollToFirstError
                  >
                    <Row>
                      <Col span={24}>
                        <div style={{ float: "right", marginBottom: "5px" }}>
                          <Form.Item span={24}>
                            <Button
                              style={{ marginRight: "5px" }}
                              onClick={() =>
                                router.push({ pathname: "/groups" })
                              }
                            >
                              Regresar
                            </Button>
                            <Button type="primary" htmlType="submit">
                              Guardar
                            </Button>
                          </Form.Item>
                        </div>
                      </Col>
                      <Col lg={18} md={18} xs={24}>
                        {edit === true ? (
                          <Form.Item name="id" hidden>
                            <Input placeholder="Nombre" />
                          </Form.Item>
                        ) : null}

                        <Form.Item
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Por favor ingresa el nombre!",
                            },
                          ]}
                          span={24}
                        >
                          <Input placeholder="Nombre" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Tabs type="card">
                    <TabPane
                      tab="People"
                      id="tabPeople"
                      name="tabPeople"
                      key="1"
                    >
                      <Table
                        className={"mainTable"}
                        id="tableperms"
                        key="2"
                        size="small"
                        columns={columns}
                        dataSource={views}
                      />
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
      </Content>
    </MainLayout>
  );
};

export default GroupAdd;
