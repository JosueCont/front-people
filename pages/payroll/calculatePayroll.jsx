import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../layout/MainInter";
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
  Upload,
  DatePicker,
  Tag,
  Tooltip,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import router, { useRouter } from "next/router";
import {
  PlusOutlined,
  RightOutlined,
  DownOutlined,
  UserOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  FileExcelOutlined,
  FileDoneOutlined,
  UnlockOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  StopOutlined,
  ClearOutlined,
  SearchOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FilePdfTwoTone,
} from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";
import WebApiPayroll from "../../api/WebApiPayroll";
import ModalConceptsPayroll from "../../components/payroll/modals/ModalConceptsPayroll";
import { Global } from "@emotion/core";
import {
  downLoadFileBlobAwait,
  getDomain,
  verifyMenuNewForTenant,
} from "../../utils/functions";
import { connect } from "react-redux";
import {
  messageError,
  messageSaveSuccess,
  messageSendSuccess,
  messageUpdateSuccess,
  messageUploadSuccess,
} from "../../utils/constant";
import GenericModal from "../../components/modal/genericModal";
import { API_URL_TENANT } from "../../config/config";
import NumberFormat from "../../components/formatter/numberFormat";
import CfdiVaucher from "../../components/payroll/cfdiVaucher";
import SelectDepartment from "../../components/selects/SelectDepartment";
import SelectJob from "../../components/selects/SelectJob";
import moment from "moment";
import NumericInput from "../../components/inputNumeric";
import locale from "antd/lib/date-picker/locale/es_ES";
const formatNumber = (value) => new Intl.NumberFormat().format(value);
import SelectCollaboratorItemForm from '../../components/selects/SelectCollaboratorItemForm'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useReactToPrint } from 'react-to-print';
import SelectPeople from "../../components/people/utils/SelectPeople";
import {ruleRequired} from "../../utils/rules";
import LinkToPerson from "../../components/person/LinkToPerson";


