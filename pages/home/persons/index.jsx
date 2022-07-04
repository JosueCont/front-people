import {
  Breadcrumb,
  Table,
  Tooltip,
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
  Menu,
  Dropdown,
  notification,
} from "antd";
import { API_URL_TENANT } from "../../../config/config";
import { useEffect, useState, useRef, React } from "react";
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BsHandIndex } from "react-icons/bs";
import MainLayout from "../../../layout/MainLayout";
import FormPerson from "../../../components/person/FormPerson";
import { withAuthSync } from "../../../libs/auth";
import { setDataUpload } from "../../../redux/UserDuck";

import Link from "next/link";
import jsCookie from "js-cookie";
import Clipboard from "../../../components/Clipboard";
import { connect } from "react-redux";
import {
  genders,
  messageError,
  messageUpdateSuccess,
  statusSelect,
} from "../../../utils/constant";
import SelectDepartment from "../../../components/selects/SelectDepartment";
import SelectAccessIntranet from "../../../components/selects/SelectAccessIntranet";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import WebApiPeople from "../../../api/WebApiPeople";
import AssignAssessments from "../../../components/person/assignments/AssignAssessments";
import PersonsGroup from "../../../components/person/groups/PersonsGroup";
import WebApiAssessment from "../../../api/WebApiAssessment";
import ViewAssigns from "../../../components/person/assignments/ViewAssigns";
import SelectJob from "../../../components/selects/SelectJob";

