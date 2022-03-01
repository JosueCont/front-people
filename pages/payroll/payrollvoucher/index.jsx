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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { useState } from "react";
import { withAuthSync } from "../../../libs/auth";
import { connect } from "react-redux";
import ModalUploadFileDrag from "../../../components/modal/ModalUploadFileDrag";
import { useEffect } from "react";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { messageError, messageUploadSuccess } from "../../../utils/constant";

const UploadPayroll = ({ ...props }) => {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [cfdi, setCfdi] = useState(null);

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
        return <span>{item.headers.rfc}</span>;
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
        console.log("TAX", props.taxRegime);
        setCompany(response.data.company);
        setCfdi(response.data.cfdis);
      })
      .catch((error) => {
        setLoading(false);
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
                  <Row justify="end" style={{ width: "100%" }}>
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
                        <PlusOutlined />
                        Nuevo
                      </Button>
                    </Col>
                  </Row>
                )}
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            {cfdi && (
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
            )}
          </Col>
        </Row>
      </Spin>
      {viewModal && (
        <ModalUploadFileDrag
          title={"Cargar xml"}
          visible={viewModal}
          setModal={setModal}
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

export default connect(mapState)(withAuthSync(UploadPayroll));