const CalculatePayroll = ({ ...props }) => {
  const { Text } = Typography;
  const [form] = Form.useForm();
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payroll, setPayroll] = useState([]);
  const [payrollOriginal, setPayrollOriginal] = useState([]);
  const [expandRow, setExpandRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [personId, setPersonId] = useState(null);
  const [workingDays, setWorkingDays] = useState(0)
  const [payrollType, setPayrollType] = useState(null);
  const [consolidated, setConsolidated] = useState(null);
  const [genericModal, setGenericModal] = useState(false);
  const [activePeriod, setActivePeriod] = useState(null);
  const [calculate, setCalculate] = useState(false);
  // const [totalSalary, setTotalSalary] = useState(null);
  // const [totalIsr, setTotalIsr] = useState(null);
  const [netPay, setNetPay] = useState(null);
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
  const [arrayCfdi, setArrayCfdi] = useState([]);
  const [totalPerceptions, setTotalPerceptions] = useState(null);
  const [downloading, setDownloading] = useState(false)
  const [totalDeductions, setTotalDeductions] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [defaultSize, setDefaultSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [exportTable, setExportTable] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false);
  const [sharingPayroll, setSharingPayroll] = useState(false)


  const componentRef = useRef();
  const promiseResolveRef = useRef(null);




  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

  const [infoGenericModal, setInfoGenericModal] = useState({
    title: "Timbrado de nómina",
    title_message: "Timbrado de nómina exitoso",
    description:
      "La nómina fue timbrada correctamente, puede visualizar los comprobantes fiscales o continuar calculando otras nóminas.",
    type_alert: "success",

    closeButton: "Cancelar",
    viewActionButton: false,
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
            {item.person && item.person.full_name} <LinkToPerson personId={item.person.id}/>
          </Space>
        </div>
      ),
    },
    {
      title: "SD",
      key: "SD",
      className: "cursor_pointer",
      render: (item) => (
          <div>
            <NumberFormat
                prefix={"$"}
                number={
                  item.daily_salary
                      ? item.daily_salary
                      : 0.0
                }
            />
          </div>
      ),
    },
    {
      title: "SDI",
      key: "SDI",
      className: "cursor_pointer",
      render: (item) => (
          <div>
            <NumberFormat
                prefix={"$"}
                number={
                  item.integrated_daily_salary
                      ? item.integrated_daily_salary
                      : 0.0
                }
            />
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
            number={
              item.calculation && item.calculation.total_perceptions
                ? item.calculation.total_perceptions
                : 0.0
            }
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
            number={
              item.calculation && item.calculation.total_deductions
                ? item.calculation.total_deductions
                : 0.0
            }
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
          <NumberFormat
            prefix={"$"}
            number={
              item.calculation && item.calculation.net_salary
                ? item.calculation.net_salary
                : 0.0
            }
          />
        </div>
      ),
    },
    {
      key: "actions",
      className: "cell-actions",
      render: (item) => (
        <>
        {
          step == 2 &&
          <Tooltip title="Comprobante" key={item.id} color={"#3d78b9"}>
              <FilePdfTwoTone
                  twoToneColor="#34495E"
                  onClick={() => downloadReceipt(item)}
                  style={{ fontSize: "25px" }}
              />
          </Tooltip>
        }
          {item.payroll_cfdi_person &&
          item.payroll_cfdi_person.is_open &&
          step == 0 ? (
            <Button
              size="small"
              onClick={() => {
                setPersonId(item.person && item.person.id),
                  setModalVisible(true);
              }}
            >
              <PlusOutlined />
            </Button>
          ) : (
            isOpen &&
            step == 0 &&
            !consolidated && (
              <Button
                size="small"
                onClick={() => {
                  setWorkingDays(item?.working_days)
                  setPersonId(item.person && item.person.id),
                  setModalVisible(true);
                }}
              >
                <PlusOutlined />
              </Button>
            )
          )}
        </>
      ),
    },
  ];

  const renderConceptsTable = (data) => {
    let dataPerceptions = data.perceptions;
    let dataDeductions = data.deductions;
    let dataOtherPayments = data.other_payments;
    dataPerceptions = dataPerceptions.sort((a, b) => b.is_salary - a.is_salary) // se ordena de tal forma que primero salgan los que son tipo sueldo
    dataDeductions = _.orderBy(dataDeductions,['type'])

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
      },
      {
        title: "Gravado",
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
        key: "exempt_amount",
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
        key: "amount",
        width: "15%",
        render: (item) => (
          <>
            {data.payroll_cfdi_person &&
            data.payroll_cfdi_person.is_open &&
            step === 0 &&
            item.type === "046" ? (
              <Space size="middle">
                <NumericInput
                  key={item.type}
                  initValue={item.value}
                  valueItem={(newValue) => {
                    item.value = Number(newValue);
                    setCalculate(true);
                  }}
                  disabled={false}
                />
              </Space>
            ) : item.type === "046" && isOpen && !consolidated && step === 0 ? (
              <Space size="middle">
                <NumericInput
                  key={item.type}
                  initValue={item.value}
                  maxLength={15}
                  valueItem={(newValue) => {
                    item.value = Number(newValue);
                    setCalculate(true);
                  }}
                  disabled={false}
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

    const columnsOtherPayments = [
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
        width: "70%",
      },
      {
        title: "Importe",
        key: "amount",
        dataIndex: "amount",
        width: "20%",
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
            <small>
            Subsidio causado: ${ new Intl.NumberFormat().format(data?.calculation?.allowance_creditable)}
            </small>
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
              flexDirection: "column-reverse",
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
                    number={data.calculation.total_perceptions}
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
                    number={data.calculation.total_deductions}
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
                    number={data.calculation.net_salary}
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
    // setTotalSalary(null);
    // setTotalIsr(null);
    setTotalPerceptions(null);
    setTotalDeductions(null);
    setNetPay(null);
    const calendar = paymentCalendars.find((item) => item.id === value);
    let period = calendar.periods.find((p) => p.active == true);
    if (!period) period = calendar.periods[0];
    setPeriodSelcted(period);
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

  useEffect(() => {
    if (periodSelected && periodSelected != undefined && calendarSelect) {
      const calendar = paymentCalendars.find(
        (item) => item.id === calendarSelect.id
      );
      let period = calendar.periods.find((p) => p.id == periodSelected.id);

      form.setFieldsValue({
        payment_day: period.payment_date,
      });
    }
  }, [periodSelected]);

  const resetStates = () => {
    setStep(0);
    setPayroll([]);
    setPayrollOriginal([])
    setLoading(true);
    setModalVisible(false);
    setPersonId(null);
    // setTotalSalary(null);
    // setTotalIsr(null);
    setTotalPerceptions(null);
    setTotalDeductions(null);
    setNetPay(null);
    setConsolidated(null);
  };

  
  const sendCalculatePayroll = async (dataToSend) => {
    resetStates();
    if (department) dataToSend.department = department;
    if (job) dataToSend.job = job;
    await WebApiPayroll.calculatePayroll(dataToSend)
      .then((response) => {
        let total_perceptions = 0;
        let total_deductions = 0;
        response.data.payroll.map((item) => {
          total_perceptions += item.calculation.total_perceptions;
          total_deductions += item.calculation.total_deductions;
        });

        setLoading(false);
        setConsolidated(response.data.consolidated);
        setPayroll(response.data.payroll);
        setPayrollOriginal(response.data.payroll)
        setCalculate(false);
        // setTotalSalary(response.data.total_salary);
        // setTotalIsr(response.data.total_isr);
        setTotalPerceptions(total_perceptions);
        setTotalDeductions(total_deductions);
        setNetPay(total_perceptions - total_deductions);
        validatedStatusPayroll(response.data.consolidated);
        setPersonsKeys([]);
        setPersonsStamp([]);
        // if (dataToSend.status)
        //   sendClosePayroll(6, response.data.payroll, dataToSend.person_edit);
      })
      .catch((error) => {
        setPersonsStamp([]);
        setPersonsKeys([]);
        setCalculate(false);
        console.log(error);
        setPayroll([]);
        setPayrollOriginal([])
        form.resetFields();
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          if (error.response.data.message.includes("concepto interno")) {
          }
          setMessageModal(1, error.response.data.message);
          setGenericModal(true);
        } else message.error(messageError);
        setLoading(false);
      }).finally(() => {
        console.log('finally')
        form.submit()
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
      payment_period: periodSelected.id,
      payroll: data,
    });
  };

  // const sendClosePayroll = () => {
  const sendClosePayroll = (
    status_consolidated = null,
    payroll_send = null,
    person_edit = null
  ) => {
    setGenericModal(false);
    setLoading(true);
    const data = {
      payment_period: periodSelected.id,
      payroll: payroll_send != null ? payroll_send : payroll,
    };
    if (status_consolidated != null) {
      data.status = status_consolidated;
      data.person_edit = person_edit;
    }
    setGenericModal(false);
    setLoading(true);
    WebApiPayroll.closePayroll(data)
      .then((response) => {
        if (status_consolidated == null)
          sendCalculatePayroll({ payment_period: periodSelected.id });
        setTimeout(() => {
          message.success(messageSaveSuccess);
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        sendCalculatePayroll({ payment_period: periodSelected.id });
        setTimeout(() => {
          if (error.response?.data?.message) {
            message.error(error.response.data.message);
          } else {
            message.error(messageError);
          }
          // message.error(messageError);
          console.log(error);
        }, 1000);
      });
  };

  const stampPayroll = (
    data = {
      payment_period: periodSelected.id,
    }
  ) => {
    if (personStamp.length > 0)
      data = {
        payment_period: periodSelected.id,
        array_cfdi: personStamp.map((item) => {
          return item.payroll_cfdi_person.id;
        }),
      };
    const inputPaymentDate = document.getElementById("payment_date");
    if (inputPaymentDate.value != null && inputPaymentDate.value != "") {
      data.pay_date = inputPaymentDate.value;
      if (department) data.department = department;
      if (job) data.job = job;
      setGenericModal(false);
      setLoading(true);
      WebApiPayroll.stampPayroll(data)
        .then((response) => {
          setLoading(false);
          setMessageModal(4);
          message.success(messageSendSuccess);
          sendCalculatePayroll({ payment_period: periodSelected.id });
        })
        .catch(async (error) => {
          console.log(error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {

            setMessageModal(1,error?.response?.data?.message,error?.response?.data?.errors);
            setGenericModal(true);
          } else message.error(messageError);
          setLoading(false);
        });
    } else {
      message.error("Se requeiere una fecha de pago");
    }
  };

  const setMessageModal = (type, data,errors=[]) => {
    const check_configuration = (data,errors=[]) => {
      if (data.includes("concepto interno")) {
        let words = data.split(" ");
        let data_parts = words.map((x) => {
          if (x === "configuración") {
            return (
              <a
                style={{ color: "blue" }}
                onClick={() => router.push("/config/catalogs/")}
              >
                configuración&nbsp;
              </a>
            );
          } else {
            return <span>{x}&nbsp;</span>;
          }
        });
        return <span>{data_parts}</span>;
      } else {
        if(errors && errors.length>0){
          return <span>{data} <ul>{errors.map((err)=> <li>{err}</li>)}</ul></span>;
        }else{
          return data;
        }

      }
    };
    switch (type) {
      case 1:
        setInfoGenericModal({
          title: data.toLowerCase().includes("fiscal information")
            ? "Información fiscal"
            : data.toLowerCase().includes("fiscal address")
            ? "Dirección fiscal"
            : data.toLowerCase().includes("folios")
            ? "Folios"
            : data.toLowerCase().includes("patronal") ||
              data.toLowerCase().includes("riesgo")
            ? "Registro patronal"
            : "Error",

          title_message: data.toLowerCase().includes("fiscal information")
            ? "Información fiscal faltante"
            : data.toLowerCase().includes("fiscal address")
            ? "Dirección fiscal faltante"
            : data.toLowerCase().includes("folios")
            ? "Folios insuficientes"
            : data.toLowerCase().includes("patronal") ||
              data.toLowerCase().includes("riesgo")
            ? "Registro patronal faltante"
            : "Error",
          description: data.toLowerCase().includes("fiscal information")
            ? "Falta información relevante para poder generar los cfdi, verifique la información fiscal de la empresa he intente de nuevo."
            : data.toLowerCase().includes("fiscal address")
            ? "Datos en la dirección fiscal faltantes, verifique la información fiscal he intente de nuevo"
            : data.toLowerCase().includes("folios")
            ? "No cuenta con los folios suficientes para poder timbrar su nómina, contacte con soporte."
            : data.toLowerCase().includes("patronal") ||
              data.toLowerCase().includes("riesgo")
            ? "Falta información relevante para poder generar los cfdi, verifique la información del registro patronal he intente de nuevo."
            : check_configuration(data, errors),
          type_alert: data.toLowerCase().includes("error")
            ? "error"
            : "warning",
          action: () =>
            data.toLowerCase().includes("fiscal information") ||
            data.toLowerCase().includes("fiscal address")
              ? router.push({
                  pathname: `/business/companies/${props.currentNode.id}`,
                  query: {
                    tab: 2,
                  },
                })
              : data.toLowerCase().includes("patronal") ||
                data.toLowerCase().includes("riesgo")
              ? router.push({ pathname: "/business/patronalRegistrationNode" })
              : setGenericModal(false),
          title_action_button:
            data.toLowerCase().includes("fiscal information") ||
            data.toLowerCase().includes("fiscal address")
              ? "Ver información fiscal"
              : data.toLowerCase().includes("patronal") ||
                data.toLowerCase().includes("riesgo")
              ? "Ver registro patronal"
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

          closeButton: "Cancelar",
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
      case 6:
        setInfoGenericModal({
          title: data.title,
          title_message: data.title_message,
          description: data.description,
          type_alert: data.type_alert,
          action: data.action,
          title_action_button: data.title_action_button,
          viewActionButton: data.viewActionButton,          
        });
        setGenericModal(true);
        break;
    }

    return;
  };

  /* useEffect(() => {
    if (calendarSelect) {
      const filter = {
        payment_period: periodSelected.id,
      };

      if (department) filter.department = department;
      if (job) filter.job = job;
      sendCalculatePayroll(filter);
    }
  }, [department, job]); */

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
    let data = {
      payment_period: periodSelected.id,
    };
    if (personStamp.length > 0)
      data.cfdis = personStamp.map((item) => {
        return item.payroll_cfdi_person.id;
      });
    const inputMotive = document.getElementById("motive");
    if (inputMotive.value != null && inputMotive.value.trim() != "") {
      (data.opening_reason = inputMotive.value.trim()), setLoading(true);
      setGenericModal(false);
      WebApiPayroll.openConsolidationPayroll(data)
        .then((response) => {
          message.success(messageUpdateSuccess);
          sendCalculatePayroll({ payment_period: periodSelected.id });
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            message.error(error.response.data.message);
          } else {
            message.error(messageError);
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
      message.warning("Motivo requerido");
    }
  };

  const validatedStatusPayroll = (data) => {
    
    if (data === null) {
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
  };

  const changeStep = (next_prev) => {
    if (next_prev) {
      //next
      if (step == 0) {
        setStep(step + 1);
        setPreviuosStep(true);
        if (isOpen) setNextStep(false);
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
        setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
        return;
      }
      if (step == 2) {
        setStep(step - 1);
        setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
        return;
      }
      if (step == 3) {
        setStep(step - 1);
        setPreviuosStep(false);
        if (!nextStep) setNextStep(true);
        return;
      }
    }
  };

  const cancelStamp = (type, id = null) => {
    const inputMotive = document.getElementById("motive");
    if (inputMotive.value != null && inputMotive.value.trim() != "") {
      setLoading(true);
      setGenericModal(false);
      let data = {
        motive: inputMotive.value.trim(),
        payment_period: periodSelected.id,
      };
      if (cfdiCancel.length > 0 && type == 2) data.cfdis_id = cfdiCancel;
      else if (type == 3) data.cfdis_id = [id];
      WebApiPayroll.cancelCfdi(data)
        .then((response) => {
          message.success(messageUpdateSuccess);
          sendCalculatePayroll({ payment_period: periodSelected.id });
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
  

  const generateDispersion =  async () => {
    let data;
    setDownloading(true)
    if (personStamp.length > 0){
      let list = personStamp.map(item => item.payroll_cfdi_person.id)
      data = {
        cfdis: list
      }
    }else{
      data = {
        period_id: periodSelected.id
      }
    }
    try {
      let response = await WebApiPayroll.generateDispersion(data)
      if (response.data.message){
        message.error(response.data.message)
      }else{
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Dispersión bancaria.txt";
        link.click();
        message.success("Archivo descargado")
      }
      setDownloading(false)
    } catch (error) {
      console.log('error', error)
      setDownloading(false)
    }
  }
  

  const importPayrollCaculate = (data) => {
    setLoading(true);
    setPayroll([]);
    setPayrollOriginal([])
    setTotalPerceptions(null);
    setTotalDeductions(null);
    setNetPay(null);
    setConsolidated(null);
    WebApiPayroll.importPayrollCaculate(data)
      .then((response) => {
        let total_perceptions = 0;
        let total_deductions = 0;
        response.data.payroll.map((item) => {
          total_perceptions += item.calculation.total_perceptions;
          total_deductions += item.calculation.total_deductions;
        });
        setConsolidated(response.data.consolidated);
        /*  */
        setPayroll(response.data.payroll);
        setPayrollOriginal(response.data.payroll)
        setCalculate(false);
        // setTotalSalary(response.data.total_salary);
        setTotalPerceptions(total_perceptions);
        setTotalDeductions(total_deductions);
        setNetPay(total_perceptions - totalDeductions);
        // setTotalIsr(response.data.total_isr);
        validatedStatusPayroll(response.data.consolidated);
        setPersonsKeys([]);
        setPersonsStamp([]);
        message.success(messageUploadSuccess);
        setLoading(false);
      })
      .catch((error) => {
        sendCalculatePayroll({ payment_period: periodSelected.id });
        setLoading(false);
        message.error(messageError);
      });
  };

  const onChangeJob = (value) => {
    value && value != undefined ? setJob(value) : setJob(null)
    form.setFields([
      {
        name:'person_id',
        value: []
      }
    ])
  }

  const onchangeDeptop = (value) => {
    value && value != undefined ? setDepartment(value) : setDepartment(null)
    form.setFields([
      {
        name:'person_id',
        value: []
      }
    ])
  }

  const clearFilter = () => {
    form.setFieldsValue({
      department: null,
      job: null,
      person_id: []
    });
    setPayroll([...payrollOriginal])
  }

  const localFilter = (values) => {
    console.log(values)
    console.log(payroll)
    let newList = [...  payrollOriginal];

    if(values.person_id && values.person_id.length >= 1){
      newList = newList.filter(item => values.person_id.includes(item.person.id))
    }

    if(values.job){
      newList = newList.filter(item => values.job === item.person.job.id)
    }

    if(values.department){
      newList = newList.filter(item => values.department === item.person.department_id)
    }
    console.log('newList', newList)
    setPayroll(newList)
  }

  const sendForm = (values) => {
    values['payment_period'] = periodSelected.id,
    localFilter(values)
    /* sendCalculatePayroll(values) */
  }

  const deletePayroll = (consolidated_id) => {
    let data = {
      consolidated_id: consolidated_id,
    };
   
    setLoading(true);
    setGenericModal(false);
    WebApiPayroll.deleteConsolidationPayroll(data)
      .then((response) => {
        message.success("Reiniciaro correctamente");
        sendCalculatePayroll({ payment_period: periodSelected.id });
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          message.error(error.response.data.message);
        } else {
          message.error(messageError);
        }
        setLoading(false);
      });   
  };


  const changePeriod = (period_id) => {

    let period = calendarSelect.periods.find((p) => p.id == period_id);

    form.setFieldsValue({
      insidences: `${period.incidences.start_date} - ${period.incidences.end_date}`
    });
    
    setPeriodSelcted(
      calendarSelect.periods.find(
        (p) => p.id == period_id
      )
    );

    let values = form.getFieldsValue()
    values['payment_period'] = period_id
    sendCalculatePayroll(values)
  }

  const ButtonsDownloads = () => (
    <Menu sty>
        <Menu.Item
            key='1'
            icon={<DeleteOutlined />}
            /* onClick={() => showManyDelete()} */
        >
            Eliminar
        </Menu.Item>
    </Menu>
  )

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);
  
  const exportPdf = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setDefaultSize(10000)
        let keys = payroll.map((item) => {
          return item.key;
        })
        setExpandedRowKeys(keys)  
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
      setDefaultSize(10)
      setExpandedRowKeys([])  
    }
  });

  const _exportPdf = () => {
    

    /* setDefaultSize(5)

    let nPages = payroll.length / 5

    let keys = payroll.map((item) => {
      return item.key;
    })
    let prevPage = {...currentPage}
    
    const pdf = new jsPDF({ format : 'legal' });
    setExpandedRowKeys(keys)  
    for (let index = 0; index < nPages; index++) {
      setExportTable(true)
      setTimeout(() => {
        setCurrentPage(index+1)  
      }, 1000);
      
      
      let input = document.querySelector(".ant-table-content")
      html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 2, 0, 210, 350);
        
      });
    }

    

    setTimeout(() => {
      pdf.save("download.pdf");  
      setDefaultSize(10)
      setExpandedRowKeys([])
    }, 5000) */
    
  }

  

    /* {
      key: '1',
      label: (
        <a rel="noopener noreferrer" href="#">
          Nomina
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ]; */

  const downloadNomina = () => {
    isOpen
    ? downLoadFileBlobAwait(
        `${getDomain(
          API_URL_TENANT
        )}/payroll/payroll-calculus`,
        `nomina_abierta_periodo${periodSelected.name}.xlsx`,
        "POST",
        {
          payment_period: periodSelected.id,
          extended_report: "True",
          department: department,
          job: job,
          payroll: payroll.map((item) => {
            item.person_id = item.person.id;
            return item;
          }),
        },
        "",
        setDownloading,
        2
      )
    : downLoadFileBlobAwait(
        `${getDomain(
          API_URL_TENANT
        )}/payroll/payroll-report?export=True&&report_type=PAYROLL_DETAILED&consolidated_type=1&cfdi_movement=0&consolidated_movement=0&node__id=${props.currentNode.id}&payment_periods=${
          periodSelected.id
        }`,
        `nomina_cerrada_periodo${periodSelected.name}.xlsx`,
        "GET",
        "",
        "",
        setDownloading,
        2
      );
  }

  const downloadNominaProv = () => {
    downLoadFileBlobAwait(
        `${getDomain(
          API_URL_TENANT
        )}/payroll/payroll-report?export=True&consolidated_type=1&consolidated_movement=0&cfdi_movement=0&report_type=PAYROLL_DETAILED_PROVISIONS&node__id=${props.currentNode.id}&payment_periods=${
          periodSelected.id
        }`,
        `nomina_proviciones_${periodSelected.name}.xlsx`,
        "GET",
        "",
        "",
        setDownloading,
        2
      );
  }


  const downloadActions = ({ key }) => {
    console.log('key', key)
    if(key === 'nom'){
      downloadNomina()
    }else if(key === 'nomprov'){
      downloadNominaProv()
    }else if(key === 'raya'){
      downLoadFileBlobAwait(
        `${getDomain(
          API_URL_TENANT
        )}/payroll/consolidated-payroll-report?period=${
          periodSelected.id
        }`,
        "hoja_rayas.xlsx",
        "GET",
        "",
        "No se encontraron resultados",
        setDownloading,
        2
      )
    }else if(key === 'accounting_policy_simple'){
      downLoadFileBlobAwait(
        `${getDomain(
          API_URL_TENANT
        )}/payroll/accounting-policy-report`,
        `resumen_${periodSelected.start_date}_${periodSelected.end_date}.xlsx`,
        "POST",
        {
          "node__id": props?.currentNode?.id,
          "payment_periods": [periodSelected.id],
          "type": "ACCOUNTING_POLICY_SIMPLE" 
        },
        "No se encontraron resultados",
        setDownloading,
        2
      )
    }
  }

  const sharePayload = async (selections_list, share_key) => {
    try {
      setSharingPayroll(true)
      let data = {
        'created_by_person_id': props?.userInfo?.id,
        'share_key': share_key,
        'period_id':  periodSelected?.id,
        'cfdis_ids': selections_list?.selectedRowKeys
      }
      let resp = await WebApiPayroll.sharePayload(data)
      if(resp.status === 200){
        Modal.success({
          title: resp?.data?.message,
          onOk() {},
        });
      }
      setSharingPayroll(false)
    } catch (error) {
      console.log('error', error)
      setSharingPayroll(false)
    }
  }
  
  const downloadReceipt = async (data) => {
    
    let req = {
      cfdi_id: data?.payroll_cfdi_person?.id,
      payroll_not_stamped: true
    }

    try {
      let response = await WebApiPayroll.downLoadReceipt(req);
      const type = response.headers["content-type"];
      const blob = new Blob([response.data], {
        type: type,
        encoding: "UTF-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "comprobante_2.pdf";
      link.click();
    } catch (error) {
      error &&
      error.response &&
      error.response.data &&
      error.response.data.message &&
      message.error(error.response.data.message);
    }
  };

  const downloads_options = (
    <Menu onClick={downloadActions} >
      <Menu.Item  key={'nom'} >
        <a >
          Nómina
        </a>
      </Menu.Item>
      {
        payroll.length > 0 && !genericModal && consolidated && (
          <>
            <Menu.Item key={'nomprov'}>
              <a>
                Nómina + provisiones
              </a>
            </Menu.Item>
            <Menu.Item key={'raya'}>
              <a>
                Hoja de raya
              </a>
            </Menu.Item>
            <Menu.Item key={'accounting_policy_simple'}>
              <a>
                Resumen
              </a>
            </Menu.Item>
          </>
        )
      }
    </Menu>
  );


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
        <MainLayout
          currentKey={["calculatePayroll"]}
          defaultOpenKeys={["managementRH", "payroll"]}
        >
          <Breadcrumb className={"mainBreadcrumb"}>
            <Breadcrumb.Item
              className={"pointer"}
              onClick={() => route.push({ pathname: "/home/persons/" })}
            >
              Inicio
            </Breadcrumb.Item>
            {verifyMenuNewForTenant() && (
              <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
            )}
            <Breadcrumb.Item>Nómina</Breadcrumb.Item>
            <Breadcrumb.Item>Cálculo de nómina</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={[10, 10]}>
            <Col span={24}>
              <Card className="form_header">
                <Form form={form} layout="vertical" onFinish={sendForm}>
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
                                changePeriod(value)
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
                            onChange={onchangeDeptop}
                          />
                        </Col>
                        <Col xxs={24} xl={4}>
                          <SelectJob
                            size={"large"}
                            onChange={onChangeJob}
                          />
                        </Col>
                        <Col xxs={24} xl={3}>
                        <SelectCollaboratorItemForm multiple name="person_id" size={"large"} department_id={department} job_id={job} />
                        </Col>
                        <Col>
                        <Tooltip title="Buscar">
                            <Button htmlType="submit" icon={<SearchOutlined/>} style={{ marginTop: "30px", marginRight: 20 }} />
                        </Tooltip>
                        <Tooltip title="Limpiar filtro">
                            <Button onClick={() => clearFilter()} icon={<ClearOutlined/>} style={{ marginTop: "30px", marginRight: 20 }} />
                        </Tooltip>
                        </Col>
                        <Col xxs={24} xl={5}>
                          
                          {
                            step < 3 && 
                             <Button
                                  loading={downloading === 1}
                                  style={{ marginTop: "30px", marginRight: 20 }}
                                  size="sm"
                                  icon={<DownloadOutlined />}
                                  onClick={() => {
                                    let data = {
                                      payment_period: periodSelected.id,
                                      department: department,
                                      job: job
                                    }
                                    if(step < 2) {
                                      data.payroll = payroll.map((item) => {
                                        item.person_id = item.person.id;
                                        return item;
                                      })
                                    }

                                    downLoadFileBlobAwait(
                                        `${getDomain(
                                            API_URL_TENANT
                                        )}/payroll/payroll-calculus`,
                                        "Nomina.xlsx",
                                        "POST",
                                        data,
                                        "",
                                        setDownloading,
                                        1
                                    );
                                  }}
                              >
                                Descargar plantilla
                              </Button>
                          }

                        </Col>
                        {(step === 0 || 
                          isOpen ||
                          (consolidated &&
                            !isOpen &&
                            consolidated.status != 3)) && step < 3 && (
                          <Col xxs={24} xl={5} style={{ paddingTop: "30px" }}>
                            <Upload
                              {...{
                                showUploadList: false,
                                beforeUpload: (file) => {
                                  const isXlsx = file.name.includes(".xlsx");
                                  if (!isXlsx) {
                                    message.error(
                                      `${file.name} no es un xlsx.`
                                    );
                                  }
                                  return isXlsx || Upload.LIST_IGNORE;
                                },
                                onChange(info) {
                                  const { status } = info.file;
                                  if (status !== "uploading") {
                                    if (info.fileList.length > 0) {
                                      let data = new FormData();
                                      data.append(
                                        "File",
                                        info.file
                                          ? info.file.originFileObj
                                          : info.fileList[
                                              info.fileList.length - 1
                                            ].originFileObj
                                        // info.fileList.length === 1 ? info.fileList[0].originFileObj : info.fileList[info.fileList.length-1].originFileObj
                                      );
                                      data.append("department", department);
                                      data.append("job", job);
                                      data.append(
                                        "payment_period",
                                        periodSelected.id
                                      );
                                      info.file = null;
                                      info.fileList = [];
                                      importPayrollCaculate(data);
                                    }
                                  }
                                },
                              }}
                            >
                              <Button size="sm" icon={<UploadOutlined />}>
                                Subir nómina
                              </Button>
                            </Upload>
                          </Col>
                        )}
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
                    description="Cálculo de nómina."
                  />
                  <Steps.Step title="Cerrar" description="Cierre de nómina." />
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
                    justify="space-between"
                    gutter={20}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    <Col flex="auto">
                      <Row gutter={10}>
                        <Col>
                          <Dropdown overlay={downloads_options} placement="bottomLeft">
                            <Button size="large"
                              block
                              htmlType="button"
                              icon={<FileExcelOutlined />}
                              loading={downloading === 2}
                              >
                              Descargar
                            </Button>
                          </Dropdown>
                        </Col>
                        {payroll.length > 0 && !genericModal && (
                          <>

                            {step == 0 && calculate && (
                              <Col md={4}  style={{ minWidth: "200px" }}>
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
                            {step == 2 &&
                              consolidated &&
                              consolidated.status <= 2 && (
                                <Col
                                  md={4}
                                >
                                  <Button
                                    size="large"
                                    block
                                    icon={<UnlockOutlined />}
                                    htmlType="button"
                                    onClick={() =>
                                      setMessageModal(5, {
                                        title: "Abrir nómina",
                                        description:
                                          "Al abrir la nómina tendrás acceso a recalcular los salarios de las personas. Para poder completar la reapertura es necesario capturar el motivo por el cual se abrirá.",
                                        type_alert: "warning",
                                        action: () => openPayroll(1),
                                        title_action_button: "Abrir nómina",
                                        components: (
                                          <>
                                            <Row
                                              gutter={20}
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
                            {step >= 1 && (
                              <>
                                {((isOpen &&
                                  consolidated &&
                                  (consolidated.status <= 2 ||
                                    consolidated.status == 6)) ||
                                  (isOpen && !consolidated)) && (
                                  <Col  >
                                    <Button
                                      size="large"
                                      block
                                      icon={<LockOutlined />}
                                      htmlType="button"
                                      onClick={() => setMessageModal(2)}
                                    >
                                      Cerrar nómina
                                    </Button>
                                  </Col>
                                )}
                                {/*  Reiniciar Nomina consolidada no timbrada */}
                                {(step == 1 || step == 2) &&
                                  consolidated &&
                                  consolidated.status == 1 && (
                                  <Col >
                                    <Button
                                      size="large"
                                      block
                                      icon={<ClearOutlined />}
                                      htmlType="button"
                                      onClick={() =>
                                        setMessageModal(6, {
                                          title: "Reiniciar Nómina",
                                          description:
                                            "Al reiniciar la nómina se perderá la información del cálculo de éste periodo pero podrás calcularlo nuevamente ",
                                          type_alert: "warning",
                                          action: () => deletePayroll(consolidated.id),
                                          title_action_button: "Reiniciar nómina",                                     
                                        })
                                      }
                                    >
                                      Reiniciar Nomina
                                    </Button>
                                  </Col>
                                )}

                                {step == 2 &&
                                  consolidated &&
                                  consolidated.status < 3 && (
                                    <Col >
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
                                  <Col
                                  >
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
                        )}
                        {
                          consolidated &&
                          (consolidated.status <= 3 || consolidated.status >= 6 ) &&
                          step >= 2 && calendarSelect.bank_dispersion &&
                          <Col>
                            <Button
                              size="large"
                              block
                              htmlType="button"
                              onClick={() => generateDispersion()}
                              loading={downloading}
                            >
                              Generar dispersión
                            </Button>
                          </Col>
                        }
                      </Row>
                    </Col>
                    <Col>
                      <Button size="large"
                        htmlType="button"
                        icon={<FilePdfOutlined />}
                        loading={downloading === 3}
                        onClick={() => exportPdf()}
                        >
                        Reporte de Nómina
                      </Button>
                          
                      </Col>
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

              <Col span={24}>
              <div ref={componentRef}>
                <Card className="card_table">
                  {step == 3 ? (
                    <CfdiVaucher
                      calendar={calendarSelect.id}
                      period={periodSelected.id}
                      viewFilter={false}
                      setKeys={setCfdiCancel}
                      department={department}
                      job={job}
                      clickCancelStamp={cancelOneStamp}
                      movementType={'0'}
                      pageSize={defaultSize}
                      setPageSize={setDefaultSize}
                      showAll={defaultSize > 100 ? true : false}
                      sharePayload={sharePayload}
                      sharingPayroll={sharingPayroll}
                    />
                  ) : (
                    <>
                      <Table
                        scroll={{ x: 800 }}
                        className="headers_transparent"
                        dataSource={payroll.map((item) => {
                          item.key = item?.person?.id;
                          return item;
                        })}
                        columns={persons}
                        expandable={{
                          expandedRowKeys: expandedRowKeys,
                          onExpandedRowsChange: (rows) => setExpandedRowKeys(rows),
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
                          consolidated && step > 1 && (consolidated.status <= 3 || consolidated.status == 6)
                            ? rowSelectionPerson
                            : null
                        }
                        pagination={
                          {
                            showSizeChanger:true,
                            pageSize: defaultSize,
                            pageSizeOptions: [5,10,20,50,100],
                            hideOnSinglePage: defaultSize > 100 ? true: false,
                            onChange: (page, size) => setDefaultSize(size) 
                          }
                        }
                      />
                      {totalPerceptions != null && totalDeductions != null ? (
                        <Col span={24}>
                          <Row justify="space-between">
                            <Col span={12}>
                              <Row>
                                <Col
                                lg={12}
                                md={16}
                                sm={12}
                                style={{ fontWeight: "bold" }}
                              >
                                <div>Total de personas:</div>
                              </Col>
                              <Col
                                lg={8}
                                md={10}
                                sm={16}
                                style={{ fontWeight: "bold" }}
                              >
                                <div>
                                  {payrollOriginal.length}
                                </div>
                              </Col>
                              </Row>  
                            </Col>
                            <Col span={12}>
                          <Row justify="end">
                            <Col
                              lg={12}
                              md={16}
                              sm={12}
                              style={{ fontWeight: "bold" }}
                            >
                              <div>Total de Percepciones:</div>
                            </Col>
                            <Col
                              lg={8}
                              md={10}
                              sm={16}
                              style={{ fontWeight: "bold" }}
                            >
                              <div>
                                <NumberFormat
                                  prefix={"$"}
                                  number={totalPerceptions}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row justify="end">
                            <Col
                              lg={12}
                              md={16}
                              sm={12}
                              style={{ fontWeight: "bold" }}
                            >
                              <div>Total de Deducciones:</div>
                            </Col>
                            <Col
                              lg={8}
                              md={10}
                              sm={16}
                              style={{ fontWeight: "bold" }}
                            >
                              <div>
                                <NumberFormat
                                  prefix={"$"}
                                  number={totalDeductions}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row justify="end">
                            <Col
                              lg={12}
                              md={16}
                              sm={12}
                              style={{ fontWeight: "bold" }}
                            >
                              <div>Total a pagar:</div>
                            </Col>
                            <Col
                              lg={8}
                              md={10}
                              sm={16}
                              style={{ fontWeight: "bold" }}
                            >
                              <div>
                                <NumberFormat prefix={"$"} number={netPay} />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                          </Row>
                        </Col>
                      ) : null}
                    </>
                  )}
                </Card>
              </div>
              </Col>
            </>
          )}
        </MainLayout>
      </Spin>
      {personId && (
        <ModalConceptsPayroll
          workingDays={workingDays}
          visible={modalVisible}
          setVisible={setModalVisible}
          payment_period={periodSelected}
          calendar={{
            payment_period: periodSelected.id,
          }}
          periodicity={calendarSelect.periodicity}
          person_id={personId}
          payroll={payrollOriginal}
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
          closeButton={
            infoGenericModal.closeButton
              ? infoGenericModal.closeButton
              : "Cancelar"
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
    </>
  );
};

const mapState = (state) => {
  return { 
    currentNode: state.userStore.current_node,
    userInfo: state.userStore.user
  };
};

export default connect(mapState)(withAuthSync(CalculatePayroll));
