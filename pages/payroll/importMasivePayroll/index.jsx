import {
  Table,
  Breadcrumb,
  Button,
  Row,
  Col,
  Form,
  Card,
  Spin,
  Modal,
  message,
  Input,
  Alert,
  Statistic,
  Select,
  Space,
  Switch,
} from "antd";
import {
  DollarCircleOutlined,
  PlusOutlined,
  LeftCircleTwoTone,
  RightCircleTwoTone,
} from "@ant-design/icons";
import MainLayout from "../../../layout/MainInter";
import { useRouter } from "next/router";
import { useState } from "react";
import { withAuthSync } from "../../../libs/auth";
import { connect } from "react-redux";
import ModalUploadFileDrag from "../../../components/modal/ModalUploadFileDrag";
import { useEffect } from "react";
import WebApiPayroll from "../../../api/WebApiPayroll";
import {
  messageError,
  messageSaveSuccess,
  messageUploadSuccess,
} from "../../../utils/constant";
import CalendarImport from "./components/calendarImport";
import GenericModal from "../../../components/modal/genericModal";
import { getTypeTax } from "../../../redux/fiscalDuck";
import _ from "lodash";
import { verifyMenuNewForTenant } from "../../../utils/functions";
import { orange } from "@material-ui/core/colors";
import { CheckOutlined, CloseOutlined } from "@material-ui/icons";
import SelectPaymentCalendar from "../../../components/selects/SelectPaymentCalendar";
import moment from "moment";

