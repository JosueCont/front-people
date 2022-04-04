import {
  ClearOutlined,
  FilePdfTwoTone,
  FileTextTwoTone,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Col, Form, Row, Table, Tooltip } from "antd";
import { useState } from "react";
import { connect } from "react-redux";
import SelectPaymentCalendar from "../../components/selects/SelectPaymentCalendar";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import SelectDepartment from "../../components/selects/SelectDepartment";
import SelectJob from "../../components/selects/SelectJob";
import MainLayout from "../../layout/MainLayout";

const PayrollVaucher = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Num. trabajador",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "Colaborador",
      key: "collaborator",
      dataIndex: "collaborator",
    },
    {
      title: "Fecha emisión",
      key: "timestamp",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (item) => {
        return (
          <>
            {item.id_facturama && (
              <Tooltip title="PDF" color={"#3d78b9"} key={"#3d78b9"}>
                <FilePdfTwoTone style={{ fontSize: "25px" }} />
              </Tooltip>
            )}
            <Tooltip title="XML" color={"#3d78b9"} key={"#3d78b9"}>
              <FileTextTwoTone href={item.file} style={{ fontSize: "25px" }} />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const onFinish = (value) => {
    console.log(value);
  };

  const clearFilter = () => {
    form.resetFields();
  };

  return (
    <MainLayout currentKey={["persons"]}>
      <Breadcrumb>
        <Breadcrumb.Item href="/home/persons">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Comprobantes fiscales</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <div className="top-container-border-radius">
          <Form
            name="filter"
            form={form}
            layout="vertical"
            key="formFilter"
            className="formFilterReports"
            onFinish={onFinish}
          >
            <Row gutter={[10]}>
              <Col>
                <SelectPaymentCalendar
                  name="collaborator"
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <SelectCollaborator
                  name="collaborator"
                  style={{ width: 150 }}
                />
              </Col>
              <Col>
                <SelectDepartment key="selectDepartament" />
              </Col>
              <Col>
                <SelectJob style={{ width: 120 }} />
              </Col>
              <Col style={{ display: "flex" }}>
                <Tooltip title="Filtrar" color={"#3d78b9"} key={"#3d78b9"}>
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
                </Tooltip>
              </Col>
              <Col style={{ display: "flex" }}>
                <Tooltip
                  title="Limpiar filtro"
                  color={"#3d78b9"}
                  key={"#3d78b9"}
                >
                  <Button
                    onClick={clearFilter}
                    style={{
                      fontWeight: "bold",
                      marginTop: "auto",
                    }}
                    key="buttonClearFilter"
                  >
                    <ClearOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form>
        </div>
        <Row>
          <Col span={24}>
            <Table
              dataSource={[{ code: "0001", collaborator: "Jasson" }]}
              key="tableHolidays"
              columns={columns}
              loading={loading}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(PayrollVaucher);
