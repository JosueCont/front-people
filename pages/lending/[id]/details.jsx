import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Table,
  Breadcrumb,
  Descriptions,
  Button,
  Switch,
  Spin,
  Modal,
} from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../../libs/auth";
import { API_URL } from "../../../config/config";
import Axios from "axios";
import jsCookie from "js-cookie";

const HolidaysNew = () => {
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
            {permissions.pay && (
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
    try {
      let data = {
        is_paid: true,
      };
      let response = await Axios.patch(
        API_URL + `/payroll/payment-plan/${id}/`,
        data
      );
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
    } catch (error) {
    } finally {
      setSending(false);
    }
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
    try {
      let response = await Axios.get(API_URL + `/payroll/loan/${id}`);
      let data = response.data;
      setDetails(data);
      SetStrStatus(
        data.status === 1
          ? "Pendiente"
          : data.status === 2
          ? "Aprobado"
          : "Rechazado"
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getPlan = async () => {
    try {
      let response = await Axios.get(
        API_URL + `/payroll/payment-plan/?loan__id=${id}`
      );
      let data = response.data.results;

      setPlan(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    if (id) {
      getDetails();
      getPlan();
    }
  }, [route]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.loan.function.approve_loan_pay")) perms.pay = true;
    });
    setPermissions(perms);
  };

  return (
    <MainLayout currentKey="7.1">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/lending/">Préstamos</Breadcrumb.Item>
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
                    <Text strong>Fecha autorizada:</Text>
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

export default withAuthSync(HolidaysNew);
