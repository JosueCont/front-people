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
  Radio,
  Space,
  Switch,
} from "antd";
import { DollarCircleOutlined, PlusOutlined } from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
import { useRouter } from "next/router";
import { useState } from "react";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import ModalUploadFileDrag from "../../components/modal/ModalUploadFileDrag";
import { useEffect } from "react";
import WebApiPayroll from "../../api/WebApiPayroll";
import {
  messageError,
  messageSaveSuccess,
  messageUploadSuccess,
} from "../../utils/constant";
import SelectTypeTax from "../../components/selects/SelectTypeTax";
import { ruleRequired } from "../../utils/rules";

const ImportMasivePayroll = ({ ...props }) => {
  const router = useRouter();
  const [calendar] = Form.useForm();
  const [companyImport, setCompanyImport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [startDate, setStartDate] = useState(null);

  const columns = [
    {
      title: "Colaborador",
      render: (item) => {
        return <span>{item.headers.reason_receiver}</span>;
      },
      key: "reason_receiver",
    },
    {
      title: "RFC",
      render: (item) => {
        return <span>{item.headers.rfc_receiver}</span>;
      },
      key: "rfc",
    },
    {
      title: "Fecha inicio de pago",
      render: (item) => {
        return <span>{item.headers.payment_start_date}</span>;
      },
      key: "payment_start_date",
    },
    {
      title: "Fecha fin de pago",
      render: (item) => {
        return <span>{item.headers.payment_end_date}</span>;
      },
      key: "payment_end_date",
    },
    {
      title: "Departamento",
      render: (item) => {
        return <span>{item.headers.department}</span>;
      },
      key: "department",
    },
    {
      title: "Puesto",
      render: (item) => {
        return <span>{item.headers.job}</span>;
      },
      key: "job",
    },
  ];

  const setModal = (value) => {
    setViewModal(value);
  };

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
        calendar.setFieldsValue({
          period: response.data.cfdis[0].headers.payment_date.substring(0, 4),
          active: false,
        });
        setCompanyImport(response.data);
        console.log(response.data);
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
        setFiles([]);
        console.log(error);
      });
  };

  const PrintPeriods = ({ periods }) => {
    return (
      <>
        {periods.map((item, i) => {
          return (
            <Col>
              <Radio
                key={item.payment_start_date + i}
                value={item.payment_start_date}
              >
                {item.payment_start_date} - {item.payment_end_date}
              </Radio>
            </Col>
          );
        })}
      </>
    );
  };

  const onChangePeriod = (item) => {
    setStartDate(item.target.value);
  };

  const sendCreateCompany = async (data) => {
    data.periodicity = props.payment_periodicity.find(
      (item) => item.id === companyImport.periodicity
    ).id;
    data.start_date = startDate;
    data.perception_type = "8110942bdff9432aaf603f23006e2378";
    data.period = Number(data.period);
    companyImport.payment_calendar = data;
    delete companyImport["periodicity"];
    await WebApiPayroll.savePayrollMasiveXml(companyImport)
      .then((response) => {
        message.success(messageSaveSuccess);
      })
      .catch((error) => {
        message.error(messageError);
        console.log(error);
      });
  };

  return (
    <MainLayout currentKey={["recibos_nomina"]} defaultOpenKeys={["nómina"]}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Importar nómina</Breadcrumb.Item>
      </Breadcrumb>
      {alertMessage && (
        <Alert
          style={{ margin: "2%" }}
          type="error"
          message={<b>{alertMessage}</b>}
          banner
          closable
        />
      )}
      <Spin spinning={loading}>
        <Row justify="end" gutter={[10, 10]}>
          <Col span={24}>
            <Card className="form_header">
              <Row justify="space-between">
                {companyImport ? (
                  <>
                    <Col>
                      <Form
                        layout="vertical"
                        key="formFilter"
                        className={"formFilter"}
                      >
                        <Row gutter={[16, 6]}>
                          <Col style={{ display: "flex" }}>
                            <Form.Item label="Razon social">
                              <Input value={companyImport.company.reason} />
                            </Form.Item>
                          </Col>
                          <Col style={{ display: "flex" }}>
                            <Form.Item label="RFC">
                              <Input value={companyImport.company.rfc} />
                            </Form.Item>
                          </Col>
                          <Col style={{ display: "flex" }}>
                            <Form.Item label="Registro patronal">
                              <Input
                                value={
                                  companyImport.company.patronal_registration
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col style={{ display: "flex" }}>
                            <Form.Item label="Regimen fiscal">
                              <Input
                                value={
                                  props.taxRegime.find(
                                    (item) =>
                                      item.code ===
                                      companyImport.company.fiscal_regime
                                  ).description
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                      <Row style={{ width: "100%", padding: 10 }}>
                        <Col span={24}>
                          <h4>Fecha de inicio del calendario</h4>
                        </Col>
                        <Col span={24}>
                          <Radio.Group onChange={onChangePeriod}>
                            <PrintPeriods periods={companyImport.periods} />
                          </Radio.Group>
                        </Col>
                      </Row>
                      <Form
                        form={calendar}
                        layout="vertical"
                        key="formFilter"
                        className={"formFilter"}
                        onFinish={sendCreateCompany}
                      >
                        <Row gutter={[16, 6]}>
                          <Col style={{ display: "flex" }}>
                            <Form.Item
                              name={"name"}
                              label="Nombre de calendario"
                              rules={[ruleRequired]}
                            >
                              <Input value={companyImport.company.reason} />
                            </Form.Item>
                          </Col>
                          <Col style={{ display: "flex" }}>
                            <Form.Item label="Periocidad">
                              <Input
                                readOnly
                                value={
                                  props.payment_periodicity.find(
                                    (item) =>
                                      item.id === companyImport.periodicity
                                  ).description
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col style={{ display: "flex" }}>
                            <SelectTypeTax />
                          </Col>
                          <Col style={{ display: "flex" }}>
                            <Form.Item name="period" label="Periodo">
                              <Input type={"number"} readOnly />
                            </Form.Item>
                          </Col>

                          <Col style={{ display: "flex" }}>
                            <Form.Item name={"active"} label="¿Activo?">
                              <Switch />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24} justify="end">
                          <Space>
                            <Button
                              style={{
                                background: "#fa8c16",
                                fontWeight: "bold",
                                color: "white",
                                marginTop: "auto",
                              }}
                              onClick={() => {
                                setCompanyImport(null), setFiles([]);
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              style={{
                                background: "#fa8c16",
                                fontWeight: "bold",
                                color: "white",
                                marginTop: "auto",
                              }}
                              htmlType="submit"
                            >
                              Guardar
                            </Button>
                          </Space>
                        </Row>
                      </Form>
                    </Col>
                  </>
                ) : (
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
                )}
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            {companyImport ? (
              <Card className="card_table">
                <Table
                  size="small"
                  columns={columns}
                  dataSource={companyImport.cfdis}
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
            ) : (
              <Card>
                <div className={"ImportPayroll"}></div>
                <Row justify="center" style={{ marginTop: "-40px" }}>
                  <div style={{ width: "50%", textAlign: "center" }}>
                    <span style={{ fontSize: "20px" }}>
                      <b>Importa tus recibos aquí</b>
                    </span>
                    <p style={{ fontSize: "15px" }}>
                      Se analizará la información de tus archivos, se creará la
                      empresa, información de los empleados y sus pagos de
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
            )}
          </Col>
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
  };
};

export default connect(mapState)(withAuthSync(ImportMasivePayroll));
