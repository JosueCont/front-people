import {
  Layout,
  Breadcrumb,
  Table,
  Row,
  Col,
  Input,
  Select,
  Switch,
} from "antd";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HeaderCustom from "../../components/header";
import _ from "lodash";

const { Content } = Layout;

const homeScreen = () => {
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);

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
          2;
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
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
      key: "id",
    },
    {
      title: "Fecha de registro",
      dataIndex: "timestamp",
      key: "id",
    },
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "id",
    },
    {
      title: "IMSS",
      dataIndex: "imss",
      key: "id",
    },
    {
      title: "Opciones",
      key: "id",
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
        {/* <FooterCustom /> */}
      </Layout>
    </>
  );
};
export default homeScreen;
