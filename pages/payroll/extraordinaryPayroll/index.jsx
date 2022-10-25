import { useEffect, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
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
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import NumberFormat from "../../../components/formatter/numberFormat";
import NumericInput from "../../../components/inputNumeric";
import MainLayout from "../../../layout/MainLayout";
import { withAuthSync } from "../../../libs/auth";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { Global } from "@emotion/core";
import { messageError } from "../../../utils/constant";

const ExtraordinaryPayroll = ({ ...props }) => {
  const route = useRouter();
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bonusChristmas, setBonusChristmas] = useState([]);
  const [calendarSelect, setCalendarSelect] = useState(null);
  const [periodSelected, setPeriodSelcted] = useState(null);
  const [totalBonus, setTotalBonus] = useState(null);
  const [totalIsr, setTotalIsr] = useState(null);
  const [netPay, setNetPay] = useState(null);
  const defaulPhoto =
    "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/1412021224859/placeholder-profile-sq.jpg";

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
            {item.payroll_person.person && item.payroll_person.person.full_name}
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
      render: (item) => <div>{item.payroll_person.daily_salary}</div>,
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
    // {
    //   key: "actions",
    //   className: "cell-actions",
    //   render: (item) => (
    //     <>
    //       {item.payroll_cfdi_person &&
    //       item.payroll_cfdi_person.is_open &&
    //       step == 0 ? (
    //         <Button
    //           size="small"
    //           onClick={() => {
    //             setPersonId(item.person && item.person.id),
    //               setModalVisible(true);
    //           }}
    //         >
    //           <PlusOutlined />
    //         </Button>
    //       ) : (
    //         isOpen &&
    //         step == 0 &&
    //         !consolidated && (
    //           <Button
    //             size="small"
    //             onClick={() => {
    //               setPersonId(item.person && item.person.id),
    //                 setModalVisible(true);
    //             }}
    //           >
    //             <PlusOutlined />
    //           </Button>
    //         )
    //       )}
    //     </>
    //   ),
    // },
  ];

  const renderConceptsTable = (data) => {
    console.log(data);
    let dataPerceptions = [data.perception];
    let dataDeductions = [data.deduction];

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
                  <NumberFormat prefix={"$"} number={data.bonus_amount} />
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
    // setActivePeriod(period.id);
    // setPayrollType(calendar.perception_type.code);
    form.setFieldsValue({
      periodicity: calendar.periodicity.description,
      period: `${period.name}.- ${period.start_date} - ${period.end_date}`,
    });
    sendCalculateBonus({ payment_period: period.id, calendar: value });
  };

  const resetState = () => {
    form.resetFields();
    setBonusChristmas([]);
    setCalendarSelect(null);
    setPeriodSelcted(null);
    setTotalBonus(null);
    setTotalIsr(null);
    setNetPay(null);
  };

  const sendCalculateBonus = async (data) => {
    setLoading(true);
    await WebApiPayroll.christmasBonusCaculate(data)
      .then((response) => {
        setBonusChristmas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
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
                          <Button
                            style={{ marginTop: "30px" }}
                            size="large"
                            onClick={() => {
                              // downLoadFileBlob(
                              //   `${getDomain(
                              //     API_URL_TENANT
                              //   )}/payroll/payroll-calculus`,
                              //   "Nomina.xlsx",
                              //   "POST",
                              //   {
                              //     payment_period: periodSelected.id,
                              //     department: department,
                              //     job: job,
                              //     payroll: payroll.map((item) => {
                              //       item.person_id = item.person.id;
                              //       return item;
                              //     }),
                              //   }
                              // );
                            }}
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
          <Col span={24}>
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
                  dataSource={bonusChristmas.map((item) => {
                    item.key = item?.payrrol_person?.person.id;
                    return item;
                  })}
                  columns={persons}
                  expandable={{
                    expandedRowRender: (item) => renderConceptsTable(item),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <DownOutlined onClick={(e) => onExpand(record, e)} />
                      ) : (
                        <RightOutlined onClick={(e) => onExpand(record, e)} />
                      ),
                  }}
                  hideExpandIcon
                  loading={loading}
                  locale={{
                    emptyText: loading
                      ? "Cargando..."
                      : "No se encontraron resultados.",
                  }}
                  // rowSelection={
                  //   consolidated && step == 2 && consolidated.status < 3
                  //     ? rowSelectionPerson
                  //     : null
                  // }
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
          </Col>
        </div>
      </MainLayout>
    </Spin>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(ExtraordinaryPayroll));
