import { Row, Col, Form, Input, Radio, Switch, Select } from "antd";
import { useEffect } from "react";
import SelectTypeTax from "../../../../components/selects/SelectTypeTax";
import { salaryDays } from "../../../../utils/constant";
import { ruleRequired } from "../../../../utils/rules";

const FormCaledanrXml = ({ calendar, paymentPeriodicity = [], ...props }) => {
  const [formCalendar] = Form.useForm();

  const onChangePeriod = (item,perception) => {
    calendar.calendar.start_date = item.target.value;
    calendar.calendar.perception_type = perception;
  };

  const PrintPeriods = ({ periods = [] }) => {
    return (
      <>
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
      </>
    );
  };

  useEffect(() => {
    formCalendar.setFieldsValue({
      active: calendar.calendar.active,
      annual_adjustment: calendar.calendar.annual_adjustment,
      monthly_adjustment: calendar.calendar.monthly_adjustment,
      name: calendar.calendar.name,
      perception_type: calendar.calendar.perception_type,
      period: calendar.calendar.period,
      periodicity: calendar.calendar.periodicity,
      start_date: calendar.calendar.start_date,
      type_tax: calendar.calendar.type_tax,
    });
  }, [calendar]);

  return (
    <>
      {calendar && (
        <>
          <Row style={{ width: "100%", padding: 10 }}>
            <Col span={24}>
              <h4>Fecha de inicio del calendario</h4>
            </Col>
            <Col span={24}>
              <Radio.Group onChange={(e)=>onChangePeriod(e,calendar.perception)} required>
                <PrintPeriods periods={calendar.period_list} />
              </Radio.Group>
            </Col>
          </Row>
          <Form form={formCalendar} layout="vertical" className={"formFilter"}>
            <Row gutter={[16, 6]}>
              <Col style={{ display: "flex" }}>
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
              <Col style={{ display: "flex" }}>
                <Form.Item name="period" label="Periodo">
                  <Input type={"number"} readOnly />
                </Form.Item>
              </Col>
              <Col style={{ display: "flex" }}>
                <Form.Item label="Periodicidad">
                  <Input
                    readOnly
                    value={
                      paymentPeriodicity.length > 0 ?
                      paymentPeriodicity.find(
                        (item) => item.id == calendar.calendar.periodicity
                      ).description : '--'
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 6]} style={{ marginTop: "5px" }}>
              <Col
                style={{
                  display: "flex",
                }}
              >
                <SelectTypeTax
                  style={{ width: 240 }}
                  rules={[ruleRequired]}
                  onChange={(value) => (calendar.calendar.type_tax = value)}
                />
              </Col>
              <Col lg={5} xs={22}>
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
              <Col style={{ display: "flex" }}>
                <Form.Item name="active" label="¿Activo?">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Si"
                    unCheckedChildren="No"
                    onChange={(value) => (calendar.calendar.active = value)}
                  />
                </Form.Item>
              </Col>
              <Col style={{ display: "flex" }}>
                <Form.Item name="monthly_adjustment" label="Ajuste mensual">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Si"
                    unCheckedChildren="No"
                    onChange={(value) =>
                      (calendar.calendar.monthly_adjustment = value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col style={{ display: "flex" }}>
                <Form.Item name="annual_adjustment" label="Ajuste anual">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Si"
                    unCheckedChildren="No"
                    onChange={(value) =>
                      (calendar.calendar.annual_adjustment = value)
                    }
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
