import { Row, Col, Form, Input,Collapse, Radio, Switch, Select, DatePicker } from "antd";
import { useEffect } from "react";
import SelectTypeTax from "../../../../components/selects/SelectTypeTax";
import { salaryDays } from "../../../../utils/constant";
import { ruleRequired } from "../../../../utils/rules";
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from "moment";
import { useState } from "react";
const { Panel } = Collapse;

const FormCaledanrXml = ({
  calendar,
  paymentPeriodicity = [],
  dataImportCalendar,
  isAddXMLS=false,// esto indica si es la opcion de agregar mas xmls a un calendario existente
  perceptions_type = null,
  ...props
}) => {
  const [formCalendar] = Form.useForm();
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [periodicityCode, setPeriodicityCode] = useState("");
  const [lastPeriodDate, setlastPeriodDate] = useState(null);
  const [perception, setPerception] = useState("");

  useEffect(() => {
    calendar.calendar.perception_type = calendar.perception;
  }, []);

  useEffect(() => {
    if (calendar.perception) {
      let percep = perceptions_type.find(
        (item) => item.id == calendar.perception
      );
      if (percep) setPerception(percep.code == "001" ? "Nomina" : "Asimilados");
    }
  }, [perceptions_type, calendar]);

  const onChangePeriod = (item) => {
    calendar.calendar.start_date = item.target.value;
  };

  const PrintPeriods = ({ periods = [] }) => {
    return (
      <Col span={10}>
        <Collapse>
          <Panel header={`Periodos identificados (${periods ? periods.length : 0})`} key="1">
            <ul>
              {periods.map((item, i) => {
                return (
                    <li key={i}>
                      {item.payment_start_date} - {item.payment_end_date}
                    </li>
                );
              })}
            </ul>
          </Panel>
        </Collapse>

      </Col>
    );
  };

  useEffect(() => {
    if (calendar) setCurrentYear(calendar.calendar.period);
    let periodicity_code = paymentPeriodicity.find(
      (item) => item.id == calendar.calendar.periodicity
    ).description;
    setPeriodicityCode(periodicity_code);
    formCalendar.setFieldsValue({
      name: isAddXMLS ? calendar.name : calendar.calendar.name,
      perception_type: calendar.calendar.perception_type,
      period: calendar.calendar.period,
      periodicity: isAddXMLS ? calendar.periodicity:calendar.calendar.periodicity ,
      start_date:isAddXMLS ? moment(calendar.start_date) : moment(calendar.calendar.start_date),
      activation_date:isAddXMLS ?  moment(calendar.activation_date) :  moment(calendar.calendar.activation_date),
      type_tax: isAddXMLS ? calendar.type_tax : calendar.calendar.type_tax,
      salary_days: isAddXMLS ? calendar.salary_days : calendar.calendar.salary_days,
    });
    setlastPeriodDate(calendar.calendar.activation_date);
  }, [calendar]);

  const SwitchCalendar = ({ status = false, name }) => {
    return (
      <Switch
        defaultChecked={status}
        checkedChildren="Si"
        unCheckedChildren="No"
        onChange={(value) => (calendar.calendar[name] = value)}
      />
    );
  };

  const disablePeriod = (current) => {
    let month = moment(current).month() + 1;
    let year = moment(current).year();

    let date = {
      month,
      year,
    };

    if (
      (date.month !== 1 && date.month !== 12) ||
      date.year < currentYear - 1
    ) {
      return true;
    } else {
      if (date.month === 1 && date.year < currentYear) return true;
      return false;
    }
  };

  const disableActivation = (current) => {
    if (moment(lastPeriodDate) < moment(current)) return false;
    return true;
  };

  return (
    <>
      {calendar && (
        <>
           <Row style={{ width: "100%", padding: 10 }}>
            <Col span={24}>
              <PrintPeriods periods={calendar.period_list} />
            </Col>
          </Row>
          <Row style={{ width: "100%", padding: 10 }}>
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "start" }}
            >
              {" "}
              <span style={{ fontSize: 20, fontWeiht: "bold" }}>
                {perception}
              </span>
            </Col>
          </Row>

          <Form form={formCalendar} layout="vertical">
            <Row gutter={[16, 6]}>
              <Col>
                <Form.Item
                  name={"name"}
                  label="Nombre de calendario"
                  rules={[ruleRequired]}
                  initialValue={calendar.calendar.name}
                >
                  <Input
                    onChange={(value) =>
                      (calendar.calendar.name = value.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="period" label="Periodo">
                  <Input type={"number"} readOnly />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Periodicidad">
                  <Input
                    readOnly
                    value={
                      paymentPeriodicity.length > 0
                        ? paymentPeriodicity.find(
                            (item) => item.id == calendar.calendar.periodicity
                          ).description
                        : "--"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 6]}>
              <Col>
                <Form.Item
                  name="start_date"
                  label="Inicio de calendario"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    moment={"YYYY-MM-DD"}
                    placeholder=""
                    locale={locale}
                    onChange={(value, dateString) => {
                      calendar.calendar.start_date = dateString;
                    }}
                    disabledDate={disablePeriod}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="activation_date"
                  label="Inicio de uso de calendario"
                  rules={[ruleRequired]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    moment={"YYYY-MM-DD"}
                    placeholder=""
                    locale={locale}
                    onChange={(value, dateString) => {
                      calendar.calendar.activation_date = dateString;
                    }}
                    disabledDate={disableActivation}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 6]} style={{ marginTop: "5px" }}>
              <Col span={10}>
                <SelectTypeTax
                  style={{ width: 240 }}
                  rules={[ruleRequired]}
                  onChange={(value) => (calendar.calendar.type_tax = value)}
                />
              </Col>
              <Col lg={12} xs={22}>
                <Form.Item
                  key={"SelectSalaryDays"}
                  name="salary_days"
                  label="Días a pagar"
                  rules={[ruleRequired]}
                >
                  <Select
                    key={"SelectSalaryDays"}
                    placeholder="Días a pagar"
                    options={salaryDays}
                    onChange={(value) =>
                      (calendar.calendar.salary_days = value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="¿Activo?">
                  <SwitchCalendar
                    status={calendar.calendar.active}
                    name={"active"}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Ajuste mensual">
                  <SwitchCalendar
                    status={calendar.calendar.monthly_adjustment}
                    name={"monthly_adjustment"}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Ajuste anual">
                  <SwitchCalendar
                    status={calendar.calendar.annual_adjustment}
                    name={"annual_adjustment"}
                  />
                </Form.Item>
              </Col>
              {periodicityCode &&
                periodicityCode != "" &&
                periodicityCode == "02" && (
                  <>
                    <Col span={5}>
                      <Form.Item label="Desglose del séptimo día">
                        <SwitchCalendar
                          status={calendar.calendar.seventh_day_breakdown}
                          name={"seventh_day_breakdown"}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Descuento séptimo día">
                        <SwitchCalendar
                          status={calendar.calendar.seventh_day_discount}
                          name={"seventh_day_discount"}
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}
            </Row>
          </Form>
        </>
      )}
    </>
  );
};

export default FormCaledanrXml;