const ImportMasivePayroll = ({ getTypeTax, ...props }) => {
  const router = useRouter();
  const [xmlImport, setXmlImport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [patronals, setPatronals] = useState([]);
  const [companySelect, setCompanySelect] = useState(null);
  const [patronalSelect, setPatronalSelect] = useState(0);
  const [person, setPerson] = useState([]);

  //resumen de datos
  const [resumeData, setResumeData] = useState(null);
  const [visibleResumeModal, setVisibleResumemodal] = useState(false);
  const [visibleRegPatronalSelect, setVisibleRegPatronalSelect] = useState(false)
  const [isAddXMLS, setIsAddXMLS] = useState(false) // para saber si la vista se comportará como añadir xmls a calendario existente
  const [calendarSelected, setCalendarSelected] = useState(null)

  // Modal respuesta del import
  const [titileMessage, setTitleMessage] = useState("");
  const [visibleMessageModal, setVisibleMessageModal] = useState(false);
  const [successImport, setSuccessImport] = useState(true);
  const [descriptionImport, setDescriptionImport] = useState(
    "Serás redireccionado al listado de empresas"
  );
  const [importError, setImportError] = useState([]);

  const columns = [
    {
      title: "Colaborador",
      render: (item) => {
        return <span>{item.headers.name}</span>;
      },
      key: (item) => {
        return item.headers.name;
      },
    },
    {
      title: "RFC",
      render: (item) => {
        return <span>{item.headers.rfc}</span>;
      },
      key: (item) => {
        return item.headers.rfc;
      },
    },
    {
      title: "Fecha inicio de pago",
      render: (item) => {
        return <span>{item.headers.payment_start_date}</span>;
      },
      key: (item) => {
        return item.headers.curp;
      },
    },
    {
      title: "Fecha fin de pago",
      render: (item) => {
        return <span>{item.headers.payment_end_date}</span>;
      },
      key: (item) => {
        return item.headers.curp + 1;
      },
    },
    {
      title: "Departamento",
      render: (item) => {
        return <span>{item.headers.department}</span>;
      },
      key: (item) => {
        return item.headers.department;
      },
    },
  ];

  const setModal = (value) => {
    setViewModal(value);
  };

  useEffect(()=>{

    if(router?.query){
      if(router?.query?.action==='addxmls'){
        setIsAddXMLS(true)

      }else{
        setIsAddXMLS(false)
      }
    }

  },[router?.query])

  useEffect(() => {
    getTypeTax();
  }, []);

  useEffect(() => {
    if (xmlImport) {
      setCompanies(
        xmlImport.companies.map((item, i) => {
          return { label: item.company.reason, value: i };
        })
      );
      setCompanySelect(0);
    }
  }, [xmlImport]);

  useEffect(() => {
    setPatronals([]);
    if (companySelect != null && companySelect != undefined) {
      if (xmlImport.companies[companySelect].patronal_registrations) {
        setPatronals(
          xmlImport.companies[companySelect].patronal_registrations.map(
            (p, e) => {
              return { label: p.patronal_registration, value: e };
            }
          )
        );
      }
    }
  }, [companySelect]);

  useEffect(() => {
    if (files.length > 0) {
      setLoading(true);
      let data = new FormData();
      files.map((item) => {
        data.append("File", item.originFileObj);
      });
      data.append("export", "False");
      if(isAddXMLS){

        if(!calendarSelected){
          message.error('Es requerido elegir un calendario')
          setLoading(false);
          return
        }

        data.append("node_id", props?.currentNode?.id)
        data.append("calendar_id", calendarSelected)
      }

      sendFiles(data);
    }
  }, [files]);

  const processResume = (data) => {
    let numCompanies = data.companies.length;
    let numRegPatronales = 0;
    let numXML = 0;
    let extraordinary = 0;

    //buscamos cuantos registros patronales se cargaron
    data.companies.map((company) => {
      if (_.get(company, "patronal_registrations", null)) {
        numRegPatronales =
          numRegPatronales + company?.patronal_registrations?.length;
      }
    });

    //buscamoscuantos xmls se cargaron
    data.companies.forEach((company) => {
      if (_.get(company, "patronal_registrations", null)) {
        company.patronal_registrations.forEach((regPatr, i) => {
          console.log("company?.extraordinary", regPatr?.extraordinary);
          extraordinary =
            extraordinary +
            (regPatr?.extraordinary ? regPatr?.extraordinary?.length : 0);

          regPatr.periodicities.forEach((periodicity, i) => {
            console.log(periodicity?.cfdis.length);
            numXML =
              numXML + (periodicity?.cfdis ? periodicity?.cfdis.length : 0);
          });
        });
      }

      if (_.get(company, "periodicities", null)) {
        company.periodicities.map((periodicity, i) => {
          console.log(periodicity?.cfdis.length);
          numXML =
            numXML + (periodicity?.cfdis ? periodicity?.cfdis.length : 0);
        });
      }

      if (_.get(company, "extraordinary", null)) {
        extraordinary += company.extraordinary.length;
      }
    });

    let resume = {
      numCompanies,
      numRegPatronales,
      numXML,
      extraordinary,
    };

    setResumeData(resume);
    setVisibleResumemodal(true);
  };

  const DataDetailImport = () => {
    return (
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Empresas" value={resumeData?.numCompanies} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Registros Patronales"
            value={resumeData?.numRegPatronales}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="xml Importados"
            value={resumeData?.numXML + resumeData?.extraordinary}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Extraordinarios"
            value={resumeData?.extraordinary}
          />
        </Col>
      </Row>
    );
  };

  const ModalResumeData = () => {
    return (
      <Modal
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => setVisibleResumemodal(false)}
          >
            Aceptar
          </Button>,
        ]}
        title="Resumen de datos importados"
        visible={visibleResumeModal}
        onOk={() => setVisibleResumemodal(false)}
        onCancel={() => setVisibleResumemodal(false)}
      >
        <DataDetailImport />
      </Modal>
    );
  };

  const sendFiles = (data) => {
    WebApiPayroll.importPayrollMasiveXml(data)
      .then((response) => {
        if(response?.data?.companies && response?.data?.companies.length>0){
          message.success(messageUploadSuccess);
          console.log("DATA IMPORT ->", response.data);
          setXmlImport(response.data);
          processResume(response.data);
        }else{
          message.error("No se pudo procesar la información, asegurate que los recibos sean correspondientes a la misma empresa o al mismo periodo");
          setLoading(false);
          return;
        }
        setLoading(false);

      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.message)
          setAlertMessage(error.response.data.message);
        else message.error(messageError);
        // setFiles([]);
        console.log(error);
      });
  };

  useEffect(() => {
    console.log("descriptionImport", descriptionImport);
  }, [descriptionImport]);

  const selectCompany=(company_index, regPatronal_index)=>{
      setCompanySelect(company_index)
      if(regPatronal_index){
        setPatronalSelect(regPatronal_index)
      }
      setVisibleMessageModal(false);
  }

  const processResponseSave = (response) => {
    let company_list = _.get(response, "data.companies.company_list", []);
    let notSaved = []; // empresas no guardadas
    if (company_list.length > 0) {
      notSaved = company_list.filter((ele) => !ele.saved);
    }

    if (notSaved.length > 0) {
      setSuccessImport(false);
      let description = `${messageError}, por favor valide los datos requeridos. [detalle: ${_.map(
        notSaved,
        "message"
      )}]`;
      setTitleMessage("Ocurrió un error");
      setDescriptionImport(description);
      setVisibleMessageModal(true);
    } else {
      let calendars = [];
      company_list.map((comp) => {
        comp?.calendars &&
          comp.calendars.map((c) => {
            calendars.push({
              company: comp,
              calendar: c,
            });
          });
      });

      let calendar_not_saved = calendars.filter((elem) => !elem.calendar.saved);
      let calendar_saved = calendars.filter((elem) => elem.calendar.saved);

      if (calendar_not_saved.length > 0) {
        let text = "";
        calendar_not_saved.map((item) => {
          if (text != "") {
            let desc =
              item.calendar.name +
              ": " +
              (item.calendar.message != ""
                ? item.calendar.message
                : "Error al guardar");
            text = text + ", " + " - " + desc;
          } else {
            text =
              item.calendar.name +
              ": " +
              (item.calendar.message != ""
                ? item.calendar.message
                : "Error al guardar");
          }
        });
        if (calendar_saved.length > 0) {
          setSuccessImport(true);
        } else {
          setSuccessImport(false);
        }

        setTitleMessage("Importación incompleta");
        // setInfoGenericModal();
        setDescriptionImport(text);
      } else {
        setSuccessImport(true);
        // si no encontramos errores en la lista de saved
        let description = `${company_list.length} Empresas y ${calendars.length} Calendarios guardados correctamente.`;
        setTitleMessage("Importación correcta");
        setDescriptionImport(description);
      }
      setVisibleMessageModal(true);
    }

    console.log(response.data.companies);

    setLoading(false);
  };

  const ProccessMessageIsValid = () => {
    return (
      <Col span={24}>
        {importError.map((e) => (
          <Row
            style={{
              padding: 10,
              backgroundColor: "#fffbe6",
              border: "1px solid #ffe58f",
              borderRadius: 5,
              marginBottom: 10,
            }}
          >
            <Col span={24} style={{ fontWeight: "bold" }}>
             <a onClick={()=> selectCompany(e.company_index)}>Empresa: {e.company} | RFC: {e.rfc}  </a>
            </Col>
            {e.calendars &&
              e.calendars.map((c, idx) => (
                <Row>
                  {c.patronal_registration && (
                    <Col span={24} style={{ fontWeight: "bold" }}>
                      <a onClick={()=> selectCompany(e.company_index, c.regP_index)}>Registro patronal: {c.patronal_registration}{" "}</a>
                    </Col>
                  )}
                  <Col span={24} style={{}}>
                    Calendario:{" "}
                    {c.periodicity_type == "03"
                      ? "Catorcenal"
                      : c.periodicity_type == "04"
                      ? "Quincenal"
                      : c.periodicity_type == "05"
                      ? "Mensual"
                      : "Otra periocidad"}
                    {""}
                  </Col>

                  <ul>
                    {c.errors &&
                      c.errors.map((error) => <li span={24}>{error}</li>)}
                  </ul>
                </Row>
              ))}
          </Row>
        ))}
      </Col>
    );
  };

  useEffect(() => {
    if (importError && importError.length > 0) {
    }
  }, [importError]);

  // const validateBeforeSubmit = () => {
  //   xmlImport.companies.map((company1, i) => {
  //     console.log(company1.patronal_registrations);
  //   });
  //   return false;
  // };
  const validateBeforeSubmit = () => {
    let companies_errors = [];
    console.log("Errors->", companies_errors);
    xmlImport.companies.map((company,index) => {
      let company_error = {
        rfc: company?.company?.rfc,
        company: company?.company?.reason,
        company_index: index,
        calendars: [],
      };
      if (company.patronal_registrations) {
        company.patronal_registrations.map((reg_pat,regP_index) => {
          if (reg_pat.periodicities && reg_pat.periodicities.length > 0) {
            reg_pat.periodicities.map((periodicity) => {
              let calendar = {
                patronal_registration: reg_pat.patronal_registration,
                regP_index: regP_index,
                errors: [],
              };
              calendar.periodicity_type = periodicity.periodicity_code;
              calendar.errors = [];
              if (periodicity.calendar) {
                if(isAddXMLS){
                  periodicity.calendar.name = periodicity.name ? periodicity.name  : "";
                  periodicity.calendar.start_date = periodicity.start_date ? periodicity.start_date  : "";
                  periodicity.calendar.type_tax = periodicity.type_tax ? periodicity.type_tax  : "";
                  periodicity.calendar.salary_days = periodicity.salary_days ? periodicity.salary_days  : "";
                  periodicity.calendar.activation_date = periodicity.activation_date ? periodicity.activation_date  : "";
                  periodicity.calendar.id = periodicity.id ? periodicity.id  : "";
                }
                if (periodicity.calendar.name == "") {
                  calendar.errors.push("Nombre es requerido");
                }
                if (periodicity.calendar.start_date == "") {
                  calendar.errors.push("Fecha de inicio es requerido");
                }
                if (periodicity.calendar.type_tax == "") {
                  calendar.errors.push("Tipo de impuesto es requerido");
                }
                if (periodicity.calendar.activation_date == "") {
                  calendar.errors.push("Fecha de activación es requerido");
                }

                if (periodicity.calendar.salary_days == "") {
                  calendar.errors.push("Días a pagar");
                }
                if (calendar.errors.length > 0)
                  company_error.calendars.push(calendar);
              } else {
                calendar.errors.push("No se encontraron datos del calendario");
                company_error.calendars.push(calendar);
              }
            });
          } else {
            let calendar = {
              patronal_registration: reg_pat.patronal_registration,
              errors: [],
            };
            calendar.errors.push("No se encontraron períodos de pagos");
            company_error.calendars.push(calendar);
          }
        });
      } else if (company.periodicities && company.periodicities.length > 0) {
        company.periodicities.map((periodicity) => {
          let calendar = {
            errors: [],
          };
          calendar.periodicity_type = periodicity.periodicity_code;
          calendar.errors = [];
          if (periodicity.calendar) {
            if (periodicity.calendar.name == "") {
              calendar.errors.push("Nombre es requerido");
            }
            if (periodicity.calendar.start_date == "") {
              calendar.errors.push("Fecha de inicio es requerido");
            }
            if (periodicity.calendar.activation_date == "") {
              calendar.errors.push("Fecha de activación es requerido");
            }
            if (periodicity.calendar.type_tax == "") {
              calendar.errors.push("Tipo de impuesto es requerido");
            }
            if (calendar.errors.length > 0)
              company_error.calendars.push(calendar);
          } else {
            calendar.errors.push("Completa los datos del calendario");
            company_error.calendars.push(calendar);
          }
        });
      } else {
        let calendar = {
          errors: [],
        };
        calendar.errors.push("No se encontraron períodos de pagos");
        company_error.calendars.push(calendar);
      }

      if (company_error.calendars.length > 0) {
        companies_errors.push(company_error);
      }
    });
    if (companies_errors.length > 0) {
      setImportError(companies_errors);
      return false;
    }
    setImportError([]);
    return true;
  };

  const saveImportPayrroll = async () => {
    if (files.length > 0) {
      const validated = validateBeforeSubmit();

      if (!validated) {
        setSuccessImport(false);
        setTitleMessage("Campos faltantes");
        setDescriptionImport("Complete los campos del calendario");
        setVisibleMessageModal(true);
      } else {
        xmlImport.companies.forEach((c)=>{
           if(!c.company.hasOwnProperty("use_internal_concepts")){
             c.company.use_internal_concepts = false;
           }
        });

        setLoading(true);
        let form_data = new FormData();
        files.map((item) => {
          form_data.append("File", item.originFileObj);
        });
        form_data.append("export", "False");
        form_data.append("save", "True");
        form_data.append("payroll", JSON.stringify(xmlImport));
        form_data.append("person_id", props.user.id);

        WebApiPayroll.importPayrollMasiveXml(form_data)
          .then((response) => {
            processResponseSave(response);
          })
          .catch((error) => {
            message.error(messageError);
            console.log(error);
            setLoading(false);
          });
      }
    }
  };

  const downloadReport = () => {
    WebApiPayroll.getPayrollReport()
      .then((response) => {
        const type = response.headers["content-type"];
        const blob = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Personas.xlsx";
        link.click();
      })
      .catch((error) => {
        message.error(messageError);
      });
  };

  const nextPrev = (value) => {
    if (value)
      companySelect < xmlImport.companies.length - 1 &&
        setCompanySelect(companySelect + 1);
    else companySelect > 0 && setCompanySelect(companySelect - 1);
    setPatronalSelect(0);
  };

  const onCancel = () => {
    setXmlImport(null);
    setLoading(false);
    setFiles([]);
    setViewModal(false);
    setAlertMessage(null);
    setPatronals([]);
    setCompanySelect(null);
    setPatronalSelect(0);
  };

  const NameSuc = ({ name = "" }) => {
    return (
      <Form.Item label="Nombre de sucursal">
        <Input
          defaultValue={name}
          onChange={(value) => {
            xmlImport.companies[companySelect].patronal_registrations[
              patronalSelect
            ].branch_node = value.target.value;
          }}
        />
      </Form.Item>
    );
  };

  const UseInternalConcept = ({ use = false }) => {
    return (
        <Form.Item label="Utilizar conceptos internos del sistema en lugar de los míos.">
            <Switch
              defaultChecked={use}
              checkedChildren="Si"
              unCheckedChildren="No"
              onChange={(value) => {
                xmlImport.companies[companySelect].company.use_internal_concepts =
                  value;
              }}
            />
        </Form.Item>
    );
  };

  return (
    <MainLayout
      currentKey={["importMassivePayroll"]}
      defaultOpenKeys={["managementRH", "payroll"]}
    >
      {props.currentNode && (
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => router.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          {verifyMenuNewForTenant() && (
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
          )}
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Importar nómina con XML</Breadcrumb.Item>
        </Breadcrumb>
      )}
      {alertMessage && (
        <Alert
          style={{ margin: "2%" }}
          type="error"
          message={<b>{alertMessage}</b>}
          banner
          closable
        />
      )}

      {/* <ModalSuccessImport /> */}
      <ModalResumeData />

      {xmlImport && (
        <Form layout="vertical">
          <Row align="center" style={{ width: "100%" }}>
            <Col align="center" span={1}>
              <Form.Item label="Anterior">
                <LeftCircleTwoTone
                  onClick={() => nextPrev(false)}
                  style={{ fontSize: "32px" }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                extra={
                  companies && companies.length > 1
                    ? `${companySelect + 1}/${companies.length}`
                    : ""
                }
                label="Empresa"
              >
                <Select
                  options={companies}
                  size="middle"
                  placeholder="Seleccionar empresa"
                  value={companySelect}
                  onChange={(value) => {
                    setCompanySelect(value), setPatronalSelect(0);
                  }}
                />
              </Form.Item>
            </Col>
            <Col align="center" span={1}>
              <Form.Item label="Siguiente">
                <RightCircleTwoTone
                  onClick={() => nextPrev(true)}
                  style={{ fontSize: "32px" }}
                />
              </Form.Item>
            </Col>
          </Row>
          {patronals.length > 0 && (
            <Row align="center" style={{ width: "100%" }}>
              <Col span={3}>
                <Form.Item
                  extra={
                    patronals && patronals.length > 1
                      ? `${patronalSelect + 1}/${patronals.length}`
                      : ""
                  }
                  label="Registro patronal"
                >
                  <Select
                    options={patronals}
                    size="middle"
                    placeholder="Seleccionar registro patronal"
                    value={patronalSelect}
                    onChange={(value) => setPatronalSelect(value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      )}

      <Spin spinning={loading}>
        {xmlImport && companySelect != null && patronalSelect != null && (
          <Row justify="end">
            <Space>
              <Button onClick={() => onCancel()}>Cancelar</Button>
              <Button onClick={() => saveImportPayrroll()}>Guardar</Button>
            </Space>
          </Row>
        )}

        <Row justify="end" gutter={[10, 10]}>
          {xmlImport && companySelect != null && patronalSelect != null ? (
            <>
              <Col span={24}>
                <Card className={"form_header_black"}>
                  <Row justify="space-between">
                    <Row style={{ width: "100%" }}>
                      <Col span={18} style={{ display: "" }}>
                        <span
                          style={{
                            fontSize: "25px",
                            fontWeight: "bold",
                          }}
                        >
                          Empresa
                        </span>
                        <Form layout="vertical" className={"formFilter"}>
                          <Row gutter={[24, 6]}>
                            <Col style={{ display: "flex" }}>
                              <Form.Item label="Razon social">
                                <Input
                                  value={
                                    xmlImport.companies[companySelect]?.company
                                      ?.reason
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col style={{ display: "flex" }}>
                              <Form.Item label="RFC">
                                <Input
                                  value={
                                    xmlImport.companies[companySelect]?.company
                                      ?.rfc
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col style={{ display: "flex" }}>
                              <Form.Item label="Régimen fiscal">
                                <Input
                                  value={
                                    props.taxRegime.length > 0
                                      ? props.taxRegime.find(
                                          (item) =>
                                            item.code ===
                                            xmlImport.companies[companySelect]
                                              ?.company?.fiscal_regime
                                        )?.description
                                      : ""
                                  }
                                />
                              </Form.Item>
                            </Col>
                            {xmlImport.companies[companySelect]
                              ?.patronal_registrations && (
                              <>
                                <Col style={{ display: "flex" }}>
                                  <Form.Item label="Registro patronal">
                                    <Input
                                      readOnly
                                      value={
                                        patronals.length > 0
                                          ? patronals[patronalSelect]?.label
                                          : ""
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                {
                                  !isAddXMLS && <Col style={{ display: "flex" }}>
                                      <NameSuc
                                          name={
                                            xmlImport.companies[companySelect]
                                                ?.patronal_registrations[patronalSelect]
                                                ?.branch_node
                                          }
                                      />
                                    </Col>
                                }

                              </>
                            )}
                            {
                                !isAddXMLS && <Col style={{ display: "flex" }}>
                                  <UseInternalConcept use={xmlImport.companies[companySelect].company.use_internal_concepts}/>
                                </Col>
                            }
                            {/* <Col style={{ display: "flex" }}>
                              <Form.Item label="Usar conceptos del sistema">
                                <UseInternalConcept
                                  use={
                                    xmlImport.companies[companySelect]
                                      .use_internal_concepts
                                  }
                                  name={"internal_concept"}
                                />
                              </Form.Item>
                            </Col> */}
                          </Row>
                        </Form>
                      </Col>
                    </Row>
                  </Row>
                </Card>
              </Col>
              <CalendarImport
                patronalSelect={patronalSelect}
                company={xmlImport.companies[companySelect]}
                paymentPeriodicity={props.payment_periodicity}
                setPerson={setPerson}
                isAddXMLS={isAddXMLS}
                companies={xmlImport.companies}
                periodicities
                perceptions_type={props.perceptions_type}
              />

              <Col span={24}>
                <Card className="card_table">
                  <Table
                    size="small"
                    columns={columns}
                    dataSource={person}
                    loading={loading}
                    scroll={{ x: 350 }}
                    locale={{
                      emptyText: loading
                        ? "Cargando..."
                        : "No se encontraron resultados.",
                    }}
                    className={"mainTable headers_transparent"}
                  />
                </Card>
              </Col>
            </>
          ) : (
            <>
              <Col span={24}>
                <Card className="form_header">
                  <Row justify="space-between">
                    <Row style={{ width: "100%" }}>
                      <Col span={18} style={{ display: "" }}>
                        <span
                          style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                          }}
                        >

                          <DollarCircleOutlined />
                          {
                            isAddXMLS ? ' Añadir nómina a calendario existente': ' Recibos de nómina'
                          }
                        </span>
                      </Col>
                      <Col span={2} style={{ display: "flex" }}>
                        <Button
                          style={{
                            background: "#fa8c16",
                            fontWeight: "bold",
                            marginTop: "auto",
                          }}
                          onClick={() => setModal(true)}
                        >
                          <PlusOutlined />
                          Importar nómina
                        </Button>
                      </Col>
                    </Row>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card>
                  {
                    isAddXMLS && <Row>
                        <Col span={6}>
                          <SelectPaymentCalendar style={{width:'100%'}}  setCalendarId={(calendar)=>setCalendarSelected(calendar)} />
                        </Col>
                      </Row>
                  }


                  <div
                    onClick={() => setModal(true)}
                    className={"ImportPayroll"}
                  ></div>
                  <Row justify="center" style={{ marginTop: "-30px" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                      <span style={{ fontSize: "20px" }}>
                        <b>Importa tus recibos aquí</b>
                      </span>
                      {
                        isAddXMLS ?  <p style={{ fontSize: "15px" }}>
                          Se analizará la información de tus archivos, y se añadirá a un calendario seleccionado.
                        </p>  :  <p style={{ fontSize: "15px" }}>
                          Se analizará la información de tus archivos, se creará
                          la empresa, información de los empleados y sus pagos de
                          nómina.
                        </p>
                      }

                      <Button
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          marginTop: "auto",
                        }}
                        onClick={() => setModal(true)}
                      >
                        <PlusOutlined />
                        Importar nómina
                      </Button>
                    </div>
                  </Row>
                </Card>
              </Col>
            </>
          )}
        </Row>
      </Spin>
      {viewModal && (
        <ModalUploadFileDrag
          title={"Cargar xml"}
          visible={viewModal}
          setVisible={setModal}
          setFiles={setFiles}
        />
      )}

      {visibleMessageModal && (
        <GenericModal
          visible={visibleMessageModal}
          setVisible={(value) => setVisibleMessageModal(value)}
          title={titileMessage}
          width="50%"
          titleActionButton="Aceptar"
          actionButton={() => {
            successImport
              ? router.push({ pathname: "/select-company" })
              : setVisibleMessageModal(false);
          }}
          viewActionButtonCancell={successImport ? false : true}
        >
          <>
            {importError && importError.length > 0 ? (
              <ProccessMessageIsValid />
            ) : (
              <Alert message={descriptionImport} type="info" />
            )}
          </>
        </GenericModal>
      )}
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    taxRegime: state.fiscalStore.tax_regime,
    payment_periodicity: state.fiscalStore.payment_periodicity,
    type_tax: state.fiscalStore.type_tax,
    perceptions_type: state.fiscalStore.cat_perceptions,
    user: state.userStore.user,
  };
};

export default connect(mapState, { getTypeTax })(
  withAuthSync(ImportMasivePayroll)
);
