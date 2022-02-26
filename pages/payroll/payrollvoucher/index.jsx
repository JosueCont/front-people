import { Table, Breadcrumb, Button, Row, Col, Form, Tooltip, Card } from "antd";
import { PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { useState } from "react";
import { withAuthSync } from "../../../libs/auth";
import { connect } from "react-redux";
import ModalUploadFileDrag from "../../../components/modal/ModalUploadFileDrag";

const UploadPayroll = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  const columns = [
    {
      title: "Colaborador",
      dataIndex: "reason_receiver",
      key: "reason_receiver",
    },
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
    },
    {
      title: "Fecha inicio de pago",
      dataIndex: "payment_start_date",
      key: "payment_start_date",
    },
    {
      title: "Fecha fin de pago",
      dataIndex: "payment_end_date",
      key: "payment_end_date",
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Puesto",
      dataIndex: "job",
      key: "job",
    },
  ];

  const getFileExtension = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
  };

  const setModal = (value) => {
    setViewModal(value);
  };

  const onFinish = (value) => {};

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
      <Row justify="end" gutter={[10, 10]}>
        <Col span={24}>
          <Card className="form_header">
            <Row justify="space-between">
              <Col>
                <Form
                  size="large"
                  name="filter"
                  onFinish={onFinish}
                  layout="vertical"
                  key="formFilter"
                  className={"formFilter"}
                  form={form}
                >
                  <Row gutter={[24, 8]}>
                    <Col style={{ display: "flex" }}>
                      <Button
                        style={{
                          background: "#fa8c16",
                          fontWeight: "bold",
                          color: "white",
                          marginTop: "auto",
                        }}
                        key="buttonFilter"
                        htmlType="submit"
                        loading={loading}
                      >
                        <SearchOutlined />
                      </Button>
                    </Col>
                    <Col style={{ display: "flex" }}>
                      <Tooltip
                        title="Limpiar filtros"
                        color={"#3d78b9"}
                        key={"#3d78b9"}
                      >
                        <Button style={{ marginTop: "auto", marginLeft: 10 }}>
                          <SyncOutlined />
                        </Button>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form>
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
                  <PlusOutlined />
                  Nuevo
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card className="card_table">
            <Table
              size="small"
              columns={columns}
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
      </Row>
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
    currentNode: state.userStore.currentNode,
  };
};

export default connect(mapState)(withAuthSync(UploadPayroll));
