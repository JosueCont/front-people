import {
  Table,
  Breadcrumb,
  Button,
  Row,
  Col,
  Form,
  Card,
  Spin,
  message,
  Input,
  Alert,
  Select, Space,
} from "antd";
import {
  DollarCircleOutlined,
  PlusOutlined,
  LeftCircleTwoTone,
  RightCircleTwoTone,
} from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
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
import {getTypeTax} from "../../../redux/fiscalDuck"
import _ from 'lodash'



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
        return <span>{item.headers.rfc_receiver}</span>;
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
    getTypeTax()
  },[])

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
      sendFiles(data);
    }
  }, [files]);

  const sendFiles = (data) => {
    WebApiPayroll.importPayrollMasiveXml(data)
      .then((response) => {
        setLoading(false);
        message.success(messageUploadSuccess);
        setXmlImport(response.data);
      })
      .catch((error) => {
        setLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message &&
          error.response.data.message.includes("Se detectó")
        )
          setAlertMessage(error.response.data.message);
        else message.error(messageError);
        // setFiles([]);
        console.log(error);
      });
  };

  const processResponseSave=(response)=>{

    let company_list = _.get(response,'data.companies.company_list',[]);
    let notSaved = [] // empresas no guardadas
    if(company_list.length>0){
        notSaved = company_list.filter((ele)=>!ele.saved)
        console.log(notSaved)
    }

    if(notSaved.length>0){
      message.error(`${messageError}, por favor valide los datos requeridos. [detalle: ${_.map(notSaved,'message')}]`);
    }else{
      // si no encontramos errores en la lista de saved
      message.success(messageSaveSuccess);
    }


    console.log(response.data.companies)

    setLoading(false);
  }

  const validateBeforeSubmit=()=>{
      xmlImport.companies.map((company1,i)=>{
        console.log(company1.patronal_registrations)
      })
    return false;
  }

  const saveImportPayrroll = async () => {
    if (files.length > 0) {
      setLoading(true);
      let form_data = new FormData();
      files.map((item) => {
        form_data.append("File", item.originFileObj);
      });
      form_data.append("export", "False");
      form_data.append("save", "True");
      form_data.append("payroll", JSON.stringify(xmlImport));
      console.log(xmlImport);
      WebApiPayroll.importPayrollMasiveXml(form_data)
        .then((response) => {
          processResponseSave(response)
        })
        .catch((error) => {
          message.error(messageError);
          console.log(error);
          setLoading(false);
        });
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

  return (
    <MainLayout currentKey={["importxml"]} defaultOpenKeys={["payroll"]}>
      {props.currentNode && (
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => router.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Importar nómina</Breadcrumb.Item>
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
              <Form.Item label="Empresa">
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
                <Form.Item label="Registro patronal">
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
                <Button onClick={() => saveImportPayrroll()}>
                  Guardar
                </Button>
              </Space>
            </Row>

            )}


        <Row justify="end" gutter={[10, 10]}>
          {xmlImport && companySelect != null && patronalSelect != null ? (
            <>
              <Col span={24}>
                <Card className={'form_header_black'}>
                  <Row justify="space-between">
                    <Row style={{ width: "100%" }}>
                      <Col span={18} style={{ display: "" }}>
                        <span
                          style={{
                            color: "white",
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
                                    xmlImport.companies[companySelect].company
                                      .reason
                                  }
                                />
                              </Form.Item>
                            </Col>
                            <Col style={{ display: "flex" }}>
                              <Form.Item label="RFC">
                                <Input
                                  value={
                                    xmlImport.companies[companySelect].company
                                      .rfc
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
                                              .company.fiscal_regime
                                        ).description
                                      : ""
                                  }
                                />
                              </Form.Item>
                            </Col>
                            {xmlImport.companies[companySelect]
                              .patronal_registrations && (
                              <>
                                <Col style={{ display: "flex" }}>
                                  <Form.Item label="Registro patronal">
                                    <Input
                                      readOnly
                                      value={
                                        patronals.length > 0
                                          ? patronals[patronalSelect].label
                                          : ""
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                                <Col style={{ display: "flex" }}>
                                  <Form.Item label="Nombre de sucursal">
                                    <Input
                                      value={
                                        xmlImport.companies[companySelect]
                                          .patronal_registrations[
                                          patronalSelect
                                        ].branch_node
                                      }
                                      onChange={(value) =>{
                                        xmlImport.companies[
                                            companySelect
                                            ].patronal_registrations[
                                            patronalSelect
                                            ].branch_node = value.target.value;

                                        setXmlImport({...xmlImport})
                                      }
                                      }
                                    />
                                  </Form.Item>
                                </Col>
                              </>
                            )}
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
                            color: "white",
                            fontSize: "30px",
                            fontWeight: "bold",
                          }}
                        >
                          <DollarCircleOutlined /> Recibos de nómina
                        </span>
                      </Col>
                      <Col span={2} style={{ display: "flex" }}>
                        <Button
                          style={{
                            background: "#fa8c16",
                            fontWeight: "bold",
                            color: "white",
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
                  <div
                    onClick={() => setModal(true)}
                    className={"ImportPayroll"}
                  ></div>
                  <Row justify="center" style={{ marginTop: "-30px" }}>
                    <div style={{ width: "50%", textAlign: "center" }}>
                      <span style={{ fontSize: "20px" }}>
                        <b>Importa tus recibos aquí</b>
                      </span>
                      <p style={{ fontSize: "15px" }}>
                        Se analizará la información de tus archivos, se creará
                        la empresa, información de los empleados y sus pagos de
                        nómina.
                      </p>
                      <Button
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
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
  };
};

export default connect(mapState, {getTypeTax})(withAuthSync(ImportMasivePayroll));
