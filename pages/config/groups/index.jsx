import {
  Form,
  Input,
  Layout,
  Table,
  Breadcrumb,
  Tabs,
  Button,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
const { Content } = Layout;
const { TabPane } = Tabs;
const { confirm } = Modal;
import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import moment from "moment";
import { userCompanyId, withAuthSync } from "../../../libs/auth";
import jsCookie from "js-cookie";
import { connect } from "react-redux";

const Groups = (...props) => {
  console.log('porps in groups', props)
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState({});
  let nodeId = userCompanyId();

  const headers = {
    "client-id": props[0].client_khonnect_id,
    "Content-Type": "application/json",
  };

  const getGroups = (name = "") => {
    setLoading(true);
    let company = "";
    if (name === "") company = `?company=${nodeId}`;
    else company = `&company=${nodeId}`;

    Axios.get(props[0].url_server_khonnect + `/group/list/${name}` + company, {
      headers: headers,
    })
      .then((response) => {
        response.data.data.map((item) => {
          item["key"] = item.id;
          item.timestamp = moment(item.timestamp).format("DD/MM/YYYY");
        });
        setGroups(response.data.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setGroups([]);
        console.log(e);
      });
  };

  const deleteGroup = async (id) => {
    let data = { id: id };

    Axios.post(props[0].url_server_khonnect + `/group/delete/`, data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.level == "associated") {
            message.error({
              content: "Este perfil tiene usuarios asociados",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
          } else {
            message.success({
              content: "Grupo eliminado éxitosamente",
              className: "custom-class",
              style: {
                marginTop: "20vh",
              },
            });
            getGroups();
          }
        }
      })
      .catch(function (error) {
        message.error({
          content: "Ocurrió un error, intente de nuevo",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        console.log(error);
      });
  };

  const confirmDelete = (id) => {
    confirm({
      title: "¿Está seguro de eliminar este perfil de seguridad?",
      icon: <ExclamationCircleOutlined />,
      content: "Si lo elimina no podrá recuperarlo",
      onOk() {
        deleteGroup(id);
      },
      okType: "primary",
      okText: "Eliminar",
      cancelText: "Cancelar",
      okButtonProps: {
        danger: true,
      },
    });
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getGroups();
  }, []);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.groups.can.view")) perms.view = true;
      if (a.includes("people.groups.can.create")) perms.create = true;
      if (a.includes("people.groups.can.edit")) perms.edit = true;
      if (a.includes("people.groups.can.delete")) perms.delete = true;
    });
    setPermissions(perms);
  };

  const filter = (value) => {
    let filt = "";
    if (value.name != "" && value.name != undefined) {
      filt = "?name=" + value.name;
    }
    getGroups(filt);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Fecha de creación",
      render: (item) => {
        return <div>{item.timestamp}</div>;
      },
    },
    {
      title: "Acciones",
      key: "id",
      render: (text, record) => {
        return (
          <div>
            <Row gutter={16}>
              {permissions.edit && (
                <Col className="gutter-row" span={6}>
                  <a
                    onClick={() =>
                      router.push({
                        pathname: "/config/groups/add",
                        query: { type: "edit", id: record.id },
                      })
                    }
                  >
                    <EditOutlined />
                  </a>
                </Col>
              )}
              {permissions.delete && (
                <Col className="gutter-row" span={6}>
                  <DeleteOutlined onClick={() => confirmDelete(record.id)} />
                </Col>
              )}
            </Row>
          </div>
        );
      },
    },
  ];

  const resetFilter = () => {
    form.resetFields();
    getGroups();
  };
  return (
    <MainLayout currentKey="3.2">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Perfiles de seguridad</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row>
          <Col span={20}>
            <Form
              form={form}
              onFinish={filter}
              initialValues={{
                id: "",
                name: "",
                perms: [],
              }}
              scrollToFirstError
            >
              <Row>
                <Col xl={10} md={10} xs={24}>
                  <Form.Item name="name" label="Nombre">
                    <Input placeholder="Nombre" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <div style={{ float: "left", marginLeft: "5px" }}>
                    <Form.Item>
                      <Button
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
                        }}
                        htmlType="submit"
                      >
                        <SearchOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                  <div style={{ float: "left", marginLeft: "5px" }}>
                    <Form.Item>
                      <Button
                        onClick={() => resetFilter()}
                        style={{ marginTop: "auto", marginLeft: 10 }}
                      >
                        <SyncOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col style={{ display: "flex" }}>
            {permissions.create && (
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={() => router.push({ pathname: "/config/groups/add" })}
              >
                <PlusOutlined />
                Agregar
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={groups}
              loading={loading}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
  };
};

export default connect(mapState)(withAuthSync(Groups));

