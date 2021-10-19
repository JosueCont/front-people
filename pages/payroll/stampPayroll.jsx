import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Select,
  Input,
  Collapse,
  Modal,
  message,
  Spin,
  Statistic,
} from "antd";
import { useRouter } from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { PlusOutlined } from "@ant-design/icons";
import { userCompanyId } from "../../libs/auth";
import { periodicityNom } from "../../utils/constant";
import webApiPayroll from "../../api/webApiPayroll";
import { Label } from "@material-ui/icons";
import FormPerceptionsDeductions from "../../components/payroll/forms/FormPerceptionsDeductions";

const StampPayroll = () => {
  const { Panel } = Collapse;
  const route = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [optionspPaymentCalendars, setOptionsPaymentCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [periodicity, setPeriodicity] = useState("");
  const [period, setPeriod] = useState("");
  const [insidencePeriod, setInsidencePeriod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [persons, setPersons] = useState([]);
  const [objectStamp, setObjectStamp] = useState({});

  let nodeId = userCompanyId();

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

  const getPersonCalendar = async (calendar_id) => {
    setLoading(true);
    let response = await webApiPayroll.getPersonsCalendar(calendar_id);
    if (response.data.length > 0) {
      console.log("Response Persons", response);
      setPersons(response.data);
    } else {
      setPersons([]);
      message.error("No se encontraron resultados");
    }
    setLoading(false);
  };

  const callback = (key) => {
    console.log(key);
  };

  const sendStampPayroll = async () => {
    let payroll = [];
    payroll.push(objectStamp);
    let data = {
      node: nodeId,
      period: period,
      payroll: payroll,
    };

    let response = await webApiPayroll.payrollFacturama(data);
    if (response.data.payrolls.length > 0) {
      let payrolls = response.data.payrolls;
      if (persons.length > 0) {
        let arrayPersons = persons;
        arrayPersons.map((p) => {
          let payroll_person = payrolls.find(
            (elem) =>
              elem.Complemento.Payroll.Employee.EmployeeNumber == p.person.code
          );
          if (payroll_person) {
            p.payroll = payroll_person;
          }
        });
        console.log("Personas", arrayPersons);
        setPersons([]);
        setPersons(arrayPersons);
      }
    }
    console.log("Respuesta", response);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    getPaymentCalendars();
  }, [nodeId]);

  useEffect(() => {
    console.log("Pre IF", persons);
    if (persons.length > 0) {
      console.log("StatePersonas=>", persons);
    }
  }, [persons]);

  useEffect(() => {
    if (optionspPaymentCalendars)
      console.log("Calendarios", optionspPaymentCalendars);
  }, [optionspPaymentCalendars]);

  useEffect(() => {
    if (objectStamp) {
      console.log("Enviando objeto", objectStamp);
    }
  }, [objectStamp]);

  return (
    <MainLayout currentKey="9.5">
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
            </Col>
          </Row>
          <Row justify="end">
            <Col span={24}>
              <Spin tip="Cargando..." spinning={loading}>
                <Collapse defaultActiveKey={["1"]} onChange={callback}>
                  {persons &&
                    persons.map((p) => {
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
                          key={p.person.id}
                        >
                          <Row>
                            <Col span={24}>
                              <Button
                                style={{ float: "right" }}
                                type="primary"
                                shape="circle"
                                onClick={showModal}
                                icon={<PlusOutlined />}
                                size={"middle"}
                              />
                            </Col>
                            <Col span={24}>
                              <Row gutter={16}>
                                <Col xs={24} sm={12} md={8} xl={8}>
                                  <p
                                    style={{
                                      marginBottom: "5px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Percepciones:
                                  </p>
                                  {p.payroll &&
                                    p.payroll.Complemento.Payroll.Perceptions
                                      .Details &&
                                    p.payroll.Complemento.Payroll.Perceptions.Details.map(
                                      (a) => {
                                        console.log("Elemento=>>", a);
                                        return (
                                          <>
                                            <p>{a.Description}</p>
                                            <p>
                                              {"Excento: " + a.ExemptAmount}
                                            </p>
                                            <p>{"Grabado: " + a.TaxedAmount}</p>
                                          </>
                                        );
                                      }
                                    )}
                                </Col>
                                <Col xs={24} sm={12} md={8} xl={8}>
                                  <p
                                    style={{
                                      marginBottom: "5px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Deducciones:
                                  </p>
                                  {p.payroll &&
                                    p.payroll.Complemento.Payroll.Perceptions}
                                  <p></p>
                                </Col>
                                <Col xs={24} sm={12} md={8} xl={8}>
                                  <p
                                    style={{
                                      marginBottom: "5px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Otros pagos:
                                  </p>
                                  <p></p>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={24}>
                              <Button
                                htmlType="button"
                                style={{ marginRight: 10 }}
                                onClick={() => sendStampPayroll()}
                              >
                                Enviar
                              </Button>
                            </Col>
                            <Modal
                              title="Basic Modal"
                              closable={false}
                              visible={isModalVisible}
                              footer={null}
                            >
                              <FormPerceptionsDeductions
                                setIsModalVisible={setIsModalVisible}
                                person_id={p.person.id}
                                setObjectStamp={setObjectStamp}
                              />
                            </Modal>
                          </Row>
                        </Panel>
                      );
                    })}
                </Collapse>
              </Spin>
            </Col>
          </Row>
        </>
      </div>
    </MainLayout>
  );
};

export default StampPayroll;
