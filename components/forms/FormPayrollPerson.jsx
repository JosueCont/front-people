import {
  Form,
  Input,
  Spin,
  DatePicker,
  Button,
  message,
  Row,
  Col,
  Typography,
  Modal,
  Select,
  Switch,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Axios from "axios";
import { API_URL } from "../../config/config";
import moment from "moment";
import WebApi from "../../api/webApi";
import { onlyNumeric } from "../../utils/constant";

const FormPayrollPerson = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formPayrollPerson] = Form.useForm();
  const { confirm } = Modal;
  /*iniciales */
  const [contrctsType, setContractsType] = useState([]);
  const [hiringRegimeType, setHiringRegimeType] = useState([]);
  const [typeTax, setTypeTax] = useState([]);
  const [banks, setBanks] = useState([]);
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [paymentPeriods, setPaymentPeriods] = useState([]);
  const [perceptionTypes, setPerceptionTypes] = useState([]);
  const [unionized, setUnionized] = useState(false);
  const [lastDayPaid, setLastDayPaid] = useState("");
  const PaymentTypes = [
    { value: 1, label: "Efectivo" },
    { value: 2, label: "Cheques" },
    { value: 3, label: "Transferencias" },
    { value: 30, label: "Anticipo" },
    { value: 99, label: "Por definir" },
  ];
  const ruleRequired = { required: true, message: "Este campo es requerido" };
  const [idPayroll, setIdPayroll] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPayrollPerson();
  }, []);

  const getPayrollPerson = async () => {
    setLoading(true);
    Axios.get(API_URL + `/payroll/payroll-person/?person__id=${person_id}`)
      .then((response) => {
        if (response.data.results.length > 0) {
          console.log("Response", response);
          //   setFormValues("Objeto");
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  const savePayrollPerson = async (data) => {
    try {
      let response = await WebApi.createPayrollPerson(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const updatePayrollPerson = async (data) => {
    try {
      setLoadingTable(true);
      let response = await WebApi.updatePayrollPerson(data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
    } catch (error) {
      console.log(error);
    }
  };

  /* Events */
  const onChangeLastDayPaid = (date, dateString) => {
    setLastDayPaid(dateString);
  };
  const formFinish = (value) => {
    if (idPayroll) {
      value.person = person_id;
      value.id = idPayroll;
      value.last_day_paid = lastDayPaid;
      updatePayrollPerson(value);
    } else {
      value.person = person_id;
      value.last_day_paid = lastDayPaid;
      savePayrollPerson(value);
    }
  };
  const setFormValues = (item) => {
    formPayrollPerson.setFieldsValue({
      daily_salary: item.daily_salary,
      contract_type: item.contract_type,
      hiring_regime_type: item.hiring_regime_type,
      type_tax: item.type_tax,
      unionized: item.unionized,
      payment_type: payment_type,
      bank: item.bank,
      apply_annual_adjustment: item.apply_annual_adjustment,
      payment_calendar: item.payment_calendar,
      payment_period: item.payment_period,
      perception_type: item.perception_type,
    });
    setBirthDateFam(item.last_day_paid);
    if (item.last_day_paid)
      formFamily.setFieldsValue({
        last_day_paid: moment(item.last_day_paid),
      });
    setIdPayroll(item.id);
  };

  return (
    <>
      <Spin tip="Cargando..." spinning={loading}>
        <Row>
          <Title style={{ fontSize: "20px" }}>Nomina</Title>
        </Row>
        <Form
          layout={"vertical"}
          form={formPayrollPerson}
          onFinish={formFinish}
        >
          <Row>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="daily_salary"
                label="Salario diario"
                maxLength={13}
                rules={[onlyNumeric]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="contract_type"
                label="Tipo de contrato"
                rules={[ruleRequired]}
              >
                <Select
                  options={contrctsType}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="hiring_regime_type"
                label="Tipo de regimen de contratación"
                rules={[ruleRequired]}
              >
                <Select
                  options={hiringRegimeType}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="type_tax" label="Tipo de impuesto">
                <Select
                  options={typeTax}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="unionized"
                label="¿Sindicalizado?"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="payment_type" label="Forma de pago">
                <Select
                  options={PaymentTypes}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="bank" label="Banco">
                <Select
                  options={banks}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="apply_annual_adjustment"
                label="¿Aplicar ajuste anual?"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="last_day_paid" label="Ultimo día de pago">
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangeLastDayPaid}
                  moment={"YYYY-MM-DD"}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="payment_calendar" label="Calendario de pago">
                <Select
                  options={paymentCalendars}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="payment_period"
                label="Período de pago"
                rules={[ruleRequired]}
              >
                <Select
                  options={paymentPeriods}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="perception_type" label="Tipo de percepción">
                <Select
                  options={perceptionTypes}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default FormPayrollPerson;
