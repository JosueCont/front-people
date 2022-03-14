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
  notification,
} from "antd";
import Axios from "axios";
import { API_URL, API_URL_TENANT } from "../../../config/config";
import { useEffect, useState, useRef, React } from "react";
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EyeOutlined
} from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
import FormPerson from "../../../components/person/FormPerson";
import {
  withAuthSync,
  userCompanyId,
  userCompanyName,
} from "../../../libs/auth";
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
import SelectWorkTitle from "../../../components/selects/SelectWorkTitle";
import { useLayoutEffect } from "react";
import {
  downloadTemplateImportPerson,
  getDomain,
} from "../../../utils/functions";
import WebApiPeople from "../../../api/WebApiPeople";
import AssignAssessments from "../../../components/person/assignments/AssignAssessments";
import PersonsGroup from "../../../components/person/groups/PersonsGroup";
import WebApiAssessment from "../../../api/WebApiAssessment";
import ViewAssigns from "../../../components/person/assignments/ViewAssigns";

const homeScreen = ({ ...props }) => {
  const { Text } = Typography;
  const route = useRouter();

  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAddPerson, setModalAddPerson] = useState(false);
  const [modalCreateGroup, setModalCreateGroup] = useState(false);
  const [showModalGroup, setShowModalGroup] = useState(false);
  const [openAssignTest, setOpenAssignTest] = useState(false);
  const [showModalAssignTest, setShowModalAssignTest] = useState(false);
  const [openAssignToPerson, setOpenAssignToPerson] = useState(false);
  const [showAssignToPerson, setShowAssignToPerson] = useState(false);
  const [showModalAssigns, setShowModalAssigns] = useState(false);
  const [personSelected, setPersonSelected] = useState(false);
  const [personsKeys, setPersonsKeys] = useState([]);
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
  const [itemPerson, setItemPerson] = useState({});
  const [loadAssign, setLoadAssign] = useState(false);

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

  const OpenModalAssigns = (item) =>{
    setItemPerson(item)
    getAssigns(item.id, "");
  }

  const getAssigns = async (id, queryParam) =>{
    setLoadAssign(true)
    try {
      let response = await WebApiAssessment.getAssignByPerson(id, queryParam)
      setPersonSelected(response.data)
      setShowModalAssigns(true)
      setLoadAssign(false)
    } catch (e) {
      setPersonSelected([])
      setShowModalAssigns(false)
      setLoadAssign(false)
      console.log(e)
    }
  }

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
      title: "Asignaciones",
      render: (item) => {
        return (
          <Tooltip title='Ver asignaciones'>
            <EyeOutlined
              style={{cursor: 'pointer'}}
              onClick={()=>OpenModalAssigns(item)}
            />
          </Tooltip>
        )
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
        console.log("error =>", error);
      });
  };

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
      width: 200,
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
      render: (item) => {
        return (
          <Tooltip title='Ver asignaciones'>
            <EyeOutlined
              style={{cursor: 'pointer'}}
              onClick={()=>OpenModalAssigns(item)}
            />
          </Tooltip>
        )
      },
    },
    {
      title: "Acceso a intranet",
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
        {permissions.create && (
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
        {permissions.create && (
          <Menu.Item key="1" onClick={() => HandleModalAssign(item)}>
            Asignar evaluaciónes
          </Menu.Item>
        )}
        {permissions.edit && (
          <Menu.Item key="2">
            <Link href={`/home/persons/${item.id}`}>Editar</Link>
          </Menu.Item>
        )}
        {permissions.delete && (
          <Menu.Item key="3"
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

  const HandleCloseGroup = () =>{
    setShowModalGroup(false)
    setModalCreateGroup(false)
    setOpenAssignTest(false)
    setShowModalAssignTest(false)
    // setOpenAssignToPerson(false)
    // setShowAssignToPerson(false)
    setPersonsToDelete([])
    setPersonsKeys([])
  }

  const HandleModalAssign = (item) =>{
    setPersonsToDelete([item])
    // setOpenAssignToPerson(true)
    setOpenAssignTest(true)
  }

  const getOnlyIds = () => {
    let ids = [];
    personsToDelete.map((item) => {
      ids.push(item.id);
    });
    return ids;
  };

  const onFinishCreateGroup = async (values) => {
    setLoading(true);
    // const ids = getOnlyIds();
    const body = {...values, node: props.currentNode?.id}
    try {
      await WebApiAssessment.createGroupPersons(body);
      filterPersonName();
      message.success("Grupo agregado");
    } catch (e) {
      console.log(e)
      setLoading(false)
      message.error("Grupo no agregado")
    }
  }

  const onFinishAssignAssessments = async (value) =>{
    setLoading(true)
    const ids = getOnlyIds();
    const body = {assessments: value, persons: ids, node: props.currentNode?.id}
    try {
      await WebApiAssessment.assignAssessments(body)
      filterPersonName();
      message.success("Evaluaciones asignadas")
    } catch (e) {
      setLoading(false)
      message.error("Evaluaciones no asignadas")
    }
  };

  // const onFinishAssignOneTest = async (value) =>{
  //   setLoading(true)
  //   const ids = getOnlyIds();
  //   const body = {
  //     id_assessment: value.assessments,
  //     person: ids.at(-1),
  //     node: props.currentNode?.id
  //   }
  //   try {
  //     await WebApiAssessment.assignOneTest(body)
  //     filterPersonName();
  //     message.success("Evaluación asignada")
  //   } catch (e) {
  //     console.log(e)
  //     setLoading(false)
  //     message.error("Evaluación no asignada")
  //   }
  // };

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


  useEffect(()=>{
    if(openAssignTest){
      if(personsToDelete.length > 0){
        setShowModalAssignTest(true)
      }else{
        setOpenAssignTest(false)
        message.error("Selecciona al menos una persona")
      }
    }
  },[openAssignTest])

  // useEffect(()=>{
  //   if(openAssignToPerson){
  //     if(personsToDelete.length > 0){
  //       setShowAssignToPerson(true)
  //     }else{
  //       setOpenAssignToPerson(false)
  //       message.error("Selecciona al menos una persona")
  //     }
  //   }
  // },[openAssignToPerson])

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
        <a
          href={`https://${getDomain(
            API_URL_TENANT
          )}/person/person/generate_template/`}
        >
          Plantilla básica
        </a>
      </Menu.Item>
      {props.config && props.config.enabled_nomina && (
        <Menu.Item key="2">
          <a href={`${API_URL_TENANT}/static/plantillaExtendidaPersonas.xlsx`}>
            Plantilla Extensa
          </a>
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
          Datos basicos
        </a>
        <input
          ref={inputFileRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => importPersonFileExtend(e)}
        />
      </Menu.Item>
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
        {showModalGroup && (
          <PersonsGroup
            loadData={{name:'',persons: personsToDelete}}
            title={"Crear nuevo grupo"}
            visible={showModalGroup}
            close={HandleCloseGroup}
            actionForm={onFinishCreateGroup}
            personList={person}
          />
        )}
        {showModalAssignTest && (
          <AssignAssessments
              title={'Asignar evaluaciones'}
              visible={showModalAssignTest}
              close={HandleCloseGroup}
              actionForm={onFinishAssignAssessments}
          />
        )}
        {showModalAssigns && (
          <ViewAssigns
            visible={showModalAssigns}
            setVisible={setShowModalAssigns}
            itemList={personSelected}
            itemSelected={itemPerson}
            getAssigns={getAssigns}
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
