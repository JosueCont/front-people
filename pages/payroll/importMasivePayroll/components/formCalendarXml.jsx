import { Row, Col, Form, Input, Radio, Switch, Select } from "antd";
import { useEffect } from "react";
import SelectTypeTax from "../../../../components/selects/SelectTypeTax";
import { salaryDays } from "../../../../utils/constant";
import { ruleRequired } from "../../../../utils/rules";

const FormCaledanrXml = ({
  calendar,
  paymentPeriodicity = [],
  dataImportCalendar,
  ...props
}) => {
  const [formCalendar] = Form.useForm();

  useEffect(() => {
    calendar.calendar.perception_type = calendar.perception;
  }, []);

  const onChangePeriod = (item) => {
    calendar.calendar.start_date = item.target.value;
  };

  const PrintPeriods = ({ periods = [] }) => {
    return (
      <>
        <Radio.Group
          onChange={(e) => onChangePeriod(e)}
          required
          defaultValue={calendar.calendar.start_date}
        >
          {periods.map((item, i) => {
            return (
              <Col>
                <Radio
                  key={item.payment_start_date + i}
                  value={`${item.payment_start_date},${item.payment_end_date}`}
                >
                  {item.payment_start_date} - {item.payment_end_date}
                </Radio>
              </Col>
            );
          })}
        </Radio.Group>
      </>
    );
  };

  useEffect(() => {
    formCalendar.setFieldsValue({
      name: calendar.calendar.name,
      perception_type: calendar.calendar.perception_type,
      period: calendar.calendar.period,
      periodicity: calendar.calendar.periodicity,
      start_date: calendar.calendar.start_date,
      type_tax: calendar.calendar.type_tax,
    });
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

  return (
    <>
      {calendar && (
        <>
          <Row style={{ width: "100%", padding: 10 }}>
            <Col span={24}>
              <h3>
                <b>Fecha de inicio del calendario</b>
              </h3>
            </Col>
            <Col span={24}>
              <PrintPeriods periods={calendar.period_list} />
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
                  key="SelectSalaryDays"
                  name="salary_days"
                  label="Dias a pagar"
                  rules={[ruleRequired]}
                >
                  <Select
                    placeholder="Dias a pagar"
                    options={salaryDays}
                    onChange={(value) =>
                      (calendar.calendar.salary_days = value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="¿Activo?">
                  <SwitchCalendar
                    status={calendar.calendar.active}
                    name={"active"}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="Ajuste mensual">
                  <SwitchCalendar
                    status={calendar.calendar.monthly_adjustment}
                    name={"monthly_adjustment"}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="Ajuste anual">
                  <SwitchCalendar
                    status={calendar.calendar.annual_adjustment}
                    name={"annual_adjustment"}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
};

export default FormCaledanrXml;
