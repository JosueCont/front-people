import React, { useEffect, useState, useLayoutEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Table,
  Breadcrumb,
  Button,
  Switch,
  Spin,
  Modal,
} from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import { connect } from "react-redux";
import WebApiPayroll from "../../../api/WebApiPayroll";

const LendingDetails = (props) => {
  const { Title, Text } = Typography;
  const route = useRouter();
  const { confirm, success } = Modal;
  const { id } = route.query;
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [details, setDetails] = useState({});
  const [plan, setPlan] = useState([]);
  const [strStatus, SetStrStatus] = useState(null);
  const [permissions, setPermissions] = useState({});

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  const onCancel = () => {
    route.push("/lending");
  };

  const columns = [
    {
      title: "Plazo",
      key: "plazo",
      render: (item, record, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Pago fijo",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Saldo",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Fecha de pago",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (date) => {
        return moment(date).format("DD/MMM/YYYY");
      },
    },
    {
      title: "Pagado",
      dataIndex: "is_paid",
      key: "is_paid",
      render: (is_paid, row) => {
        return (
          <>
            {permissions.approve_loan_pay && (
              <Switch
                key={row.id}
                onClick={(e) => paid(e, row)}
                checked={is_paid ? true : false}
                disabled={is_paid ? true : false}
              />
            )}
          </>
        );
      },
    },
  ];

  const confirmPaid = async (id) => {
    setSending(true);
    let data = {
      is_paid: true,
    };
    WebApiPayroll.confirmPaidLoan(id, data)
      .then(function (response) {
        let res = response.data;
        /* Setear nuevos datos al plan */
        const newData = [...plan];
        const index = newData.findIndex((item) => item.id === id);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...res,
          });
          setPlan(newData);
        }
        getPlan();
        success({
          keyboard: false,
          maskClosable: false,
          content: "Pago realizado",
          okText: "Aceptar",
        });
      })
      .catch(function (error) {
        console.log(error);
        setSending(false);
      });
  };

  const paid = (event, row) => {
    if (event) {
      confirm({
        title: "¿Está seguro de aprobar el siguiente pago?",
        icon: <ExclamationCircleOutlined />,
        okText: "Marcar como pagado",
        cancelText: "Cancelar",
        okButtonProps: {
          loading: sending,
        },
        onOk() {
          confirmPaid(row.id);
        },
      });
    }
  };
  const getDetails = async () => {
    setLoading(true);
    WebApiPayroll.getLoanRequest(id)
      .then(function (response) {
        let data = response.data;
        setDetails(data);
        SetStrStatus(
          data.status === 1
            ? "Pendiente"
            : data.status === 2
            ? "Aprobado"
            : "Rechazado"
        );
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const getPlan = async () => {
    WebApiPayroll.getPaymentPlan(id)
      .then(function (response) {
        let data = response.data.results;
        setPlan(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (id) {
      getDetails();
      getPlan();
    }
  }, [route]);

  return (
    <MainLayout currentKey={["lending"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
        <Breadcrumb.Item>Concierge</Breadcrumb.Item>
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item className={"pointer"}
                         onClick={() => route.push({ pathname: "/lending/" })}>Préstamos</Breadcrumb.Item>
        <Breadcrumb.Item>Detalles</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container back-white" style={{ width: "100%" }}>
        <Spin tip="Cargando..." spinning={loading}>
          <Col span={24} style={{ padding: 20 }}>
            <Row>
              <Col span={24}>
                <Title level={3}>Detalles del préstamo</Title>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Estatus:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {strStatus}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Fecha de solicitud:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.timestamp
                      ? moment(details.timestamp).format("DD/MMM/YYYY")
                      : null}
                  </Col>
                </Row>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Colaborador:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.person
                      ? details.person.first_name +
                        " " +
                        details.person.flast_name
                      : null}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Fecha Autorizacion/Rechazo:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.date_confirm
                      ? moment(details.date_confirm).format("DD/MMM/YYYY")
                      : null}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Plazos:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.deadline ? details.deadline : null}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Cantidad autorizada:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.amount ? "$ " + details.amount : null}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Periodicidad:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.periodicity && details.periodicity === 1
                      ? "Semanal"
                      : details.periodicity && details.periodicity === 2
                      ? "Catorcenal"
                      : details.periodicity && details.periodicity === 3
                      ? "Quincenal"
                      : details.periodicity && details.periodicity === 4
                      ? "Mensual"
                      : null}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Pago:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.periodicity_amount
                      ? "$ " + details.periodicity_amount
                      : 0}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Tipo de préstamo:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.type && details.type === "EMP"
                      ? "Empresa"
                      : details.type && details.type === "EPS"
                      ? "E-Pesos"
                      : null}
                  </Col>
                </Row>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ margin: "10px 0px" }}
              >
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Text strong>Motivo:</Text>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    {details.reason ? details.reason : null}
                  </Col>
                </Row>
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <Table
                  columns={columns}
                  dataSource={plan}
                  scroll={{ x: 350 }}
                  locale={{
                    emptyText: loading
                      ? "Cargando..."
                      : "No se encontraron resultados.",
                  }}
                />
              </Col>
              <Col span={24} style={{ textAlign: "right", padding: "30px 0" }}>
                <Button onClick={onCancel} style={{ padding: "0 40px" }}>
                  Regresar
                </Button>
              </Col>
            </Row>
          </Col>
        </Spin>
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.loan,
  };
};

export default connect(mapState)(withAuthSync(LendingDetails));
