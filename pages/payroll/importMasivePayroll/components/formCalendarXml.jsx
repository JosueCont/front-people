import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Radio,
  Space,
  Switch,
  Select,
  Card,
} from "antd";
import { useState } from "react";
import SelectTypeTax from "../../../../components/selects/SelectTypeTax";
import { salaryDays } from "../../../../utils/constant";
import { ruleRequired } from "../../../../utils/rules";

const FormCaledanrXml = ({ company, periodicity, ...props }) => {
  const [calendar] = Form.useForm();
  const [startDate, setStartDate] = useState(null);

  const onChangePeriod = (item) => {
    setStartDate(item.target.value);
  };

  const PrintPeriods = ({ periods = {} }) => {
    // console.log("EMPRESA-->> ", periods.periodicities.period_list);
    // const periodos = periods.periodicities.period_list;
    // ? periods.periodicities.period_list
    // : periods.patronal_registrations[patronalSelect].periodicities
    //     .period_list;
    // console.log(periodos);
    return (
      <>
        `{" "}
        {/* {periodos.map((item, i) => {
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
        })}` */}
      </>
    );
  };

  return (
    <>
      <Col span={24}>
        <Card className="form_header">
          <Row justify="space-between">
            <Row style={{ width: "100%" }}>
              <span
                style={{
                  color: "white",
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                Calendario
              </span>
              <Row style={{ width: "100%", padding: 10 }}>
                <Col span={24}>
                  <h4>Fecha de inicio del calendario</h4>
                </Col>
                <Col span={24}>
                  <Radio.Group onChange={onChangePeriod} required>
                    <PrintPeriods periods={company} />
                  </Radio.Group>
                </Col>
              </Row>
              <Form
                form={calendar}
                layout="vertical"
                className={"formFilter"}
                // onFinish={sendImportPayrroll}
              >
                <Row gutter={[16, 6]}>
                  <Col style={{ display: "flex" }}>
                    <Form.Item
                      name={"name"}
                      label="Nombre de calendario"
                      rules={[ruleRequired]}
                    >
                      <Input
                      // value={xmlImport.company.reason}
                      />
                    </Form.Item>
                  </Col>
                  <Col style={{ display: "flex" }}>
                    <Form.Item label="Periodicidad">
                      <Input
                        readOnly
                        value={
                          periodicity.find(
                            (item) => item.id === response.data.periodicity
                          ).description
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    style={{
                      display: "flex",
                    }}
                  >
                    <SelectTypeTax
                      style={{ width: 240 }}
                      rules={[ruleRequired]}
                    />
                  </Col>
                </Row>

                <Row gutter={[16, 6]} style={{ marginTop: "5px" }}>
                  <Col style={{ display: "flex" }}>
                    <Form.Item name="period" label="Periodo">
                      <Input type={"number"} readOnly />
                    </Form.Item>
                  </Col>
                  <Col lg={5} xs={22}>
                    <Form.Item
                      key="SelectSalaryDays"
                      name="salary_days"
                      label="Dias a pagar"
                      rules={[ruleRequired]}
                    >
                      <Select placeholder="Dias a pagar" options={salaryDays} />
                    </Form.Item>
                  </Col>
                  <Col lg={5} xs={22}>
                    <SelectTypeTax />
                  </Col>
                  <Col style={{ display: "flex" }}>
                    <Form.Item name="active" label="¿Activo?">
                      <Switch checkedChildren="Si" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                  <Col style={{ display: "flex" }}>
                    <Form.Item name="monthly_adjustment" label="Ajuste mensual">
                      <Switch checkedChildren="Si" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                  <Col style={{ display: "flex" }}>
                    <Form.Item name="annual_adjustment" label="Ajuste anual">
                      <Switch checkedChildren="Si" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* <Row gutter={24} justify="end">
                  <Space>
                    <Button
                      style={{
                        background: "#fa8c16",
                        fontWeight: "bold",
                        color: "white",
                        marginTop: "auto",
                      }}
                      onClick={() => {
                        setXmlImport(null),
                          setFiles([]),
                          calendar.resetFields();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      style={{
                        background: "#fa8c16",
                        fontWeight: "bold",
                        color: "white",
                        marginTop: "auto",
                      }}
                      htmlType="submit"
                    >
                      Guardar
                    </Button>
                  </Space>
                </Row> */}
              </Form>
            </Row>
          </Row>
        </Card>
      </Col>
    </>
  );
};
export default FormCaledanrXml;
