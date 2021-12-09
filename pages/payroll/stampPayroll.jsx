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
} from "antd";
import { useRouter } from "next/router";
import {
  FilePdfOutlined,
  PlusOutlined,
  FileOutlined,
  Html5Outlined,
} from "@ant-design/icons";
import { userCompanyId } from "../../libs/auth";
import { periodicityNom } from "../../utils/constant";
import webApiPayroll from "../../api/webApiPayroll";
import FormPerceptionsDeductions from "../../components/payroll/forms/FormPerceptionsDeductions";

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
  let nodeId = userCompanyId();

  /* functions */
  const getPaymentCalendars = async () => {
    let response = await webApiPayroll.getPaymentCalendar(nodeId);
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
    let response = await webApiPayroll.getPersonsCalendar(calendar_id);
    if (response.data.length > 0) {
      let arrar_payroll = [];
      response.data.map((a) => {
        if (a.person) {
          arrar_payroll.push({
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
      message.error("No se encontraron resultados");
    }
    setLoading(false);
  };

  const sendStampPayroll = async () => {
    let data = {
      node: nodeId,
      period: period,
      payroll: [],
      invoice: true,
    };
    if (payroll.length === 0) {
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
    }
    setLoading(true);
    let response = await webApiPayroll.payrollFacturama(data);
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
  const changePaymentCalendar = (value) => {
    if (value) {
      let calendar = paymentCalendars.find((elm) => elm.id == value);
      if (calendar) {
        getPersonCalendar(value);
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

  useEffect(() => {
    if (objectStamp) {
      let array_payroll = payroll.slice();
      let elem_payroll = array_payroll.find(
        (elem) => elem.person_id == objectStamp.person_id
      );
      if (elem_payroll) {
        let array = array_payroll.filter(
          (elem) => elem.person_id !== objectStamp.person_id
        );
        array.push(objectStamp);
        setPayroll(array);
      } else {
        array_payroll.push(objectStamp);
        setPayroll(array_payroll);
      }
      setLoading(false);
    }
  }, [objectStamp]);

  const PanelInfo = ({ data, setObjectStamp, payroll, setLoading }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
      setIsModalVisible(true);
    };
    return (
      <Row>
        <Col span={24}>
          <Button
            style={{ float: "right" }}
            type="primary"
            shape="circle"
            onClick={() => showModal(data.person.person_id)}
            icon={<PlusOutlined />}
            size={"middle"}
          />
        </Col>

        <Modal
          title="Agregar"
          closable={false}
          visible={isModalVisible}
          footer={null}
          key={"modal-" + data.person.id}
        >
          <FormPerceptionsDeductions
            setIsModalVisible={setIsModalVisible}
            person_id={data.person.id}
            setObjectStamp={setObjectStamp}
            payroll={payroll}
            setLoading={setLoading}
            key={"form-" + data.person.id}
          />
        </Modal>
      </Row>
    );
  };

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
      webApiPayroll.cfdiMultiEmitter(data).then((response) => {
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

  return (
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
      <div className="container" style={{ width: "100%" }}>
        <>
          <Row justify="space-between" style={{ paddingBottom: 20 }}>
            <Col span={24}>
              <div className="top-container-border-radius">
                <Row gutter={[16, 8]}>
                  <Col xxs={24} xl={4}>
                    <Select
                      style={{ width: "100%" }}
                      options={optionspPaymentCalendars}
                      onChange={changePaymentCalendar}
                      placeholder="Calendarios"
                      notFoundContent={"No se encontraron resultados."}
                    />
                  </Col>
                  <Col xxs={24} xl={4}>
                    <Input
                      key="periodicity"
                      placeholder="Periodicidad"
                      disabled={true}
                      value={periodicity}
                    />
                  </Col>
                  <Col xxs={24} xl={6}>
                    <Input
                      key="period"
                      placeholder="Período"
                      disabled={true}
                      value={period}
                    />
                  </Col>
                  <Col xxs={24} xl={6}>
                    <Input
                      key="insidence_period"
                      placeholder="Período de incidencia"
                      disabled={true}
                      value={insidencePeriod}
                    />
                  </Col>
                  <Col xxs={24} xl={4}>
                    <Input
                      key="payment_day"
                      placeholder="Dia de pago"
                      disabled={true}
                      value={paymentDate}
                    />
                  </Col>
                </Row>
              </div>

              <Row>
                <Col span={24}>
                  <Button
                    htmlType="button"
                    style={{ float: "right", marginTop: "10px" }}
                    onClick={() => sendStampPayroll()}
                  >
                    Enviar
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row justify="end">
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
          </Row>
        </>
      </div>
    </MainLayout>
  );
};

export default StampPayroll;
