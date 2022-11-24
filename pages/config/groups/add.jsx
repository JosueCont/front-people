import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Checkbox,
  Button,
  Spin,
  message,
  Divider,
  Tabs,
  Table,
} from "antd";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";
import { connect } from "react-redux";
import {
  createGroup,
  editGroups,
  getGroupById,
} from "../../../api/apiKhonnect";
import {
  messageSaveSuccess,
  messageError,
  messageUpdateSuccess,
} from "../../../utils/constant";
import { getProfileGroups } from "../../../redux/catalogCompany";
import {FormattedMessage} from "react-intl";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const GroupAdd = ({ ...props }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [edit, setEdit] = useState(false);
  const [perms, setPerms] = useState([]);
  const [allPerms, setAllPerms] = useState([])
  const [getperms, setGetperms] = useState(false);
  const [permsFunction, setPermsFunction] = useState([]);
  const [allCatalogs, setAllCatalogs] = useState([])
  const [arrayFunctions, setarrayFunctios] = useState([]);
  const [newFunctions, setNewFunctions ] = useState([])
  const [instruction, setInstruction] = useState(true);
  const [intranet_access, setintanetAccess] = useState(null);

  useEffect(() => {
    if (props && props && props.config) {
      setintanetAccess(props.config.intranet_enabled);
      headers["client-id"] = props.config.client_khonnect_id;
    }
  }, [props]);

  const headers = {
    "client-id": "",
    "Content-Type": "application/json",
  };

  const views = [
    { name: "Personas", module: "Personas", value: "people.person" },
    { name: "Empresas", module: "Empresas", value: "people.company" },
    /*Catalaogos */
    { name: "Departamentos", module: "Catalogos", value: "people.department" },
    { name: "Puestos de trabajo", module: "Catalogos", value: "people.job" },
    {
      name: "Tipos de personas",
      module: "Catalogos",
      value: "people.person_type",
    },
    { name: "Parentescos", module: "Catalogos", value: "people.relationship" },
    {
      name: "Tipos de documentos",
      module: "Catalogos",
      value: "people.document_type",
    },
    { name: "Bancos", module: "Catalogos", value: "people.bank" },
    /*Comunicacion */
    {
      name: "Comunicados",
      module: "Comunicacion",
      value: "people.comunication",
    },
    { name: "Eventos", module: "Comunicacion", value: "people.event" },
    /*Solicitudes */
    { name: "Préstamos", module: "Solicitudes", value: "people.loan" },
    {
      name: "Configurar Préstamos",
      module: "Solicitudes",
      value: "people.loanconfigure",
    },
    { name: "Vacaciones", module: "Solicitudes", value: "people.vacation" },
    { name: "Permisos", module: "Solicitudes", value: "people.permit" },
    { name: "Incapacidad", module: "Solicitudes", value: "people.incapacity" },
    {
      name: "Cuentas bancarias",
      module: "Solicitudes",
      value: "people.requestaccount",
    },
    /*Recibos de Nómina */
    {
      name: "Recibos de nómina",
      module: "Nómina",
      value: "people.payrollvoucher",
    },

    {
      name: "Perfiles de seguridad",
      module: "Configuración",
      value: "people.groups",
    },
  ];

  const view_functions = [
    /*Personas */
    {
      name: "Activar/ desactivar personas",
      module: "Personas",
      value: "people.person.function.change_is_active",
    },
    {
      name: "Descargar resultados .CSV personas",
      module: "Personas",
      value: "people.person.function.export_csv_person",
    },
    {
      name: "Importar .CSV personas",
      module: "Personas",
      value: "people.person.function.import_csv_person",
    },
    /*Empresa */
    {
      name: "Activar/desactivar empresa",
      module: "Empresas",
      value: "people.company.function.change_is_active",
    },
    /*Solicitudes */
    //Prestamos
    // {
    //   name: "Configuración de préstamos",
    //   module: "Prestamos",
    //   value: "people.loan.function.configure_loan",
    // },
    {
      name: "Aprobar préstamo",
      module: "Prestamos",
      value: "people.loan.function.approve_loan",
    },
    {
      name: "Rechazar préstamo",
      module: "Prestamos",
      value: "people.loan.function.reject_loan",
    },
    {
      name: "Aprobar pago de un préstamo",
      module: "Prestamos",
      value: "people.loan.function.approve_loan_pay",
    },
    //Vacaciones
    {
      name: "Aprobar vacaciones",
      module: "Vacaciones",
      value: "people.vacation.function.approve_vacation",
    },
    {
      name: "Rechazar vacaciones",
      module: "Vacaciones",
      value: "people.vacation.function.reject_vacation",
    },
    //Permisos
    {
      name: "Aprobar permisos",
      module: "Permisos",
      value: "people.permit.function.approve_permit",
    },
    {
      name: "Rechazar permisos",
      module: "Permisos",
      value: "people.permit.function.reject_permit",
    },
    //Incapacidad
    {
      name: "Aprobar incapacidad",
      module: "Incapacidad",
      value: "people.incapacity.function.approve_incapacity",
    },
    {
      name: "Rechazar incapacidad",
      module: "Incapacidad",
      value: "people.incapacity.function.reject_incapacity",
    },
    //Solicitud de cuentas bancarias
    {
      name: "Aprobar cuenta bancaria",
      module: "SolicitudCuentas",
      value: "people.requestaccount.function.approve_account",
    },
    {
      name: "Rechazar cuenta bancaria",
      module: "SolicitudCuentas",
      value: "people.requestaccount.function.reject_account",
    },
    /*Reportes */
    {
      name: "Descargar reporte de colaboradores",
      module: "Reportes",
      value: "people.report.function.export_collaborators",
    },
    {
      name: "Descargar reporte de nómina",
      module: "Reportes",
      value: "people.report.function.export_payrolls",
    },
    {
      name: "Descargar reporte de préstamos",
      module: "Reportes",
      value: "people.report.function.export_loans",
    },
    {
      name: "Descargar reporte de vacaciones",
      module: "Reportes",
      value: "people.report.function.export_vacations",
    },
    {
      name: "Descargar reporte de incapacidad",
      module: "Reportes",
      value: "people.report.function.export_inabilitys",
    },
    {
      name: "Descargar reporte de permisos",
      module: "Reportes",
      value: "people.report.function.export_permits",
    },
    // Acceso a dashboard
    {
      name: "Acceso moderación intranet",
      module: "Dashboard",
      value: "intranet.dashboard.function.statistics",
    },
  ];
  let data = {};

  const onFinish = (values) => {
    data = values;
    let permsList = []
    let onlyPerms = allPerms.length > 0 ? allPerms : perms
    let onlycatalogs = allCatalogs.length > 0? allCatalogs : arrayFunctions
    let functions = newFunctions.length > 0? newFunctions : permsFunction
    // if(getperms){
    //   permsList = onlyPerms.concat(onlycatalogs).concat(functions)
    // } else {
    //   permsList = onlyPerms.concat(functions)
    // }
    permsList = onlyPerms.concat(onlycatalogs).concat(functions)
    // console.log('Values', permsFunction)
    // data.perms = allPerms.length > 0 ? allPerms : perms;
    // let lst = [];
    // if (getperms === true) {
    //   lst = allPerms.length > 0 ? allPerms.concat(allCatalogs? allCatalogs : arrayFunctions) : perms.concat(allCatalogs? allCatalogs : arrayFunctions);
    // } else {
    //   lst = allPerms.length > 0 ? allPerms.concat(newFunctions.length> 0 ? newFunctions :  permsFunction) : perms.concat(newFunctions.length> 0 ? newFunctions :permsFunction);
    // }

    data.perms = permsList;

    if (!edit) {
      saveGroup();
    } else {
      editGroup();
    }
  };

  const saveGroup = async () => {
    setLoading(true);
    data.company = props.currentNode.id;
    
    let response = await createGroup(props.config, data);
    if (response) {
      props.getProfileGroups(props.currentNode.id, props.config);
      message.success(messageSaveSuccess);
      setTimeout(() => {
        router.push({ pathname: "/config/groups" });
      }, 600);
    } else {
      setLoading(false);
      message.error(messageError);
    }
  };

  const editGroup = async () => {
    setLoading(true);

    let response = await editGroups(props.config, data);
    if (response) {
      props.getProfileGroups(props.currentNode.id, props.config);
      message.success(messageUpdateSuccess);
      setTimeout(() => {
        router.push({ pathname: "/config/groups" });
      }, 1000);
    } else {
      setLoading(false);
      message.error(messageError);
    }
  };

  const getGroup = async (id) => {
    setLoading(true);
    data = {
      id: id,
    };
    let response = await getGroupById(props.config, data);
    if (response) {
      let group = response;
      form.setFieldsValue({
        id: group._id.$oid.toString(),
        name: group.name,
        perms: group.perms,
      });
      let arrayperms = [];
      let arrayfunctions = [];
      group.perms.forEach(function (elem) {
        var e = elem.indexOf("can");
        if (e > -1) {
          arrayperms.push(elem);
        } else {
          arrayfunctions.push(elem);
        }
      });
      setarrayFunctios(arrayfunctions);
      setLoading(false);
      setGetperms(true);
      if (perms >= 0) {
        checkPerms(arrayperms)
      }
      //     }
    } else {
      setLoading(false);
      message.error(messageError);
    }
  };

  useEffect(() => {
    const { id } = router.query;
    if (id !== undefined && props.config && edit == false) {
      getGroup(id);
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [router.query.id]);

  useEffect(() => {
    if (props.config) {
      headers["client-id"] = props.config.client_khonnect_id;
    }
    const { id } = router.query;
    if (id !== undefined && props.config && edit == false) {
      getGroup(id);
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [props.config]);

  function handleClick(e) {
    
    if(allPerms.length > 0){
      let index = allPerms.indexOf(e.target.name);
      if (index > -1) {
        if (e.target.checked) {
          setAllPerms([...allPerms, e.target.name]);
        } else {
          allPerms.splice(index, 1);
        }
      } else {
        if (e.target.checked) {
          setAllPerms([...allPerms, e.target.name]);
        }
      }
    } else {
      let index = perms.indexOf(e.target.name);
      if (index > -1) {
        if (e.target.checked) {
          setPerms([...perms, e.target.name]);
        } else {
          perms.splice(index, 1);
        }
      } else {
        if (e.target.checked) {
          setPerms([...perms, e.target.name]);
        }
      }
    }

  }

  function handleClickFunct(e) {

    if(allCatalogs.length > 0){
      if (getperms == false) {
        let index = allCatalogs.indexOf(e.target.name);
        if (index > -1) {
          if (e.target.checked) {
            setAllCatalogs([...allCatalogs, e.target.name]);
          } else {
            setAllCatalogs.splice(index, 1);
          }
        } else {
          if (e.target.checked) {
            setPermsFunction([...allCatalogs, e.target.name]);
          }
        }
      }
    } else {
      if (getperms == false) {
        let index = permsFunction.indexOf(e.target.name);
        if (index > -1) {
          if (e.target.checked) {
            setPermsFunction([...permsFunction, e.target.name]);
          } else {
            permsFunction.splice(index, 1);
          }
        } else {
          if (e.target.checked) {
            setPermsFunction([...permsFunction, e.target.name]);
          }
        }
      }
    }
    if (getperms == false) {
      let index = permsFunction.indexOf(e.target.name);
      if (index > -1) {
        if (e.target.checked) {
          setPermsFunction([...permsFunction, e.target.name]);
        } else {
          permsFunction.splice(index, 1);
        }
      } else {
        if (e.target.checked) {
          setPermsFunction([...permsFunction, e.target.name]);
        }
      }
    }
  }

  const checkPerms = (perms) => {
    if (perms.length > 0) {
      perms.forEach((element) => {
        var chkBox = document.getElementById(element);
        if (chkBox != "undefined" && chkBox !== null) {
          if (chkBox.checked == false) {
            chkBox.click();
          }
        }
      });
    }
  };

  const checkAllpermisions = async (check) => {

    let permsValue = []
    let catalogsValue = []

    let AllPerms = views.filter(
      (perm) => perm.module !== "Catalogos"
    )

    let AllCatalogs = views.filter(
      (perm) => perm.module === "Catalogos"
    )

    AllPerms.forEach((perm, i) => {
      permsValue.push(perm.value + ".can.view")
      permsValue.push(perm.value + ".can.create")
      permsValue.push(perm.value + ".can.edit")
      permsValue.push(perm.value + ".can.delete") 
    })

    AllCatalogs.forEach((perm, i) => {
      catalogsValue.push(perm.value + ".can.view")
      catalogsValue.push(perm.value + ".can.create")
      catalogsValue.push(perm.value + ".can.edit")
      catalogsValue.push(perm.value + ".can.delete") 
    })

    if(check == false){
      setPerms([])
      setAllPerms([])
      setAllCatalogs([])
    } else {
      setAllPerms(permsValue)
      setAllCatalogs(catalogsValue)
    }



    if (permsValue.length > 0) {
        permsValue.forEach( (element, i) => {

        let chkBox = document.getElementById(element);
        
        if (chkBox != "undefined" && chkBox !== null) {

          if (chkBox.checked == false) {
            chkBox.click();
          }
          if(!check){
            chkBox.click();
          }
        }
      });

      if (catalogsValue.length > 0) {
        catalogsValue.forEach((element) => {
          var chkBox = document.getElementById(element);
          if (chkBox != "undefined" && chkBox !== null) {
            if (chkBox.checked == false) {
              chkBox.click();
            }
            if(!check){
              chkBox.click();
            }
          }
        });
      }
      
    }


  }

  const checkFunctions = () => {
    if (arrayFunctions.length > 0) {
      arrayFunctions.forEach((element) => {
        var chkBox = document.getElementById(element);
        if (chkBox != "undefined" && chkBox !== null) {
          if (chkBox.checked == false) {
            chkBox.click();
          }
        }
      });
    }
  };

  const checkAllfunctions = async (check) => {

    let functionsValue = []

    let allFunctions = view_functions.filter(
      (perm) =>
        perm.module === "Personas" ||
        perm.module === "Empresas" ||
        perm.module === "Prestamos" ||
        perm.module === "Vacaciones" ||
        perm.module === "Nómina" ||
        perm.module === "SolicitudCuentas" ||
        perm.module === "Reportes" ||
        perm.module === "Incapacidad" ||
        perm.module === "Permisos" ||
        perm.module === "Dashboard"
    )

    allFunctions.forEach((element) => {
      functionsValue.push(element.value)
    })

    if(check == false){
      setarrayFunctios([])
      setPermsFunction([])
      setNewFunctions([])
    } else {
      setNewFunctions(functionsValue)
    }

    if (functionsValue.length > 0) {
      functionsValue.forEach((element) => {
        var chkBox = document.getElementById(element);
        if (chkBox != "undefined" && chkBox !== null) {
          if (chkBox.checked == false) {
            chkBox.click();
          }
          if(!check){
            chkBox.click();
          }
        }
      });
    }

  }

  // console.log('Allfunctions', newFunctions)

  const handleChangeTab = (activeKey) => {
    if (activeKey === "2") {
      setInstruction(false);
      if (getperms === true) {
        setLoading(true);
        return new Promise((resolve) => {
          setTimeout(() => {
            checkFunctions();
            setGetperms(false);
            setPermsFunction(arrayFunctions);
            setLoading(false);
          }, 0);
        });
      }
    } else {
      setInstruction(true);
    }
  };

  const columns_mod = [
    {
      title: "Módulos",
      id: "modulos",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Ver",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.view"}
              id={item.value + ".can.view"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Crear",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.create"}
              id={item.value + ".can.create"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Editar",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.edit"}
              id={item.value + ".can.edit"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Eliminar",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.delete"}
              id={item.value + ".can.delete"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
  ];

  const columns_cat = [
    {
      title: "Catálogos",
      id: "catalogos",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Ver",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.view"}
              id={item.value + ".can.view"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Crear",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.create"}
              id={item.value + ".can.create"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Editar",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.edit"}
              id={item.value + ".can.edit"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
    {
      title: "Eliminar",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value + ".can.delete"}
              id={item.value + ".can.delete"}
              onClick={handleClick}
            ></Checkbox>
          </>
        );
      },
    },
  ];

  const columns_functions = [
    {
      title: "Función",
      id: "funcion",
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: "Seleccionar",
      render: (item) => {
        return (
          <>
            <Checkbox
              name={item.value}
              id={item.value}
              onClick={handleClickFunct}
            ></Checkbox>
          </>
        );
      },
    },
  ];

  return (
    <MainLayout currentKey={['securityGroups']} defaultOpenKeys={['config']}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Configuración</Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/config/groups" })}
        >
          Perfiles de seguridad
        </Breadcrumb.Item>
        {edit ? (
          <Breadcrumb.Item>Editar perfil</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item>Crear perfil</Breadcrumb.Item>
        )}
      </Breadcrumb>
      <Content className="site-layout">
        <Spin tip="Cargando..." spinning={loading}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <div style={{ padding: 24 }}>
              <Row>
                <Col span={24}>
                  {edit === true ? (
                    <Title level={3}>Editar perfil</Title>
                  ) : (
                    <Title level={3}>Crear perfil</Title>
                  )}
                </Col>
                <Divider style={{ marginTop: "2px" }} />
                <Col span={24}>
                  <Form
                    form={form}
                    onFinish={onFinish}
                    layout={"vertical"}
                    initialValues={{
                      id: "",
                      name: "",
                      perms: [],
                    }}
                    scrollToFirstError
                  >
                    <Row>
                      <Col lg={12} md={12} xs={24}>
                        {edit === true ? (
                          <Form.Item name="id" hidden>
                            <Input placeholder="Nombre" />
                          </Form.Item>
                        ) : null}

                        <Form.Item
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Por favor ingresa el nombre",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Nombre"
                            onChange={(value) =>
                              value.target.value.trim() === "" &&
                              form.resetFields()
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={12} md={12} xs={24}>
                        <div style={{ float: "right", marginBottom: "5px" }}>
                          <Form.Item>
                            <Button
                              style={{ marginRight: "5px" }}
                              onClick={() =>
                                router.push({
                                  pathname: "/config/groups",
                                })
                              }
                            >
                              Regresar
                            </Button>
                            <Button type="primary" htmlType="submit">
                              Guardar
                            </Button>
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                  {instruction === true ? (
                    <label>
                      Al seleccionar un permiso para crear, editar o eliminar,
                      deberá ir acompañado del permiso ver
                    </label>
                  ) : null}
                </Col>
              </Row>
              <Row style={{ marginTop: "15px" }}>
                <Col span={24}>
                  <Tabs type="card" onChange={handleChangeTab}>
                    <TabPane
                      tab="Permisos"
                      id="tabPermit"
                      name="tabPermit"
                      key="1"
                    >
                      <Col span={24}>
                        <Row gutter={10} style={{ marginTop: 10 }}> 
                          <Col span={6}>
                            <Checkbox
                              name="allCatalogs"
                              onClick={ (e) => checkAllpermisions(e.target.checked)}
                            >
                              Seleccionar todos los permisos
                            </Checkbox>
                          </Col>
                        </Row>
                        <Row gutter={10}>
                          <Col xl={12} md={12} sm={24} xs={24}>
                            <Table
                              pagination={false}
                              className={"mainTable"}
                              id="tableperms"
                              key="1"
                              size="small"
                              columns={columns_mod}
                              dataSource={views.filter(
                                (perm) => perm.module !== "Catalogos"
                              )}
                              locale={{
                                emptyText: "No se encontraron resultados.",
                              }}
                            />
                          </Col>
                          <Col xl={12} md={12} sm={24} xs={24}>
                            <Table
                              pagination={false}
                              className={"mainTable"}
                              id="tableperms"
                              key="2"
                              size="small"
                              columns={columns_cat}
                              dataSource={views.filter(
                                (perm) => perm.module === "Catalogos"
                              )}
                              locale={{
                                emptyText: "No se encontraron resultados.",
                              }}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </TabPane>
                    <TabPane
                      tab="Funcionalidades"
                      id="tabFunction"
                      name="tabFunction"
                      key="2"
                    >
                      <Col span={24}>
                      <Row gutter={10} style={{ marginTop: 10 }}> 
                          <Col span={6}>
                            <Checkbox
                              name="allfunctions"
                              onClick={ (e) => checkAllfunctions(e.target.checked)}
                            >
                              Seleccionar todas las funciones
                            </Checkbox>
                          </Col>
                        </Row>
                        <Row gutter={10}>
                          <Col xl={12} md={12} sm={24} xs={24}>
                            <Table
                              pagination={false}
                              className={"mainTable"}
                              id="tableperms"
                              key="3"
                              size="small"
                              columns={columns_functions}
                              dataSource={view_functions.filter(
                                (perm) =>
                                  perm.module === "Personas" ||
                                  perm.module === "Empresas" ||
                                  perm.module === "Prestamos" ||
                                  perm.module === "Vacaciones" ||
                                  perm.module === "Nómina" ||
                                  perm.module === "SolicitudCuentas"
                              )}
                              locale={{
                                emptyText: "No se encontraron resultados.",
                              }}
                            />
                          </Col>
                          <Col xl={12} md={12} sm={24} xs={24}>
                            {intranet_access ? (
                              <Table
                                pagination={false}
                                className={"mainTable"}
                                id="tableperms"
                                key="4"
                                size="small"
                                columns={columns_functions}
                                dataSource={view_functions.filter(
                                  (perm) =>
                                    perm.module === "Reportes" ||
                                    perm.module === "Incapacidad" ||
                                    perm.module === "Permisos" ||
                                    perm.module === "Dashboard"
                                )}
                                locale={{
                                  emptyText: "No se encontraron resultados.",
                                }}
                              />
                            ) : (
                              <Table
                                pagination={false}
                                className={"mainTable"}
                                id="tableperms"
                                key="4"
                                size="small"
                                columns={columns_functions}
                                dataSource={view_functions.filter(
                                  (perm) =>
                                    perm.module === "Reportes" ||
                                    perm.module === "Incapacidad" ||
                                    perm.module === "Permisos"
                                )}
                                locale={{
                                  emptyText: "No se encontraron resultados.",
                                }}
                              />
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </TabPane>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
      </Content>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    config: state.userStore.general_config,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState, { getProfileGroups })(withAuthSync(GroupAdd));
