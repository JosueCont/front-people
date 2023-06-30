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
  Divider,
  notification,
  Checkbox,
  Upload,
  Space, Typography
} from "antd";
import { API_URL_TENANT } from "../../../config/config";
import { useEffect, useState, useRef, React, useMemo } from "react";
import {
  SyncOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LinkOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  KeyOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UsergroupAddOutlined, WarningOutlined
} from "@ant-design/icons";
import { BsHandIndex } from "react-icons/bs";
import MainLayout from "../../../layout/MainInter";
import FormPerson from "../../../components/person/FormPerson";
import { withAuthSync } from "../../../libs/auth";
import { setDataUpload } from "../../../redux/UserDuck";

import Link from "next/link";
import jsCookie from "js-cookie";
import { connect } from "react-redux";
import { genders, messageError, messageUpdateSuccess, statusSelect } from "../../../utils/constant";
import SelectDepartment from "../../../components/selects/SelectDepartment";
import SelectAccessIntranet from "../../../components/selects/SelectAccessIntranet";
import router, { useRouter } from "next/router";
import { useLayoutEffect } from "react";
import { downLoadFileBlob, getDomain, verifyMenuNewForTenant } from "../../../utils/functions";
import WebApiPeople from "../../../api/WebApiPeople";
import WebApiYnl from "../../../api/WebApiYnl";
import AssignAssessments from "../../../components/person/assignments/AssignAssessments";
import PersonsGroup from "../../../components/person/groups/PersonsGroup";
import WebApiAssessment from "../../../api/WebApiAssessment";
import ViewAssigns from "../../../components/person/assignments/ViewAssigns";
import SelectJob from "../../../components/selects/SelectJob";
import ButtonDownloadConfronta from "../../../components/payroll/ButtonDownloadConfronta";
import ButtonUpdateSalary from "../../../components/payroll/ImportGenericButton/ButtonUpdateSalary";
import ButtonUpdVacations from '../../../components/payroll/ImportGenericButton/ButtonUpdVacations'
import WebApiPayroll from "../../../api/WebApiPayroll";
import ModalAddPersonCFI from "../../../components/modal/ModalAddPersonCFI";
import { getFullName } from "../../../utils/functions";
import _ from "lodash"
import { ruleWhiteSpace, ruleRequired, ruleMinPassword, validateSpaces } from "../../../utils/rules";
import { getAdminRolesOptions } from "../../../redux/catalogCompany";
import ModalCompetences from "../../../components/person/ModalCompetences";

const { Text } = Typography;