const homeScreen = ({ ...props }) => {
  const route = useRouter();

  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAddPerson, setModalAddPerson] = useState(false);
  const [modalCreateGroup, setModalCreateGroup] = useState(false);
  const [showModalGroup, setShowModalGroup] = useState(false);
  const [openAssignTest, setOpenAssignTest] = useState(false);
  const [showModalAssignTest, setShowModalAssignTest] = useState(false);
  const [showModalAssigns, setShowModalAssigns] = useState(false);
  const [personSelected, setPersonSelected] = useState(false);
  const [personsKeys, setPersonsKeys] = useState([]);
  const [formFilter] = Form.useForm();
  const inputFileRef = useRef(null);
  const inputFileRefAsim = useRef(null);

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
  const [personsToDelete, setPersonsToDelete] = useState([]);
  const [stringToDelete, setStringToDelete] = useState(null);
  let urlFilter = "/person/person/?";

  const [userSession, setUserSession] = useState({});
  const [deactivateTrigger, setDeactivateTrigger] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [itemPerson, setItemPerson] = useState({});
  const [loadAssign, setLoadAssign] = useState(false);
  const [depSelect, setDepSelect] = useState(null);
  const [wtSelct, setWtSelct] = useState(null);

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

  const OpenModalAssigns = (item) => {
    setItemPerson(item);
    getAssigns(item.id, "");
  };

  const onChangeTypeAssign = (key) => {
    if (key == 1) {
      getAssigns(itemPerson.id, "", "");
    } else if (key == 2) {
      getAssigns(itemPerson.id, "", "&groups");
    }
  };

  const getAssigns = async (id, queryParam, type = "") => {
    setLoadAssign(true);
    setShowModalAssigns(true);
    try {
      let response = await WebApiAssessment.getAssignByPerson(
        id,
        queryParam,
        type
      );
      setPersonSelected(response.data);
      setLoadAssign(false);
    } catch (e) {
      setPersonSelected([]);
      // setShowModalAssigns(false)
      setLoadAssign(false);
      console.log(e);
    }
  };

  /////TABLE PERSON
  let columns = [
    {
      title: "Núm. Empleado",
      render: (item) => {
        return <div>{item.code ? item.code : ""}</div>;
      },
    },
    {
      title: "Foto",
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
      render: (item) => {
        let personName = item.first_name + " " + item.flast_name;
        if (item.mlast_name) personName = personName + " " + item.mlast_name;
        return (
          <>
            {permissions.edit || props.delete ? (
              <Link href={`/home/persons/${item.id}`}>
                <a>
                  <div>{personName}</div>
                </a>
              </Link>
            ) : (
              <div>{personName}</div>
            )}
          </>
        );
      },
    },
    {
      title: "Asignaciones",
      render: (item) => {
        return (
          <Tooltip title="Ver asignaciones">
            <EyeOutlined
              style={{ cursor: "pointer" }}
              onClick={() => OpenModalAssigns(item)}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Estatus",
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

  const changeValuePerosn = (value, user) => {
    /* user['intranet_access'] = value; */
    let dataUpd = {
      id: `${user.id}`,
      intranet_access: value,
    };
    WebApiPeople.changeIntranetAccess(dataUpd)
      .then((response) => {
        let idx = person.findIndex((item) => item.id === user.id);
        let newPerson = response.data;
        newPerson["key"] = response.data.khonnect_id;

        let personsTemp = [...person];
        personsTemp[idx] = newPerson;
        setPerson(personsTemp);

        notification["success"]({
          message: "Permisos acualizados",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let columns2 = [
    {
      title: "Núm. Empleado",
      show: true,
      render: (item) => {
        return <div>{item.code ? item.code : ""}</div>;
      },
    },
    {
      title: "Foto",
      show: true,
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
      show: true,
      render: (item) => {
        let personName = item.first_name + " " + item.flast_name;
        if (item.mlast_name) personName = personName + " " + item.mlast_name;
        return (
          <>
            {permissions.edit || props.delete ? (
              <Link href={`/home/persons/${item.id}`}>
                <a>
                  <div>{personName}</div>
                </a>
              </Link>
            ) : (
              <div>{personName}</div>
            )}
          </>
        );
      },
    },
    {
      title: "Estatus",
      show: true,
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
      title: "Asignaciones",
      show: props.config?.kuiz_enabled,
      render: (item) => {
        return (
          <Tooltip title="Ver asignaciones">
            <EyeOutlined
              style={{ cursor: "pointer" }}
              onClick={() => OpenModalAssigns(item)}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "Acceso a intranet",
      show: props.config?.intranet_enabled,
      render: (item) => {
        return (
          <>
            <SelectAccessIntranet
              value={item.intranet_access}
              onChange={(e) => changeValuePerosn(e, item)}
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
      show: true,
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

  const onchangeStatus = async (value) => {
    value.is_active ? (value.is_active = false) : (value.is_active = true);
    let data = {
      id: value.id,
      status: value.is_active,
    };
    await WebApiPeople.changeStatusPerson(data)
      .then((response) => {
        if (!response.data.photo) response.data.photo = defaulPhoto;
        response.data.key = value.key;
        person.map((a) => {
          if (a.id == response.data.id) a = response.data;
        });
        message.success(messageUpdateSuccess);
      })
      .catch((error) => {
        message.error(messageError);
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
        {permissions.create && props.config?.kuiz_enabled && (
          <>
            <Menu.Item key="5" onClick={() => setOpenAssignTest(true)}>
              Asignar evaluaciones
            </Menu.Item>
            <Menu.Item key="4" onClick={() => setModalCreateGroup(true)}>
              Crear grupo
            </Menu.Item>
          </>
        )}
        {permissions.delete && (
          <Menu.Item
            key="2"
            onClick={() => showModalDelete()}
            icon={<DeleteOutlined />}
          >
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
        {props.config?.kuiz_enabled && (
          <>
            {permissions.view && (
              <Menu.Item key="4" icon={<EyeOutlined />}>
                <Link href={`/home/profile/${item.id}`}>Ver resultados</Link>
              </Menu.Item>
            )}
            {permissions.create && (
              <Menu.Item
                key="1"
                icon={<BsHandIndex />}
                onClick={() => HandleModalAssign(item)}
              >
                Asignar evaluaciones
              </Menu.Item>
            )}
          </>
        )}
        {permissions.edit && (
          <Menu.Item key="2" icon={<EditOutlined />}>
            <Link href={`/home/persons/${item.id}`}>Editar</Link>
          </Menu.Item>
        )}
        {permissions.delete && (
          <Menu.Item
            icon={<DeleteOutlined />}
            key="3"
            onClick={() => {
              setPersonsToDelete([item]), showModalDelete();
            }}
          >
            Eliminar
          </Menu.Item>
        )}
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
    downLoadFileBlob(
      `${getDomain(API_URL_TENANT)}/person/person/export_person/`,
      "Personas.xlsx",
      "POST",
      filters
    );
    setLoading(false);
  };

  const importPersonFileExtend = async (e, template_type) => {
    let extension = getFileExtension(e.target.files[0].name);
    if (extension === "xlsx") {
      let formData = new FormData();
      formData.append("File", e.target.files[0]);
      formData.append("node_id", props.currentNode.id);
      formData.append("type", template_type);
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


    if(!(value?.name && value.name.trim())){
      formFilter.setFieldsValue({name:undefined})
      value.name=undefined
    }

    if(!(value?.flast_name && value.flast_name.trim())){
      formFilter.setFieldsValue({flast_name:undefined})
      value.flast_name=undefined
    }

    if(!(value?.code && value.code.trim())){
      formFilter.setFieldsValue({code:undefined})
      value.code=undefined
    }


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
    selectedRowKeys: personsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonsKeys(selectedRowKeys);
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

  const HandleCloseGroup = () => {
    setShowModalGroup(false);
    setModalCreateGroup(false);
    setOpenAssignTest(false);
    setShowModalAssignTest(false);
    setPersonsToDelete([]);
    setPersonsKeys([]);
    setItemPerson({});
  };

  const HandleModalAssign = (item) => {
    setPersonsToDelete([item]);
    // setOpenAssignTest(true);
    setShowModalAssignTest(true);
    setItemPerson(item);
  };

  const getOnlyIds = () => {
    let ids = [];
    personsToDelete.map((item) => {
      ids.push(item.id);
    });
    return ids;
  };

  const onFinishCreateGroup = async (values) => {
    setLoading(true);
    const body = { ...values, node: props.currentNode?.id };
    try {
      await WebApiAssessment.createGroupPersons(body);
      filterPersonName();
      message.success("Grupo agregado");
    } catch (e) {
      console.log(e);
      setLoading(false);
      message.error("Grupo no agregado");
    }
  };

  const onFinishAssignAssessments = async (values) => {
    setLoading(true);
    const ids = getOnlyIds();
    const body = { ...values, persons: ids, node: props.currentNode?.id };
    try {
      await WebApiAssessment.assignAssessments(body);
      filterPersonName();
      message.success("Evaluaciones asignadas");
    } catch (e) {
      setLoading(false);
      message.error("Evaluaciones no asignadas");
    }
  };

  const successMessages = (ids) => {
    if (ids.length > 1) {
      return message.success("Asignaciones eliminadas");
    } else {
      return message.success("Asignación eliminada");
    }
  };

  const errorMessages = (ids) => {
    if (ids.length > 1) {
      return message.error("Asignaciones no eliminadas");
    } else {
      return message.error("Asignación no eliminada");
    }
  };

  const deleteAssigns = async (ids, type) => {
    setLoadAssign(true);
    try {
      await WebApiAssessment.deleteAssignByPerson({ person_assessments: ids });
      successMessages(ids);
      getAssigns(itemPerson.id, "", type);
    } catch (e) {
      errorMessages(ids);
      setLoadAssign(false);
    }
  };

  useEffect(() => {
    if (modalCreateGroup) {
      if (personsToDelete.length > 0) {
        if (personsToDelete.length >= 2) {
          setShowModalGroup(true);
        } else {
          setModalCreateGroup(false);
          message.error("Selecciona al menos 2 integrantes");
        }
      } else {
        setModalCreateGroup(false);
        message.error("Selecciona los integrantes");
      }
    }
  }, [modalCreateGroup]);

  useEffect(() => {
    if (openAssignTest) {
      if (personsToDelete.length > 0) {
        setShowModalAssignTest(true);
        setItemPerson({});
      } else {
        setOpenAssignTest(false);
        message.error("Selecciona al menos una persona");
      }
    }
  }, [openAssignTest]);

  const showModalDelete = () => {
    modalDelete ? setModalDelete(false) : setModalDelete(true);
  };

  useEffect(() => {
    if (modalDelete && personsToDelete.length > 0) {
      Modal.confirm({
        title: stringToDelete,
        content: <AlertDeletes />,
        icon: <ExclamationCircleOutlined />,
        okText: "Sí, eliminar",
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
        okText: "Sí, Desactivar",
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
      <Menu.Item
        key="1"
        onClick={() =>
          downLoadFileBlob(
            `${getDomain(
              API_URL_TENANT
            )}/person/person/generate_template/?type=1`,
            "platilla_personas.xlsx",
            "GET"
          )
        }
      >
        Plantilla básica
      </Menu.Item>
      {props.config && props.config.nomina_enabled && (
        <Menu.Item
          key="2"
          onClick={() =>
            downLoadFileBlob(
              `${getDomain(
                API_URL_TENANT
              )}/person/person/generate_template/?type=2`,
              "platilla_personas.xlsx",
              "GET"
            )
          }
        >
          Plantilla con Nómina Asimilados
        </Menu.Item>
      )}
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
          Datos básicos
        </a>
        <input
          ref={inputFileRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => importPersonFileExtend(e, 1)}
        />
      </Menu.Item>
      {props.config && props.config.nomina_enabled && (
        <>
          <Menu.Item key="2">
            <a
              className={"ml-20"}
              icon={<UploadOutlined />}
              onClick={() => {
                inputFileRefAsim.current.click();
              }}
            >
              Datos con nómina Asimilados
            </a>
            <input
              ref={inputFileRefAsim}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => importPersonFileExtend(e, 2)}
            />
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <>
      <MainLayout currentKey={["persons"]} defaultOpenKeys={["people"]}>
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
                            />
                          </Form.Item>
                        </Col>
                        <Col>
                          <SelectDepartment onChange={setDepSelect} />
                        </Col>
                        <Col>
                          <SelectJob department={depSelect} />
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
                  {/* <Dropdown
                    overlay={menuExportTemplate}
                    placement="bottomLeft"
                    arrow
                    className={"ml-20"}
                  > */}
                  <Button
                    icon={<DownloadOutlined />}
                    style={{ marginBottom: "10px" }}
                    onClick={() =>
                      downLoadFileBlob(
                        `${getDomain(
                          API_URL_TENANT
                        )}/person/person/generate_template/?type=1`,
                        "platilla_personas.xlsx",
                        "GET"
                      )
                    }
                  >
                    Descargar plantilla
                  </Button>
                  {/* </Dropdown> */}
                </Row>
              </div>
              <Table
                className={"mainTable table-persons"}
                rowKey={"id"}
                size="small"
                columns={columns2.filter((item) => item.show)}
                dataSource={person}
                loading={loading}
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
        {props.config && modalAddPerson && (
          <FormPerson
            config={props.config}
            close={getModalPerson}
            visible={modalAddPerson}
            nameNode={props.currentNode && props.currentNode.name}
            node={props.currentNode && props.currentNode.id}
            currentNode={props.currentNode && props.currentNode}
          />
        )}
        {showModalGroup && (
          <PersonsGroup
            loadData={{ name: "", persons: personsToDelete }}
            title={"Crear nuevo grupo"}
            visible={showModalGroup}
            close={HandleCloseGroup}
            actionForm={onFinishCreateGroup}
            personList={person}
          />
        )}
        {showModalAssignTest && (
          <AssignAssessments
            title={"Asignar evaluaciones"}
            visible={showModalAssignTest}
            close={HandleCloseGroup}
            actionForm={onFinishAssignAssessments}
            itemSelected={{}}
          />
        )}
        {showModalAssigns && (
          <ViewAssigns
            visible={showModalAssigns}
            setVisible={setShowModalAssigns}
            itemList={personSelected}
            itemSelected={itemPerson}
            getAssigns={getAssigns}
            onChangeType={onChangeTypeAssign}
            loadAssign={loadAssign}
            actionDelete={deleteAssigns}
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
