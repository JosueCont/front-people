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
} from "antd";
import HeaderCustom from "../../components/header";
import MainLayout from "../../layout/MainLayout";
import Axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const GroupAdd = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [edit, setEdit] = useState(false);
  const headers = {
    "client-id": "5f417a53c37f6275fb614104",
    "Content-Type": "application/json",
  };
  let data = {};

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    data = values;
    if (!edit) {
      saveGroup();
    } else {
      editGroup();
    }
  };

  const saveGroup = async () => {
    setLoading(true);

    Axios.post("http://demo.localhost:3000/group/create/", data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          form.setFieldsValue({
            name: "",
            perms: [],
          });
          message.success({
            content: "Group saved successfully",
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

    Axios.post("http://demo.localhost:3000/group/edit/", data, {
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
          router.push({ pathname: "/groups/list" });
          message.success({
            content: "Group saved successfully",
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

    Axios.post("http://demo.localhost:3000/group/get/", data, {
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
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const { id } = router.query;
    console.log(router.query);
    if (id !== undefined) {
      getGroup(id);
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, []);

  return (
    <MainLayout currentKey="1">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Person</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="site-layout">
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <div style={{ padding: 24 }}>
            {/* <Form layout={"vertical"}> */}
            <Row>
              <Col span={24}>
                <Title level={3}>Perfiles de seguridad</Title>
              </Col>
              <Divider style={{ marginTop: "2px" }} />
              <Col span={24}>
                <div style={{ float: "right", marginBottom: "5px" }}>
                  <Button style={{ marginRight: "5px" }}>Regresar</Button>
                  <Button type="primary">Guardar</Button>
                </div>
              </Col>
              <Col lg={18} md={18} xs={24}>
                <Form.Item name="name">
                  <Input placeholder="Nombre" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Tabs type="card">
                  <TabPane tab="People" key="1">
                    People
                  </TabPane>
                  <TabPane tab="Tab 2" key="2">
                    Content of Tab Pane 2
                  </TabPane>
                  <TabPane tab="Tab 3" key="3">
                    Content of Tab Pane 3
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
            {/* </Form> */}
          </div>
        </div>
      </Content>
    </MainLayout>
  );
};

export default GroupAdd;
