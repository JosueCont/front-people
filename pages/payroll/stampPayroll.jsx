import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Breadcrumb,
  Button,
  Select,
  Input,
  Collapse,
  Modal,
  message,
  Spin,
  Table,
  Tooltip,
  Badge,
  Card,
  Avatar,
  Space,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import {
  FilePdfOutlined,
  PlusOutlined,
  FileOutlined,
  Html5Outlined,
  RightOutlined,
  DownOutlined,
  EditFilled,
  UserOutlined,
} from "@ant-design/icons";
import { userCompanyId, userCompanyName } from "../../libs/auth";
import WebApiPayroll from "../../api/WebApiPayroll";
import FormPerceptionsDeductions from "../../components/payroll/forms/FormPerceptionsDeductions";
import { Global, css } from "@emotion/core";
import { EditSharp } from "@material-ui/icons";

const StampPayroll = () => {
  const { Panel } = Collapse;
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personSelected, setPersonSelected] = useState(null);

  let nodeId = userCompanyId();
  let nodeName = userCompanyName();

  /* functions */
  const getPaymentCalendars = async () => {
    let response = await WebApiPayroll.getPaymentCalendar(nodeId);
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
        node: nodeId,
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
          amount: item.Amount ? item.Amount : 0,
          taxed_amount: item.TaxedAmount,
          exempt_amount: item.ExemptAmount,
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
            item["total_other_payments"] = a.calculation.total_other_payments;
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

  /* Events */
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

  useEffect(() => {
    getPaymentCalendars();
  }, [nodeId]);

  useEffect(() => {}, [payroll]);
  useEffect(() => {}, [optionspPaymentCalendars]);
  useEffect(() => {}, [fisrtRequest]);

  const columns = [
    {
      title: "Persona",
      dataIndex: "person",
      key: "person",
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return <>{status ? "Timbrado" : "Error al timbrar"}</>;
      },
    },
    {
      title: "Acciones",
      align: "center",
      render: (item) => {
        return (
          <div>
            <Row gutter={24}>
              <Col className="gutter-row" span={8}>
                <Tooltip title="Descargar XML">
                  <FileOutlined onClick={() => downloadFile(item, 1)} />
                </Tooltip>
              </Col>
              <Col className="gutter-row" span={8}>
                <Tooltip title="Descargar PDF">
                  <FilePdfOutlined onClick={() => downloadFile(item, 2)} />
                </Tooltip>
              </Col>
              <Col className="gutter-row" span={8}>
                <Tooltip title="Descargar HTML">
                  <Html5Outlined onClick={() => downloadFile(item, 3)} />
                </Tooltip>
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  const downloadFile = (item, type_file) => {
    if (item) {
      let data = {
        type_request: 3,
        type_file: type_file,
        id_facturama: item.id_facturama,
      };
      WebApiPayroll.cfdiMultiEmitter(data).then((response) => {
        if (type_file == 2) {
          const linkSource = `data:application/pdf;base64,${response.data}`;
          const downloadLink = document.createElement("a");
          const fileName = item.person + ".pdf";

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          const type = response.headers["content-type"];
          const blob = new Blob([response.data], {
            type: type,
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download =
            type_file == 1 ? item.person + ".xml" : item.person + ".html";

          link.click();
        }
      });
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
        <Button size="small" onClick={() => showModal(record)}>
          <PlusOutlined />
        </Button>
      ),
    },
  ];

  const showModal = (person) => {
    setPersonSelected(person);
    setIsModalVisible(true);
  };

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
        width: 100,
      },
      {
        title: "Descripción",
        key: "label",
        dataIndex: "label",
        className: "cell-concept",
        width: 500,
      },
      // {
      //   title: "Dato",
      //   key: "data",
      //   dataIndex: "data",
      //   className: "cell-concept",
      //   width: 150,
      // },
      {
        title: "Grabado",
        key: "taxed_amount",
        dataIndex: "taxed_amount",
        width: 150,
        render: (taxed_amount) => (
          <Space size="middle">
            <Text>$ {taxed_amount}</Text>
          </Space>
        ),
      },
      {
        title: "Exento",
        key: "exempt_amount",
        dataIndex: "exempt_amount",
        width: 150,
        render: (exempt_amount) => (
          <Space size="middle">
            <Text>$ {exempt_amount}</Text>
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
        width: 100,
      },
      {
        title: "Descripción",
        key: "label",
        dataIndex: "label",
        className: "cell-concept",
        width: 500,
      },
      // {
      //   title: "Dato",
      //   key: "data",
      //   dataIndex: "data",
      //   className: "cell-concept",
      //   width: 150,
      // },
      {
        title: "monto",
        key: "amount",
        dataIndex: "amount",
        width: 150,
        render: (amount) => (
          <Space size="middle">
            <Text>Monto</Text>
            <Text>$ {amount}</Text>
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
        width: 100,
      },
      {
        title: "Descripción",
        key: "label",
        dataIndex: "label",
        className: "cell-concept",
        width: 500,
      },
      {
        title: "monto",
        key: "amount",
        dataIndex: "amount",
        width: 150,
        render: (amount) => (
          <Space size="middle">
            <Text>Monto</Text>
            <Text>$ {amount}</Text>
          </Space>
        ),
      },
    ];

    return (
      <>
        <div style={{ textAlign: "center" }}>Percepciones</div>
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
        <div style={{ textAlign: "center" }}>Deducciones</div>
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
        <div style={{ textAlign: "center" }}>Otros pagos</div>
        <Table
          className="subTable"
          columns={columnsOtherPayments}
          dataSource={dataOtherPayments}
          pagination={false}
          size="small"
          bordered
          locale={{ emptyText: "Aún no hay datos" }}
        />

        <br />
        <Col
          span={10}
          style={{ display: "flex", float: "right", fontWeight: "bold" }}
        >
          <Row>
            <table>
              <tr>
                <td>Total percepciones :</td>
                <td>$ {record.total_perceptions}</td>
              </tr>
              <tr>
                <td>Total deducciones :</td>
                <td>$ {record.total_deductions}</td>
              </tr>
              <tr>
                <td>Total otros pagos :</td>
                <td>$ {record.total_other_payments}</td>
              </tr>
              <tr>
                <td>Total a pagar :</td>
                <td>$ {record.total_to_pay}</td>
              </tr>
            </table>
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
      <MainLayout currentKey={["timbrar"]} defaultOpenKeys={["nomina"]}>
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Timbrado de nomina</Breadcrumb.Item>
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
          <Col md={3}>
            <Button
              size="large"
              block
              htmlType="button"
              onClick={() => sendStampPayroll()}
            >
              Calcular
            </Button>
          </Col>
          <Col span={24}>
            <Spin tip="Cargando..." spinning={loading}>
              <Card className="card_table">
                <Table
                  className="headers_transparent"
                  columns={columnsNew}
                  expandable={{
                    expandedRowRender: (record) => renderConceptsTable(record),

                    /* expandRowByClick: true, */
                    onExpand: (expanded, record) => rowExpand(expanded, record),
                    expandIconAsCell: false,
                    /* expandIconColumnIndex: -1, */
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

        <Modal
          visible={isModalVisible}
          footer={null}
          width={600}
          closable={false}
          destroyOnClose
          /* key={"modal-" + data.person.id} */
        >
          <Row justify="center">
            <Col md={20}>
              <Title level={2}>Agregar</Title>
              <FormPerceptionsDeductions
                setIsModalVisible={setIsModalVisible}
                person_id={personSelected && personSelected.person_id}
                saveConcepts={saveConcepts}
                payroll={payroll}
                setLoading={setLoading}
              />
            </Col>
          </Row>
        </Modal>
      </MainLayout>
    </>
  );
};

export default StampPayroll;
