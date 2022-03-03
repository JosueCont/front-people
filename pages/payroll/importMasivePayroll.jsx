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
import { messageError, messageUploadSuccess } from "../../utils/constant";

const ImportMasivePayroll = ({ ...props }) => {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [cfdi, setCfdi] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

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
        setCompany(response.data.company);
        setCfdi(response.data.cfdis);
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
        setCfdi(null);
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
                {cfdi && company ? (
                  <Col>
                    <Form
                      layout="vertical"
                      key="formFilter"
                      className={"formFilter"}
                    >
                      <Row gutter={[16, 6]}>
                        <Col style={{ display: "flex" }}>
                          <Form.Item label="Razon social">
                            <Input value={company.reason} />
                          </Form.Item>
                        </Col>
                        <Col style={{ display: "flex" }}>
                          <Form.Item label="RFC">
                            <Input value={company.rfc} />
                          </Form.Item>
                        </Col>
                        <Col style={{ display: "flex" }}>
                          <Form.Item label="Registro patronal">
                            <Input value={company.patronal_registration} />
                          </Form.Item>
                        </Col>
                        <Col style={{ display: "flex" }}>
                          <Form.Item label="Regimen fiscal">
                            <Input
                              value={
                                props.taxRegime.find(
                                  (item) => item.code === company.fiscal_regime
                                ).description
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col style={{ display: "flex" }}>
                          <Button
                            style={{
                              background: "#fa8c16",
                              fontWeight: "bold",
                              color: "white",
                              marginTop: "auto",
                            }}
                            onClick={() => {
                              setCfdi(null), setCompany(null), setFiles([]);
                            }}
                          >
                            Cancelar
                          </Button>
                        </Col>
                        <Col style={{ display: "flex" }}>
                          <Button
                            style={{
                              background: "#fa8c16",
                              fontWeight: "bold",
                              color: "white",
                              marginTop: "auto",
                            }}
                            onClick={() => setModal(true)}
                          >
                            Guardar
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
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
            {cfdi ? (
              <Card className="card_table">
                <Table
                  size="small"
                  columns={columns}
                  dataSource={cfdi}
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
              <Card className="">
                <div className={"ImportPayroll"}></div>
                <Row justify="center">
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
  };
};

export default connect(mapState)(withAuthSync(ImportMasivePayroll));
