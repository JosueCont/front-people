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
import { periodicityNom } from "../../utils/constant";
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
  const [insidencePeriod, setInsidencePeriod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [persons, setPersons] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [objectStamp, setObjectStamp] = useState(null);
  const [stamped, setStamped] = useState(false);
  const [stampedInvoices, setStampedInvoices] = useState([]);
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

  const getPersonCalendar = async (calendar_id) => {
    setLoading(true);
    let response = await WebApiPayroll.getPersonsCalendar(calendar_id);

    if (response.data.length > 0) {
      let arrar_payroll = [];
      response.data.map((a) => {
        if (a.person) {
          arrar_payroll.push({
            person_id: a.person.id,
            key: a.person.id,
            full_name:
              a.person.first_name +
              " " +
              a.person.mlast_name +
              " " +
              a.person.flast_name,
            photo: a.person.photo,
            company: a.person.node_user ? a.person.node_user.name : null,
            daily_salary: a.daily_salary ? `$ ${a.daily_salary}` : null,
            person_id: a.person.id,
            perceptions: [],
            deductions: [],
            others_payments: [],
          });
        }
      });
      setPayroll(arrar_payroll);
      setPersons(response.data);
    } else {
      setPersons([]);
      setPayroll([]);
      message.error("No se encontraron resultados");
    }
    setLoading(false);
  };

  const prepareData = (dataPersons) => {
    let newData = [];

    dataPersons.map((item) => {
      let newItem = { ...item };
      let newDeductions = [];
      let newPerceptions = [];

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

      newItem["perceptions"] = newPerceptions;
      newItem["deductions"] = newDeductions;

      newData.push(newItem);
    });

    return newData;
  };

  const sendStampPayroll = async () => {
    let tempArray = [...payroll];
    let newData = prepareData(tempArray);
    let data = {
      node: nodeId,
      period: period,
      payroll: newData,
      invoice: true,
    };
    /* if (payroll.length === 0) {
      let arrar_payroll = [];
      persons.map((a) => {
        if (a.person) {
          arrar_payroll.push({
            person_id: a.person.id,
            perceptions: [],
            deductions: [],
            others_payments: [],
          });
        }
      });
      data.payroll = arrar_payroll;
    } else {
      data.payroll = payroll;
    } */
    setLoading(true);
    let response = await WebApiPayroll.payrollFacturama(data);
    if (response.data.length > 0) {
      setStamped(true);
      setStampedInvoices(response.data);
      setLoading(false);
    }
    //   let payrolls = response.data.payrolls;
    //   if (persons.length > 0) {
    //     let arrayPersons = persons;
    //     arrayPersons.map((p) => {
    //       let payroll_person = payrolls.find(
    //         (elem) =>
    //           elem.Complemento.Payroll.Employee.EmployeeNumber == p.person.code
    //       );
    //       if (payroll_person) {
    //         p.payroll = payroll_person;
    //       }
    //     });

    //     setPersons(arrayPersons);
    //     setLoading(false);
    //   }
    // }
  };

  /* Events */
  const getPayroll = async (dataToSend, fisrtRequest = false) => {
    setLoading(true);
    let response = await WebApiPayroll.payrollFacturama(dataToSend);

    let arrar_payroll = [];
    response.data.map((a) => {
      if (a.person) {
        let item = {
          person_id: a.employee_id,
          key: a.employee_id,
          full_name: a.person,
          company: nodeName,
          daily_salary: a.payroll
            ? `$ ${a.payroll.Employee.DailySalary}`
            : null,
          perceptions: [],
          deductions: [],
          others_payments: [],
        };

        if (a.payroll) {
          if (a.payroll.Perceptions.Details) {
            let perceptions = [];
            let deductions = [];

            a.payroll.Perceptions.Details.map((item) => {
              perceptions.push({
                locked: fisrtRequest,
                code: item.code ? item.code : "",
                key: item.Description,
                label: item.Description ? item.Description : "",
                amount: item.Amount ? item.Amount : 0,
              });
            });

            a.payroll.Deductions.Details.map((item) => {
              deductions.push({
                locked: fisrtRequest,
                code: item.code ? item.code : "",
                key: item.Description,
                label: item.Description ? item.Description : "",
                amount: item.Amount ? item.Amount : 0,
              });
            });

            item["perceptions"] = perceptions;
            item["deductions"] = deductions;
          }
        }

        arrar_payroll.push(item);
      }
    });

    setPayroll(arrar_payroll);
    /* setPersons(response.data); */
  };

  const changePaymentCalendar = (value) => {
    if (value) {
      let calendar = paymentCalendars.find((elm) => elm.id == value);
      if (calendar) {
        /* getPersonCalendar(value); */
        getPayroll({ calendar_id: value }, true);

        let periodicity = periodicityNom.find(
          (p) => p.value == calendar.periodicity
        );

        if (periodicity) {
          setPeriodicity(periodicity.label);
        } else {
          setPeriodicity("");
        }
        setPeriod(calendar.period);
        let period = calendar.periods.find((p) => p.active == true);
        if (period) {
          // setPeriod(period.start_date + " - " + period.end_date);
          if (period.incidences) {
            setInsidencePeriod(
              period.incidences.start_date + " - " + period.incidences.end_date
            );
            setPaymentDate(period.payment_date);
          }
        } else {
          setPeriod("");
          setInsidencePeriod("");
          setPaymentDate("");
        }
      }
    }
  };

  useEffect(() => {
    getPaymentCalendars();
  }, [nodeId]);

  useEffect(() => {
    if (persons.length > 0) {
    }
  }, [persons]);

  useEffect(() => {}, [optionspPaymentCalendars]);

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

  const expandedRowRender = (record) => {
    let data = record.perceptions
      .concat(record.deductions)
      .concat(record.others_payments);

    const columns = [
      {
        title: "concepto_title",
        key: "concept-title",
        width: 100,
        render: (record) => <Text>*Concepto</Text>,
      },
      {
        title: "concepto",
        key: "concept",
        dataIndex: "label",
        className: "cell-concept",
        width: 500,
      },
      {
        title: "monto",
        key: "ampunt",
        dataIndex: "amount",
        width: 150,
        render: (amount) => (
          <Space size="middle">
            <Text>Monto</Text>
            <Text>$ {amount}</Text>
          </Space>
        ),
      },
      {
        title: "Action",
        key: "operation",
        className: "cell-actions",
        render: () => (
          <Space size="middle">
            <EditFilled />
          </Space>
        ),
      },
    ];

    return (
      <Table
        className="subTable"
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
        locale={{ emptyText: "Aún no hay datos" }}
      />
    );
  };

  const saveConcepts = (concept) => {
    const tempPayroll = [...payroll];
    let payroll_person = tempPayroll.find(
      (elem) => elem.person_id === concept.person_id
    );
    vaidatePerception(concept.perceptions, payroll_person);
  };

  const vaidatePerception = (perceptions, payroll_person) => {
    perceptions.map((item) => {
      let idx = payroll_person.perceptions.findIndex(
        (element) => element.code === item.code
      );
      if (idx === -1) {
        payroll_person.perceptions.push(item);
      } else {
        payroll_person.perceptions[idx] = item;
      }
    });
    updPersonsPayroll(payroll_person);
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
                    value={insidencePeriod}
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
              Enviar
            </Button>
          </Col>
          <Col span={24}>
            <Card className="card_table">
              <Table
                className="headers_transparent"
                columns={columnsNew}
                /* expandable={{
                  expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                }} */
                expandable={{
                  expandedRowRender: (record) => expandedRowRender(record),
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
          </Col>
        </Row>

        {/* <Row justify="end" style={{ display:'none' }}>
        <Col span={24}>
          <Spin tip="Cargando..." spinning={loading}>
            {!stamped && (
              <Collapse defaultActiveKey={["1"]}>
                {persons &&
                  persons.map((p, i) => {
                    if (p.person) {
                      return (
                        <Panel
                          header={
                            p.person.first_name +
                            " " +
                            p.person.flast_name +
                            " " +
                            p.person.mlast_name +
                            "  " +
                            "    -  Salario diario: $" +
                            p.daily_salary
                          }
                          key={i + 1}
                        >
                          <PanelInfo
                            data={p}
                            setObjectStamp={setObjectStamp}
                            payroll={payroll}
                            setLoading={setLoading}
                            key={p.person.id}
                          />
                        </Panel>
                      );
                    }
                  })}
              </Collapse>
            )}

            {stampedInvoices && stampedInvoices.length > 0 && stamped && (
              <Table
                className={"mainTable"}
                size="small"
                columns={columns}
                dataSource={stampedInvoices}
                loading={loading}
                locale={{
                  emptyText: loading
                    ? "Cargando..."
                    : "No se encontraron resultados.",
                }}
              />
            )}
          </Spin>
        </Col>
      </Row> */}
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
