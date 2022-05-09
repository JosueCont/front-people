import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Breadcrumb,
  Button,
  Select,
  Input,
  message,
  Spin,
  Table,
  Card,
  Avatar,
  Space,
  Typography,
  Form,
  Alert,
} from "antd";
import router, { useRouter } from "next/router";
import {
  PlusOutlined,
  RightOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";
import WebApiPayroll from "../../api/WebApiPayroll";
import ModalConceptsPayroll from "../../components/payroll/modals/ModalConceptsPayroll";
import { Global } from "@emotion/core";
import {
  downLoadFileBlob,
  getDomain,
  numberFormat,
} from "../../utils/functions";
import { connect } from "react-redux";
import {
  messageError,
  messageSaveSuccess,
  messageSendSuccess,
} from "../../utils/constant";
import GenericModal from "../../components/modal/genericModal";
import { API_URL_TENANT } from "../../config/config";

const CalculatePayroll = ({ ...props }) => {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payroll, setPayroll] = useState([]);
  const [expandRow, setExpandRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [personId, setPersonId] = useState(null);
  const [payrollType, setPayrollType] = useState(null);
  const [consolidated, setConsolidated] = useState(false);
  const [genericModal, setGenericModal] = useState(false);
  const [activePeriod, setActivePeriod] = useState(null);
  const [calculate, setCalculate] = useState(false);
  const [totalSalary, setTotalSalary] = useState(null);
  const [totalIsr, setTotalIsr] = useState(null);
  const [calendarSelect, setCalendarSelect] = useState(null);

  const [infoGenericModal, setInfoGenericModal] = useState({
    title: "Timbrado de nómina",
    title_message: "Timbrado de nómina exitoso",
    description:
      "La nómina fue timbrada correctamente, puede visualizar los comprobantes fiscales o continuar calculando otras nominas.",
    type_alert: "success",
    action: () =>
      router.push({
        pathname: "/payroll/payrollVaucher",
        query: {
          calendar: form.getFieldValue("calendar"),
          period: activePeriod,
        },
      }),
    title_action_button: "Ver comprobantes",
  });

  useEffect(() => {
    if (props.currentNode) getPaymentCalendars(props.currentNode.id);
  }, [props.currentNode]);

  const getPaymentCalendars = async (value) => {
    await WebApiPayroll.getPaymentCalendar(value)
      .then((response) => {
        setPaymentCalendars(response.data.results);
        let calendars = response.data.results.map((item, index) => {
          return { key: item.id, label: item.name, value: item.id };
        });
        setOptionsPaymentCalendars(calendars);
      })
      .catch((error) => {
        message.error(messageError);
      });
  };

  const changeCalendar = (value) => {
    const calendar = paymentCalendars.find((item) => item.id === value);
    const period = calendar.periods.find((p) => p.active == true);
    setCalendarSelect(calendar.id);
    if (period) {
      setActivePeriod(period.id);
      setPayrollType(calendar.perception_type.code);
      form.setFieldsValue({
        periodicity: calendar.periodicity.description,
        period: `${period.name}.- ${period.start_date} - ${period.end_date}`,
        insidences: `${period.incidences.start_date} - ${period.incidences.end_date}`,
        payment_day: period.payment_date,
        year: calendar.period,
      });
      sendCalculatePayroll({ calendar_id: value });
    }
  };

  const sendCalculatePayroll = async (dataToSend) => {
    setLoading(true);
    setModalVisible(false);
    setPersonId(null);
    await WebApiPayroll.calculatePayroll(dataToSend)
      .then((response) => {
        setLoading(false);
        setConsolidated(response.data.consolidated);
        setPayroll(response.data.payroll);
        setCalculate(false);
        setTotalSalary(response.data.total_salary);
        setTotalIsr(response.data.total_isr);
      })
      .catch((error) => {
        setCalculate(false);
        console.log(error);
        setPayroll([]);
        form.resetFields();
        setLoading(false);
      });
  };

  const reCalculatePayroll = (data) => {
    data.map((item) => {
      item.person_id = item.person.id;
      delete item["person"];
      return item;
    });
    data.map((item) => {
      item.deductions = item.deductions.filter(
        (a) => a.type !== "001" && a.type !== "002"
      );
    });
    sendCalculatePayroll({
      node: props.currentNode.id,
      period: form.getFieldValue("year"),
      payroll: data,
    });
  };

  const persons = [
    {
      title: "Nombre",
      className: "column_name cursor_pointer",
      key: "name",
      render: (item) => (
        <div onClick={() => setExpandRow(expandRow ? null : item.person.id)}>
          <Space>
            <Avatar
              icon={<UserOutlined />}
              src={item.person.photo ? item.person.photo : null}
            />
            {item.person.full_name}
          </Space>
        </div>
      ),
    },
    {
      title: "Empresa",
      dataIndex: "company",
      key: "company",
      className: "cursor_pointer",
      render: (item) => (
        <div onClick={() => setExpandRow(expandRow ? null : item.person.id)}>
          {props.currentNode.name}
        </div>
      ),
    },
    {
      title: "Salario Diario",
      dataIndex: "daily_salary",
      key: "daily_salary",
      className: "cursor_pointer",
      render: (item) => (
        <div onClick={() => setExpandRow(expandRow ? null : item.person.id)}>
          {item.salary}
        </div>
      ),
    },
    {
      key: "actions",
      className: "cell-actions",
      render: (item) => (
        <>
          {!consolidated && (
            <Button
              size="small"
              onClick={() => {
                setPersonId(item.person.id), setModalVisible(true);
              }}
            >
              <PlusOutlined />
            </Button>
          )}
        </>
      ),
    },
  ];

  const rowExpand = (expanded, row) => {
    if (!expanded) {
      setExpandRow(false);
    } else {
      setExpandRow(row);
    }
  };

  const renderConceptsTable = (item) => {
    let dataPerceptions = item.perceptions;
    let dataDeductions = item.deductions;
    let dataOtherPayments = item.other_payments;

    const columnsPerceptions = [
      {
        title: "CVE",
        key: "code",
        dataIndex: "code",
        className: "cell-concept",
        width: "5%",
      },
      {
        title: "Descripción",
        key: "description",
        dataIndex: "description",
        className: "cell-concept",
        width: "45%",
      },
      {
        title: "Dato",
        key: "datum",
        dataIndex: "datum",
        className: "cell-concept",
        width: "10%",
      },
      {
        title: "Grabado",
        key: "taxed_amount",
        dataIndex: "taxed_amount",
        width: "10%",
        render: (taxed_amount) => (
          <Space size="middle">
            <span>${numberFormat(taxed_amount)}</span>
          </Space>
        ),
      },
      {
        title: "Exento",
        key: "exempt_amount",
        dataIndex: "exempt_amount",
        width: "10%",
        render: (exempt_amount) => (
          <Space size="middle">
            <Text>${numberFormat(exempt_amount)}</Text>
          </Space>
        ),
      },
      {
        title: "Importe",
        key: "amount",
        width: "20%",
        render: (item) => (
          <>
            {item.type === "046" && !consolidated ? (
              <Space size="middle">
                <Input
                  key={item.type}
                  onChange={(value) => {
                    (item.value = Number(value.target.value)),
                      setCalculate(true);
                  }}
                  defaultValue={numberFormat(item.amount)}
                />
              </Space>
            ) : (
              <Space size="middle">
                <Text>${numberFormat(item.amount)}</Text>
              </Space>
            )}
          </>
        ),
      },
    ];

    const columnsDeductions = [
      {
        title: "CVE",
        key: "code",
        dataIndex: "code",
        className: "cell-concept",
        width: "10%",
      },
      {
        title: "Descripción",
        key: "description",
        dataIndex: "description",
        className: "cell-concept",
        width: "70%",
      },
      {
        title: "Dato",
        key: "data",
        dataIndex: "data",
        className: "cell-concept",
        width: "10%",
      },
      {
        title: "Importe",
        key: "amount",
        dataIndex: "amount",
        width: "10%",
        render: (amount) => (
          <Space size="middle">
            <Text>${numberFormat(amount)}</Text>
          </Space>
        ),
      },
    ];

    const columnsOtherPayments = [
      {
        title: "CVE",
        key: "code",
        dataIndex: "code",
        className: "cell-concept",
        width: "10%",
      },
      {
        title: "Descripción",
        key: "description",
        dataIndex: "description",
        className: "cell-concept",
        width: "80%",
      },
      {
        title: "Importe",
        key: "amount",
        dataIndex: "amount",
        width: "10%",
        render: (amount) => (
          <Space size="middle">
            <Text>${numberFormat(amount)}</Text>
          </Space>
        ),
      },
    ];

    return (
      <>
        <Row>
          <Col span={14}>
            <div
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              Percepciones
            </div>
            <Table
              className="subTable"
              columns={columnsPerceptions}
              dataSource={dataPerceptions}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: "Aún no hay datos" }}
            />
          </Col>
          <br />
          <Col span={10}>
            <div
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              Deducciones
            </div>
            <Table
              className="subTable"
              columns={columnsDeductions}
              dataSource={dataDeductions}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: "Aún no hay datos" }}
            />
          </Col>
          <br />

          <Col span={12}>
            {dataOtherPayments && dataOtherPayments.length > 0 && (
              <>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Otros pagos
                </div>
                <Table
                  className="subTable"
                  columns={columnsOtherPayments}
                  dataSource={dataOtherPayments}
                  pagination={false}
                  size="small"
                  bordered
                  locale={{ emptyText: "Aún no hay datos" }}
                />
              </>
            )}
          </Col>
          <Col
            span={12}
            style={{
              display: "flex",
              float: "right",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            <Row style={{ border: "1px solid" }}>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total percepciones :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  $ {numberFormat(item.calculation.total_perceptions)}
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total deducciones :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  $ {numberFormat(item.calculation.total_deductions)}
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total a pagar :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  ${numberFormat(item.calculation.net_salary)}
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const sendClosePayroll = () => {
    setGenericModal(false);
    setLoading(true);
    WebApiPayroll.closePayroll({
      calendar_id: form.getFieldValue("calendar"),
      payroll: payroll,
    })
      .then((response) => {
        sendCalculatePayroll({ calendar_id: form.getFieldValue("calendar") });
        setTimeout(() => {
          message.success(messageSaveSuccess);
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        setTimeout(() => {
          message.error(messageError);
          console.log(error);
        }, 1000);
      });
  };

  const stampPayroll = () => {
    setGenericModal(false);
    setLoading(true);
    WebApiPayroll.stampPayroll({
      payment_calendar_id: form.getFieldValue("calendar"),
    })
      .then((response) => {
        setLoading(false);
        setMessageModal(4);
        form.resetFields();
        setTotalSalary(null);
        setTotalIsr(null);
        setPayroll([]);
        message.success(messageSendSuccess);
      })
      .catch(async (error) => {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          let dialog = await setMessageModal(1, error.response.data.message);
          setGenericModal(true);
        } else message.error(messageError);
        setLoading(false);
      });
  };

  const setMessageModal = (type, data) => {
    switch (type) {
      case 1:
        setInfoGenericModal({
          title: data.toLowerCase().includes("fiscal information")
            ? "Información fiscal"
            : data.toLowerCase().includes("fiscal address")
            ? "Dirección fiscal"
            : "Folios",

          title_message: data.toLowerCase().includes("fiscal information")
            ? "Información fiscal faltante"
            : data.toLowerCase().includes("fiscal address")
            ? "Dirección fiscal faltante"
            : "Folios insuficientes",
          description: data.toLowerCase().includes("fiscal information")
            ? "Falta información relevante para poder generar los cfdi, verifique la información de la empresa he intente de nuevo."
            : data.toLowerCase().includes("fiscal address")
            ? "Datos en la dirección fiscal faltantes, verifique la información he intente de nuevo"
            : "No cuenta con los folios suficientes para poder timbrar su nómina, contacte con soporte.",
          type_alert: "warning",
          action: () =>
            data.toLowerCase().includes("fiscal information") ||
            data.toLowerCase().includes("fiscal address")
              ? router.push({
                  pathname: `/business/${props.currentNode.id}`,
                  query: {
                    tab: 2,
                  },
                })
              : setGenericModal(false),
          title_action_button:
            data.toLowerCase().includes("fiscal information") ||
            data.toLowerCase().includes("fiscal address")
              ? "Ver información fiscal"
              : "Continuar",
        });
        break;
      case 2:
        setInfoGenericModal({
          title: "Cerrar nómina",
          title_message: "¿Esta seguro de cerrar la nómina?",
          description:
            "Una vez cerrada la nómina no podra realizar cambios o modificaciones.",
          type_alert: "warning",
          action: () => sendClosePayroll(),
          title_action_button: "Si, cerrar nómina",
        });
        setGenericModal(true);
        break;
      case 3:
        setInfoGenericModal({
          title: "Timbrar nómina",
          title_message: "¿Esta seguro de timbrar la nómina?",
          description:
            "Se emitiran todos los cfdi correspondientes ante el SAT",
          type_alert: "warning",
          action: () => stampPayroll(),
          title_action_button: "Si, timbrar",
        });
        setGenericModal(true);
        break;
      case 4:
        setInfoGenericModal({
          title: "Timbrado de nómina",
          title_message: "Timbrado de nómina exitoso",
          description:
            "La nómina fue timbrada correctamente, puede visualizar los comprobantes fiscales o continuar calculando otras nominas.",
          type_alert: "success",
          action: () => {
            console.log(calendarSelect),
              router.push({
                pathname: "/payroll/payrollVaucher",
                query: {
                  calendar: calendarSelect,
                  period: activePeriod,
                },
              });
          },
          title_action_button: "Ver comprobantes",
        });
        setGenericModal(true);
        break;
    }

    return;
  };
  return (
    <>
      <Spin tip="Cargando..." spinning={loading}>
        <Global
          styles={`
          
          .column_arrow{
            width: 10px !important;
            padding:10px 0px 10px 10px !important;
          }
          .column_name{
            padding-left:10px !important;
          }
          .subTable .ant-table{
            // margin-left: 70px !important;
            background: rgb(252 102 2 / 10%);
          }
          .subTable .ant-table tr:hover td{
            background: rgb(252 102 2 / 10%) !important;
          } 

          td.cursor_pointer{
            cursor:pointer;
          }
          .form_concept .ant-form-item{
            margin-bottom:0px;
          }
          .cell-concept{
              text-overflow: ellipsis;
              overflow: hidden;
          }
          .cell-actions{
            width: 70px;
            text-align: center;
          }
        `}
        />
        <MainLayout currentKey={["timbrar"]} defaultOpenKeys={["nómina"]}>
          <Breadcrumb className={"mainBreadcrumb"}>
            <Breadcrumb.Item
              className={"pointer"}
              onClick={() => route.push({ pathname: "/home/persons/" })}
            >
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item>Timbrado de nómina</Breadcrumb.Item>
          </Breadcrumb>

          <Row justify="end" gutter={[10, 10]}>
            <Col span={24}>
              <Card className="form_header">
                <Form form={form} layout="vertical">
                  <Row gutter={[16, 8]}>
                    <Col xxs={24} xl={4}>
                      <Form.Item name="calendar" label="Calendario">
                        <Select
                          size="large"
                          style={{ width: "100%" }}
                          options={optionspPaymentCalendars}
                          onChange={changeCalendar}
                          placeholder="Calendarios"
                          notFoundContent={"No se encontraron resultados."}
                        />
                      </Form.Item>
                    </Col>
                    <Col xxs={24} xl={4}>
                      <Form.Item name="periodicity" label="Periocidad">
                        <Input
                          size="large"
                          key="periodicity"
                          placeholder="Periodicidad"
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xxs={24} xl={6}>
                      <Form.Item name="period" label="Periodo">
                        <Input
                          size="large"
                          key="period"
                          placeholder="Período"
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xxs={24} xl={6}>
                      <Form.Item name="insidences" label="Fecha de incidencias">
                        <Input
                          size="large"
                          key="insidence_period"
                          placeholder="Período de incidencia"
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                    <Col xxs={24} xl={4}>
                      <Form.Item name="payment_day" label="Fecha de pago">
                        <Input
                          size="large"
                          key="payment_day"
                          placeholder="Dia de pago"
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>

            {payroll.length > 0 && !genericModal && (
              <>
                {consolidated && (
                  <Col md={5}>
                    <Button
                      size="large"
                      block
                      htmlType="button"
                      onClick={() =>
                        downLoadFileBlob(
                          `${getDomain(
                            API_URL_TENANT
                          )}/payroll/consolidated-payroll-report?period=${activePeriod}`,
                          "hoja_rayas.xlsx",
                          "GET"
                        )
                      }
                    >
                      Descargar hoja de raya
                    </Button>
                  </Col>
                )}
                <Col md={5}>
                  <Button
                    size="large"
                    block
                    htmlType="button"
                    onClick={() =>
                      calculate
                        ? reCalculatePayroll([...payroll])
                        : consolidated
                        ? setMessageModal(3)
                        : setMessageModal(2)
                    }
                  >
                    {calculate
                      ? "Calcular"
                      : consolidated
                      ? "Timbrar nómina"
                      : "Cerrar nómina"}
                  </Button>
                </Col>
              </>
            )}
            <Col span={24}>
              <Card className="card_table">
                <Table
                  className="headers_transparent"
                  dataSource={
                    payroll.length > 0 && payroll[0].person ? payroll : []
                  }
                  columns={persons}
                  expandable={{
                    expandedRowRender: (item) => renderConceptsTable(item),
                    onExpand: (expanded, item) => rowExpand(expanded, item),
                    expandIconAsCell: false,
                    expandedRowKeys: [expandRow],
                    expandIcon: ({ expanded, onExpand, item }) =>
                      expanded ? (
                        <DownOutlined onClick={(e) => onExpand(item, e)} />
                      ) : (
                        <RightOutlined onClick={(e) => onExpand(item, e)} />
                      ),
                  }}
                  hideExpandIcon
                  locale={{ emptyText: "No se encontraron resultados" }}
                />
                {totalSalary != null && totalIsr != null ? (
                  <Col sm={24} md={18} lg={12}>
                    <Row>
                      <Col span={12} style={{ fontWeight: "bold" }}>
                        <div>Total de sueldos:</div>
                        <div>Total de ISR:</div>
                      </Col>
                      <Col span={12} style={{ fontWeight: "bold" }}>
                        <div>${totalSalary}</div>
                        <div>${totalIsr}</div>
                      </Col>
                    </Row>
                  </Col>
                ) : null}
              </Card>
            </Col>
          </Row>
        </MainLayout>
      </Spin>
      {personId && (
        <ModalConceptsPayroll
          visible={modalVisible}
          setVisible={setModalVisible}
          calendar={{
            node: props.currentNode.id,
            period: form.getFieldValue("year"),
          }}
          person_id={personId}
          payroll={payroll}
          setLoading={setLoading}
          sendCalculatePayroll={sendCalculatePayroll}
          payrollType={payrollType}
        />
      )}
      {genericModal && (
        <GenericModal
          visible={genericModal}
          setVisible={setGenericModal}
          title={infoGenericModal.title}
          content={
            <Row>
              <Alert
                style={{ width: "100%" }}
                message={infoGenericModal.title_message}
                description={infoGenericModal.description}
                type={infoGenericModal.type_alert}
                showIcon
              />
            </Row>
          }
          actionButton={infoGenericModal.action}
          titleActionButton={infoGenericModal.title_action_button}
        />
      )}
    </>
  );
};

const mapState = (state) => {
  return { currentNode: state.userStore.current_node };
};

export default connect(mapState)(withAuthSync(CalculatePayroll));
