import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Checkbox,
  Button,
  AutoComplete,
  Switch,
  InputNumber,
  Spin,
  message,
  Divider,
  Tabs,
  Table,
} from "antd";
import MainLayout from "../../../layout/MainLayout";
import Axios from "axios";
import { LOGIN_URL, APP_ID } from "../../../config/config";
import { withAuthSync } from "../../../libs/auth";

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const GroupAdd = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [edit, setEdit] = useState(false);
  const [perms, setPerms] = useState([]);
  const [getperms, setGetperms] = useState(false);
  const [permsFunction, setPermsFunction] = useState([]);

  const headers = {
    "client-id": APP_ID,
    "Content-Type": "application/json",
  };
  let data = {};

  const onFinish = (values) => {
    data = values;
    data.perms = perms;
    let lst = perms.concat(permsFunction);
    data.perms = lst;
    console.log("permisos seleccionados>>", data.perms);
    if (!edit) {
      saveGroup();
    } else {
      editGroup();
    }
  };

  const saveGroup = async () => {
    setLoading(true);

    Axios.post(LOGIN_URL + "/group/create/", data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          form.setFieldsValue({
            name: "",
            perms: [],
          });
          setPerms([]);
          router.push({ pathname: "/config/groups" });
          message.success({
            content: "Grupo guardado exitosamente!",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      })
      .catch(function (error) {
        message.error({
          content: "An error occurred",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        console.log(error);
      });
  };

  const editGroup = async () => {
    setLoading(true);

    Axios.post(LOGIN_URL + "/group/edit/", data, {
      headers: headers,
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          form.setFieldsValue({
            id: "",
            name: "",
            perms: [],
          });
          setPerms([]);
          router.push({ pathname: "/config/groups" });
          message.success({
            content: "Grupo editado exitosamente",
            className: "custom-class",
            style: {
              marginTop: "20vh",
            },
          });
        }
      })
      .catch(function (error) {
        message.error({
          content: "Ocurrió un error",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        console.log(error);
      });
  };

  const getGroup = async (id) => {
    setLoading(true);
    data = {
      id: id,
    };

    Axios.post(LOGIN_URL + "/group/get/", data, {
      headers: headers,
    })
      .then((response) => {
        if (response.status === 200) {
          let group = response.data.data;
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
          //setPerms(arrayperms);
          setPermsFunction(arrayfunctions);
          console.log("Permisos", perms);
          console.log("Functions", permsFunction);
          setPerms(arrayperms);
          setLoading(false);
          if (perms >= 0) {
            // setMostrar(true);
            setGetperms(true);
            checkPerms(group.perms);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const { id } = router.query;
    if (id !== undefined) {
      getGroup(id);
      setEdit(true);
    } else {
      setEdit(false);
      //   setMostrar(true);
    }
  }, []);

  function handleClick(e) {
    if (getperms == false) {
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
    { name: "Vacaciones", module: "Solicitudes", value: "people.vacation" },
    { name: "Permisos", module: "Solicitudes", value: "people.permit" },
    { name: "Incapacidad", module: "Solicitudes", value: "people.incapacity" },
    /*Recibos de Nomina */
    {
      name: "Recibos de nómina",
      module: "Nomina",
      value: "people.payrollvoucher",
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
    {
      name: "Configuración de préstamos",
      module: "Prestamos",
      value: "people.loan.function.configure_loan",
    },
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
    /* Recibos de nomina */
    {
      name: "Importar .xml",
      module: "Nomina",
      value: "people.payrollvoucher.function.import_payrollvoucher",
    },
  ];

  const checkPerms = (perms) => {
    if (perms.length > 0) {
      perms.forEach((element) => {
        var chkBox = document.getElementById(element);
        if (chkBox != "undefined") {
          if (chkBox.checked == false) {
            chkBox.click();
          }
        }
      });
      setGetperms(false);
    }
  };

  const columns = [
    {
      title: "Módulo",
      id: "modulo",
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
      title: "Funciones",
      id: "modulo",
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
    <MainLayout currentKey="3.2">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/config/groups">
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
                      <Col span={24}>
                        <div style={{ float: "right", marginBottom: "5px" }}>
                          <Form.Item span={24}>
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
                      <Col lg={18} md={18} xs={24}>
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
                          span={24}
                        >
                          <Input placeholder="Nombre" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Tabs type="card">
                    <TabPane
                      tab="People"
                      id="tabPeople"
                      name="tabPeople"
                      key="1"
                    >
                      <Col span={24}>
                        <Row>
                          <Col xl={12} md={12} sm={24} xs={24}>
                            <Table
                              pagination={false}
                              className={"mainTable"}
                              id="tableperms"
                              key="2"
                              size="small"
                              columns={columns}
                              dataSource={views}
                            />
                          </Col>
                          <Col xl={12} md={12} sm={24} xs={24}>
                            {view_functions.length > 0 ? (
                              <Table
                                pagination={false}
                                className={"mainTable"}
                                id="tableperms"
                                key="2"
                                size="small"
                                columns={columns_functions}
                                dataSource={view_functions}
                              />
                            ) : null}
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

export default withAuthSync(GroupAdd);