const homeScreen = ({
  getAdminRolesOptions,
  ...props
}) => {
  const route = useRouter();

  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAddPerson, setModalAddPerson] = useState(false);
  const [modalCreateGroup, setModalCreateGroup] = useState(false);
  const [showModalGroup, setShowModalGroup] = useState(false);
  const [showModalImportPersons, setShowModalImportPersons] = useState(false);
  const [openAssignTest, setOpenAssignTest] = useState(false);
  const [showModalAssignTest, setShowModalAssignTest] = useState(false);
  const [showModalAssigns, setShowModalAssigns] = useState(false);
  const [showModalSendIUSS, setShowModalSendIUSS] = useState(false)
  const [personSelected, setPersonSelected] = useState(false);
  const [personsKeys, setPersonsKeys] = useState([]);
  const [namePerson, setNamePerson] = useState("");
  const [formFilter] = Form.useForm();
  const [formAddImmediateSupervisor] = Form.useForm();
  const [formAddSubstituteImmediateSupervisor] = Form.useForm();
  const [formImportPeople] = Form.useForm();
  const [formResetPassword] = Form.useForm();
  // const inputFileRef = useRef(null);
  // const inputFileRefAsim = useRef(null);

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
  const [modalSynchronizeYNL, setModalSynchronizeYNL] = useState(false);
  const [modalAddImmediateSupervisor, setModalAddImmediateSupervisor] = useState(false);
  const [modalAddSubstituteImmediateSupervisor, setModalAddSubstituteImmediateSupervisor] = useState(false);
  const [personsToDelete, setPersonsToDelete] = useState([]);
  const [personsToSynchronizeYNL, setPersonsToSynchronizeYNL] = useState([]);
  const [personsToSendUIStore, setPersonsToSendUIStore] = useState([])
  const [personsToAddImmediateSupervisor, setPersonsToAddImmediateSupervisor] = useState([]);
  const [personsToAddSubstituteImmediateSupervisor, setPersonsToAddSubstituteImmediateSupervisor] = useState([]);
  const [stringToDelete, setStringToDelete] = useState(null);
  const [showSynchronizeYNL, setShowSynchronizeYNL] = useState(false);
  let urlFilter = "/person/person/?";

  const [userSession, setUserSession] = useState({});
  const [deactivateTrigger, setDeactivateTrigger] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [itemPerson, setItemPerson] = useState({});
  const [loadAssign, setLoadAssign] = useState(false);
  const [depSelect, setDepSelect] = useState(null);
  // const [wtSelct, setWtSelct] = useState(null);
  const [addPersonCfi, setPersonCfi] = useState(false)
  const [listPersons, setListPersons] = useState([]);
  const [isLoadingImmediateSupervisor, setIsLoadingImmediateSupervisor] = useState(false);
  const [isLoadingSubstituteImmediateSupervisor, setIsLoadingSubstituteImmediateSupervisor] = useState(false);
  const [couldAddSubstitute, setCouldAddSubstitute] = useState(false);
  const [isOpenModalResetPassword, setIsOpenModalResetPassword] = useState(false);
  const [khonnectId, setKhonnectId] = useState("");
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState([])
  const [correct, SetCorrect] = useState(0)
  const [modalError, setModalError] = useState(false)
  const applications = props && props.config && props.config.applications || []
  let enableStore = applications.some((app) => app.app === 'IUSS' && app.is_active)
  // Modal competencias
  const [openCompetences, setOpenCompetences] = useState(false);
  const [itemReport, setItemReport] = useState([]);

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  useEffect(() => {
    if (!props.currentNode) return;
    getAdminRolesOptions(props.currentNode?.id)
  }, [props.currentNode])





  // useEffect(() => {
  //   if (props.currentNode) {
  //     filterPersonName();
  //   } else {
  //     return <></>;
  //   }
  // }, [props.currentNode]);

  // useEffect(() => {
  //   const jwt = JSON.parse(jsCookie.get("token"));
  //   setUserSession(jwt);
  //   if (props.currentNode) filterPersonName();
  // }, [props.currentNode]);

  useEffect(() => {
    for (let item in props.applications) {
      if (item === "ynl") {
        if (props.applications[item].active) {
          setShowSynchronizeYNL(true);
        }
      }
    }
  }, [props.applications]);

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
  const getListPersons = async () => {
    let data = {
      node: props.currentNode.id
    }
    try {
      let response = await WebApiPeople.filterPerson(data);
      setListPersons([]);
      let persons = response.data.map((a) => {
        a.key = a.khonnect_id;
        return a;
      });
      setListPersons(persons);
    } catch (error) {
      setListPersons([]);
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

  const downloadIndefiniteTermContract = async (item) => {
    try {
      let response = await WebApiPayroll.downloadIndefiniteTermContract(item.id)
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], {
        type: type,
        encoding: "UTF-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Contrato por tiempo indeterminado.pdf"
      link.click()

    } catch (error) {
      console.log('error',error)
      error &&
        error.response &&
        error.response.data &&
        error.response.data.message &&
        message.error(error.response.data.message)
    }
  }
 
  const downloadFixedTermContract = async (item) => {
    try {
      let response = await WebApiPayroll.downloadFixedTermContract(item.id)
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], {
        type: type,
        encoding: "UTF-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Contrato por tiempo determinado.pdf"
      link.click()

    } catch (error) {
      console.log('error',error)
      error &&
        error.response &&
        error.response.data &&
        error.response.data.message &&
        message.error(error.response.data.message)
    }
  }

  const downloadResignationLetter = async (item) => {

    try {

      let response = await WebApiPayroll.downloadRenegationCart(item.id)
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], {
        type: type,
        encoding: "UTF-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Carta de renuncia.pdf"
      link.click()

    } catch (error) {
      error &&
        error.response &&
        error.response.data &&
        error.response.data.message &&
        message.error(error.response.data.message)
    }

    // downLoadFileBlob(
    //   `${getDomain(API_URL_TENANT)}/payroll/resignation-letter?person_id=${item.id}`,
    //   "carta_de_renuncia.pdf",
    //   "GET",
    // );

  }

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
            <Avatar src={item.photo_thumbnail ? item.photo_thumbnail : defaulPhoto} />
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
      title: "Foto",
      show: true,
      render: (item) => {
        return (
          <div>
            <Avatar src={item.photo_thumbnail ? item.photo_thumbnail : defaulPhoto} />
          </div>
        );
      },
    },
    {
      title: "Núm. Empleado",
      show: true,
      render: (item) => {
        return <div>{item.code ? item.code : ""}</div>;
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
              <div
                onClick={() => route.push({
                  pathname: `/home/persons/${item.id}`,
                  query: route.query
                })}
              > <a>{personName}</a></div>
            ) : (
              <div>{personName}</div>
            )}
          </>
        );
      },
    },
    {
      title: "Jefe inmediato",
      show: true,
      render: (item) => {
        return <div>{item?.immediate_supervisor ? getFullName(item.immediate_supervisor) : ""}</div>;
      },
    },
    {
      title: "Suplente de jefe inmediato",
      show: true,
      render: (item) => {
        return <div>{item?.substitute_immediate_supervisor ? getFullName(item.substitute_immediate_supervisor) : ""}</div>;
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
    // {
    //   title: "Asignaciones",
    //   show: props.config?.kuiz_enabled,
    //   render: (item) => {
    //     return (
    //       <Tooltip title="Ver asignaciones">
    //         <EyeOutlined
    //           style={{ cursor: "pointer" }}
    //           onClick={() => OpenModalAssigns(item)}
    //         />
    //       </Tooltip>
    //     );
    //   },
    // },
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
        if (!response.data.photo_thumbnail) response.data.photo_thumbnail = defaulPhoto;
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
        {/*{props.currentNode && permissions && (*/}
        {/*  <Menu.Item key="1">*/}
        {/*    <Clipboard*/}
        {/*      text={*/}
        {/*        window.location.origin +*/}
        {/*        "/ac/urn/" +*/}
        {/*        props.currentNode.permanent_code*/}
        {/*      }*/}
        {/*      title={"Link de empresa"}*/}
        {/*      border={false}*/}
        {/*      type={"button"}*/}
        {/*      msg={"Copiado en portapapeles"}*/}
        {/*      tooltipTitle={"Copiar link de auto registro"}*/}
        {/*    />*/}
        {/*  </Menu.Item>*/}
        {/*)}*/}
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
        {/*<Menu.Item key="3" onClick={() => handleDeactivate()}>*/}
        {/*  Desactivar*/}
        {/*</Menu.Item>*/}
        {
          enableStore &&
          <Menu.Item key="8" onClick={() => showModalUISS()} icon={<SendOutlined />}>
            Enviar a UI Store
          </Menu.Item>
        }
        {showSynchronizeYNL && (
          <Menu.Item key="6" onClick={() => showModalSynchronizeYNL()} icon={<SyncOutlined />}>
            Sincronizar YNL
          </Menu.Item>
        )}
        <Menu.Item key="7" onClick={() => showModalAddImmediateSupervisor()} icon={<UserSwitchOutlined />}>
          Asignar jefe inmediato
        </Menu.Item>
        <Menu.Item key="add_substitute" onClick={() => showModalAddSubstituteImmediateSupervisor()} icon={<UsergroupAddOutlined />}>
          Asignar suplente de jefe inmediato
        </Menu.Item>
      </Menu>
    );
  };

  const handleDeactivate = () => {
    setDeactivateTrigger(true);
  };

  const closeCompetences = (person,) => {
    setItemPerson({})
    setItemReport([])
    setOpenCompetences(false)
  }

  const getReport = async (item) => {
    const key = 'updatable';
    message.loading({ content: 'Obteniendo información...', key })
    try {
      let body = {
        node_id: props.currentNode?.id,
        user_id: item?.id,
        calculation_type: props.config?.calculation_type
      }
      let response = await WebApiAssessment.getReportCompetences(body);
      setTimeout(()=>{
        message.success({content: 'Información obtenida', key})
        setItemPerson(item)
        setItemReport(response.data)
      },1000)
      setTimeout(()=>{
        setOpenCompetences(true)
      },2000)
    } catch (e) {
      console.log(e)
      let error = e?.response?.data?.message;
      let msg = error ? error : 'Información no obtenida';
      setTimeout(() => {
        message.error({ content: msg, key })
      }, 2000)
    }
  }

  const menuPerson = (item) => {
    return (
      <Menu>
        {props?.applications && (_.has(props.applications, "kuiz") && props.applications["kuiz"].active) && (
          <>
            {/* {permissions.view && (
              <Menu.Item key="4" icon={<EyeOutlined />}>
                <Link href={`/home/profile/${item.id}`}>Ver resultados</Link>
              </Menu.Item>
            )} */}
            <Menu.Item
              key="5"
              icon={<EyeOutlined />}
              onClick={() => route.push({
                pathname: `/assessment/persons/${item.id}`,
                query: route.query
              })}>
              Ver asignaciones
            </Menu.Item>
            <Menu.Item
              key="5.1"
              icon={<LinkOutlined />}
              onClick={() =>
                navigator.clipboard.writeText(`${window.location.origin}/validation?user=${item.id}&app=kuiz&type=user`)
              }>
              Copiar permalink de evaluaciones
            </Menu.Item>

            {permissions.create && (
              <Menu.Item
                key="1"
                icon={<BsHandIndex />}
                onClick={() => HandleModalAssign(item)}
              >
                Asignar evaluaciones
              </Menu.Item>
            )}
           <Menu.Item
              key="10"
              icon={<EyeOutlined/>}
              onClick={()=> getReport(item)}
            >
                Ver reporte competencias
            </Menu.Item>

          </>
        )}
        {permissions.edit && (
          <Menu.Item
            key="2"
            icon={<EditOutlined />}
            onClick={() => route.push({
              pathname: `/home/persons/${item.id}`,
              query: route.query
            })}
          >
            Editar
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
        <Menu.Item
          icon={<DownloadOutlined />}
          key="4"
          onClick={() => {
            downloadResignationLetter(item)
          }
          }
        >
          Descargar carta de renuncia
        </Menu.Item>
        <Menu.Item
          icon={<DownloadOutlined />}
          key="10"
          onClick={() => {
            downloadFixedTermContract(item)
          }
          }
        >
          Descargar contrato de tiempo determinado
        </Menu.Item>
        <Menu.Item
          icon={<DownloadOutlined />}
          key="11"
          onClick={() => {
            downloadIndefiniteTermContract(item)
          }
          }
        >
          Descargar contrato de tiempo indeterminado
        </Menu.Item>
        {
          enableStore &&
          <Menu.Item key="9"
            icon={<SendOutlined />}
            onClick={() => {
              setPersonsToSendUIStore([item]),
                showModalUISS()
            }}
          >
            Enviar a UI Store
          </Menu.Item>
        }
        {showSynchronizeYNL && (
          <Menu.Item
            key="6"
            icon={<SyncOutlined />}
            onClick={() => {
              setPersonsToSynchronizeYNL([item]), showModalSynchronizeYNL();
            }}
          >
            Sincronizar con YNL
          </Menu.Item>
        )}
        <Menu.Item
          key="7"
          icon={<UserSwitchOutlined />}
          onClick={() => {
            setPersonsToAddImmediateSupervisor([item]), setModalAddImmediateSupervisor(true);
          }}
        >
          Asignar jefe inmediato
        </Menu.Item>

        {item.immediate_supervisor &&
          <Menu.Item key="add_substitute" icon={<UsergroupAddOutlined />} onClick={() => {
            setPersonsToAddSubstituteImmediateSupervisor([item]), setModalAddSubstituteImmediateSupervisor(true);
          }}>
            Asignar suplente de jefe inmediato
          </Menu.Item>
        }

        {isAdmin && (
          <Menu.Item
            key="8"
            icon={<KeyOutlined />}
            onClick={() => { setIsOpenModalResetPassword(true), setKhonnectId(item.khonnect_id) }}
          >
            Reestablecer contraseña
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
                <Avatar src={p.photo_thumbnail} />
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

  //// EXPORT VACATION REPORT
  const exportVacationReport = () => {
    setLoading(true);
    filter(formFilter.getFieldsValue());
    downLoadFileBlob(
      `${getDomain(API_URL_TENANT)}/person/person/export-vacation-report/`,
      "reporteVacaciones.xlsx",
      "POST",
      filters
    );
    setLoading(false);
  };

  const importPersonFileExtend = async (e) => {
    let formData = new FormData();

    let types = [1]

    /*
    1 = Quiero que lea intranet
    2 = Quiero que lea nomina/timbrado
    3 = Quiero que lea imss
    */

    let imss = formImportPeople.getFieldValue('types_imss') ? [3] : [];
    let timbrado = formImportPeople.getFieldValue('types_stamp') ? [2] : [];

    //formData.append("File", e);
    formData.append("types", [1, ...imss, ...timbrado, 0])
    formData.append("excel_person_file", e);
    formData.append("node_id", props.currentNode.id);
    formData.append("saved_by", userSession.user_id);
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
  };

  const getFileExtension = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
  };

  ////SEARCH FILTER
  const filter = (value) => {
    let valueQuery = {}
    if (!(value?.name && value.name.trim())) {
      formFilter.setFieldsValue({ name: undefined });
      value.name = undefined;
    }

    if (!(value?.flast_name && value.flast_name.trim())) {
      formFilter.setFieldsValue({ flast_name: undefined });
      value.flast_name = undefined;
    }

    if (!(value?.code && value.code.trim())) {
      formFilter.setFieldsValue({ code: undefined });
      value.code = undefined;
    }

    if (value && value.name !== undefined) {
      urlFilter = urlFilter + "first_name__icontains=" + value.name + "&";
      filters.first_name = value.name;
      valueQuery.name = value.name;
    }
    if (value && value.flast_name !== undefined) {
      urlFilter = urlFilter + "flast_name=" + value.flast_name + "&";
      filters.flast_name = value.flast_name;
      valueQuery.flast_name = value.flast_name;
    }
    if (value && value.code !== undefined) {
      urlFilter = urlFilter + "code=" + value.code + "&";
      filters.code = value.code;
      valueQuery.code = value.code;
    }
    if (value && value.gender !== undefined && value.gender != 0) {
      urlFilter = urlFilter + "gender=" + value.gender + "&";
      filters.gender = value.gender;
      valueQuery.gender = value.gender;
    }

    if (value && value.is_active !== undefined && value.is_active != -1) {
      urlFilter = urlFilter + "is_active=" + value.is_active + "&";
      filters.is_active = value.is_active;
      valueQuery.is_active = value.is_active;
    }
    if (value && value.department !== undefined) {
      urlFilter = urlFilter + "person_department__id=" + value.department + "&";
      filters.department = value.department;
      valueQuery.department = value.department;
    }
    if (value && value.job && value.job !== undefined) {
      urlFilter = urlFilter + "job__id=" + value.job + "&";
      filters.job = value.job;
      valueQuery.job = value.job;
    }
    if (value && value.periodicity !== undefined) {
      urlFilter = urlFilter + "periodicity=" + value.periodicity + "&";
      filters.periodicity = value.periodicity;
      valueQuery.periodicity = value.periodicity;
    }
    if (value && value.immediate_supervisor !== undefined) {
      urlFilter = urlFilter + "immediate_supervisor=" + value.immediate_supervisor + "&";
      filters.immediate_supervisor = value.immediate_supervisor;
      valueQuery.immediate_supervisor = value.immediate_supervisor;
    }
    filterPersonName(urlFilter);
    route.replace({
      pathname: '/home/persons/',
      query: valueQuery
    }, undefined, { shallow: true });
  };

  const resetFilter = () => {
    formFilter.resetFields();
    route.replace('/home/persons', undefined, { shallow: true });
    // filter();
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
      Al eliminar este registro, perderá todos los datos relacionados a él de
      manera permanente. ¿Está seguro de querer eliminarlo?
      <br />
      <br />
      <ListElementsToDelete personsDelete={personsToDelete} />
    </div>
  );

  const AlertSynchronizeToYNL = () => (
    <div>
      Las siguientes personas serán sincronizadas con YNL, ¿Desea continuar?
      <br />
      <br />
      <ListElementsToSynchronize personsToSynchronizeYNL={personsToSynchronizeYNL} />
    </div>
  );

  const AlertSentToUiStore = () => (
    <div>
      Las siguientes personas serán creadas en UI Store, ¿Desea continuar?
      <br />
      <br />
      <ListElementsSendToUiStore personsToSendUIStore={personsToSendUIStore} />
    </div>
  );

  const AlertErrors = () => (
    <div>
      <CheckCircleOutlined /> Usuarios creados: {correct}
      <br />
      <br />
      <CloseCircleOutlined /> Errores: {errors.length} <br />
      <ListError errors={errors} />
    </div>
  );

  const AlertAddImmediateSupervisor = () => (
    <div>
      {personsToAddImmediateSupervisor.length > 1 ? (<b>Colaboradores a asignar:</b>) : (<b>Colaborador a asignar:</b>)}
      <br /><br />
      <ListElementsToAddImmediateSupervisor personsToAddImmediateSupervisor={personsToAddImmediateSupervisor} />
    </div>
  );

  const rowSelectionPerson = {
    selectedRowKeys: personsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonsKeys(selectedRowKeys);
      setPersonsToDelete(selectedRows);
      setPersonsToSendUIStore(selectedRows)
      setPersonsToSynchronizeYNL(selectedRows);
      setPersonsToAddImmediateSupervisor(selectedRows)
      setPersonsToAddSubstituteImmediateSupervisor(selectedRows)
    },
  };

  const ListElementsToDelete = ({ personsDelete }) => {
    return (
      <div>
        {personsDelete.map((p, i) => {
          return (
            <div key={i}>
              <Row style={{ marginBottom: 15 }}>
                <Avatar src={p.photo_thumbnail} />
                <span>{" " + p.first_name + " " + p.flast_name}</span>
              </Row>
            </div>
          );
        })}
      </div>
    );
  };

  const ListElementsToSynchronize = ({ personsToSynchronizeYNL }) => {
    return (
      <div>
        {personsToSynchronizeYNL.map((p) => {
          return (
            <>
              <Row style={{ marginBottom: 15 }}>
                <Avatar src={p.photo_thumbnail} />
                <span>{" " + p.first_name + " " + p.flast_name}</span>
              </Row>
            </>
          );
        })}
      </div>
    );
  };

  const ListElementsSendToUiStore = ({ personsToSendUIStore }) => {
    return (
      <div>
        {personsToSendUIStore.map((p) => {
          return (
            <>
              <Row key={p.id} style={{ marginBottom: 15 }}>
                <Avatar src={p.photo_thumbnail} />
                <span>{" " + p.first_name + " " + p.flast_name}</span>
              </Row>
            </>
          );
        })}
      </div>
    );
  }

  const ListError = ({ errors }) => {
    return (
      <div>
        {errors.map((p, index) => {
          return (
            <>
              <Row key={index + 1} style={{ marginBottom: 15 }}>
                <span>{p}</span>
              </Row>
            </>
          );
        })}
      </div>
    );
  }

  const ListElementsToAddImmediateSupervisor = ({ personsToAddImmediateSupervisor }) => {
    return (
      <div>
        {personsToAddImmediateSupervisor.map((p) => {
          return (
            <>
              <Row style={{ marginBottom: 15 }}>
                <Avatar src={p.photo_thumbnail ? p.photo_thumbnail : defaulPhoto} />
                <span>{" " + p.first_name + " " + p.flast_name}</span>
              </Row>
            </>
          );
        })}
      </div>
    );
  };

  const ListElementsToAddSubstituteImmediateSupervisor = () => {
    let noSupervisorCount = false
    const list = <>
      {personsToAddSubstituteImmediateSupervisor.map((p) => {
        let hasSupervisor = p.immediate_supervisor
        if (!hasSupervisor) {
          noSupervisorCount += 1
        }
        return (
          <>
            <Row style={{ marginBottom: 15 }}>
              <Avatar src={p.photo_thumbnail ? p.photo_thumbnail : defaulPhoto} />
              <span>{" " + p.first_name + " " + p.flast_name}</span>
              {!hasSupervisor && <Tooltip title={'Jefe inmediato no asignado'}><ExclamationCircleOutlined style={{ color: 'red', marginLeft: 8 }} /></Tooltip>}
            </Row>
          </>
        )
      })}
    </>
    setCouldAddSubstitute(noSupervisorCount < personsToAddSubstituteImmediateSupervisor.length)
    return <div>
      {list}
      {noSupervisorCount > 0 &&
        <div style={{ marginTop: 16, marginBottom: 16, fontStyle: 'italic', border: '1px solid #ddd', background: '#fafafa', borderRadius: 8, padding: 8 }}>
          <ExclamationCircleOutlined style={{ color: 'red', marginRight: 8 }} />No se asignará el suplente a personas sin un jefe inmediato
        </div>
      }
    </div>
  }

  const HandleCloseGroup = () => {
    setShowModalGroup(false);
    setModalCreateGroup(false);
    setOpenAssignTest(false);
    setShowModalAssignTest(false);
    setPersonsToDelete([]);
    setPersonsToSynchronizeYNL([]);
    setPersonsToAddImmediateSupervisor([]);
    setPersonsToAddSubstituteImmediateSupervisor([]);
    setPersonsKeys([]);
    setItemPerson({});
  };

  const HandleModalAssign = (item) => {
    setNamePerson(getFullName(item))
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

  const showModalSynchronizeYNL = () => {
    modalSynchronizeYNL ? setModalSynchronizeYNL(false) : setModalSynchronizeYNL(true);
  };

  const showModalUISS = () => {
    showModalSendIUSS ? setShowModalSendIUSS(false) : setShowModalSendIUSS(true)
  }

  const showModalAddImmediateSupervisor = () => {
    personsToAddImmediateSupervisor.length > 0 ? setModalAddImmediateSupervisor(true) : message.warning("Selecciones colaboradores");
  };
  const showModalAddSubstituteImmediateSupervisor = () => {
    personsToAddSubstituteImmediateSupervisor.length > 0 ? setModalAddSubstituteImmediateSupervisor(true) : message.warning("Selecciones colaboradores");
  };

  const finishImmediateSupervisor = (value) => {
    // let validateColaborator = personsToAddImmediateSupervisor.filter(item => item.id === value.immediate_supervisor)
    // validateColaborator.length > 0 ? message.error("No se puede asignar al mismo colaborador como jefe inmediato") : assignedImmediateSupervisor(value.immediate_supervisor)
    assignedImmediateSupervisor(value.immediate_supervisor)
  }

  const assignedImmediateSupervisor = (immediate_supervisor) => {
    setIsLoadingImmediateSupervisor(true)
    let ids = null;
    if (personsToAddImmediateSupervisor.length == 1) {
      ids = personsToAddImmediateSupervisor[0].id;
    } else if (personsToAddImmediateSupervisor.length > 0) {
      personsToAddImmediateSupervisor.map((a) => {
        if (ids) ids = ids + "," + a.id;
        else ids = a.id;
      });
    }
    let data = { immediate_supervisor: immediate_supervisor, persons_id: ids, node: props.currentNode.id }
    WebApiPeople.assignedMassiveImmediateSupervisor(data)
      .then((response) => {
        let msg = response.status == 206
          ? response.data?.message
          : 'Asignado correctamente';
        message.success({ content: msg, duration: 4 });
        setIsLoadingImmediateSupervisor(false);
        setModalAddImmediateSupervisor(false);
        formAddImmediateSupervisor.resetFields();
        filterPersonName();
      })
      .catch((e) => {
        console.log(e)
        if (e.response?.status == 400) {
          let txt = e.response?.data?.message;
          let error = [{ name: 'immediate_supervisor', errors: [txt] }];
          formAddImmediateSupervisor.setFields(error)
        } else {
          message.error("Error al asignar");
        }
        setIsLoadingImmediateSupervisor(false);
      });
  };

  const onFinishAddSubstituteImmediateSupervisor = (values) => {
    setIsLoadingSubstituteImmediateSupervisor(true)
    let ids = null;
    let _personsToAdd = personsToAddSubstituteImmediateSupervisor.filter(e => e.immediate_supervisor)
    if (_personsToAdd.length === 0) {
      message.error("No se puede asignar un suplente a personas sin jefe inmediato")
      return;
    }

    ids = (_personsToAdd.map((a) => a.id)).join(',')

    let data = {
      immediate_supervisor: values.substitute_immediate_supervisor,
      persons_id: ids,
      node: props.currentNode.id
    }

    WebApiPeople.assignedMassiveSubstituteImmediateSupervisor(data)
      .then((response) => {
        let msg = response.status == 206
          ? response.data?.message
          : 'Asignado correctamente';
        message.success({ content: msg, duration: 4 });
        setIsLoadingSubstituteImmediateSupervisor(false);
        setModalAddSubstituteImmediateSupervisor(false);
        formAddSubstituteImmediateSupervisor.resetFields();
        filterPersonName();
      })
      .catch((e) => {
        console.log(e)
        if (e.response?.status == 400) {
          let txt = e.response?.data?.message;
          let error = [{ name: 'substitute_immediate_supervisor', errors: [txt] }];
          formAddSubstituteImmediateSupervisor.setFields(error)
        } else {
          message.error("Error al asignar");
        }
        setIsLoadingSubstituteImmediateSupervisor(false);
      });
  };

  useEffect(() => {
    if (modalSynchronizeYNL && personsToSynchronizeYNL.length > 0) {
      Modal.confirm({
        title: "Sincronización con YNL",
        content: <AlertSynchronizeToYNL />,
        icon: <SyncOutlined />,
        okText: "Sí, sincronizar",
        okButtonProps: {
          danger: true,
        },
        onCancel() {
          setModalSynchronizeYNL(false);
        },
        cancelText: "Cancelar ",
        onOk() {
          SynchronizeYNLPerson();
        },
      });
    } else if (modalSynchronizeYNL) {
      setModalSynchronizeYNL(false);
    }
  }, [modalSynchronizeYNL]);

  const sendToUIStore = () => {

    let arrayIds = null

    if (personsToSendUIStore.length == 1) {
      let idPerson = personsToSendUIStore[0].id
      arrayIds = [idPerson]
    } else {
      let arr = personsToSendUIStore.map((person) => person.id)
      arrayIds = arr
    }

    let data = {
      node_id: props.currentNode.id,
      persons_id: arrayIds
    }

    setLoading(true)

    WebApiPeople.CreateUIStoreUsers(data)
      .then((res) => {
        let errors = res.data.error_details || []
        let success = res.data.success
        setErrors(errors)
        SetCorrect(success)
        if (errors.length > 0) {
          setModalError(true)
        } else {
          message.success('Usuarios enviados correctamente')
        }
      })
      .catch((e) => {
        message.error('Error al enviar usuarios')
      })
      .finally(() => {
        setShowModalSendIUSS(false)
        filterPersonName();
        setPersonsToSendUIStore([])
        getListPersons()
        setLoading(false)
      })

  }

  useEffect(() => {
    if (showModalSendIUSS && personsToSendUIStore.length > 0) {
      Modal.confirm({
        title: 'Enviar a UI Store',
        icon: <SendOutlined />,
        content: <AlertSentToUiStore />,
        okText: 'Sí, enviar',
        cancelText: "Cancelar ",
        okButtonProps: {
          danger: true,
        },
        onOk: () => {
          sendToUIStore()
        },
        onCancel: () => {
          setShowModalSendIUSS(false)
        }

      })
    }
  }, [showModalSendIUSS])

  useEffect(() => {
    if (modalError && errors.length > 0) {
      Modal.info({
        title: 'Detalles de la sincronización',
        cancelText: "Cerrar",
        content: <AlertErrors />,
        onCancel: () => {
          setModalError(false)
          setErrors([])
        }
      })
    }
  }, [modalError])

  useEffect(() => {
    if (Object.keys(route.query).length === 0) {
      if (props.currentNode) {
        const jwt = JSON.parse(jsCookie.get("token"));
        setUserSession(jwt);
        filterPersonName()
        getListPersons()
      }
    } else {
      if (props.currentNode) {
        let page = route.query.page ? parseInt(route.query.page) : 1;
        if (route && route.query.name != "") {
          urlFilter = urlFilter + "first_name__icontains=" + route.query.name + "&";
          filters.first_name = route.query.name;
        }
        if (route && route.query.flast_name != "") {
          urlFilter = urlFilter + "flast_name=" + route.query.flast_name + "&";
          filters.flast_name = route.query.flast_name;
        }
        if (route && route.query.code != "") {
          urlFilter = urlFilter + "code=" + route.query.code + "&";
          filters.code = route.query.code;
        }
        if (route && route.query.gender != "" && route.query.gender != 0) {
          urlFilter = urlFilter + "gender=" + route.query.gender + "&";
          filters.gender = route.query.gender;
        }

        if (route && route.query.is_active != "" && route.query.is_active != -1) {
          urlFilter = urlFilter + "is_active=" + route.query.is_active + "&";
          filters.is_active = route.query.is_active;
        }
        if (route && route.query.department != "") {
          urlFilter = urlFilter + "person_department__id=" + route.query.department + "&";
          filters.department = route.query.department;
        }
        if (route && route.query.job && route.query.job != "") {
          urlFilter = urlFilter + "job__id=" + route.query.job + "&";
          filters.job = route.query.job;
        }
        if (route && route.query.periodicity !== undefined) {
          urlFilter = urlFilter + "periodicity=" + route.query.periodicity + "&";
          filters.periodicity = route.query.periodicity;
        }
        if (route && route.query.immediate_supervisor !== undefined) {
          urlFilter = urlFilter + "immediate_supervisor=" + route.query.immediate_supervisor + "&";
          filters.immediate_supervisor = route.query.immediate_supervisor;
        }
        filterPersonName(urlFilter)
        getListPersons()
        formFilter.setFieldsValue({
          ...route.query,
          gender: router.query.gender ? parseInt(route.query.gender) : "",
        });
      }
    }
  }, [route, props.currentNode]);

  const validatePersonTodelete = (personsToDelete = []) => {
    // Validamos si no estoy tratando de eliminarme a mi mismo
    let isValid = true;
    if (personsToDelete && personsToDelete.length > 0) {
      let myPerson = personsToDelete.find((p) => p.id === props?.user_store?.id);
      console.log('personsToDelete===>', personsToDelete, myPerson)
      if (myPerson) {
        isValid = false;
      } else {
        isValid = true;
      }
    }
    return isValid;
  }

  const deletePerson = () => {
    let ids = null;
    let isValid = validatePersonTodelete(personsToDelete);
    if (!isValid) {
      message.error('No se puede completar esta acción, verifique que no se encuentre su usuario en la lista de personas a eliminar.')
      return;
    }
    if (personsToDelete.length === 1) {
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

  const SynchronizeYNLPerson = () => {
    let ids = null;
    if (personsToSynchronizeYNL.length == 1) {
      ids = personsToSynchronizeYNL[0].id;
    } else if (personsToSynchronizeYNL.length > 0) {
      personsToSynchronizeYNL.map((a) => {
        if (ids) ids = ids + "," + a.id;
        else ids = a.id;
      });
    }
    setLoading(true);
    let data = { node_id: props.currentNode.id, persons_id: ids }
    WebApiYnl.synchronizePersonYNL(data)
      .then((response) => {
        setModalSynchronizeYNL(false);
        setPersonsToSynchronizeYNL([]);
        filterPersonName();
        setLoading(false);
        message.success("Sincronizado correctamente.");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        message.error("Error al sincronizar");
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

  const onFinishChangePassword = (data) => {
    setLoadingChangePassword(true)
    let dataToApi = {
      khonnect_id: khonnectId,
      password: data.passwordTwo,
    }
    data.passwordTwo === data.passwordOne ? changePasswordUser(dataToApi) : message.info("Confirme bien sus contraseñas")
  }

  const changePasswordUser = async (data) => {
    try {
      let response = await WebApiPeople.validateChangePassword(data);
      if (response.status == 200) {
        setTimeout(() => {
          setLoadingChangePassword(false)
          message.success("Cambio de contraseña exitoso");
          setIsOpenModalResetPassword(false)
          formResetPassword.resetFields();
        }, 3000);
      }
    } catch (e) {
      message.error("Ocurrio un error intenta nuevamente");
      formResetPassword.resetFields()
      setLoadingChangePassword(false)
      console.log(e)
    }
  }

  const validatePassword = ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue("passwordOne") === value) {
        return Promise.resolve();
      }
      return Promise.reject("Las contraseñas no coinciden");
    },
  });

  useEffect(() => {
    if (props.user_store) {
      setIsAdmin(props.user_store.is_admin)
    }
  }, [props.user_store]);

  const closeAssign = () => {
    setPersonsKeys([])
    setPersonsToDelete([])
    setPersonsToSendUIStore([])
    setPersonsToSynchronizeYNL([])
    setPersonsToAddImmediateSupervisor([])
    setPersonsToAddSubstituteImmediateSupervisor([])
  }

  // Lista para asignar suplente de jefe inmediato
  // Se excluye al jefe inmediato en caso de tener uno asignado
  const listSubstituteSupevisor = useMemo(() => {
    let size = personsToAddSubstituteImmediateSupervisor?.length;
    if (size <= 0) return listPersons;
    if (size > 1) return listPersons; //Solo aplica para la asignación masiva
    let ids = personsToAddImmediateSupervisor.map(item => item?.immediate_supervisor?.id);
    const filter_ = item => !ids.includes(item?.id);
    return listPersons.filter(filter_)
  }, [listPersons, personsToAddSubstituteImmediateSupervisor])


  return (
    <>
      <MainLayout currentKey={["persons"]} defaultOpenKeys={["strategyPlaning", "people"]}>
        <Row >
          <Col xs={12} md={20} >
            <Breadcrumb>
              <Breadcrumb.Item>Inicio</Breadcrumb.Item>
              {verifyMenuNewForTenant() &&
                <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
              }
              <Breadcrumb.Item>Colaboradores</Breadcrumb.Item>
              <Breadcrumb.Item>Personas</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs={12} md={4} >
            {permissions.create && (
              <Button className="btn-add-person" onClick={() => getModalPerson(true)} style={{ marginLeft: '-.1vh', width: '100%' }} >
                <PlusOutlined />
                Agregar persona
              </Button>
            )}
          </Col>
        </Row>
        <div className="container" style={{ width: "100%" }}>
          {permissions.view ? (
            <>
              <div className="top-container-border-radius">
                <Row justify={"space-between"} className={"formFilter"}>
                  <Col span={24}>
                    <Form
                      onFinish={filter}
                      layout={"vertical"}
                      form={formFilter}
                    >
                      <Row gutter={[10]} style={{ marginBottom: 10 }}>
                        <Col span={24}>
                          <Row gutter={[10]} style={{ marginBottom: 10 }}>
                            <Col xs={12} md={8}>
                              <Form.Item name="name" label={"Nombre"}>
                                <Input
                                  allowClear={true}
                                  placeholder="Nombre(s)"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={12} md={8}>
                              <Form.Item name="flast_name" label={"Apellido"}>
                                <Input
                                  allowClear={true}
                                  placeholder="Apellido(s)"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={12} md={8}>
                              <Form.Item name="code" label={"Núm. empleado"}>
                                <Input
                                  allowClear={true}
                                  placeholder="Núm. empleado"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={[10]} style={{ marginBottom: 10 }}>
                            <Col xs={12} md={8}>
                              <Form.Item name="gender" label="Género">
                                <Select
                                  options={genders}
                                  notFoundContent={"No se encontraron resultados."}
                                  placeholder="Todos"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={12} md={8}>
                              <SelectDepartment onChange={setDepSelect} />
                            </Col>
                            <Col xs={12} md={8}>
                              <SelectJob department={depSelect} />
                            </Col>
                          </Row>
                          <Row gutter={[10]} style={{ marginBottom: 10 }}>
                            <Col xs={12} md={8}>
                              <Form.Item name="is_active" label="Estatus">
                                <Select
                                  options={statusSelect}
                                  placeholder="Estatus"
                                  notFoundContent={"No se encontraron resultados."}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={12} md={8}>
                              <Form.Item name="immediate_supervisor" label="Jefe inmediato">
                                <Select
                                  showSearch
                                  optionFilterProp="children"
                                  allowClear={true}
                                >
                                  {listPersons.length > 0 && listPersons.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                      {getFullName(item)}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col
                              className="button-filter-person"
                              style={{ display: "flex", marginTop: "10px" }}
                              xs={12} md={4}
                            >
                              <Tooltip
                                title="Filtrar"
                                color={"#3d78b9"}
                                key={"#filtrar"}
                              >
                                <Button style={{ width: '100%' }} className="btn-filter" htmlType="submit">
                                  <SearchOutlined /> Filtrar
                                </Button>
                              </Tooltip>
                            </Col>
                            <Col
                              xs={12} md={4}
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
                                  style={{ marginTop: "auto", marginLeft: 10, width: '100%' }}
                                >
                                  <SyncOutlined /> Limpar filtro
                                </Button>
                              </Tooltip>
                            </Col>

                          </Row>

                        </Col>






                      </Row>
                    </Form>
                  </Col>
                </Row>

              </div>
              <Row span={24} style={{ marginBottom: 12 }}>
                <Col span={24}>
                  <div style={{ display: "flex", justifyContent: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                    {permissions.export_csv_person && (
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => exportPersons()}
                      >
                        Descargar personas
                      </Button>
                    )}

                    {permissions.import_csv_person && props.config && !props.config.nomina_enabled && (
                      <Upload
                        {...{
                          showUploadList: false,
                          beforeUpload: (file) => {
                            const isXlsx = file.name.includes(".xlsx");
                            if (!isXlsx) {
                              message.error(`${file.name} no es un xlsx.`);
                            }
                            return isXlsx || Upload.LIST_IGNORE;
                          },
                          onChange(info) {
                            const { status } = info.file;
                            if (status !== "uploading") {
                              if (info.fileList.length > 0) {
                                importPersonFileExtend(
                                  info.fileList[0].originFileObj
                                );
                                info.file = null;
                                info.fileList = [];
                              }
                            }
                          },
                        }}
                      >
                        <Button
                          //size="middle"
                          icon={<UploadOutlined />}
                        >
                          Importar personas
                        </Button>
                      </Upload>

                    )}

                    {
                      permissions.import_csv_person && props?.config && props?.config?.nomina_enabled && (
                        <Button
                          icon={<DownloadOutlined />}
                          onClick={() => setShowModalImportPersons(true)}
                        >
                          Importar personas
                        </Button>
                      )
                    }
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() =>
                        downLoadFileBlob(
                          `${getDomain(
                            API_URL_TENANT
                          )}/person/person/generate_template/?type=1&node_id=${props?.currentNode?.id}`,
                          "plantilla_personas.xlsx",
                          "GET"
                        )
                      }
                    >
                      Descargar plantilla
                    </Button>

                    {props.config && props.config.nomina_enabled &&
                      <ButtonDownloadConfronta />
                    }

                    {/*{props.config && props.config.nomina_enabled &&*/}
                    {/*    <ButtonMovements node={props.currentNode}/>*/}
                    {/*}*/}

                    {props.config && props.config.nomina_enabled &&
                      <ButtonUpdateSalary personsList={rowSelectionPerson} node={props.currentNode} />
                    }
                    <Button
                      //size="middle"
                      icon={<UserAddOutlined />}
                      onClick={() => setPersonCfi(true)}
                    >
                      Agregar persona usando CIF
                    </Button>
                    <Button
                      //size="middle"
                      icon={<DownloadOutlined />}
                      onClick={() => exportVacationReport()}
                    >
                      Descargar reporte vacaciones
                    </Button>
                    <ButtonUpdVacations />
                  </div>
                  
                </Col>
              </Row>

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
            listPersons={person}
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
            title={`Asignar evaluaciones a ${namePerson}`}
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
        <ModalCompetences
          visible={openCompetences}
          close={closeCompetences}
          itemReport={itemReport}
          itemPerson={itemPerson}
        />
        <ModalAddPersonCFI
          visible={addPersonCfi}
          setVisible={() => setPersonCfi(false)}
          node_id={props.currentNode?.id}
        />

        <Modal title={'Importar personas'} closable={false} footer={false} visible={showModalImportPersons}>
          <p>Selecciona los datos que estas por importar</p>

          <Form
            form={formImportPeople}
            initialValues={{ types_imss: true, types_stamp: true }}
            layout="inline"
          >
            <Form.Item
              name="types_imss"
              valuePropName="checked"
            >
              <Checkbox>IMSS</Checkbox>
            </Form.Item>

            <Form.Item
              name="types_stamp"
              valuePropName="checked"
            >
              <Checkbox>Timbrado</Checkbox>
            </Form.Item>

            <Form.Item
              name="types_stamp"
              valuePropName="checked"
            >
              <Upload
                {...{
                  showUploadList: false,
                  beforeUpload: (file) => {
                    const isXlsx = file.name.includes(".xlsx");
                    if (!isXlsx) {
                      message.error(`${file.name} no es un xlsx.`);
                    }
                    return isXlsx || Upload.LIST_IGNORE;
                  },
                  onChange(info) {
                    const { status } = info.file;
                    if (status !== "uploading") {
                      if (info.fileList.length > 0) {
                        importPersonFileExtend(
                          info.fileList[0].originFileObj
                        );
                        info.file = null;
                        info.fileList = [];
                      }
                    }
                  },
                }}
              >
                <Button
                  //size="middle"
                  icon={<UploadOutlined />}
                >
                  Importar personas
                </Button>
              </Upload>
            </Form.Item>


          </Form>




          <Divider />

          <Button onClick={() => setShowModalImportPersons(false)}>Cerrar</Button>


        </Modal>

        <Modal title="Asignar jefe inmediato" closable={false} visible={modalAddImmediateSupervisor} footer={false} >
          <Form
            onFinish={finishImmediateSupervisor}
            layout={"vertical"}
            form={formAddImmediateSupervisor}
          >
            <Row>
              <Col xs={24} md={24}>
                <Form.Item name="immediate_supervisor" label="Jefe inmediato" rules={[ruleRequired]}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    allowClear={true}
                    notFoundContent="No se encontraron resultados"
                    placeholder="Seleccionar una opción"
                  >
                    {listPersons.length > 0 && listPersons.map(item => (
                      <Select.Option value={item.id} key={item.id}>
                        {getFullName(item)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <AlertAddImmediateSupervisor />
            <Row gutter={[8, 20]} justify="end">
              <Col span={6}>
                <Button
                  disabled={isLoadingImmediateSupervisor}
                  style={{ width: '100%', opacity: isLoadingImmediateSupervisor ? "0.6" : "1" }}
                  className="btn-filter"
                  onClick={() => {
                    closeAssign()
                    setModalAddImmediateSupervisor(false)
                    formAddImmediateSupervisor.resetFields()
                  }}>
                  Cancelar
                </Button>
              </Col>
              <Col span={6}>
                <Button loading={isLoadingImmediateSupervisor} style={{ width: '100%' }} className="btn-filter" htmlType="submit">
                  Asignar
                </Button>
              </Col>
            </Row>
          </Form>
          <br />
        </Modal>

        {personsToAddSubstituteImmediateSupervisor && <Modal title="Asignar suplente de jefe inmediato" closable={false} visible={modalAddSubstituteImmediateSupervisor} footer={false} >
          <Form
            onFinish={onFinishAddSubstituteImmediateSupervisor}
            layout={"vertical"}
            form={formAddSubstituteImmediateSupervisor}
          >
            <Row>
              <Col xs={24} md={24}>
                <Form.Item name="substitute_immediate_supervisor" label="Suplente de jefe inmediato" rules={[ruleRequired]}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    allowClear={true}
                    notFoundContent="No se encontraron resultados"
                    placeholder="Seleccionar una opción"
                  >
                    {listSubstituteSupevisor.length > 0 &&
                      listSubstituteSupevisor.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {getFullName(item)}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div>
              {personsToAddSubstituteImmediateSupervisor.length > 1 ? (<b>Colaboradores a asignar:</b>) : (<b>Colaborador a asignar:</b>)}
              <br /><br />
              <ListElementsToAddSubstituteImmediateSupervisor />
            </div>
            <Row gutter={[8, 20]} justify="end">
              <Col span={6}>
                <Button
                  disabled={isLoadingSubstituteImmediateSupervisor}
                  style={{ width: '100%', opacity: isLoadingSubstituteImmediateSupervisor ? "0.6" : "1" }}
                  className="btn-filter"
                  onClick={() => {
                    closeAssign()
                    setModalAddSubstituteImmediateSupervisor(false)
                    formAddSubstituteImmediateSupervisor.resetFields()
                  }}>
                  Cancelar
                </Button>
              </Col>
              <Col span={6}>
                <Button
                  loading={isLoadingSubstituteImmediateSupervisor}
                  disabled={!couldAddSubstitute}
                  style={{ width: '100%' }} className="btn-filter" htmlType="submit">
                  Asignar
                </Button>
              </Col>
            </Row>
          </Form>
          <br />
        </Modal>
        }

        <Modal title="Reestablecer contraseña" visible={isOpenModalResetPassword} closable={false} footer={false}>
          <Form
            form={formResetPassword}
            onFinish={onFinishChangePassword}
            layout={"vertical"}
            requiredMark={false}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="passwordOne"
                  label="Contraseña nueva"
                  rules={[ruleRequired, ruleWhiteSpace, validateSpaces, ruleMinPassword(6)]}
                >
                  <Input.Password type="password" style={{ minWidth: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="passwordTwo"
                  label="Confirmar contraseña"
                  rules={[ruleRequired, ruleWhiteSpace, validatePassword, validateSpaces, ruleMinPassword(6)]}
                >
                  <Input.Password type="password" style={{ minWidth: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, 20]} justify="end">
              <Col span={6}>
                <Button disabled={loadingChangePassword} style={{ width: '100%', opacity: loadingChangePassword ? "0.6" : "1" }} className="btn-filter" onClick={() => { setIsOpenModalResetPassword(false) }}>Cancelar</Button>
              </Col>
              <Col span={12}>
                <Button className="btn-filter" style={{ width: '100%' }} loading={loadingChangePassword} type="primary" htmlType="submit">Reestablecer contraseña</Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
    permissions: state.userStore.permissions.person,
    applications: state.userStore.applications,
    user_store: state.userStore.user
  };
};

export default connect(mapState, { setDataUpload, getAdminRolesOptions })(withAuthSync(homeScreen));
