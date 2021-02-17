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
import { useCallback, useEffect, useState, useRef, React } from "react";
import {
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
import _ from "lodash";
import FormPerson from "../../components/person/FormPerson";
import { withAuthSync } from "../../libs/auth";

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
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  const [modalDelete, setModalDelete] = useState(false);
  const [idsDelete, setIdsDelete] = useState("");
  const [personsToDelete, setPersonsToDelete] = useState([]);
  const [stringToDelete, setStringToDelete] = useState(null);

  useEffect(() => {
    getPerson();
  }, []);

  /////PEOPLE
  const getPerson = (text) => {
    setLoading(true);
    if (text == undefined) {
      Axios.get(API_URL + `/person/person/`)
        .then((response) => {
          setPerson([]);
          response.data.results.map((item, i) => {
            item.key = i;
            if (!item.photo) item.photo = defaulPhoto;
          });
          setPerson(response.data.results);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      if (filters.gender == 0) {
        delete filters["gender"];
      }
      Axios.post(API_URL + `/person/person/get_list_persons/ `, filters)
        .then((response) => {
          setPerson([]);
          response.data.map((item, i) => {
            item.key = i;
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
        setIdsDelete("");
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
    if (value && value.name !== undefined && value.name !== "") {
      filters.first_name = value.name;
    }
    if (value && value.gender !== undefined) {
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
      render: (item) => {
        let personName = item.first_name + " " + item.flast_name;
        if (item.mlast_name) personName = personName + " " + item.mlast_name;
        return <div>{personName}</div>;
      },
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
              onChange={() => onchangeStatus(item)}
            />
          </>
        );
      },
    },
    {
      title: "Fecha de ingreso",
      render: (item) => {
        return <div>{item.date_of_admission}</div>;
      },
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
  const onchangeStatus = (value) => {
    value.is_active ? (value.is_active = false) : (value.is_active = true);
    let data = {
      id: value.id,
      status: value.is_active,
    };
    // Axios.put(API_URL + `/person/person/${value.id}/`, value)
    Axios.post(API_URL + `/person/person/change_is_active/`, data)
      .then((response) => {
        if (!response.data.photo) response.data.photo = defaulPhoto;
        response.data.key = value.key;
        person.map((a) => {
          if (a.id == response.data.id) a = response.data;
        });
      })
      .catch((error) => {
        message.error("Ocurrio un error intente de nuevo.");
        getPerson();
        console.log(error);
      });
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
      label: "Todos",
      value: 0,
    },
    {
      label: "Masculino",
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
  const setDeleteModal = async (value) => {
    console.log(value);
    setStringToDelete("Eliminar usuarios ");
    if (value.length > 0) {
      if (value.length == 1) {
        setStringToDelete(
          "Eliminar usuario " + value[0].first_name + " " + value[0].flast_name
        );
      }
      setPersonsToDelete(value);
      console.log(personsToDelete);
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
    filter();
    console.log("Filter->> ", filters);
    Axios.get(API_URL + `/person/import-export-person/csv`, filters)
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
          getPerson();
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

  const resetFilter = () => {
    formFilter.resetFields();
    setStatus(true);
    getPerson();
  };

  return (
    <MainLayout currentKey="1">
      <Breadcrumb>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Personas</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify={"space-between"} className={"formFilter"}>
          <Col xs={24} sm={24} md={20} lg={20} xl={20}>
            <Form onFinish={filter} layout={"vertical"} form={formFilter}>
              <Row>
                <Col lg={7} xs={22} offset={1}>
                  <Form.Item name="name">
                    <Input placeholder="Nombre" />
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
                <Col lg={2} xs={5} offset={1}>
                  <Button onClick={() => resetFilter()}>Limpiar filtros</Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col>
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
          </Col>
        </Row>
        <Row justify={"end"}>
          <Col>
            <Button
              className={"ml-20"}
              type="primary"
              icon={<DownloadOutlined />}
              size={{ size: "large" }}
              onClick={() => downloadPersons()}
            >
              Descargar resultados
            </Button>
            <Button
              className={"ml-20"}
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
              className={"ml-20"}
              type="primary"
              icon={<DownloadOutlined />}
              size={{ size: "large" }}
              onClick={() => downloadPlantilla()}
            >
              Descargar plantilla
            </Button>
          </Col>
        </Row>
        <Table
          className={"mainTable"}
          size="small"
          columns={columns}
          dataSource={person}
          loading={loading}
          rowSelection={rowSelectionPerson}
        />
      </div>
      <FormPerson close={getModalPerson} visible={modalAddPerson} />
      <Modal
        title={stringToDelete}
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
    </MainLayout>
  );
};
export default withAuthSync(homeScreen);
