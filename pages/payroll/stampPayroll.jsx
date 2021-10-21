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
} from "antd";
import { useRouter } from "next/router";
import { PlusOutlined } from "@ant-design/icons";
import { userCompanyId } from "../../libs/auth";
import { periodicityNom } from "../../utils/constant";
import webApiPayroll from "../../api/webApiPayroll";
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
  const [payroll, setPayroll] = useState([]);
  const [objectStamp, setObjectStamp] = useState(null);
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
      payroll: payroll,
    };
    setLoading(true);
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

        setPersons(arrayPersons);
        setLoading(false);
      }
    }
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

  const showModal = () => {
    setIsModalVisible(true);
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
        <Col
          span={24}
          style={{
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <Row>
            <Col xl={12} md={12} sm={24} xs={24}>
              {data.payroll &&
                data.payroll.Complemento.Payroll.Perceptions.Details && (
                  <Row className="header-tabe">
                    <Col span={12}>Percepciones</Col>
                    <Col span={12}>Importe</Col>
                  </Row>
                )}
              {data.payroll &&
                data.payroll.Complemento.Payroll.Perceptions &&
                data.payroll.Complemento.Payroll.Perceptions.Details.map(
                  (a) => {
                    return (
                      <Row className="body-table" key={a.code + "P"}>
                        {a.Code !== "046" && (
                          <>
                            <Col span={12}>{a.Description}</Col>
                            <Col span={12}>
                              ${+(a.ExemptAmount ? a.ExemptAmount : 0)}
                            </Col>
                          </>
                        )}
                        {a.Code === "046" && (
                          <>
                            <Col span={12}>Asimilados</Col>
                            <Col span={12}>${a.ExemptAmount}</Col>
                          </>
                        )}
                      </Row>
                    );
                  }
                )}
              {data.payroll &&
                data.payroll.Complemento.Payroll.OtherPayments &&
                data.payroll.Complemento.Payroll.OtherPayments.map((a) => {
                  return (
                    <Row className="body-table" key={a.code + "O"}>
                      <Col span={12}>{a.Description}</Col>
                      <Col span={12}>${+(a.Amount ? a.Amount : "0")}</Col>
                    </Row>
                  );
                })}
            </Col>
            <Col xl={12} md={12} sm={24} xs={24}>
              {/**Deducciones */}
              {data.payroll &&
                data.payroll.Complemento.Payroll.Deductions.Details && (
                  <Row className="header-tabe">
                    <Col span={12}>Deducciones</Col>
                    <Col span={12}>Importe</Col>
                  </Row>
                )}
              {data.payroll &&
                data.payroll.Complemento.Payroll.Deductions.Details.map((a) => {
                  return (
                    <Row className="body-table" key={a.code + "D"}>
                      <Col span={12}>{a.Description}</Col>
                      <Col span={12}>${+(a.Amount ? a.Amount : "0")}</Col>
                    </Row>
                  );
                })}
            </Col>
          </Row>
          <Row>
            <Col xl={12} md={12} sm={24} xs={24}>
              {data.payroll && data.payroll.Complemento.Payroll && (
                <Row
                  className="body-table"
                  style={{ fontWeight: "bold", borderStyle: "groove" }}
                >
                  <Col span={12}>Total percepciones</Col>
                  <Col span={12}>
                    ${data.payroll.Complemento.Payroll.Totales.Perceptions}
                  </Col>
                </Row>
              )}
            </Col>
            <Col xl={12} md={12} sm={24} xs={24}>
              {data.payroll && data.payroll.Complemento.Payroll && (
                <Row
                  className="body-table"
                  style={{ fontWeight: "bold", borderStyle: "groove" }}
                >
                  <Col span={12}>Total decucciones</Col>
                  <Col span={12}>
                    ${data.payroll.Complemento.Payroll.Totales.Deductions}
                  </Col>
                </Row>
              )}
            </Col>

            {data.payroll && data.payroll.Complemento.Payroll && (
              <Col span={24} style={{ float: "rigth", borderStyle: "groove" }}>
                <Row className="body-table" style={{ fontWeight: "bold" }}>
                  <Col span={12}>Total a pagar</Col>
                  <Col span={12}>
                    ${data.payroll.Complemento.Payroll.Totales.Payment}
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Col>
        <Modal
          title="Agregar"
          closable={false}
          visible={isModalVisible}
          footer={null}
        >
          <FormPerceptionsDeductions
            setIsModalVisible={setIsModalVisible}
            person_id={data.person.id}
            setObjectStamp={setObjectStamp}
            payroll={payroll}
            setLoading={setLoading}
            key={"form-" + data.person.person_id}
          />
        </Modal>
      </Row>
    );
  };

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
                              key={p.person.person_id}
                            />
                          </Panel>
                        );
                      }
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
