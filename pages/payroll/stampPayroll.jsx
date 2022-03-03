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

const StampPayroll = ({ ...props }) => {
  const route = useRouter();
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [periodicity, setPeriodicity] = useState("");
  const [period, setPeriod] = useState("");
  const [paymentPeriod, setPaymentPeriod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [payroll, setPayroll] = useState([]);
  const [fisrtRequest, setFirstRequest] = useState(true);
  const [expandRow, setExpandRow] = useState(null);
  const { Text, Title } = Typography;
  const [modalVisible, setModalVisible] = useState(false);
  const [personSelected, setPersonSelected] = useState(null);

  useEffect(() => {
    if (props.currentNode) getPaymentCalendars(props.currentNode.id);
  }, [props.currentNode]);

  const getPaymentCalendars = async (value) => {
    let response = await WebApiPayroll.getPaymentCalendar(value);
    let data = response.data.results;
    if (data.length > 0) {
      setPaymentCalendars(data);
      let calendars = data.map((item, index) => {
        return { key: item.id, label: item.name, value: item.id };
      });
      setOptionsPaymentCalendars(calendars);
    } else {
      message.error("Sin resultados");
    }
  };

  const prepareData = (dataPersons) => {
    let newData = [];

    dataPersons.map((item) => {
      let newItem = { ...item };
      let newDeductions = [];
      let newPerceptions = [];
      let newOtherPayments = [];

      item.perceptions.map((p) => {
        if (!p.locked) {
          newPerceptions.push(p);
        }
      });

      item.deductions.map((d) => {
        if (!d.locked) {
          newDeductions.push(d);
        }
      });

      item.other_payments.map((o) => {
        if (!o.locked) {
          newOtherPayments.push(o);
        }
      });

      newItem["perceptions"] = newPerceptions;
      newItem["deductions"] = newDeductions;
      newItem["other_payments"] = newOtherPayments;

      newData.push(newItem);
    });

    return newData;
  };

  const sendStampPayroll = async (data) => {
    try {
      let tempArray = data ? data : [...payroll];
      let newData = prepareData(tempArray);
      let data = {
        node: props.currentNode,
        period: period,
        payroll: newData,
        invoice: true,
      };

      let response = await getCalculatePayroll(data);
      if (response) {
        setFirstRequest(false);
      } else {
        message("Error al calcular la nómina");
      }
    } catch (error) {
      message("Error al calcular la nómina");
      console.log("error", error);
    }
  };

  const mapConcepts = (concepts, type) => {
    let array_concepts = [];
    if (type == "perceptions") {
      concepts.map((item) => {
        array_concepts.push({
          locked: item.Code == "046" ? true : item.Code == "001" ? true : false,
          code: item.Code ? item.Code : "",
          key: item.Description,
          label: item.Description ? item.Description : "",
          amount: item.Amount ? item.Amount : 0.0,
          taxed_amount: item.TaxedAmount ? item.TaxedAmount : 0.0,
          exempt_amount: item.ExemptAmount ? item.ExemptAmount : 0.0,
        });
      });
    }
    if (type == "deductions") {
      concepts.map((item) => {
        array_concepts.push({
          locked: item.Code == "002" ? true : item.Code == "001" ? true : false,
          code: item.Code ? item.Code : "",
          key: item.Description,
          label: item.Description ? item.Description : "",
          amount: item.Amount ? item.Amount : 0,
        });
      });
    }
    if (type == "other_payments") {
      concepts.map((item) => {
        array_concepts.push({
          locked: item.Code == "002" ? true : false,
          code: item.Code ? item.Code : "",
          key: item.Description,
          label: item.Description ? item.Description : "",
          amount: item.Amount,
          exempt_amount: item.ExemptAmount,
          taxed_amount: item.taxed_amount,
        });
      });
    }
    return array_concepts;
  };

  const getCalculatePayroll = async (dataToSend) => {
    try {
      setLoading(true);
      let response = await WebApiPayroll.calculatePayroll(dataToSend);

      let arrar_payroll = [];
      response.data.payroll.map((a) => {
        if (a.payroll_person) {
          let item = {
            person_id: a.payroll_person.person.id,
            key: a.payroll_person.person.id,
            full_name:
              a.payroll_person.person.first_name +
              " " +
              a.payroll_person.person.flast_name +
              " " +
              a.payroll_person.person.mlast_name,
            company: a.payroll_person.person.node_user.name,
            daily_salary: a.payroll_person.daily_salary
              ? `$ ${a.payroll_person.daily_salary}`
              : null,
            perceptions: [],
            deductions: [],
            total_deductions: 0.0,
            other_payments: [],
            total_other_payments: 0.0,
            total_to_pay: 0.0,
          };

          if (a.calculation) {
            item["total_perceptions"] = a.calculation.total_perceptions;
            item["total_deductions"] = a.calculation.total_deductions;
            item["total_to_pay"] = a.calculation.net_salary;

            if (a.calculation.perceptions) {
              item["perceptions"] = mapConcepts(
                a.calculation.perceptions,
                "perceptions"
              );
            }

            if (a.calculation.deductions) {
              item["deductions"] = mapConcepts(
                a.calculation.deductions,
                "deductions"
              );
            }

            if (a.calculation.other_payments) {
              item["other_payments"] = mapConcepts(
                a.calculation.other_payments,
                "other_payments"
              );
            }
          }
          arrar_payroll.push(item);
        }
      });
      setPayroll(arrar_payroll);
      setLoading(false);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const changePaymentCalendar = (value) => {
    if (value) {
      let calendar = paymentCalendars.find((elm) => elm.id == value);
      if (calendar) {
        let calculate = getCalculatePayroll({ calendar_id: value });
        if (!calculate) message("Error al calcular la nómina");
        setPeriodicity(calendar.periodicity.description);
        setPeriod(calendar.period);
        let period = calendar.periods.find((p) => p.active == true);
        if (period) {
          setPaymentPeriod(period.start_date + " - " + period.end_date);
          setPaymentDate(period.payment_date);
        } else {
          setPeriod("");
          setPaymentPeriod("");
          setInsidencePeriod("");
          setPaymentDate("");
        }
      }
    }
  };

  const columnsNew = [
    {
      title: "Nombre",
      className: "column_name cursor_pointer",
      key: "name",
      render: (record) => (
        <div onClick={() => setExpandRow(expandRow ? null : record.key)}>
          <Space>
            <Avatar
              icon={<UserOutlined />}
              src={record.photo ? record.photo : null}
            />
            {record.full_name}
          </Space>
        </div>
      ),
    },
    {
      title: "Empresa",
      dataIndex: "company",
      key: "company",
      className: "cursor_pointer",
      render: (company, record) => (
        <div onClick={() => setExpandRow(expandRow ? null : record.key)}>
          {company}
        </div>
      ),
    },
    {
      title: "Salario Diario",
      dataIndex: "daily_salary",
      key: "daily_salary",
      className: "cursor_pointer",
      render: (salary, record) => (
        <div onClick={() => setExpandRow(expandRow ? null : record.key)}>
          {salary}
        </div>
      ),
    },
    {
      key: "actions",
      className: "cell-actions",
      render: (record) => (
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
      setExpandRow(row.key);
    }
  };

  const renderConceptsTable = (record) => {
    let dataPerceptions = record.perceptions;
    let dataDeductions = record.deductions;
    let dataOtherPayments = record.other_payments;

    const columnsPerceptions = [
      {
        title: "CVE",
        key: "code",
        dataIndex: "code",
        className: "cell-concept",
        width: "10%",
      },
      {
        title: "Descripción",
        key: "label",
        dataIndex: "label",
        className: "cell-concept",
        width: "50%",
      },
      {
        title: "Dato",
        key: "data",
        dataIndex: "data",
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
        key: "label",
        dataIndex: "label",
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
        key: "label",
        dataIndex: "label",
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
        <div style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
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
        <br />
        <div style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
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
        <br />

        {dataOtherPayments && dataOtherPayments.length > 0 && (
          <>
            <div
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
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

        <br />
        <Col
          span={10}
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
                $ {numberFormat(record.total_perceptions)}
              </Col>
            </Col>
            <Col span={24} style={{ display: "flex" }}>
              <Col style={{ borderRight: "1px solid" }} span={14}>
                Total deducciones :
              </Col>
              <Col style={{ textAlign: "right" }} span={10}>
                $ {numberFormat(record.total_deductions)}
              </Col>
            </Col>
            <Col span={24} style={{ display: "flex" }}>
              <Col style={{ borderRight: "1px solid" }} span={14}>
                Total a pagar :
              </Col>
              <Col style={{ textAlign: "right" }} span={10}>
                ${numberFormat(record.total_to_pay)}
              </Col>
            </Col>
          </Row>
        </Col>
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
            margin-left: 70px !important;
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
              <Row gutter={[16, 8]}>
                <Col xxs={24} xl={4}>
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    options={optionspPaymentCalendars}
                    onChange={changePaymentCalendar}
                    placeholder="Calendarios"
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Col>
                <Col xxs={24} xl={4}>
                  <Input
                    size="large"
                    key="periodicity"
                    placeholder="Periodicidad"
                    disabled={true}
                    value={periodicity}
                  />
                </Col>
                <Col xxs={24} xl={6}>
                  <Input
                    size="large"
                    key="period"
                    placeholder="Período"
                    disabled={true}
                    value={period}
                  />
                </Col>
                <Col xxs={24} xl={6}>
                  <Input
                    size="large"
                    key="insidence_period"
                    placeholder="Período de incidencia"
                    disabled={true}
                    value={paymentPeriod}
                  />
                </Col>
                <Col xxs={24} xl={4}>
                  <Input
                    size="large"
                    key="payment_day"
                    placeholder="Dia de pago"
                    disabled={true}
                    value={paymentDate}
                  />
                </Col>
              </Row>
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
                  columns={columnsNew}
                  expandable={{
                    expandedRowRender: (record) => renderConceptsTable(record),
                    onExpand: (expanded, record) => rowExpand(expanded, record),
                    expandIconAsCell: false,
                    expandedRowKeys: [expandRow],
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <DownOutlined onClick={(e) => onExpand(record, e)} />
                      ) : (
                        <RightOutlined onClick={(e) => onExpand(record, e)} />
                      ),
                  }}
                  hideExpandIcon
                  dataSource={payroll}
                  locale={{ emptyText: "No se encontraron resultados" }}
                />
              </Card>
            </Spin>
          </Col>
        </Row>

        <ModalConceptsPayroll
          visible={modalVisible}
          setVisible={setModalVisible}
          person_id={personSelected && personSelected.person_id}
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

export default connect(mapState)(withAuthSync(StampPayroll));
