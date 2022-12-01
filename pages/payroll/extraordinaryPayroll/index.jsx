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
  Row,
  Select,
  Space,
  Spin,
  Steps,
  Table,
  Typography,
} from "antd";
import {
  PlusOutlined,
  RightOutlined,
  DownOutlined,
  UserOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  FileDoneOutlined,
  UnlockOutlined,
  LockOutlined,
  DownloadOutlined,
  StopOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import NumberFormat from "../../../components/formatter/numberFormat";
import NumericInput from "../../../components/inputNumeric";
import ModalConceptsPayroll from "../../../components/payroll/modals/ModalConceptsPayroll";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { Global } from "@emotion/core";
import { messageError, optionMovement } from "../../../utils/constant";
import SelectDepartment from "../../../components/selects/SelectDepartment";
import SelectJob from "../../../components/selects/SelectJob";
import GenericModal from "../../../components/modal/genericModal";
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from "moment";

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
  const [totalBonus, setTotalBonus] = useState(null);
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
            <Avatar
              icon={<UserOutlined />}
              src={
                item.payroll_person.person && item.payroll_person.person.photo
                  ? item.payroll_person.person.photo
                  : defaulPhoto
              }
            />
            {`${
              item.payroll_person.person &&
              item.payroll_person.person.mlast_name
                ? item.payroll_person.person.first_name +
                  " " +
                  item.payroll_person.person.flast_name +
                  " " +
                  item.payroll_person.person.mlast_name
                : item.payroll_person.personfirst_name +
                  " " +
                  item.payroll_person.person.flast_name
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
          <NumberFormat
            prefix={"$"}
            number={item.payroll_person.daily_salary}
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
          <NumberFormat prefix={"$"} number={item.bonus_amount} />
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
            {(movementType == 2 || movementType == 3) && (
              <Button
                size="small"
                onClick={() => {
                  setPersonId(
                    item.payroll_person && item.payroll_person.person.id
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
    console.log("render-->> ", data);
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

  useEffect(() => {
    if (optionspPaymentCalendars.length == 1) {
      form.setFieldsValue({ calendar: optionspPaymentCalendars[0].value });
      changeCalendar(optionspPaymentCalendars[0].value);
    }
  }, [optionspPaymentCalendars]);

  const changeCalendar = (value) => {
    if (!value) {
      resetState();
      return;
    }
    setTotalBonus(null);
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
    sendCalculateExtraordinaryPayrroll({
      payment_period: period.id,
      calendar: value,
      movementType: movementType,
    });
  };

  const resetState = () => {
    form.resetFields();
    setExtraOrdinaryPayroll([]);
    setCalendarSelect(null);
    setPeriodSelcted(null);
    setTotalBonus(null);
    setTotalIsr(null);
    setNetPay(null);
    setMovementType(null);
  };

  const sendCalculateExtraordinaryPayrroll = async (data) => {
    setLoading(true);
    setExtraOrdinaryPayroll([]);
    await WebApiPayroll.extraordinaryPayroll(data)
      .then((response) => {
        console.log(response.data);
        setExtraOrdinaryPayroll(response.data);
        setLoading(false);
        setObjectSend(null);
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
  };

  useEffect(() => {
    if (movementType && calendarSelect) changeCalendar(calendarSelect.id);
  }, [movementType]);

  const ExpandedFunc = (expanded, onExpand, record) => {
    if (movementType > 1 && record.worked_days)
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
    setGenericModal(false);
    const departureDate = document.getElementById("departure_date");
    if (departureDate.value != null && departureDate.value != "") {
      sendCalculateExtraordinaryPayrroll({
        list: objectSend
          ? objectSend.payroll
          : listPersons.map((item) => {
              return { person_id: item.key };
            }),
        departure_date: departureDate.value,
        movementType: movementType,
        calendar: calendarSelect.id,
      });
    } else {
      message.error("Se requeiere una fecha de pago");
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
        defaultOpenKeys={["payroll"]}
      >
        <Breadcrumb>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
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
                            placeholder="Salario"
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
                                // sendCalculatePayroll({
                                //   payment_period: value,
                                // }),
                                //   setPeriodSelcted(
                                //     calendarSelect.periods.find(
                                //       (p) => p.id == value
                                //     )
                                //   );
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
                      <Col md={4}>
                        <Button
                          size="large"
                          block
                          htmlType="button"
                          icon={<FileExcelOutlined />}
                          // onClick={() => {
                          //   isOpen
                          //     ? downLoadFileBlob(
                          //         `${getDomain(
                          //           API_URL_TENANT
                          //         )}/payroll/payroll-calculus`,
                          //         "Nomina.xlsx",
                          //         "POST",
                          //         {
                          //           payment_period: periodSelected.id,
                          //           extended_report: "True",
                          //           department: department,
                          //           job: job,
                          //           payroll: payroll.map((item) => {
                          //             item.person_id = item.person.id;
                          //             return item;
                          //           }),
                          //         }
                          //       )
                          //     : downLoadFileBlob(
                          //         `${getDomain(
                          //           API_URL_TENANT
                          //         )}/payroll/payroll-report?payment_period=${
                          //           periodSelected.id
                          //         }`,
                          //         "Nomina.xlsx",
                          //         "GET"
                          //       );
                          // }}
                        >
                          Descargar nómina
                        </Button>
                      </Col>

                      {personKeys && personKeys.length > 0 && (
                        <Col md={5} offset={1}>
                          <Button
                            size="large"
                            block
                            htmlType="button"
                            onClick={() => (
                              setInfoGenericModal({
                                title: `Calcular ${
                                  movementType === 2
                                    ? "finiquito"
                                    : "liquidacion"
                                }`,
                                title_message: "Selecciona una fecha de salida",
                                description:
                                  "Fecha de salida requerida para el calculo que quiere realizar.",
                                type_alert: "warning",
                                title_message: "Fecha de salida",

                                closeButton: "Cerrar",
                                action: () => calculateExtra(),
                                components: (
                                  <>
                                    <Row
                                      style={{
                                        width: "100%",
                                        marginTop: "10px",
                                      }}
                                      justify="center"
                                    >
                                      <Form.Item
                                        label="Fecha de pago"
                                        style={{ width: "40%" }}
                                      >
                                        <DatePicker
                                          defaultValue={moment(
                                            periodSelected?.payment_date
                                          )}
                                          moment={"YYYY"}
                                          id="departure_date"
                                          placeholder="Fecha de pago."
                                          locale={locale}
                                        />
                                      </Form.Item>
                                    </Row>
                                  </>
                                ),
                              }),
                              setGenericModal(true)
                            )}
                          >
                            Calcular
                          </Button>
                        </Col>
                      )}

                      {/* {payroll.length > 0 && !genericModal && (
                        <>
                          {consolidated && (
                            <>
                              <Col md={5} offset={1}>
                                <Button
                                  size="large"
                                  block
                                  icon={<FileExcelOutlined />}
                                  htmlType="button"
                                  // onClick={() =>
                                  //   downLoadFileBlob(
                                  //     `${getDomain(
                                  //       API_URL_TENANT
                                  //     )}/payroll/consolidated-payroll-report?period=${
                                  //       periodSelected.id
                                  //     }`,
                                  //     "hoja_rayas.xlsx",
                                  //     "GET"
                                  //   )
                                  // }
                                >
                                  Descargar hoja de raya
                                </Button>
                              </Col>
                            </>
                          )}

                          
                          {step == 2 &&
                            consolidated &&
                            consolidated.status <= 2 && (
                              <Col md={5} offset={1}>
                                <Button
                                  size="large"
                                  block
                                  icon={<UnlockOutlined />}
                                  htmlType="button"
                                  // onClick={() =>
                                  //   setMessageModal(5, {
                                  //     title: "Abrir nómina",
                                  //     description:
                                  //       "Al abrir la nómina tendras acceso a recalcular los salarios de las personas. Para poder completar la reapertura es necesario capturar el motivo por el caul se abrira.",
                                  //     type_alert: "warning",
                                  //     action: () => openPayroll(1),
                                  //     title_action_button: "Abrir nómina",
                                  //     components: (
                                  //       <>
                                  //         <Row
                                  //           style={{
                                  //             width: "100%",
                                  //             marginTop: "5px",
                                  //           }}
                                  //         >
                                  //           <Input.TextArea
                                  //             maxLength={290}
                                  //             id="motive"
                                  //             placeholder="Capture el motivo de reapertura."
                                  //           />
                                  //         </Row>
                                  //       </>
                                  //     ),
                                  //   })
                                  // }
                                >
                                  Abrir
                                </Button>
                              </Col>
                            )}
                          {step >= 1 && (
                            <>
                              {((isOpen &&
                                consolidated &&
                                consolidated.status <= 2) ||
                                (isOpen && !consolidated)) && (
                                <Col md={5} offset={1}>
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
                  {/* {step == 3 ? (
              <CfdiVaucher
                calendar={calendarSelect.id}
                period={periodSelected.id}
                viewFilter={false}
                setKeys={setCfdiCancel}
                clickCancelStamp={cancelOneStamp}
              />
            ) : ( */}
                  <>
                    <Table
                      className="headers_transparent"
                      dataSource={extraOrdinaryPayroll.map((item) => {
                        item.key = item?.person.id;
                        return item;
                      })}
                      columns={persons}
                      expandable={{
                        expandedRowRender: (item) => renderConceptsTable(item),
                        expandIcon: ({ expanded, onExpand, record }) =>
                          ExpandedFunc(expanded, onExpand, record),

                        // expanded ? (
                        //   <DownOutlined
                        //     onClick={(e) => onExpand(record, e)}
                        //   />
                        // ) : (
                        //   <RightOutlined
                        //     onClick={(e) => onExpand(record, e)}
                        //   />
                        // ),
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
                          : null
                      }
                    />
                    {totalBonus != null && totalIsr != null ? (
                      <Col sm={24} md={24} lg={24}>
                        <Row justify="end">
                          <Col span={4} style={{ fontWeight: "bold" }}>
                            <div>Total de aguinaldos:</div>
                            <div>Total de ISR:</div>
                            <div>Total a pagar:</div>
                          </Col>
                          <Col span={3} style={{ fontWeight: "bold" }}>
                            <div>
                              <NumberFormat prefix={"$"} number={totalBonus} />
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
                  {/* )} */}
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
          sendCalculatePayroll={setObjectSend}
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
