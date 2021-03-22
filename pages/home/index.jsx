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
import CardUser from "../../components/CardUser";
import _ from "lodash";
import FormPerson from "../../components/FormPerson";

const { Content } = Layout;

const homeScreen = () => {
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false);

  const getPerson = (text = "") => {
    setLoading(true);
    if (text) {
      Axios.get("http://demo.localhost:8000/person/person/")
        .then((response) => {
          console.log("RESPONSE-->> ", response);
          response.data.results.map((item) => {
            item["fullname"] =
              item.name + " " + item.flast_name + " " + item.mlast_name;
            item.timestamp = item.timestamp.substring(0, 10);
          });
          setPerson(response.data.results);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      Axios.get("http://demo.localhost:8000/person/person/")
        .then((response) => {
          console.log("RESPONSE-->> ", response);
          response.data.results.map((item) => {
            item["key"] = item.id;
            item["fullname"] =
              item.name + " " + item.flast_name + " " + item.mlast_name;
            item.timestamp = item.timestamp.substring(0, 10);
          });
          setPerson(response.data.results);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const searchPerson = ({ target: { value } }) => {
    setLoading(true);
    search(value);
  };

  const statusPeron = () => {
    console.log(status);
    setStatus(status ? false : true);
  };

  const search = useCallback(
    _.debounce((value) => {
      getPerson(value);
    }, 600)
  );

  useEffect(() => {
    getPerson();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Fecha de registro",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
    },
    {
      title: "IMSS",
      dataIndex: "imss",
      key: "imss",
    },
    {
      title: "Opciones",
      render: () => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <DeleteOutlined />
              </Col>
              <Col className="gutter-row" span={6}>
                <EditOutlined />
              </Col>
              <Col className="gutter-row" span={6}>
                <InfoCircleOutlined />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const { Search } = Input;

  const genders = [
    {
      label: "Maculino",
      value: "M",
    },
    {
      label: "Femenino",
      value: "F",
    },
  ];

  const getModal = (value) => {
    console.log("Open Modal-->> ", modal);
    setModal(value);
  };

  return (
    <>
      <Layout>
        <HeaderCustom />
        <Content
          className="site-layout"
          style={{ padding: "0 50px", marginTop: 64 }}
        >
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Person</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: "1%", float: "right" }}>
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => getModal(true)}
            >
              <PlusOutlined />
              Agregar persona
            </Button>
          </div>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <div style={{ padding: 24 }}>
              <Row>
                <Col span={18}>
                  <Search
                    placeholder="Nombre..."
                    loading={loading}
                    onChange={searchPerson}
                    onSearch={getPerson}
                    enterButton={((<SearchOutlined />), "Buscar")}
                  />
                </Col>
                <Col span={5}>
                  <Select
                    style={{ marginLeft: "10%", width: "100%" }}
                    options={genders}
                    placeholder="Género"
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: "2%" }}>
                <Col span={4}>
                  <label>
                    <span style={{ fontWeight: "bold" }}>Activos:</span>
                  </label>
                  <Switch
                    style={{ marginLeft: "10%" }}
                    defaultChecked
                    onChange={statusPeron}
                  />
                </Col>
              </Row>
            </div>
            <Table
              size="small"
              columns={columns}
              dataSource={person}
              loading={loading}
            />
          </div>
        </Content>
        <CardUser />
        <FormPerson close={getModal} visible={modal} />
      </Layout>
    </>
  );
};
export default homeScreen;
