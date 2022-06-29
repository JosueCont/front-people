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
  InputNumber,
  Steps,
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
import { downLoadFileBlob, getDomain } from "../../utils/functions";
import { connect } from "react-redux";
import {
  messageError,
  messageSaveSuccess,
  messageSendSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import GenericModal from "../../components/modal/genericModal";
import { API_URL_TENANT } from "../../config/config";
import NumberFormat from "../../components/formatter/numberFormat";
import CfdiVaucher from "../../components/payroll/cfdiVaucher";
import SelectDepartment from "../../components/selects/SelectDepartment";
import SelectJob from "../../components/selects/SelectJob";

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
  const [consolidated, setConsolidated] = useState(null);
  const [genericModal, setGenericModal] = useState(false);
  const [activePeriod, setActivePeriod] = useState(null);
  const [calculate, setCalculate] = useState(false);
  const [totalSalary, setTotalSalary] = useState(null);
  const [totalIsr, setTotalIsr] = useState(null);
  const [calendarSelect, setCalendarSelect] = useState(null);
  const [periodSelected, setPeriodSelcted] = useState(null);
  const [step, setStep] = useState(0);
  const [nextStep, setNextStep] = useState(true);
  const [previousStep, setPreviuosStep] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [job, setJob] = useState(null);
  const [department, setDepartment] = useState(null);
  const [personsKeys, setPersonsKeys] = useState([]);
  const [personStamp, setPersonsStamp] = useState([]);
  const [cfdiCancel, setCfdiCancel] = useState([]);
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  const [infoGenericModal, setInfoGenericModal] = useState({
    title: "Timbrado de nómina",
    title_message: "Timbrado de nómina exitoso",
    description:
      "La nómina fue timbrada correctamente, puede visualizar los comprobantes fiscales o continuar calculando otras nominas.",
    type_alert: "success",
    action: () =>
      router.push({
        pathname: "/payroll/payrollVoucher",
        query: {
          calendar: calendarSelect.id,
          period: activePeriod,
        },
      }),
    title_action_button: "Ver comprobantes",
  });

  useEffect(() => {
    if (props.currentNode) getPaymentCalendars(props.currentNode.id);
  }, [props.currentNode]);

  const persons = [
    {
      title: "Nombre",
      className: "column_name cursor_pointer",
      key: "name",
      render: (item) => (
        <div>
          <Space>
            <Avatar
              icon={<UserOutlined />}
              src={
                item.person && item.person.photo
                  ? item.person.photo
                  : defaulPhoto
              }
            />
            {item.person && item.person.full_name}
          </Space>
        </div>
      ),
    },
    {
      title: "Total percepciones",
      key: "company",
      className: "cursor_pointer",
      render: (item) => (
        <div>
          <NumberFormat
            prefix={"$"}
            number={item.calculation.total_perceptions}
          />
        </div>
      ),
    },
    {
      title: "Total deducciones",
      key: "daily_salary",
      className: "cursor_pointer",
      render: (item) => (
        <div>
          <NumberFormat
            prefix={"$"}
            number={item.calculation.total_deductions}
          />
        </div>
      ),
    },
    {
      title: "Total a pagar",
      key: "daily_salary",
      className: "cursor_pointer",
      render: (item) => (
        <div>
          <NumberFormat prefix={"$"} number={item.calculation.net_salary} />
        </div>
      ),
    },
    {
      key: "actions",
      className: "cell-actions",
      render: (item) => (
        <>
          {step == 0 && (
            <Button
              size="small"
              onClick={() => {
                setPersonId(item.person && item.person.id),
                  setModalVisible(true);
              }}
            >
              <PlusOutlined />
            </Button>
          )}
        </>
      ),
    },
  ];

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
            <NumberFormat prefix={"$"} number={taxed_amount} />
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
            <NumberFormat prefix={"$"} number={exempt_amount} />
          </Space>
        ),
      },
      {
        title: "Importe",
        key: "amount",
        width: "20%",
        render: (item) => (
          <>
            {item.type === "046" && isOpen ? (
              <Space size="middle">
                <InputNumber
                  key={item.type}
                  type="number"
                  onChange={(value) => {
                    item.value = value;
                    setCalculate(true);
                  }}
                  controls={false}
                  defaultValue={item.amount}
                />
              </Space>
            ) : (
              <Space size="middle">
                <NumberFormat prefix={"$"} number={item.amount} />
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
            <Text>
              <NumberFormat prefix={"$"} number={amount} />
            </Text>
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
            <NumberFormat prefix={"$"} number={amount} />
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
                  <NumberFormat
                    prefix={"$"}
                    number={item.calculation.total_perceptions}
                  />
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total deducciones :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  <NumberFormat
                    prefix={"$"}
                    number={item.calculation.total_deductions}
                  />
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total a pagar :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  <NumberFormat
                    prefix={"$"}
                    number={item.calculation.net_salary}
                  />
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

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
        console.log(error);
        message.error(messageError);
      });
  };

  useEffect(() => {
    if (optionspPaymentCalendars.length == 1) {
      form.setFieldsValue({ calendar: optionspPaymentCalendars[0].value });
      changeCalendar(optionspPaymentCalendars[0].value);
    }
  }, [optionspPaymentCalendars]);

  const changeCalendar = (value) => {
    setTotalSalary(null);
    setTotalIsr(null);
    const calendar = paymentCalendars.find((item) => item.id === value);
    let period = calendar.periods.find((p) => p.active == true);
    if (!period) period = calendar.periods[0];
    setPeriodSelcted(period.id);
    setCalendarSelect(calendar);
    setActivePeriod(period.id);
    setPayrollType(calendar.perception_type.code);
    form.setFieldsValue({
      periodicity: calendar.periodicity.description,
      period: `${period.name}.- ${period.start_date} - ${period.end_date}`,
      insidences: `${period.incidences.start_date} - ${period.incidences.end_date}`,
      payment_day: period.payment_date,
      year: calendar.period,
    });
    sendCalculatePayroll({ payment_period: period.id });
  };

  const sendCalculatePayroll = async (dataToSend) => {
    setPayroll([]);
    setLoading(true);
    setModalVisible(false);
    setPersonId(null);
    setTotalSalary(null);
    setTotalIsr(null);
    setConsolidated(null);
    await WebApiPayroll.calculatePayroll(dataToSend)
      .then((response) => {
        setLoading(false);
        setConsolidated(
          response.data.consolidated ? response.data.consolidated : null
        );
        setPayroll(response.data.payroll);
        setCalculate(false);
        setTotalSalary(response.data.total_salary);
        setTotalIsr(response.data.total_isr);
        validatedStatusPayroll(response.data.consolidated);
        setPersonsKeys([]);
        setPersonsStamp([]);
      })
      .catch((error) => {
        setPersonsStamp([]);
        setPersonsKeys([]);
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
      payment_period: periodSelected,
      payroll: data,
    });
  };

  const sendClosePayroll = () => {
    setGenericModal(false);
    setLoading(true);
    WebApiPayroll.closePayroll({
      payment_period: periodSelected,
      payroll: payroll,
    })
      .then((response) => {
        changeStep(true);
        setIsOpen(response.data.consolidated.is_open);
        setConsolidated(response.data.consolidated);
        sendCalculatePayroll({ payment_period: periodSelected });
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

  const stampPayroll = (
    data = {
      payment_period: periodSelected,
    }
  ) => {
    setGenericModal(false);
    setLoading(true);
    WebApiPayroll.stampPayroll(data)
      .then((response) => {
        setLoading(false);
        setMessageModal(4);
        message.success(messageSendSuccess);
        sendCalculatePayroll({ payment_period: periodSelected });
      })
      .catch(async (error) => {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setMessageModal(1, error.response.data.message);
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
            : data.toLowerCase().includes("folios")
            ? "Folios"
            : "Error",

          title_message: data.toLowerCase().includes("fiscal information")
            ? "Información fiscal faltante"
            : data.toLowerCase().includes("fiscal address")
            ? "Dirección fiscal faltante"
            : data.toLowerCase().includes("folios")
            ? "Folios insuficientes"
            : "Error",
          description: data.toLowerCase().includes("fiscal information")
            ? "Falta información relevante para poder generar los cfdi, verifique la información de la empresa he intente de nuevo."
            : data.toLowerCase().includes("fiscal address")
            ? "Datos en la dirección fiscal faltantes, verifique la información he intente de nuevo"
            : data.toLowerCase().includes("folios")
            ? "No cuenta con los folios suficientes para poder timbrar su nómina, contacte con soporte."
            : data,
          type_alert: data.toLowerCase().includes("error")
            ? "error"
            : "warning",
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
            "La nómina fue timbrada correctamente, puede visualizar los comprobantes fiscales y enviarlos.",
          type_alert: "success",
          action: () => {
            router.push({
              pathname: "/payroll/payrollVoucher",
              query: {
                calendar: calendarSelect.id,
                period: activePeriod,
              },
            });
          },
          title_action_button: "Ver comprobantes",
          viewActionButton: false,
        });
        setGenericModal(true);
        break;
      case 5:
        setInfoGenericModal({
          title: data.title,
          title_message: data.title_message,
          description: data.description,
          type_alert: data.type_alert,
          action: data.action,
          title_action_button: data.title_action_button,
          viewActionButton: data.viewActionButton,
          components: data.components,
        });
        setGenericModal(true);
        break;
    }

    return;
  };

  useEffect(() => {
    if (calendarSelect) {
      const filter = {
        payment_period: periodSelected,
      };

      if (department) filter.department = department;
      if (job) filter.job = job;
      sendCalculatePayroll(filter);
    }
  }, [department, job]);

  const rowSelectionPerson = {
    selectedRowKeys: personsKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonsKeys(selectedRowKeys);
      setPersonsStamp(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.payroll_cfdi_person && record.payroll_cfdi_person.status == 2,
    }),
  };

  const openPayroll = (type) => {
    const inputMotive = document.getElementById("motive");
    if (inputMotive.value != null && inputMotive.value != "") {
      setLoading(true);
      switch (type) {
        case 1:
          setGenericModal(false);
          WebApiPayroll.openConsolidationPayroll({
            payment_period: periodSelected,
            opening_reason: inputMotive.value,
          })
            .then((response) => {
              message.success(messageUpdateSuccess);
              sendCalculatePayroll({ payment_period: periodSelected });
            })
            .catch((error) => {
              setLoading(false);
              message.error(messageError);
            });
          break;

        default:
          break;
      }
    } else {
      setLoading(false);
      message.warning("Motivo requerido");
    }
  };

  const validatedStatusPayroll = (data) => {
    if (data == null) {
      setStep(0), setPreviuosStep(false), setNextStep(true);
      return;
    }
    setIsOpen(data.is_open);

    if (data.status === 1 && data.is_open) {
      setStep(1), setPreviuosStep(true), setNextStep(false);
      return;
    }
    if (data.status === 1 && !data.is_open) {
      setStep(2), setPreviuosStep(false), setNextStep(false);
      return;
    }
    if (data.status === 2 && data.is_open) {
      setStep(2), setPreviuosStep(false), setNextStep(true);
      return;
    }
    if (data.status === 3 && !data.is_open) {
      setStep(3), setPreviuosStep(true), setNextStep(false);
      return;
    }
  };

  const changeStep = (next_prev) => {
    if (next_prev) {
      //next
      if (step == 0) {
        setStep(step + 1);
        setPreviuosStep(true);
        if (isOpen) setNextStep(false);
      }
      if (step == 1) {
        setStep(step + 1);
        if (!isOpen) setPreviuosStep(false);
      }
      if (step == 2) {
        setStep(step + 1);
        if (!isOpen) setPreviuosStep(false);
        else if (isOpen) {
          setPreviuosStep(true);
          setNextStep(false);
        }
      }
    } else {
      //previous
      if (step == 1) {
        setStep(step - 1);
        setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
      }
      if (step == 2) {
        setStep(step - 1);
        setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
      }
      if (step == 3) {
        setStep(step - 1);
        setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
      }
    }
  };

  const partialStamp = () => {
    console.log(personStamp);
    const cfdis = personStamp.map((item) => {
      return item.payroll_cfdi_person.id;
    });
    stampPayroll({
      payment_period: periodSelected,
      array_cfdi: cfdis,
    });
  };

  const cancelStamp = (type, id = null) => {
    const inputMotive = document.getElementById("motive");
    if (inputMotive.value != null && inputMotive.value != "") {
      setLoading(true);
      setGenericModal(false);
      let data = {
        motive: inputMotive.value,
        payment_period: periodSelected,
      };
      if (cfdiCancel.length > 0 && type == 2) data.cfdis_id = cfdiCancel;
      else if (type == 3) data.cfdis_id = [id];
      WebApiPayroll.cancelCfdi(data)
        .then((response) => {
          message.success(messageUpdateSuccess);
          sendCalculatePayroll({ payment_period: periodSelected });
        })
        .catch((error) => {
          setLoading(false);
          message.error(messageError);
        });
    } else {
      setLoading(false);
      message.warning("Motivo requerido");
    }
  };

  const cancelOneStamp = (data) => {
    setMessageModal(5, {
      title: "Cancelar nómina",
      description:
        "Al cancelar se debera timbrar un nuevo cfdi. Para poder completar la cancelación es necesario capturar el motivo por el caul se cancela.",
      type_alert: "warning",
      action: () => cancelStamp(3, data),
      title_action_button: "Cancelar cfdi",
      components: (
        <>
          <Row
            style={{
              width: "100%",
              marginTop: "5px",
            }}
          >
            <Input.TextArea
              id="motive"
              placeholder="Capture el motivo de cancelacion."
            />
          </Row>
        </>
      ),
    });
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
        <MainLayout currentKey={["timbrar"]} defaultOpenKeys={["payroll"]}>
          <Breadcrumb className={"mainBreadcrumb"}>
            <Breadcrumb.Item
              className={"pointer"}
              onClick={() => route.push({ pathname: "/home/persons/" })}
            >
              Inicio
            </Breadcrumb.Item>
            <Breadcrumb.Item>Timbrado de nómina</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={[10, 10]}>
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
                    {periodSelected && (
                      <>
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
                            <Select
                              placeholder="Periodo"
                              size="large"
                              onChange={(value) => {
                                sendCalculatePayroll({
                                  payment_period: value,
                                }),
                                  setPeriodSelcted(value);
                              }}
                              options={
                                calendarSelect
                                  ? calendarSelect.periods
                                      .sort((a, b) => a.name - b.name)
                                      .map((item) => {
                                        return {
                                          value: item.id,
                                          label: `${item.name}.- ${item.start_date} - ${item.end_date}`,
                                          key: item.id,
                                        };
                                      })
                                  : []
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xxs={24} xl={6}>
                          <Form.Item
                            name="insidences"
                            label="Fecha de incidencias"
                          >
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
                        <Col xxs={24} xl={4}>
                          <SelectDepartment
                            size={"large"}
                            onChange={(value) =>
                              value && value != undefined
                                ? setDepartment(value)
                                : setDepartment(null)
                            }
                          />
                        </Col>
                        <Col xxs={24} xl={4}>
                          <SelectJob
                            size={"large"}
                            onChange={(value) =>
                              value && value != undefined
                                ? setJob(value)
                                : setJob(null)
                            }
                          />
                        </Col>
                        <Col xxs={24} xl={4}>
                          <Button
                            size="large"
                            onClick={() =>
                              downLoadFileBlob(
                                `${getDomain(
                                  API_URL_TENANT
                                )}/payroll/payroll-calculus?payment_period=${periodSelected}`,
                                "Nomina.xlsx",
                                "GET"
                              )
                            }
                          >
                            Descargar plantilla
                          </Button>
                        </Col>
                      </>
                    )}
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
          {calendarSelect && (
            <>
              <div style={{ marginTop: "10px" }}>
                <Steps current={step}>
                  <Steps.Step
                    title="Calcular"
                    description="Calculo de nomina."
                  />
                  <Steps.Step title="Cerrar" description="Cierre de nomina." />
                  <Steps.Step title="Timbrar" description="Timbre fiscal." />
                  <Steps.Step title="Comprobantes" description="XML y PDF." />
                </Steps>
                <div
                  style={{
                    backgroundColor: "#fafafa",
                    border: "1px dashed #e9e9e9",
                    borderRadius: "2px",
                  }}
                >
                  {payroll.length > 0 && !genericModal && (
                    <Row
                      justify="end"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      <Col md={5} offset={1}>
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
                      {step == 0 && calculate && (
                        <Col md={5} offset={1}>
                          <Button
                            size="large"
                            block
                            htmlType="button"
                            onClick={() => reCalculatePayroll([...payroll])}
                          >
                            Calcular
                          </Button>
                        </Col>
                      )}
                      {step == 2 && consolidated && consolidated.status <= 1 && (
                        <Col md={5} offset={1}>
                          <Button
                            size="large"
                            block
                            htmlType="button"
                            onClick={() =>
                              setMessageModal(5, {
                                title: "Abrir nómina",
                                description:
                                  "Al abrir la nómina tendras acceso a recalcular los salarios de las personas. Para poder completar la reapertura es necesario capturar el motivo por el caul se abrira.",
                                type_alert: "warning",
                                action: () => openPayroll(1),
                                title_action_button: "Abrir nómina",
                                components: (
                                  <>
                                    <Row
                                      style={{
                                        width: "100%",
                                        marginTop: "5px",
                                      }}
                                    >
                                      <Input.TextArea
                                        id="motive"
                                        placeholder="Capture el motivo de reapertura."
                                      />
                                    </Row>
                                  </>
                                ),
                              })
                            }
                          >
                            Abrir
                          </Button>
                        </Col>
                      )}
                      {step >= 1 && (
                        <>
                          <Col md={5} offset={1}>
                            <Button
                              size="large"
                              block
                              htmlType="button"
                              // onClick={() => setMessageModal(2)}
                            >
                              Descargar nómina
                            </Button>
                          </Col>
                          {isOpen && !consolidated && (
                            <Col md={5} offset={1}>
                              <Button
                                size="large"
                                block
                                htmlType="button"
                                onClick={() => setMessageModal(2)}
                              >
                                Cerrar nómina
                              </Button>
                            </Col>
                          )}
                          {step == 2 &&
                            consolidated &&
                            consolidated.status < 3 && (
                              <Col md={5} offset={1}>
                                <Button
                                  size="large"
                                  block
                                  htmlType="button"
                                  onClick={() =>
                                    personStamp.length > 0
                                      ? partialStamp()
                                      : setMessageModal(3)
                                  }
                                >
                                  Timbrar nómina
                                </Button>
                              </Col>
                            )}
                          {step == 3 && (
                            <Col md={5} offset={1}>
                              <Button
                                size="large"
                                block
                                htmlType="button"
                                onClick={() =>
                                  setMessageModal(5, {
                                    title: "Cancelar nómina",
                                    description:
                                      "Al cancelar nómina se debera iniciar el proceso de cierre de nomina de nuevo. Para poder completar la cancelación es necesario capturar el motivo por el caul se cancela.",
                                    type_alert: "warning",
                                    action: () => cancelStamp(),
                                    title_action_button: "Cancelar nómina",
                                    components: (
                                      <>
                                        <Row
                                          style={{
                                            width: "100%",
                                            marginTop: "5px",
                                          }}
                                        >
                                          <Input.TextArea
                                            id="motive"
                                            placeholder="Capture el motivo de cancelacion."
                                          />
                                        </Row>
                                      </>
                                    ),
                                  })
                                }
                              >
                                Cancelar todos los cfdis
                              </Button>
                            </Col>
                          )}
                        </>
                      )}
                    </Row>
                  )}
                </div>
                {previousStep && (
                  <Button
                    style={{ margin: "8px" }}
                    onClick={() => changeStep(false)}
                  >
                    Previo
                  </Button>
                )}
                {nextStep && (
                  <Button
                    style={{ margin: "8px" }}
                    onClick={() => changeStep(true)}
                  >
                    Siguiente
                  </Button>
                )}
              </div>

              <Col span={24}>
                <Card className="card_table">
                  {step == 3 ? (
                    <CfdiVaucher
                      calendar={calendarSelect.id}
                      period={periodSelected}
                      viewFilter={false}
                      setKeys={setCfdiCancel}
                      clickCancelStamp={cancelOneStamp}
                    />
                  ) : (
                    <>
                      <Table
                        className="headers_transparent"
                        dataSource={payroll.map((item) => {
                          item.key = item.person.id;
                          return item;
                        })}
                        columns={persons}
                        expandable={{
                          expandedRowRender: (item) =>
                            renderConceptsTable(item),
                          expandIcon: ({ expanded, onExpand, record }) =>
                            expanded ? (
                              <DownOutlined
                                onClick={(e) => onExpand(record, e)}
                              />
                            ) : (
                              <RightOutlined
                                onClick={(e) => onExpand(record, e)}
                              />
                            ),
                        }}
                        hideExpandIcon
                        loading={loading}
                        locale={{
                          emptyText: loading
                            ? "Cargando..."
                            : "No se encontraron resultados.",
                        }}
                        rowSelection={
                          consolidated && step == 2 && consolidated.status < 3
                            ? rowSelectionPerson
                            : null
                        }
                      />
                      {totalSalary != null && totalIsr != null ? (
                        <Col sm={24} md={24} lg={24}>
                          <Row justify="end">
                            <Col span={4} style={{ fontWeight: "bold" }}>
                              <div>Total de sueldos:</div>
                              <div>Total de ISR:</div>
                              <div>Total a pagar:</div>
                            </Col>
                            <Col span={3} style={{ fontWeight: "bold" }}>
                              <div>
                                <NumberFormat
                                  prefix={"$"}
                                  number={totalSalary}
                                />
                              </div>
                              <div>
                                <NumberFormat prefix={"$"} number={totalIsr} />
                              </div>
                              <div>
                                <NumberFormat
                                  prefix={"$"}
                                  number={totalSalary - totalIsr}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      ) : null}
                    </>
                  )}
                </Card>
              </Col>
            </>
          )}
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
          viewActionButton={infoGenericModal.viewActionButton}
          actionButton={infoGenericModal.action}
          titleActionButton={infoGenericModal.title_action_button}
        >
          <Row>
            <Alert
              style={{ width: "100%" }}
              message={infoGenericModal.title_message}
              description={infoGenericModal.description}
              type={infoGenericModal.type_alert}
              showIcon
            />
            {infoGenericModal.components && infoGenericModal.components}
          </Row>
        </GenericModal>
      )}
    </>
  );
};

const mapState = (state) => {
  return { currentNode: state.userStore.current_node };
};

export default connect(mapState)(withAuthSync(CalculatePayroll));
