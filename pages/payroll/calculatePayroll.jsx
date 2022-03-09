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
} from "antd";
import { useRouter } from "next/router";
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
import { numberFormat } from "../../utils/functions";
import { connect } from "react-redux";
import { messageError } from "../../utils/constant";

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
    console.log(calendar);
    form.setFieldsValue({
      periodicity: calendar.periodicity.description,
      period: `${period.start_date} - ${period.end_date}`,
      insidences: `${period.incidences.start_date} - ${period.incidences.end_date}`,
      payment_day: period.payment_date,
    });
    sendCalculatePayroll({ calendar_id: value });
  };

  const sendCalculatePayroll = async (dataToSend) => {
    setLoading(true);
    await WebApiPayroll.calculatePayroll(dataToSend)
      .then((response) => {
        setLoading(false);
        setPayroll(response.data.payroll);
      })
      .catch((error) => {
        console.log(error);
        setPayroll([]);
        form.resetFields();
        setLoading(false);
      });

    //   let arrar_payroll = [];
    //   response.data.payroll.map((a) => {
    //     if (a.payroll_person) {
    //       let item = {
    //         person_id: a.payroll_person.person.id,
    //         key: a.payroll_person.person.id,
    //         full_name:
    //           a.payroll_person.person.first_name +
    //           " " +
    //           a.payroll_person.person.flast_name +
    //           " " +
    //           a.payroll_person.person.mlast_name,
    //         company: a.payroll_person.person.node_user.name,
    //         daily_salary: a.payroll_person.daily_salary
    //           ? `$ ${a.payroll_person.daily_salary}`
    //           : null,
    //         perceptions: [],
    //         deductions: [],
    //         total_deductions: 0.0,
    //         other_payments: [],
    //         total_other_payments: 0.0,
    //         total_to_pay: 0.0,
    //       };

    //       if (a.calculation) {
    //         item["total_perceptions"] = a.calculation.total_perceptions;
    //         item["total_deductions"] = a.calculation.total_deductions;
    //         item["total_to_pay"] = a.calculation.net_salary;

    //         if (a.calculation.perceptions) {
    //           item["perceptions"] = mapConcepts(
    //             a.calculation.perceptions,
    //             "perceptions"
    //           );
    //         }

    //         if (a.calculation.deductions) {
    //           item["deductions"] = mapConcepts(
    //             a.calculation.deductions,
    //             "deductions"
    //           );
    //         }

    //         if (a.calculation.other_payments) {
    //           item["other_payments"] = mapConcepts(
    //             a.calculation.other_payments,
    //             "other_payments"
    //           );
    //         }
    //       }
    //       arrar_payroll.push(item);
    //     }
    //   });
    //   setPayroll(arrar_payroll);
    //   setLoading(false);
    //   return true;
    // } catch (error) {
    //   console.log(error);
    //   return false;
    // }
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
      render: () => (
        <Button size="small" onClick={() => setModalVisible(true)}>
          <PlusOutlined />
        </Button>
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
        width: "50%",
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
        dataIndex: "amount",
        width: "10%",
        render: (amount) => (
          <Space size="middle">
            <Text>${numberFormat(amount)}</Text>
          </Space>
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
                  $ {numberFormat(item.total_perceptions)}
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total deducciones :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  $ {numberFormat(item.total_deductions)}
                </Col>
              </Col>
              <Col span={24} style={{ display: "flex" }}>
                <Col style={{ borderRight: "1px solid" }} span={14}>
                  Total a pagar :
                </Col>
                <Col style={{ textAlign: "right" }} span={10}>
                  ${numberFormat(item.total_to_pay)}
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const saveConcepts = (concept) => {
    const tempPayroll = [...payroll];
    let payroll_person = tempPayroll.find(
      (elem) => elem.person_id === concept.person_id
    );
    payroll_person.perceptions = concept.perceptions;
    payroll_person.deductions = concept.deductions;
    payroll_person.other_payments = concept.other_payments;
    updPersonsPayroll(payroll_person);
    sendStampPayroll(payroll_person);
  };

  const updPersonsPayroll = (object_person) => {
    let newpayroll = [...payroll];
    let idx = newpayroll.findIndex(
      (item) => item.person_id === object_person.person_id
    );
    newpayroll[idx] = object_person;
    setPayroll(newpayroll);
  };

  return (
    <>
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
            onClick={() => route.push({ pathname: "/home" })}
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
                    <Form.Item label="Calendario">
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
          {payroll.length > 0 && (
            <Col md={4}>
              <Button
                size="large"
                block
                htmlType="button"
                onClick={() => sendStampPayroll()}
              >
                Consolidar nomina
              </Button>
            </Col>
          )}
          <Col span={24}>
            <Spin tip="Cargando..." spinning={loading}>
              <Card className="card_table">
                <Table
                  className="headers_transparent"
                  dataSource={payroll}
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
              </Card>
            </Spin>
          </Col>
        </Row>

        <ModalConceptsPayroll
          visible={modalVisible}
          setVisible={setModalVisible}
          saveConcepts={saveConcepts}
          payroll={payroll}
          setLoading={setLoading}
        />
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return { currentNode: state.userStore.current_node };
};

export default connect(mapState)(withAuthSync(CalculatePayroll));
