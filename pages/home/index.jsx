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
  Avatar,
  message,
  Modal,
  Alert,
  Menu,
  Dropdown,
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
  EllipsisOutlined,
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
  const [modalAddPerson, setModalAddPerson] = useState(false);
  const [formFilter] = Form.useForm();
  const inputFileRef = useRef(null);
  let filters = {};
  const [defaulPhoto, setDefaulPhoto] = useState(
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg"
  );
  const [modalDelete, setModalDelete] = useState(false);
  const [idsDelete, setIdsDelete] = useState("");
  const [personsToDelete, setPersonsToDelete] = useState([]);

  useEffect(() => {
    getPerson();
  }, []);

  /////PEOPLE
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
            if (!item.photo) item.photo = defaulPhoto;
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
            if (!item.photo) item.photo = defaulPhoto;
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
  const deletePerson = () => {
    Axios.post(API_URL + `/person/person/delete_by_ids/`, {
      persons_id: idsDelete,
    })
      .then((response) => {
        showModalDelete();
        getPerson();
        setLoading(false);
        message.success("Eliminado correctamente.");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  const statusPeron = () => {
    setStatus(status ? false : true);
  };
  const getModalPerson = (value) => {
    setModalAddPerson(value);
    setLoading(true);
    Axios.get(API_URL + `/person/person/`)
      .then((response) => {
        response.data.results.map((item) => {
          item["key"] = item.id;
          item["fullname"] =
            item.first_name + " " + item.flast_name + " " + item.mlast_name;
          item.timestamp = item.timestamp.substring(0, 10);
          if (!item.photo) item.photo = defaulPhoto;
        });
        setPerson(response.data.results);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  ////SEARCH FILTER
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

  ////STYLE
  const menuDropDownStyle = {
    background: "#434343",
    color: "#ffff",
  };

  /////TABLE PERSON
  const columns = [
    {
      title: "Foto",
      render: (item) => {
        return (
          <div>
            <Avatar src={item.photo} />
          </div>
        );
      },
    },
    {
      title: "Nombre",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Estatus",
      render: (item) => {
        return (
          <>
            <Switch
              defaultChecked={item.is_active}
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
            />
          </>
        );
      },
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
      title: () => {
        return (
          <>
            <Dropdown overlay={menuGeneric}>
              <Button style={menuDropDownStyle} size="small">
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </>
        );
      },
      render: (item) => {
        return (
          <>
            <Dropdown overlay={() => menuPerson(item)}>
              <Button
                style={{ background: "#8c8c8c", color: "withe" }}
                size="small"
              >
                <EllipsisOutlined />
              </Button>
            </Dropdown>
          </>
        );
      },
    },
  ];
  const rowSelectionPerson = {
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonsToDelete(selectedRows);
    },
  };

  const menuGeneric = (
    <Menu>
      <Menu.Item onClick={() => setDeleteModal(personsToDelete)}>
        Eliminar
      </Menu.Item>
    </Menu>
  );
  const menuPerson = (item) => {
    return (
      <Menu>
        <Menu.Item>
          <Link href={`/home/${item.id}`}>Editar</Link>
        </Menu.Item>
        <Menu.Item onClick={() => setDeleteModal([item])}>Eliminar</Menu.Item>
      </Menu>
    );
  };

  ////DEFAULT SELECT
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

  /////DELETE MODAL
  const setDeleteModal = (value) => {
    if (value.length > 0) {
      setPersonsToDelete(value);
      let ids = null;
      value.map((a) => {
        if (ids) ids = ids + "," + a.id;
        else ids = a.id;
      });
      setIdsDelete(ids);
      showModalDelete();
    } else {
      message.error("Selecciona una persona.");
    }
  };
  const ListElementsToDelete = ({ personsDelete }) => {
    return (
      <div>
        {personsDelete.map((p) => {
          return (
            <>
              <Row>
                <Avatar src={p.photo} />
                <span>{" " + p.first_name + " " + p.flast_name}</span>
              </Row>
            </>
          );
        })}
      </div>
    );
  };
  const showModalDelete = () => {
    modalDelete ? setModalDelete(false) : setModalDelete(true);
  };

  ////IMPORT/EXPORT PERSON
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
          <div style={{ padding: "1%", float: "right" }}>
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => getModalPerson(true)}
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
              <Form onFinish={filter} layout={"vertical"} form={formFilter}>
                <Row>
                  <Col lg={7} xs={22} offset={1}>
                    <Form.Item name="name">
                      <Input placeholder="Nombre..." />
                    </Form.Item>
                  </Col>
                  <Col lg={4} xs={22} offset={1}>
                    <Form.Item name="gender">
                      <Select options={genders} placeholder="Género" />
                    </Form.Item>
                  </Col>
                  <Col lg={3} xs={5} offset={1}>
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
              <div>
                <Row>
                  <Button
                    style={{
                      margin: "20px",
                    }}
                    type="primary"
                    icon={<DownloadOutlined />}
                    size={{ size: "large" }}
                    onClick={() => downloadPersons()}
                  >
                    Descargar resultados
                  </Button>
                  <Button
                    style={{
                      margin: "20px",
                    }}
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
                    style={{
                      margin: "20px",
                    }}
                    type="primary"
                    icon={<DownloadOutlined />}
                    size={{ size: "large" }}
                    onClick={() => downloadPlantilla()}
                  >
                    Descargar plantilla
                  </Button>
                </Row>
              </div>
            </div>
            <Table
              size="small"
              columns={columns}
              dataSource={person}
              loading={loading}
              rowSelection={rowSelectionPerson}
            />
          </div>
        </Content>
        <FormPerson close={getModalPerson} visible={modalAddPerson} />
        <Modal
          title="Modal"
          visible={modalDelete}
          onOk={deletePerson}
          onCancel={showModalDelete}
          okText="Si, Eliminar"
          cancelText="Cancelar"
        >
          <Alert
            message="Warning"
            description="Al eliminar este registro perderá todos los datos
                    relacionados a el de manera permanente.
                    ¿Está seguro de querer eliminarlo?"
            type="warning"
            showIcon
          />

          <ListElementsToDelete personsDelete={personsToDelete} />
        </Modal>
      </Layout>
    </>
  );
};
export default homeScreen;
