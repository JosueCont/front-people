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

    Axios.post(LOGIN_URL + `/group/delete/`, data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          message.success({
            content: "Group eliminado satisfactoriamente",
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
      title: "Esta seguro de eliminar el elemento?",
      icon: <ExclamationCircleOutlined />,
      content: "Si elimina el elemento no podrá recuperarlo",
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
        <Breadcrumb.Item>Groups</Breadcrumb.Item>
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
