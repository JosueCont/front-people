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
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
const { Content } = Layout;
const { TabPane } = Tabs;
const { confirm } = Modal;
import Axios from "axios";
import { API_URL, LOGIN_URL } from "../../config/config";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Groups = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [formFilter] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  const headers = {
    "client-id": "5f417a53c37f6275fb614104",
    "Content-Type": "application/json",
  };

  const getGroups = (text) => {
    setLoading(true);

    Axios.get(LOGIN_URL + `/group/list/`, { headers: headers })
      .then((response) => {
        response.data.data.map((item) => {
          item["key"] = item.id;
          item.timestamp = item.timestamp.substring(0, 10);
        });
        setGroups(response.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteGroup = async (id) => {
    let data = { id: id };

    Axios.post("http://demo.localhost:3000/group/delete/", data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success({
            content: "Application deleted successfully",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
          console.log("Elemento Eliminado", id);
          getGroups();
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

  const confirmDelete = (id) => {
    confirm({
      title: "Do you want to delete the item?",
      icon: <ExclamationCircleOutlined />,
      content: "If you delete the item, you won't be able to get it back",
      onOk() {
        deleteGroup(id);
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    getGroups();
  }, []);

  const filter = () => {};

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Fecha de creacion",
      render: (item) => {
        return <div>{item.timestamp}</div>;
      },
    },
    {
      title: "Opciones",
      key: "id",
      render: (text, record) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <a
                  onClick={() =>
                    router.push({
                      pathname: "/groups/add",
                      query: { type: "edit", id: record.id },
                    })
                  }
                >
                  <EditOutlined />
                </a>
              </Col>
              <Col className="gutter-row" span={6}>
                <DeleteOutlined onClick={() => confirmDelete(record.id)} />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <MainLayout currentKey="1">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Person</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="site-layout">
        <div style={{ padding: "1%", float: "right" }}>
          <Button
            style={{
              background: "#fa8c16",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={() => router.push({ pathname: "/groups/add" })}
          >
            <PlusOutlined />
            Agregar grupo
          </Button>
        </div>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <div style={{ padding: 24 }}>
            <Form onFinish={filter} layout={"vertical"} form={formFilter}>
              <Row>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item name="name">
                    <Input placeholder="Nombre" />
                  </Form.Item>
                </Col>
                <Col lg={2} xs={5} offset={1}>
                  <Form.Item>
                    <Button
                      icon={<SearchOutlined />}
                      type="primary"
                      htmlType="submit"
                    >
                      Buscar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Table
            size="small"
            columns={columns}
            dataSource={groups}
            loading={loading}
          />
        </div>
      </Content>
    </MainLayout>
  );
};
export default Groups;
