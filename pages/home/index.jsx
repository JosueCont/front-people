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
  Form,
  Upload,
  message,
} from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import HeaderCustom from "../../components/Header";
import _ from "lodash";
import FormPerson from "../../components/person/FormPerson";

const { Content } = Layout;
import Link from "next/link";

const homeScreen = () => {
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(true);
  const [modal, setModal] = useState(false);
  const [formFilter] = Form.useForm();
  const inputFileRef = useRef(null);
  let filters = {};

  const getPerson = (text) => {
    setLoading(true);
    if (text == undefined) {
      Axios.get(API_URL + `/person/person/`)
        .then((response) => {
          response.data.results.map((item) => {
            item["key"] = item.id;
            item["fullname"] =
              item.first_name + " " + item.flast_name + " " + item.mlast_name;
            item.timestamp = item.timestamp.substring(0, 10);
          });
          setPerson(response.data.results);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      Axios.post(API_URL + `/person/person/get_list_persons/ `, filters)
        .then((response) => {
          response.data.map((item) => {
            item["key"] = item.id;
            item["fullname"] =
              item.first_name + " " + item.flast_name + " " + item.mlast_name;
            item.timestamp = item.timestamp.substring(0, 10);
          });
          setPerson(response.data);
          setLoading(false);
        })
        .catch((e) => {
          setPerson([]);
          setLoading(false);
          console.log(e);
        });
    }
  };

  const statusPeron = () => {
    setStatus(status ? false : true);
  };

  const filter = (value) => {
    if (value.name !== undefined && value.name !== "") {
      filters.first_name = value.name;
    }
    if (value.gender !== undefined) {
      filters.gender = value.gender;
    }
    if (status !== undefined) {
      filters.is_active = status == false ? 0 : 1;
    }
    getPerson("filter");
  };

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
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Link href={`/home/${item.id}`}>
                  <EditOutlined />
                </Link>
              </Col>
              <Col className="gutter-row" span={6}>
                <DeleteOutlined />
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

  const genders = [
    {
      label: "Maculino",
      value: 1,
    },
    {
      label: "Femenino",
      value: 2,
    },
    {
      label: "Otro",
      value: 3,
    },
  ];

  const getModal = (value) => {
    setModal(value);
    setLoading(true);
    Axios.get(API_URL + `/person/person/`)
      .then((response) => {
        response.data.results.map((item) => {
          item["key"] = item.id;
          item["fullname"] =
            item.first_name + " " + item.flast_name + " " + item.mlast_name;
          item.timestamp = item.timestamp.substring(0, 10);
        });
        setPerson(response.data.results);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const downloadPersons = () => {
    setLoading(true);
    Axios.get(API_URL + `/person/import-export-person/csv`)
      .then((response) => {
        const type = response.headers["content-type"];
        const blob = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Personas.csv";
        link.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const downloadPlantilla = () => {
    setLoading(true);
    Axios.get(API_URL + `/person/import-export-person/plantilla`)
      .then((response) => {
        const type = response.headers["content-type"];
        const blob = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "PlantillaPersonas.csv";
        link.click();
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const importFile = async (e) => {
    let extension = getFileExtension(e.target.files[0].name);
    if (extension == "csv") {
      let formData = new FormData();
      formData.append("File", e.target.files[0]);
      console.log(formData);
      setLoading(true);
      Axios.post(API_URL + `/person/import-export-person`, formData)
        .then((response) => {
          setLoading(false);
          message.success("Excel importado correctamente.");
          getPerson();
        })
        .catch((e) => {
          setLoading(false);
          message.error("Error al importar.");
          console.log(e);
        });
    } else {
      message.error("Formato incorrecto, suba un archivo .csv");
    }
  };
  const getFileExtension = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
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
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <div style={{ padding: 24 }}>
              <Form onFinish={filter} layout={"vertical"} form={formFilter}>
                <Row>
                  <Col span={18}>
                    <Form.Item name="name">
                      <Input placeholder="Nombre..." />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item name="gender">
                      <Select
                        style={{ marginLeft: "10%", width: "100%" }}
                        options={genders}
                        placeholder="Género"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ marginTop: "2%" }}>
                  <Col span={4}>
                    <Form.Item name="is_active">
                      <label>
                        <span style={{ fontWeight: "bold" }}>Activos:</span>
                      </label>
                      <Switch
                        style={{ marginLeft: "10%" }}
                        defaultChecked
                        onChange={statusPeron}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ float: "right" }}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Buscar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <div
                style={{
                  float: "right",
                }}
              >
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size={{ size: "large" }}
                  onClick={() => downloadPersons()}
                >
                  Descargar resultados
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => {
                    inputFileRef.current.click();
                  }}
                >
                  Importar personas
                </Button>
                <input
                  ref={inputFileRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => importFile(e)}
                />
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size={{ size: "large" }}
                  onClick={() => downloadPlantilla()}
                >
                  Descargar plantilla
                </Button>
              </div>
            </div>
            <Table
              size="small"
              columns={columns}
              dataSource={person}
              loading={loading}
            />
          </div>
        </Content>
        <FormPerson close={getModal} visible={modal} />
      </Layout>
    </>
  );
};
export default homeScreen;
