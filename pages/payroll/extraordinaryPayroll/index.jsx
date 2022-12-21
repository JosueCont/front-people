import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  PlusOutlined,
  RightOutlined,
  DownOutlined,
  UserOutlined,
  LockOutlined,
  SearchOutlined,
  UnlockOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import router, { useRouter } from "next/router";
import { connect } from "react-redux";
import NumberFormat from "../../../components/formatter/numberFormat";
import ModalConceptsPayroll from "../../../components/payroll/modals/ModalConceptsPayroll";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { Global } from "@emotion/core";
import {
  messageError,
  messageSaveSuccess,
  messageSendSuccess,
  messageUpdateSuccess,
  optionMovement,
} from "../../../utils/constant";
import SelectDepartment from "../../../components/selects/SelectDepartment";
import SelectJob from "../../../components/selects/SelectJob";
import GenericModal from "../../../components/modal/genericModal";
import moment, { locale } from "moment";
import CfdiVaucher from "../../../components/payroll/cfdiVaucher";

const ExtraordinaryPayroll = ({ ...props }) => {
  const route = useRouter();
  const { Text } = Typography;
  const [form] = Form.useForm();

  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [personKeys, setPersonKeys] = useState([]);
  const [personId, setPersonId] = useState(null);
  const [listPersons, setListPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movementType, setMovementType] = useState(null);
  const [extraOrdinaryPayroll, setExtraOrdinaryPayroll] = useState([]);
  const [calendarSelect, setCalendarSelect] = useState(null);
  const [periodSelected, setPeriodSelcted] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalIsr, setTotalIsr] = useState(null);
  const [netPay, setNetPay] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [consolidated, setConsolidated] = useState(null);
  const [step, setStep] = useState(0);
  const [nextStep, setNextStep] = useState(true);
  const [previousStep, setPreviuosStep] = useState(false);
  const [job, setJob] = useState(null);
  const [department, setDepartment] = useState(null);
  const [cfdiCancel, setCfdiCancel] = useState([]);
  const [genericModal, setGenericModal] = useState(false);
  const [objectSend, setObjectSend] = useState(null);
  const [consolidatedObj, setConsolidatedObj] = useState(null);

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${day}-${month}-${year}`;

  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  const [infoGenericModal, setInfoGenericModal] = useState(null);

  const persons = [
    {
      title: "Nombre",
      className: "column_name cursor_pointer",
      key: "name",
      render: (item) => (
        <div>
          <Space>
            {item.payroll_cfdi_person && (
              <Tag
                color={item.payroll_cfdi_person.status === 1 ? "gold" : "green"}
              >
                {item.payroll_cfdi_person.status === 1 ? (
                  <>
                    <ExclamationCircleOutlined style={{ marginRight: "2px" }} />
                    Sin timbrar
                  </>
                ) : (
                  <>
                    <CheckCircleOutlined style={{ marginRight: "2px" }} />
                    Timbrado
                  </>
                )}
              </Tag>
            )}
            <Avatar
              icon={<UserOutlined />}
              src={
                item.person && item.person.photo
                  ? item.person.photo
                  : defaulPhoto
              }
            />
            {`${
              item.person && item.person.mlast_name
                ? item.person.first_name +
                  " " +
                  item.person.flast_name +
                  " " +
                  item.person.mlast_name
                : item.personfirst_name + " " + item.person.flast_name
            }`}
          </Space>
        </div>
      ),
    },
    {
      title: "Antigüedad",
      key: "company",
      className: "cursor_pointer",
      render: (item) => <div>{item.antiquity}</div>,
    },
    {
      title: "Salario diario",
      key: "company",
      className: "cursor_pointer",
      render: (item) => (
        <div>
          <NumberFormat prefix={"$"} number={item.daily_salary} />
        </div>
      ),
    },
    {
      title: "Total percepciones",
      key: "company",
      className: "cursor_pointer",
      render: (item) => (
        <div>
          <NumberFormat prefix={"$"} number={item.total_perception} />
        </div>
      ),
    },
    {
      title: "Total deducciones",
      key: "total_deductions",
      className: "cursor_pointer",
      render: (item) => (
        <div>
          <NumberFormat prefix={"$"} number={item.isr} />
        </div>
      ),
    },
    {
      title: "Total a pagar",
      key: "total_payment",
      className: "cursor_pointer",
      render: (item) => (
        <div>
          <NumberFormat prefix={"$"} number={item.total_payment} />
        </div>
      ),
    },
    {
      key: "actions",
      className: "cell-actions",
      render: (item) =>
        listPersons &&
        listPersons.find((a) => a.key === item.key) && (
          <>
            {(movementType == 2 || movementType == 3) && step == 0 && (
              <Button
                size="small"
                onClick={() => {
                  setPersonId(item?.person?.id),
                    console.log(
                      "🚀 ~ file: index.jsx:175 ~ ExtraordinaryPayroll ~ listPersons",
                      item.person.id
                    ),
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

  const renderConceptsTable = (data) => {
    let dataPerceptions = data?.perception;
    let dataDeductions = data?.deduction;

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
        width: "5%",
        render: (datum) => (
          <Space size="middle">
            <NumberFormat number={datum} />
          </Space>
        ),
      },
      {
        title: "Grabado",
        key: "taxed_amount",
        dataIndex: "taxed_amount",
        width: "15%",
        render: (taxed_amount) => (
          <Space size="middle">
            <NumberFormat prefix={"$"} number={taxed_amount} />
          </Space>
        ),
      },
      {
        title: "Exento",
        key: "taxed_amount",
        dataIndex: "exempt_amount",
        width: "15%",
        render: (exempt_amount) => (
          <Space size="middle">
            <NumberFormat prefix={"$"} number={exempt_amount} />
          </Space>
        ),
      },
      {
        title: "Importe",
        key: "taxed_amount",
        width: "15%",
        render: (item) => (
          <>
            <Space size="middle">
              <NumberFormat prefix={"$"} number={item.amount} />
            </Space>
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
        width: "60%",
      },
      {
        title: "Dato",
        key: "datum",
        dataIndex: "datum",
        className: "cell-concept",
        width: "10%",
      },
      {
        title: "Importe",
        key: "amount",
        dataIndex: "amount",
        width: "20%",
        render: (amount) => (
          <Space size="middle">
            <Text>
              <NumberFormat prefix={"$"} number={amount} />
            </Text>
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
          <Col
            span={12}
            style={{
              display: "flex",
              float: "right",
              fontSize: 16,
              fontWeight: "bold",
              flexDirection: "column-reverse",
            }}
          ></Col>
          <Col
            span={12}
            style={{
              display: "flex",
              float: "right",
              fontSize: 16,
              fontWeight: "bold",
              flexDirection: "column-reverse",
            }}
          >
            <Row style={{ border: "1px solid" }}>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total percepciones :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  <NumberFormat prefix={"$"} number={data.total_perception} />
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total deducciones :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  <NumberFormat prefix={"$"} number={data.isr} />
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total a pagar :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  <NumberFormat prefix={"$"} number={data.total_payment} />
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

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
        console.log(error);
        message.error(messageError);
      });
  };

  const changeCalendar = (value) => {
    resetStateViews();
    if (!value) {
      resetState();
      return;
    }
    setTotalPayment(null);
    setTotalIsr(null);
    setNetPay(null);
    const calendar = paymentCalendars.find((item) => item.id === value);
    let period = calendar.periods.find((p) => p.active == true);
    if (!period) period = calendar.periods[0];
    setPeriodSelcted(period);
    setCalendarSelect(calendar);
    form.setFieldsValue({
      periodicity: calendar.periodicity.description,
      period: `${period.name}.- ${period.start_date} - ${period.end_date}`,
    });
  };

  const resetState = () => {
    form.resetFields();
    setExtraOrdinaryPayroll([]);
    setCalendarSelect(null);
    setPeriodSelcted(null);
    setTotalPayment(null);
    setTotalIsr(null);
    setNetPay(null);
    setMovementType(null);
    setConsolidatedObj(null);
  };

  const resetStateViews = () => {
    setExtraOrdinaryPayroll([]);
    setTotalPayment(null);
    setTotalIsr(null);
    setNetPay(null);
    setConsolidatedObj(null);
    setConsolidated(null);
    setStep(0);
    setPreviuosStep(false);
    setNextStep(true);
    setIsOpen(true);
    setObjectSend(null);
    setPersonKeys([]);
    setPersonId(null);
    setListPersons([]);
  };

  const sendCalculateExtraordinaryPayrroll = async (data) => {
    if (!movementType) return;
    data.calendar = calendarSelect.id;
    setLoading(true);
    // setExtraOrdinaryPayroll([]);
    await WebApiPayroll.extraordinaryPayroll(data)
      .then((response) => {
        if (response.data.consolidated) {
          if (movementType === 1) {
            let calculateExist = [];
            calculateExist = response.data.payroll.filter(
              (a) => a.payroll_cfdi_person.status === 1
            );

            if (calculateExist.length > 0) setConsolidatedObj(calculateExist);
          }
          setConsolidated(response.data.consolidated);
          setExtraOrdinaryPayroll(response.data.payroll);
        } else {
          setConsolidatedObj(response.data);
          if (movementType > 1 && extraOrdinaryPayroll.length > 0) {
            let calculateExist = extraOrdinaryPayroll;
            response.data.map((item) => {
              calculateExist = calculateExist.filter(
                (a) => item.person.id != a.person.id
              );
            });
            response.data.map((item) => {
              calculateExist[calculateExist.length] = item;
            });

            setExtraOrdinaryPayroll(
              calculateExist.sort((a, b) =>
                a.person.first_name.localeCompare(b.person.first_name)
              )
            );
          } else {
            setExtraOrdinaryPayroll(
              response.data.sort((a, b) =>
                a.person.first_name.localeCompare(b.person.first_name)
              )
            );
          }
        }
        validatedStatusPayroll(response.data.consolidated);
        setLoading(false);
        // setObjectSend(null);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const rowSelectionPerson = {
    selectedRowKeys: personKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setPersonKeys(selectedRowKeys);
      setListPersons(selectedRows);
    },

    getCheckboxProps: (record) => ({
      disabled:
        (record.payroll_cfdi_person &&
          record.payroll_cfdi_person.status == 2) ||
        (!record.payroll_cfdi_person && !isOpen),
    }),
  };

  useEffect(() => {
    if (movementType && calendarSelect) {
      resetStateViews();
      sendCalculateExtraordinaryPayrroll({
        payment_period: periodSelected.id,
        calendar: calendarSelect.id,
        movement_type: movementType,
      });
    } else if (movementType === undefined) resetState();
  }, [movementType]);

  useEffect(() => {
    if (movementType && calendarSelect)
      sendCalculateExtraordinaryPayrroll({
        payment_period: periodSelected.id,
        calendar: calendarSelect.id,
        movement_type: movementType,
      });
  }, [calendarSelect]);

  const ExpandedFunc = (expanded, onExpand, record) => {
    if (movementType > 1 && record.working_days)
      return expanded ? (
        <DownOutlined onClick={(e) => onExpand(record, e)} />
      ) : (
        <RightOutlined onClick={(e) => onExpand(record, e)} />
      );
    else if (movementType == 1) {
      return expanded ? (
        <DownOutlined onClick={(e) => onExpand(record, e)} />
      ) : (
        <RightOutlined onClick={(e) => onExpand(record, e)} />
      );
    }
  };

  const calculateExtra = () => {
    const objSend = objectSend.payroll.filter((item) => item.departure_date);
    if (objSend.length == 0) {
      message.error(
        "Debe seleccionar una fecha de salida y un motivo por cada persona a calcular."
      );
      return;
    }
    sendCalculateExtraordinaryPayrroll({
      list: objSend,
      movement_type: movementType,
      calendar: calendarSelect.id,
      payment_period: periodSelected.id,
    });
  };

  const sendClosePayroll = () => {
    if (movementType > 1) {
      if (objectSend == null || objectSend.length == 0) {
        message.error(
          "Debe seleccionar almenos una persona y generar el calculo."
        );
        return;
      }
      const objSend = objectSend.payroll.filter((item) => item.departure_date);
      if (objSend.length == 0) {
        message.error(
          "Debe seleccionar una fecha de salida y un motivo por cada persona a calcular."
        );
        return;
      }
    }
    setLoading(true);
    WebApiPayroll.consolidatedExtraordinaryPayroll({
      payment_period: periodSelected.id,
      payroll: consolidatedObj,
      movement_type: movementType,
    })
      .then((response) => {
        // resetStateViews();
        if (movementType == 2 || movementType == 3) {
          setListPersons([]);
          setPersonKeys([]);
        }
        sendCalculateExtraordinaryPayrroll({
          payment_period: periodSelected.id,
          movement_type: movementType,
        });
        setTimeout(() => {
          message.success(messageSaveSuccess);
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const setPayrollCalculate = (data) => {
    console.log("🚀 ~ file: index.jsx:623 ~ setPayrollCalculate ~ data", data);
    setExtraOrdinaryPayroll(data.payroll);
    setObjectSend(data);
  };

  const validatedStatusPayroll = (data) => {
    console.log(
      "🚀 ~ file: index.jsx:625 ~ validatedStatusPayroll ~ data",
      data
    );

    if (data === null || data === undefined) {
      setStep(0), setPreviuosStep(false), setNextStep(true), setIsOpen(true);
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
      setStep(1), setPreviuosStep(true), setNextStep(true);
      return;
    }
    if (data.status === 2) {
      setStep(2), setPreviuosStep(false), setNextStep(true);
      return;
    }
    if (data.status === 3 && !data.is_open) {
      setStep(3), setPreviuosStep(true), setNextStep(false);
      return;
    }
    if (data.status === 3 && data.is_open) {
      setStep(0), setPreviuosStep(true), setNextStep(true);
      return;
    }
  };

  const changeStep = (next_prev) => {
    if (next_prev) {
      //next
      if (step == 0) {
        setStep(step + 1);
        setPreviuosStep(true);
        if (isOpen)
          if (movementType > 1 && isOpen) setNextStep(true);
          else setNextStep(false);
        return;
      }
      if (step == 1) {
        setStep(step + 1);
        if (!isOpen) setPreviuosStep(false);
        return;
      }
      if (step == 2) {
        setStep(step + 1);
        setPreviuosStep(true);
        setNextStep(false);
        return;
      }
    } else {
      //previous
      if (step == 1) {
        setStep(step - 1);
        if (movementType > 1 && isOpen) setPreviuosStep(true);
        else setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
        return;
      }
      if (step == 2) {
        setStep(step - 1);
        if (movementType > 1 && isOpen) setPreviuosStep(true);
        else setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
        return;
      }
      if (step == 3) {
        setStep(step - 1);
        if (movementType > 1 && isOpen) setPreviuosStep(true);
        else setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
        return;
      }
    }
  };

  const stampPayroll = (
    data = {
      payment_period: periodSelected.id,
      movement_type: movementType,
      payroll_type: "E",
    }
  ) => {
    if (listPersons.length > 0)
      data = {
        payment_period: periodSelected.id,
        array_cfdi: listPersons.map((item) => {
          return item.payroll_cfdi_person.id;
        }),
        movement_type: movementType,
        payroll_type: "E",
      };
    const inputPaymentDate = document.getElementById("payment_date");
    if (inputPaymentDate.value != null && inputPaymentDate.value != "") {
      data.pay_date = inputPaymentDate.value;
      // if (department) data.department = department;
      // if (job) data.job = job;
      setGenericModal(false);
      setLoading(true);
      WebApiPayroll.stampPayroll(data)
        .then((response) => {
          setPersonKeys([]);
          setPersonId(null);
          setListPersons([]);
          setLoading(false);
          setMessageModal(4);
          message.success(messageSendSuccess);
          sendCalculateExtraordinaryPayrroll({
            payment_period: periodSelected.id,
            movement_type: movementType,
          });
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
    } else {
      message.error("Se requeiere una fecha de pago");
    }
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
          title_action_button: "Sí, cerrar nómina",
        });
        setGenericModal(true);
        break;
      case 3:
        setInfoGenericModal({
          title: "Timbrar nómina",
          title_message: "¿Esta seguro de timbrar la nómina?",
          description:
            "Verifica que la fecha de pago sea correcta, se emitiran todos los cfdi correspondientes ante el SAT.",
          type_alert: "warning",
          action: () => stampPayroll(),
          components: (
            <>
              <Row
                style={{
                  width: "100%",
                  marginTop: "10px",
                }}
                justify="center"
              >
                <Form.Item label="Fecha de pago" style={{ width: "40%" }}>
                  <DatePicker
                    defaultValue={moment(periodSelected.payment_date)}
                    moment={"YYYY"}
                    id="payment_date"
                    placeholder="Fecha de pago."
                    locale={locale}
                  />
                </Form.Item>
              </Row>
            </>
          ),
          title_action_button: "Sí, timbrar",
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

          closeButton: "Cerrar",
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

  const cancelOneStamp = (data) => {
    setMessageModal(5, {
      title: "Cancelar nómina",
      description:
        "Al cancelar se debera timbrar un nuevo cfdi. Para poder completar la cancelación es necesario capturar el motivo por el cual se cancela.",
      type_alert: "warning",
      action: () =>
        cfdiCancel.length > 0 ? cancelStamp(2) : cancelStamp(3, data),
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
              maxLength={290}
              id="motive"
              placeholder="Capture el motivo de cancelacion."
            />
          </Row>
        </>
      ),
    });
  };

  const cancelStamp = (type, id = null) => {
    const inputMotive = document.getElementById("motive");
    if (inputMotive.value != null && inputMotive.value.trim() != "") {
      setLoading(true);
      setGenericModal(false);
      let data = {
        motive: inputMotive.value.trim(),
        payment_period: periodSelected.id,
        movement_type: movementType,
      };
      if (cfdiCancel.length > 0 && type == 2) data.cfdis_id = cfdiCancel;
      else if (type == 3) data.cfdis_id = [id];
      WebApiPayroll.cancelCfdi(data)
        .then((response) => {
          message.success(messageUpdateSuccess);
          sendCalculateExtraordinaryPayrroll({
            payment_period: periodSelected.id,
            movement_type: movementType,
          });
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

  const openPayroll = (type) => {
    let data = {
      payment_period: periodSelected.id,
      movement_type: movementType,
    };
    if (listPersons.length > 0)
      data.cfdis = listPersons.map((item) => {
        return item.payroll_cfdi_person.id;
      });
    const inputMotive = document.getElementById("motive");
    if (inputMotive.value != null && inputMotive.value.trim() != "") {
      (data.opening_reason = inputMotive.value.trim()), setLoading(true);
      setGenericModal(false);
      WebApiPayroll.openConsolidationPayroll(data)
        .then((response) => {
          message.success(messageUpdateSuccess);
          sendCalculateExtraordinaryPayrroll({
            payment_period: periodSelected.id,
            movement_type: movementType,
          });
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

  return (
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
      <MainLayout
        currentKey={["extraordinaryPayroll"]}
        defaultOpenKeys={["managementRH", "payroll"]}
      >
        <Breadcrumb>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Nominas extraordinarias</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{ width: "100%" }}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Card className="form_header">
                <Form form={form} layout="vertical">
                  <Row gutter={[16, 8]}>
                    <>
                      <Col xxs={24} xl={4}>
                        <Form.Item
                          name="movement_type"
                          label="Tipo de movimento"
                        >
                          <Select
                            size="large"
                            style={{ width: "100%" }}
                            options={optionMovement}
                            onChange={(e) => setMovementType(e)}
                            placeholder="Movimiento"
                            notFoundContent={"No se encontraron resultados."}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                    </>
                    {movementType && (
                      <Col xxs={24} xl={4}>
                        <Form.Item name="calendar" label="Calendario">
                          <Select
                            size="large"
                            style={{ width: "100%" }}
                            options={optionspPaymentCalendars}
                            onChange={changeCalendar}
                            placeholder="Calendarios"
                            notFoundContent={"No se encontraron resultados."}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                    )}
                    {periodSelected && (
                      <>
                        <Col xxs={24} xl={4}>
                          <Form.Item name="periodicity" label="Periodicidad">
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
                                resetStateViews(),
                                  sendCalculateExtraordinaryPayrroll({
                                    payment_period: value,
                                    movement_type: movementType,
                                    calendar: calendarSelect.id,
                                  });
                                setPeriodSelcted(
                                  calendarSelect.periods.find(
                                    (p) => p.id == value
                                  )
                                );
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
                        {(job || department) && (
                          <Col xxs={1} xl={1}>
                            <Button
                              style={{ marginTop: "30px", marginRight: 20 }}
                              size="large"
                              icon={<SearchOutlined />}
                            />
                          </Col>
                        )}
                      </>
                    )}
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
          <Col span={24}>
            {calendarSelect && (
              <>
                <div style={{ marginTop: "10px" }}>
                  <Steps current={step}>
                    <Steps.Step
                      title="Calcular"
                      description="Cálculo de nómina."
                    />
                    <Steps.Step
                      title="Cerrar"
                      description="Cierre de nómina."
                    />
                    <Steps.Step title="Timbrar" description="Timbre fiscal." />
                    <Steps.Step title="Comprobantes" description="XML y PDF." />
                  </Steps>
                  <div
                    style={{
                      backgroundColor: "#fafafa",
                      borderRadius: "15px",
                      marginBottom: 10,
                    }}
                  >
                    <Row
                      justify="start"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      {personKeys &&
                        personKeys.length > 0 &&
                        objectSend &&
                        step == 0 && (
                          <Col md={5} offset={1}>
                            <Button
                              size="large"
                              block
                              htmlType="button"
                              onClick={() => calculateExtra()}
                            >
                              Calcular
                            </Button>
                          </Col>
                        )}

                      {step >= 1 && consolidatedObj && isOpen && (
                        <>
                          <Col md={5} offset={1}>
                            <Button
                              size="large"
                              block
                              icon={<LockOutlined />}
                              htmlType="button"
                              onClick={() => sendClosePayroll()}
                            >
                              Cerrar nómina
                            </Button>
                          </Col>
                        </>
                      )}
                      {((step == 2 &&
                        consolidated &&
                        consolidated.status <= 2) ||
                        (step == 2 && movementType >= 1 && !isOpen)) && (
                        <Col md={5} offset={1}>
                          <Button
                            size="large"
                            block
                            icon={<UnlockOutlined />}
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
                                        maxLength={290}
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
                      {step == 2 && consolidated && consolidated.status < 3 && (
                        <Col md={5} offset={1}>
                          <Button
                            size="large"
                            block
                            icon={<FileDoneOutlined />}
                            htmlType="button"
                            onClick={() => setMessageModal(3)}
                          >
                            Timbrar nómina
                          </Button>
                        </Col>
                      )}

                      {step == 3 && (
                        <Col md={6} offset={1}>
                          <Button
                            size="large"
                            block
                            icon={<StopOutlined />}
                            htmlType="button"
                            onClick={() =>
                              setMessageModal(5, {
                                title: "Cancelar nómina",
                                description:
                                  "Al cancelar nómina se debera iniciar el proceso de cierre de nómina de nuevo. Para poder completar la cancelación es necesario capturar el motivo por el caul se cancela.",
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
                                        maxLength={290}
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

                      {/* 
                          {step >= 1 && (
                            <>
                             
                              {step == 2 &&
                                consolidated &&
                                consolidated.status < 3 && (
                                  <Col md={5} offset={1}>
                                    <Button
                                      size="large"
                                      block
                                      icon={<FileDoneOutlined />}
                                      htmlType="button"
                                      onClick={() => setMessageModal(3)}
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
                                    icon={<StopOutlined />}
                                    htmlType="button"
                                    onClick={() =>
                                      setMessageModal(5, {
                                        title: "Cancelar nómina",
                                        description:
                                          "Al cancelar nómina se debera iniciar el proceso de cierre de nómina de nuevo. Para poder completar la cancelación es necesario capturar el motivo por el caul se cancela.",
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
                                                maxLength={290}
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
                        </>
                      )} */}
                    </Row>
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

                <Card className="card_table">
                  {step == 3 ? (
                    <CfdiVaucher
                      calendar={calendarSelect.id}
                      period={periodSelected.id}
                      viewFilter={false}
                      setKeys={setCfdiCancel}
                      clickCancelStamp={cancelOneStamp}
                      movementType={movementType}
                    />
                  ) : (
                    <>
                      <Table
                        className="headers_transparent"
                        dataSource={extraOrdinaryPayroll}
                        columns={persons}
                        expandable={{
                          expandedRowRender: (item) =>
                            renderConceptsTable(item),
                          expandIcon: ({ expanded, onExpand, record }) =>
                            ExpandedFunc(expanded, onExpand, record),
                        }}
                        hideExpandIcon
                        loading={loading}
                        locale={{
                          emptyText: loading
                            ? "Cargando..."
                            : "No se encontraron resultados.",
                        }}
                        rowSelection={
                          movementType === 2 || movementType === 3
                            ? rowSelectionPerson
                            : movementType == 1 && step == 2
                            ? rowSelectionPerson
                            : null
                        }
                      />
                      {totalPayment != null && totalIsr != null ? (
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
                                  number={totalPayment}
                                />
                              </div>
                              <div>
                                <NumberFormat prefix={"$"} number={totalIsr} />
                              </div>
                              <div>
                                <NumberFormat prefix={"$"} number={netPay} />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      ) : null}
                    </>
                  )}
                </Card>
              </>
            )}
          </Col>
        </div>
      </MainLayout>
      {personId && periodSelected && (
        <ModalConceptsPayroll
          extraOrdinary={true}
          visible={modalVisible}
          setVisible={setModalVisible}
          calendar={{
            payment_period: periodSelected.id,
          }}
          person_id={personId}
          payroll={extraOrdinaryPayroll}
          setLoading={setLoading}
          sendCalculatePayroll={setPayrollCalculate}
          movementType={movementType}
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
          closeButton={
            infoGenericModal.closeButton
              ? infoGenericModal.closeButton
              : "Cerrar"
          }
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
    </Spin>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ExtraordinaryPayroll));
