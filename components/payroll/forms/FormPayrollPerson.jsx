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
import { API_URL } from "../../../config/config";
import moment from "moment";
import WebApiPayroll from "../../../api/WebApiPayroll";
import WebApiFiscal from "../../../api/WebApiFiscal";
/* import { treeDecimal } from "../../../utils/constant"; */
import { ruleRequired, treeDecimal } from "../../../utils/rules";

const FormPayrollPerson = ({ person_id = null, node = null }) => {
  const { Title } = Typography;
  const [formPayrollPerson] = Form.useForm();
  const { confirm } = Modal;
  const [contrctsType, setContractsType] = useState([]);
  const [hiringRegimeType, setHiringRegimeType] = useState([]);
  const [typeTax, setTypeTax] = useState([]);
  const [banks, setBanks] = useState([]);
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [paymentPeriods, setPaymentPeriodicity] = useState([]);
  const [lastDayPaid, setLastDayPaid] = useState("");
  const PaymentTypes = [
    { value: 1, label: "Efectivo" },
    { value: 2, label: "Cheques" },
    { value: 3, label: "Transferencias" },
    { value: 30, label: "Anticipo" },
    { value: 99, label: "Por definir" },
  ];
  const [idPayroll, setIdPayroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payrollPerson, setPayrolPerson] = useState(null);
  const [perceptionTypes, setPerceptionTypes] = useState([]);

  useEffect(() => {
    getPayrollPerson();
    getContractTypes();
    getHiringRegimes();
    getTypeTax();
    getBanks();
    getPaymentCalendar();
    getPaymentPeriodicity();
    getPerceptionTypes();
  }, []);

  const getPayrollPerson = async () => {
    setLoading(true);
    Axios.get(API_URL + `/payroll/payroll-person/?person__id=${person_id}`)
      .then((response) => {
        if (response.data) {
          /* let item = response.data.results[0]; */
          let item = response.data;
          formPayrollPerson.setFieldsValue({
            daily_salary: item.daily_salary,
            contract_type: item.contract_type.id,
            hiring_regime_type: item.hiring_regime_type.id,
            type_tax: item.type_tax.id,
            unionized: item.unionized ? item.unionized : false,
            payment_type: item.payment_type,
            bank: item.bank,
            apply_annual_adjustment: item.apply_annual_adjustment
              ? item.apply_annual_adjustment
              : false,
            payment_calendar: item.payment_calendar,
            payment_period: item.payment_period,
            perception_type: item.perception_type,
            last_day_paid: item.last_day_paid ? moment(item.last_day_paid) : "",
            integrated_daily_salary: item.integrated_daily_salary,
          });
          setLastDayPaid(item.last_day_paid);
          if (item.id) setIdPayroll(item.id);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const getContractTypes = async () => {
    try {
      let response = await WebApiFiscal.getContractTypes();
      let contract_types = response.data.results.map((a) => {
        return { value: a.id, label: a.description };
      });
      setContractsType(contract_types);
    } catch (error) {
      console.log(error);
    }
  };

  const getHiringRegimes = async () => {
    try {
      let response = await WebApiFiscal.getHiringRegimes();
      let hiring_regime_types = response.data.results.map((a) => {
        return { value: a.id, label: a.description };
      });
      setHiringRegimeType(hiring_regime_types);
    } catch (error) {
      console.log(error);
    }
  };

  const getTypeTax = async () => {
    try {
      let response = await WebApiFiscal.getTypeTax();
      let tax_types = response.data.results.map((a) => {
        return { value: a.id, label: a.description };
      });
      setTypeTax(tax_types);
    } catch (error) {
      console.log(error);
    }
  };

  const getBanks = async () => {
    try {
      let response = await WebApiFiscal.getBanks();
      let banks = response.data.results.map((a) => {
        return { value: a.id, label: a.description };
      });
      setBanks(banks);
    } catch (error) {
      console.log(error);
    }
  };

  const getPaymentCalendar = async () => {
    try {
      let response = await WebApiPayroll.getPaymentCalendar(node);
      let payment_calendar = response.data.results.map((a) => {
        return { value: a.id, label: a.name };
      });
      setPaymentCalendars(payment_calendar);
    } catch (error) {
      console.log(error);
    }
  };

  const getPaymentPeriodicity = async () => {
    try {
      let response = await WebApiFiscal.getPaymentPeriodicity();
      let payment_periodicity = response.data.results.map((a) => {
        return { value: a.id, label: a.description };
      });
      setPaymentPeriodicity(payment_periodicity);
    } catch (error) {
      console.log(error);
    }
  };

  const getPerceptionTypes = async () => {
    try {
      let response = await WebApiFiscal.getPerseptions();
      let payment_perceptions = response.data.results.map((a) => {
        return { value: a.id, label: a.description };
      });

      console.log("payment_perceptions =>", payment_perceptions);
      setPerceptionTypes(payment_perceptions);
    } catch (error) {
      console.log(error);
    }
  };

  const savePayrollPerson = async (data) => {
    try {
      let response = await WebApiPayroll.createPayrollPerson(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
      console.log("response =>", response);
      if (response.data) {
        formPayrollPerson.setFieldsValue({
          integrated_daily_salary: response.data.integrated_daily_salary,
        });
      }
      getPayrollPerson();
    } catch (error) {
      console.log(error);
    }
  };

  const updatePayrollPerson = async (data) => {
    try {
      setLoading(true);
      let response = await WebApiPayroll.updatePayrollPerson(data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
      console.log("response =>", response);
      if (response.data) {
        formPayrollPerson.setFieldsValue({
          integrated_daily_salary: response.data.integrated_daily_salary,
        });
      }

      setLoading(false);
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
      value.payment_type = parseInt(value.payment_type);
      value.daily_salary = parseFloat(value.daily_salary);
      updatePayrollPerson(value);
    } else {
      value.person = person_id;
      value.last_day_paid = lastDayPaid;
      value.daily_salary = parseFloat(value.daily_salary)
      savePayrollPerson(value);
    }
  };
  const setFormValues = (item) => {};

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
          className="inputs_form_responsive"
        >
          <Row gutter={20}>
            <Col lg={8} xs={22} md={12} >
              <Form.Item
                name="daily_salary"
                label="Salario diario"
                maxLength={13}
                rules={[treeDecimal]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22} md={12} >
              <Form.Item
                name="integrated_daily_salary"
                label="Salario diario integrado"
                maxLength={13}
                rules={[treeDecimal]}
              >
                <Input maxLength={10} disabled />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22} md={12} >
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
            <Col lg={8} xs={22} md={12} >
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
            <Col lg={8} xs={22} md={12} >
              <Form.Item name="type_tax" label="Tipo de impuesto">
                <Select
                  options={typeTax}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22} md={12} >
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
            <Col lg={8} xs={22} md={12} >
              <Form.Item name="payment_type" label="Forma de pago">
                <Select
                  options={PaymentTypes}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22} md={12} >
              <Form.Item name="bank" label="Banco">
                <Select
                  options={banks}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22} md={12} >
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
            <Col lg={8} xs={22} md={12} >
              <Form.Item name="last_day_paid" label="Ultimo día de pago">
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangeLastDayPaid}
                  moment={"YYYY-MM-DD"}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22} md={12} >
              <Form.Item name="payment_calendar" label="Calendario de pago">
                <Select
                  options={paymentCalendars}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            {/* <Col 8g={6} xs={22} md={12} >
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
            </Col> */}
            <Col lg={8} xs={22} md={12} >
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
