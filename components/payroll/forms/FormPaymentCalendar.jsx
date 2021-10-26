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
  Select,
  Switch,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import WebApi from "../../../api/webApiPayroll";
import WebApiFiscal from "../../../api/WebApiFiscal";
import { useRouter } from "next/router";
import { messageSaveSuccess, onlyNumeric } from "../../../utils/constant";
const FormPaymentCalendar = ({
  title,
  nodeId = null,
  idPaymentCalendar = null,
}) => {
  const route = useRouter();
  const { Title } = Typography;
  const [formPaymentCalendar] = Form.useForm();
  const optionsPeriodicity = [
    { value: 1, label: "Diario" },
    { value: 2, label: "Semanal" },
    { value: 3, label: "Decenal" },
    { value: 4, label: "Catorcenal" },
    { value: 5, label: "Quincenal" },
    { value: 6, label: "Mensual" },
    { value: 7, label: "Anual" },
  ];
  const ruleRequired = { required: true, message: "Este campo es requerido" };
  const [typeTax, setTypeTax] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [activationDate, setActivationtDate] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    getTypeTax();
    if (idPaymentCalendar) {
      getPaymentCalendar();
    }
  }, [idPaymentCalendar]);

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

  const getPaymentCalendar = async () => {
    setLoading(true);
    try {
      let response = await WebApi.getDetailPaymentCalendar(idPaymentCalendar);
      if (response.data) {
        let item = response.data;
        formPaymentCalendar.setFieldsValue({
          name: item.name,
          periodicity: item.periodicity,
          type_tax: item.type_tax,
          start_date: item.start_date ? moment(item.start_date) : "",
          period: item.period ? moment().year(item.period) : "",
          start_incidence: item.start_incidence,
          end_incidence: item.end_incidence,
          adjustment: item.adjustment ? item.adjustment : false,
          active: item.active ? item.active : false,
          pay_before: item.pay_before ? item.pay_before : 0,
          payment_saturday: item.payment_saturday
            ? item.payment_saturday
            : false,
          payment_sunday: item.payment_sunday ? item.payment_sunday : false,
          activation_date: item.activation_date,
        });
        setStartDate(item.start_date);
        setPeriod(item.period);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const savePaymentCalendar = async (data) => {
    try {
      let response = await WebApi.createPaymentCalendar(data);
      message.success({
        content: messageSaveSuccess,
        className: "custom-class",
      });
      route.push({ pathname: "/payroll/paymentCalendar" });
    } catch (error) {
      console.log(error);
    }
  };

  const updatePaymentCalendar = async (data) => {
    try {
      let response = await WebApi.updatePaymentCalendar(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
      route.push({ pathname: "/payroll/paymentCalendar" });
    } catch (error) {
      console.log(error);
    }
  };

  /* Events */
  const onChangeLastDayPaid = (date, dateString) => {
    setStartDate(dateString);
  };
  const onChangeActivationDate = (date, dateString) => {
    setActivationtDate(dateString);
  };

  const onChangePeriod = (date, dateString) => {
    setPeriod(dateString);
  };
  const formFinish = (value) => {
    value.node = parseInt(nodeId);
    value.active = value.active ? value.active : false;
    value.adjustment = value.adjustment ? value.adjustment : false;
    value.pay_before = value.pay_before ? value.pay_before : 0;
    value.payment_saturday = value.payment_saturday
      ? value.payment_saturday
      : false;
    value.payment_sunday = value.payment_sunday ? value.payment_sunday : false;
    if (startDate) {
      value.start_date = startDate;
    }
    value.activation_date = activationDate !== "" ? activationDate : "";
    if (period) {
      value.period = parseInt(period);
    }
    if (value.start_incidence) {
      value.start_incidence = parseInt(value.start_incidence);
    } else {
      value.start_incidence = 0;
    }
    if (value.end_incidence) {
      value.end_incidence = parseInt(value.end_incidence);
    } else {
      value.end_incidence = 0;
    }

    if (idPaymentCalendar) {
      value.id = idPaymentCalendar;
      updatePaymentCalendar(value);
    } else {
      savePaymentCalendar(value);
    }
  };

  return (
    <>
      <Spin tip="Cargando..." spinning={loading}>
        <Row>
          <Title style={{ fontSize: "20px" }}>{title}</Title>
        </Row>
        <Form
          layout={"vertical"}
          form={formPaymentCalendar}
          onFinish={formFinish}
        >
          <Row style={{ marginBottom: 20 }}>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="periodicity"
                label="Periodicidad"
                rules={[ruleRequired]}
              >
                <Select
                  options={optionsPeriodicity}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="type_tax"
                label="Tipo de impuesto"
                rules={[ruleRequired]}
              >
                <Select
                  options={typeTax}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="adjustment"
                label="¿Aplicar ajuste?"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="start_date"
                label="Inicio de calendario"
                rules={[ruleRequired]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangeLastDayPaid}
                  moment={"YYYY-MM-DD"}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="activation_date" label="Fecha de activación">
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangeLastDayPaid}
                  moment={"YYYY-MM-DD"}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="period" label="Período" rules={[ruleRequired]}>
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangePeriod}
                  picker="year"
                  moment={"YYYY"}
                />
              </Form.Item>
            </Col>

            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="start_incidence"
                label="Inicio de incidencia"
                maxLength={2}
                type="number"
                rules={[onlyNumeric]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="end_incidence"
                label="Fin de incidencia"
                maxLength={2}
                type="number"
                rules={[onlyNumeric]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="active" label="¿Activo?" valuePropName="checked">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="pay_before"
                label="Pagar antes?"
                rules={[onlyNumeric]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="payment_saturday"
                label="Pago en sábado?"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="payment_sunday"
                label="Pago en domingo?"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Button
              htmlType="button"
              style={{ marginRight: 10 }}
              onClick={() =>
                route.push({ pathname: "/payroll/paymentCalendar" })
              }
            >
              Cancelar
            </Button>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Form.Item>
            <Col
              span={24}
              style={{ textAlign: "right", padding: "30px 0" }}
            ></Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};
export default FormPaymentCalendar;
