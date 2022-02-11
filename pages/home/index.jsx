import {
  Breadcrumb,
  Table,
  Tooltip,
  Row,
  Col,
  List,
  Input,
  Select,
  Switch,
  Button,
  Typography,
  Form,
  Avatar,
  message,
  Modal,
  Menu,
  Dropdown,
} from "antd";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { useEffect, useState, useRef, React } from "react";
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
import _, { set } from "lodash";
import FormPerson from "../../components/person/FormPerson";
import { withAuthSync, userCompanyId, userCompanyName } from "../../libs/auth";
import { setDataUpload } from "../../redux/UserDuck";

import Link from "next/link";
import jsCookie from "js-cookie";
import Clipboard from "../../components/Clipboard";
import { connect } from "react-redux";
import WebApiPeople from "../../api/WebApiPeople";
import { genders, periodicity, statusSelect } from "../../utils/constant";
import SelectDepartment from "../../components/selects/SelectDepartment";
import SelectJob from "../../components/selects/SelectJob";
import SelectAccessIntranet from '../../components/selects/SelectAccessIntranet'
import { useRouter } from "next/router";
import SelectWorkTitle from "../../components/selects/SelectWorkTitle";
import { useLayoutEffect } from "react";

const homeScreen = ({ ...props }) => {
  const { Text } = Typography;
  const route = useRouter();

  const [valRefreshColumns, setValRefreshColumns] = useState(false);
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAddPerson, setModalAddPerson] = useState(false);
  const [formFilter] = Form.useForm();
  const inputFileRef = useRef(null);
  const inputFileRef2 = useRef(null);
  const { Option } = Select;

  let filters = { node: "" };
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  // Constantes para desactivar.
  const [modalDeactivate, setModalDeactivate] = useState(false);
  const [idsDeactivate, setIdsDeactivate] = useState("");
  const [personsToDeactivate, setPersonsToDeactivate] = useState([]);
  const [stringToDeactivate, setStringToDeactivate] = useState(null);

  // Constantes para eliminar.
  const [modalDelete, setModalDelete] = useState(false);
  const [idsDelete, setIdsDelete] = useState("");
  const [personsToDelete, setPersonsToDelete] = useState([]);
  const [stringToDelete, setStringToDelete] = useState(null);
  let urlFilter = "/person/person/?";

  const [listUserCompanies, setListUserCompanies] = useState("");
  const [showModalCompanies, setShowModalCompanies] = useState(false);
  const [userSession, setUserSession] = useState({});
  const [deactivateTrigger, setDeactivateTrigger] = useState(false);
  const [permissions, setPermissions] = useState({});
  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  useEffect(() => {
    if (props.currentNode) {
      filterPersonName();
    } else {
      return <></>;
    }
  }, [props.currentNode]);

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    setUserSession(jwt);
    if (props.currentNode) filterPersonName();
  }, [props.currentNode]);

  const filterPersonName = async () => {
    filters.node = props.currentNode.id;
    setLoading(true);
    try {
      let response = await WebApiPeople.filterPerson(filters);
      setPerson([]);
      setLoading(false);
      let persons = response.data.map((a) => {
        a.key = a.khonnect_id;
        return a;
      });
      setPerson(persons);
    } catch (error) {
      setPerson([]);
      setLoading(false);
      console.log(error);
    }
  };

  const deactivatePerson = () => {
    setLoading(true);
    WebApiPeople.deactivatePerson({
      persons_id: idsDeactivate,
    })
      .then((response) => {
        setIdsDeactivate("");
        setModalDeactivate(false);
        setPersonsToDeactivate([]);
        filterPersonName();
        setLoading(false);
        message.success("Desactivado correctamente.");
      })
      .catch((error) => {
        setLoading(false);
        message.error("Error al desactivar");
      });
  };

  useEffect(() => {
    if (showModalCompanies && listUserCompanies) {
      Modal.info({
        title: "Empresas Asignadas",
        content: (
          <List
            locale={{ emptyText: "No se encontraron datos" }}
            dataSource={listUserCompanies}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        ),
        icon: "",
        onOk() {},
      });
    }
  }, [showModalCompanies]);

  const getUserCompanies = async (item) => {
    setListUserCompanies([]);
    setShowModalCompanies(false);
    try {
      let response = WebApiPeoplegetCompaniesPeople(item.id);
      let result = response.data;
      let stringList = [];
      result.map((item) => {
        stringList.push(item.name);
      });
      setListUserCompanies(stringList);
      setShowModalCompanies(true);
    } catch (error) {
      setListUserCompanies([]);
      setShowModalCompanies(true);
    }
  };

  const getModalPerson = (value) => {
    setModalAddPerson(value);
    setLoading(true);
    filterPersonName();
  };

  ////STYLE
  const menuDropDownStyle = {
    background: "#434343",
    color: "#ffff",
  };

  /////TABLE PERSON
  let columns = [
    {
      title: "Núm. Empleado",
      width: 2,
      render: (item) => {
        return <div>{item.code ? item.code : ""}</div>;
      },
    },
    {
      title: "Foto",
      width: 1,
      render: (item) => {
        return (
          <div>
            <Avatar src={item.photo ? item.photo : defaulPhoto} />
          </div>
        );
      },
    },
    {
      title: "Nombre",
      width: 120,
      render: (item) => {
        let personName = item.first_name + " " + item.flast_name;
        if (item.mlast_name) personName = personName + " " + item.mlast_name;
        return (
          <>
            {permissions.edit || props.delete ? (
              <Dropdown overlay={() => menuPerson(item)}>
                <a>
                  <div>{personName}</div>
                </a>
              </Dropdown>
            ) : (
              <div>{personName}</div>
            )}
          </>
        );
      },
    },
    {
      title: "Estatus",
      width: 30,
      render: (item) => {
        return (
          <>
            <Switch
              disabled={permissions.change_is_active ? false : true}
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
      // fixed: "right",
      title: () => {
        return (
          <>
            {permissions.delete && (
              <Dropdown overlay={menuGeneric}>
                <Button style={menuDropDownStyle} size="small">
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            )}
          </>
        );
      },
      width: 44,
      render: (item) => {
        return (
          <>
            {(permissions.edit || permissions.delete) && (
              <Dropdown overlay={() => menuPerson(item)}>
                <Button
                  style={{ background: "#8c8c8c", color: "withe" }}
                  size="small"
                >
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            )}
          </>
        );
      },
    },
  ];

  let columns2 = [
    {
      title: "Núm. Empleado",
      width: 2,
      fixed: "left",
      render: (item) => {
        return <div>{item.code ? item.code : ""}</div>;
      },
    },
    {
      title: "Foto",
      width: 42,
      render: (item) => {
        return (
          <div>
            <Avatar src={item.photo ? item.photo : defaulPhoto} />
          </div>
        );
      },
    },
    {
      title: "Nombre",
      width: 120,
      render: (item) => {
        let personName = item.first_name + " " + item.flast_name;
        if (item.mlast_name) personName = personName + " " + item.mlast_name;
        return (
          <>
            {permissions.edit || props.delete ? (
              <Dropdown overlay={() => menuPerson(item)}>
                <a>
                  <div>{personName}</div>
                </a>
              </Dropdown>
            ) : (
              <div>{personName}</div>
            )}
          </>
        );
      },
    },
    {
      title: "Estatus",
      width: 70,
      render: (item) => {
        return (
          <>
            <Switch
              disabled={permissions.change_is_active ? false : true}
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
      title: "Acceso a intranet",
      width: 70,
      render: (item) => {
        return (
          <>
             <SelectAccessIntranet />
            {/* <Switch
              disabled={true}
              defaultChecked={item.intranet_access}
              checkedChildren="Si"
              unCheckedChildren="No"
            /> */}
          </>
        );
      },
    },

    {
      // fixed: "right",
      title: () => {
        return (
          <>
            {permissions.delete && (
              <Dropdown overlay={menuGeneric}>
                <Button style={menuDropDownStyle} size="small">
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            )}
          </>
        );
      },
      width: 44,
      render: (item) => {
        return (
          <>
            {(permissions.edit || permissions.delete) && (
              <Dropdown overlay={() => menuPerson(item)}>
                <Button
                  style={{ background: "#8c8c8c", color: "withe" }}
                  size="small"
                >
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            )}
          </>
        );
      },
    },
  ];

  const onchangeStatus = (value) => {
    value.is_active ? (value.is_active = false) : (value.is_active = true);
    let data = {
      id: value.id,
      status: value.is_active,
    };
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
        filterPersonName();
        console.log(error);
      });
  };

  const menuGeneric = () => {
    return (
      <Menu>
        {props.currentNode && permissions && (
          <Menu.Item key="1">
            <Clipboard
              text={
                window.location.origin +
                "/ac/urn/" +
                props.currentNode.permanent_code
              }
              title={"Link de empresa"}
              border={false}
              type={"button"}
              msg={"Copiado en portapapeles"}
              tooltipTitle={"Copiar link de auto registro"}
            />
          </Menu.Item>
        )}
        {permissions.delete && (
          <Menu.Item key="2" onClick={() => showModalDelete()}>
            Eliminar
          </Menu.Item>
        )}
        <Menu.Item key="3" onClick={() => handleDeactivate()}>
          Desactivar
        </Menu.Item>
      </Menu>
    );
  };

  const handleDeactivate = () => {
    setDeactivateTrigger(true);
  };

  const menuPerson = (item) => {
    return (
      <Menu>
        {permissions.edit && (
          <Menu.Item>
            <Link href={`/home/${item.id}`}>Editar</Link>
          </Menu.Item>
        )}
        {permissions.delete && (
          <Menu.Item
            onClick={() => {
              setPersonsToDelete([item]), showModalDelete();
            }}
          >
            Eliminar
          </Menu.Item>
        )}
        <Menu.Item onClick={() => setDeactivateModal([item])}>
          Desactivar
        </Menu.Item>
      </Menu>
    );
  };

  // DEACTIVATE MODAL
  const setDeactivateModal = async (value) => {
    setStringToDeactivate("Desactivar usuarios ");
    if (value.length > 0) {
      if (value.length == 1) {
        setStringToDeactivate(
          "Desactivar usuario " +
            value[0].first_name +
            " " +
            value[0].flast_name
        );
      }
      setPersonsToDeactivate(value);
      let ids = null;
      value.map((a) => {
        if (ids) ids = ids + "," + a.id;
        else ids = a.id;
      });
      setIdsDeactivate(ids);
      showModalDeactivate();
    } else {
      message.error("Selecciona una persona.");
    }
  };

  const showModalDeactivate = () => {
    modalDeactivate ? setModalDeactivate(false) : setModalDeactivate(true);
  };

  const ListElementsToDeactivate = ({ personsDeactivate }) => {
    return (
      <div>
        {personsDeactivate.map((p) => {
          return (
            <>
              <Row style={{ marginBottom: 15 }}>
                <Avatar src={p.photo} />
                <span>{" " + p.first_name + " " + p.flast_name}</span>
              </Row>
            </>
          );
        })}
      </div>
    );
  };

  ////IMPORT/EXPORT PERSON
  const exportPersons = () => {
    setLoading(true);
    filter(formFilter.getFieldsValue());
    filters.format = "data";
    Axios.post(API_URL + `/person/person/export_csv/`, filters)
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

  const importPersonFileExtend = async (e) => {
    let extension = getFileExtension(e.target.files[0].name);
    if (extension === "xlsx") {
      let formData = new FormData();
      formData.append("File", e.target.files[0]);
      formData.append("node_id", props.currentNode.id);
      formData.append(
        "saved_by",
        userSession.first_name + " " + userSession.last_name
      );
      setLoading(true);
      props
        .setDataUpload(formData)
        .then((response) => {
          if (response) {
            route.push({ pathname: "/bulk_upload/preview" });
          } else {
            message.error("Ocurrió un error ");
          }
        })
        .catch((error) => {
          message.error("Ocurrió un error ");
        });
    } else {
      message.error("Formato incorrecto, suba un archivo .xlsx");
    }
  };

  const getFileExtension = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
  };

  ////SEARCH FILTER
  const filter = (value) => {
    if (value && value.name !== undefined) {
      urlFilter = urlFilter + "first_name__icontains=" + value.name + "&";
      filters.first_name = value.name;
      filters.flast_name = value.name;
      filters.mlast_name = value.name;
    }
    if (value && value.flast_name !== undefined) {
      urlFilter = urlFilter + "flast_name=" + value.flast_name + "&";
      filters.flast_name = value.flast_name;
    }
    if (value && value.code !== undefined) {
      urlFilter = urlFilter + "code=" + value.code + "&";
      filters.code = value.code;
    }
    if (value && value.gender !== undefined && value.gender != 0) {
      urlFilter = urlFilter + "gender=" + value.gender + "&";
      filters.gender = value.gender;
    }

    if (value && value.is_active !== undefined && value.is_active != -1) {
      urlFilter = urlFilter + "is_active=" + value.is_active + "&";
      filters.is_active = value.is_active;
    }
    if (value && value.department !== undefined) {
      urlFilter = urlFilter + "person_department__id=" + value.department + "&";
      filters.department = value.department;
    }
    if (value && value.job && value.job !== undefined) {
      urlFilter = urlFilter + "job__id=" + value.job + "&";
      filters.job = value.job;
    }
    if (value && value.periodicity !== undefined) {
      urlFilter = urlFilter + "periodicity=" + value.periodicity + "&";
      filters.periodicity = value.periodicity;
    }
    filterPersonName(urlFilter);
  };

  const resetFilter = () => {
    formFilter.resetFields();
    filter();
    filterPersonName();
  };

  const AlertDeactivate = () => (
    <div>
      Al desactivar este registro ya no podra accerder a el hasta que lo vuelva
      a activar. ¿Está seguro de querer desactivarlo?
      <br />
      <br />
      <ListElementsToDeactivate personsDeactivate={personsToDeactivate} />
    </div>
  );

  const AlertDeletes = () => (
    <div>
      Al eliminar este registro perderá todos los datos relacionados a el de
      manera permanente. ¿Está seguro de querer eliminarlo?
      <br />
      <br />
      <ListElementsToDelete personsDelete={personsToDelete} />
    </div>
  );

  const rowSelectionPerson = {
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonsToDelete(selectedRows);
    },
  };

  const ListElementsToDelete = ({ personsDelete }) => {
    return (
      <div>
        {personsDelete.map((p) => {
          return (
            <>
              <Row style={{ marginBottom: 15 }}>
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

  useEffect(() => {
    if (modalDelete && personsToDelete.length > 0) {
      Modal.confirm({
        title: stringToDelete,
        content: <AlertDeletes />,
        icon: <ExclamationCircleOutlined />,
        okText: "Si, eliminar",
        okButtonProps: {
          danger: true,
        },
        onCancel() {
          setModalDelete(false);
        },
        cancelText: "Cancelar ",
        onOk() {
          deletePerson();
        },
      });
    } else if (modalDelete) {
      setModalDelete(false);
    }
  }, [modalDelete]);

  const deletePerson = () => {
    let ids = null;
    if (personsToDelete.length == 1) {
      setStringToDelete(
        "Eliminar usuario " +
          personsToDelete[0].first_name +
          " " +
          personsToDelete[0].flast_name
      );
      ids = personsToDelete[0].id;
    } else if (personsToDelete.length > 0) {
      personsToDelete.map((a) => {
        if (ids) ids = ids + "," + a.id;
        else ids = a.id;
      });
    }
    setLoading(true);
    WebApiPeople.deletePerson({
      persons_id: ids,
    })
      .then((response) => {
        setModalDelete(false);
        setPersonsToDelete([]);
        filterPersonName();
        setLoading(false);
        message.success("Eliminado correctamente.");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        message.error("Error al eliminar");
      });
  };

  useEffect(() => {
    if (modalDeactivate) {
      Modal.confirm({
        title: stringToDeactivate,
        content: <AlertDeactivate />,
        icon: <ExclamationCircleOutlined />,
        okText: "Si, desactivar",
        okButtonProps: {
          danger: true,
        },
        onCancel() {
          setModalDeactivate();
        },
        cancelText: "Cancelar",
        onOk() {
          deactivatePerson();
        },
      });
    }
  }, [modalDeactivate]);

  const menuExportTemplate = (
    <Menu>
      <Menu.Item key="1">
        <a href={`${API_URL}/static/plantillaPersonas.xlsx`}>
          Plantilla básica
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a href={`${API_URL}/static/plantillaExtendidaPersonas.xlsx`}>
          Plantilla Extensa
        </a>
      </Menu.Item>
    </Menu>
  );

  const menuImportPerson = (
    <Menu>
      <Menu.Item key="1">
        <a
          className={"ml-20"}
          icon={<UploadOutlined />}
          onClick={() => {
            inputFileRef.current.click();
          }}
        >
          Datos basicos
        </a>
        <input
          ref={inputFileRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => importPersonFileExtend(e)}
        />
      </Menu.Item>
      {/* <Menu.Item key="2">
        <a
          className={"ml-20"}
          icon={<UploadOutlined />}
          onClick={() => {
            inputFileRef2.current.click();
          }}
        >
          Datos Extensos
        </a>
        <input
          ref={inputFileRef2}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => importPersonFileExtend(e)}
        />
      </Menu.Item> */}
    </Menu>
  );

  return (
    <>
      <MainLayout currentKey={["persons"]}>
        <Breadcrumb>
          <Breadcrumb.Item>Inicio</Breadcrumb.Item>
          <Breadcrumb.Item>Personas</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{ width: "100%" }}>
          {permissions.view ? (
            <>
              <div className="top-container-border-radius">
                <Row justify={"space-between"} className={"formFilter"}>
                  <Col>
                    <Form
                      onFinish={filter}
                      layout={"vertical"}
                      form={formFilter}
                    >
                      <Row gutter={[10]}>
                        <Col>
                          <Form.Item name="name" label={"Nombre"}>
                            <Input
                              allowClear={true}
                              placeholder="Nombre(s)"
                              style={{ width: 150 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item name="flast_name" label={"Apellido"}>
                            <Input
                              allowClear={true}
                              placeholder="Apellido(s)"
                              style={{ width: 150 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item name="code" label={"Núm. empleado"}>
                            <Input
                              allowClear={true}
                              placeholder="Núm. empleado"
                              style={{ width: 100 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Form.Item name="gender" label="Género">
                            <Select
                              options={genders}
                              notFoundContent={"No se encontraron resultados."}
                              placeholder="Todos"
                              notFoundContent={"No se encontraron resultados."}
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <SelectDepartment />
                        </Col>
                        <Col>
                          <SelectWorkTitle />
                        </Col>
                        <Col>
                          <Form.Item name="is_active" label="Estatus">
                            <Select
                              options={statusSelect}
                              placeholder="Estatus"
                              notFoundContent={"No se encontraron resultados."}
                              style={{ width: 90 }}
                            />
                          </Form.Item>
                        </Col>

                        <Col
                          className="button-filter-person"
                          style={{ display: "flex", marginTop: "10px" }}
                        >
                          <Tooltip
                            title="Filtrar"
                            color={"#3d78b9"}
                            key={"#filtrar"}
                          >
                            <Button className="btn-filter" htmlType="submit">
                              <SearchOutlined />
                            </Button>
                          </Tooltip>
                        </Col>
                        <Col
                          className="button-filter-person"
                          style={{ display: "flex", marginTop: "10px" }}
                        >
                          <Tooltip
                            title="Limpiar filtros"
                            color={"#3d78b9"}
                            key={"#3d78b9"}
                          >
                            <Button
                              onClick={() => resetFilter()}
                              style={{ marginTop: "auto", marginLeft: 10 }}
                            >
                              <SyncOutlined />
                            </Button>
                          </Tooltip>
                        </Col>
                        <Col
                          className="button-filter-person"
                          style={{ display: "flex", marginTop: "10px" }}
                        >
                          {permissions.create && (
                            <Button
                              className="btn-add-person"
                              onClick={() => getModalPerson(true)}
                              style={{ marginTop: "auto", marginLeft: 10 }}
                            >
                              <PlusOutlined />
                              Agregar persona
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
                <Row justify={"end"} style={{ padding: "1% 0" }}>
                  {permissions.export_csv_person && (
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      size={{ size: "large" }}
                      onClick={() => exportPersons()}
                      style={{ marginBottom: "10px" }}
                    >
                      Descargar resultados
                    </Button>
                  )}
                  {permissions.import_csv_person && (
                    <Dropdown
                      overlay={menuImportPerson}
                      placement="bottomLeft"
                      arrow
                      className={"ml-20"}
                    >
                      <Button
                        icon={<DownloadOutlined />}
                        style={{ marginBottom: "10px" }}
                      >
                        Importar personas
                      </Button>
                    </Dropdown>
                  )}
                  <Dropdown
                    overlay={menuExportTemplate}
                    placement="bottomLeft"
                    arrow
                    className={"ml-20"}
                  >
                    <Button
                      icon={<DownloadOutlined />}
                      style={{ marginBottom: "10px" }}
                    >
                      Descargar plantilla
                    </Button>
                  </Dropdown>
                </Row>
              </div>
              <Table
                className={"mainTable"}
                size="small"
                columns={
                  props.config && props.config.intranet_enabled
                    ? columns2
                    : columns
                }
                dataSource={person}
                loading={loading}
                // scroll={{ x: 1300 }}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
                rowSelection={rowSelectionPerson}
              />
            </>
          ) : (
            <div className="notAllowed" />
          )}
        </div>
        {props.config && (
          <FormPerson
            config={props.config}
            close={getModalPerson}
            visible={modalAddPerson}
            nameNode={userCompanyName()}
            node={userCompanyId()}
            currentNode={props.currentNode}
          />
        )}
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
    permissions: state.userStore.permissions.person,
  };
};

export default connect(mapState, { setDataUpload })(withAuthSync(homeScreen));
