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
import { messageSaveSuccess } from "../../../utils/constant";
import { onlyNumeric, ruleRequired } from "../../../utils/rules";
import { css, Global } from "@emotion/core";

const FormPaymentCalendar = ({
  title,
  nodeId = null,
  idPaymentCalendar = null,
  onCancel,
  ...props
}) => {
  const route = useRouter();
  const { Title } = Typography;
  const [formPaymentCalendar] = Form.useForm();
  const [typeTax, setTypeTax] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [activationDate, setActivationtDate] = useState("");
  const [period, setPeriod] = useState("");
  const [paymentPeriodicity, setPaymentPeriodicity] = useState([]);

  /* Const switchs */
  const [adjustmentAppy, setAdjustmentApply] = useState(false);
  const [periodActive, setPeriodActive] = useState(false);
  const [paymentSaturday, setPaymentSaturday] = useState(false);
  const [paymentSunday, setPaymentSunday] = useState(false);

  useEffect(() => {
    getTypeTax();
    getPaymentPeriodicity();
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

  const getPaymentPeriodicity = async () => {
    try {
      let response = await WebApiFiscal.getPaymentPeriodicity();
      let periodicity = response.data.results.map((a) => {
        return { value: a.id, label: a.description };
      });
      setPaymentPeriodicity(periodicity);
    } catch (error) {
      console.log(error);
    }
  };

  const getPaymentCalendar = async () => {
    setLoading(true);
    try {
      let response = await WebApi.getDetailPaymentCalendar(idPaymentCalendar);
      console.log('item => ', response.data);
      if (response.data) {
        let item = response.data;
        formPaymentCalendar.setFieldsValue({
          name: item.name,
          periodicity: item.periodicity.id,
          type_tax: item.type_tax.id,
          start_date: item.start_date ? moment(item.start_date) : "",
          period: item.period ? moment().year(item.period) : "",
          start_incidence: item.start_incidence,
          end_incidence: item.end_incidence,
          /* adjustment: item.adjustment ? item.adjustment : false, */
          /* active: item.active ? item.active : false, */
          pay_before: item.pay_before ? parseInt(item.pay_before) : 0,
          /* payment_saturday: item.payment_saturday
            ? item.payment_saturday
            : false, */
          /* payment_sunday: item.payment_sunday ? item.payment_sunday : false, */
          activation_date: item.activation_date
            ? moment(item.activation_date)
            : "",
        });
        setAdjustmentApply(item.adjustment);
        setPeriodActive(item.active);
        setPaymentSaturday(item.payment_saturday)
        setPaymentSunday(item.payment_saturday)
        setStartDate(item.start_date);
        setActivationtDate(item.activation_date);
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
      closeModal();
      /* route.push({ pathname: "/payroll/paymentCalendar" }); */
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  const updatePaymentCalendar = async (data) => {
    try {
      let response = await WebApi.updatePaymentCalendar(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
      /* route.push({ pathname: "/payroll/paymentCalendar" }); */
      closeModal();
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
    setLoading(true);
    value.node = parseInt(nodeId);
    value.active = periodActive;
    value.adjustment = adjustmentAppy;
    value.pay_before = value.pay_before ? parseInt(value.pay_before) : 0;
    value.payment_saturday =  paymentSaturday;
    value.payment_sunday = paymentSunday
    
    if (startDate) {
      value.start_date = startDate;
    }
    if (activationDate) {
      value.activation_date = activationDate;
    }
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
  
  const changeAdjustmentAppy = (checked) => {
    console.log('checked =>', checked);
    setAdjustmentApply(checked)
  }

  const changePeriodActive = (checked) => {
    setPeriodActive(checked);
  }

  const changePaymentSaturday = (checked) =>{
    setPaymentSaturday(checked)
  }

  const changePaymentSunday = (checked) =>{
    setPaymentSunday(checked)
  }

  const closeModal = () =>{
    props.setIsModalVisible(false);
    setPaymentSunday(false);
    setPaymentSaturday(false);
    setAdjustmentApply(false);
    setPeriodActive(false);
    props.getPaymentCalendars();
  }

  return (
    <>
      <Global
        styles={`
          .ant-form-item-extra{
            text-align: end;
          }
          .ant-input, .ant-input:hover, .ant-input:focus, .ant-form-item-control-input, .ant-select-selector, .ant-select-selector:hover, .ant-select-selector:active, .ant-picker, .ant-picker:hover, .ant-picker:focus  {
            border-color: #7B25F1 !important;
          }
          .ant-form-item{
            margin-bottom:0px;
          }
          .close_modal {
            background: transparent !important;
            border-color: #7B25F1 !important;
          }
          .close_modal > span {
            color: black !important;
          }
        `}
      />
      <Spin tip="Cargando..." spinning={loading}>
        <Row>
          <Title style={{ fontSize: "20px" }}>{title}</Title>
        </Row>
        <Form
          layout={"vertical"}
          form={formPaymentCalendar}
          onFinish={formFinish}
          size="large"
        >
          <Row gutter={30} style={{ marginBottom: 20 }}>
            <Col lg={8} xs={22}>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[ruleRequired]}
                extra={
                  <>
                    Aplicar ajuste
                    <Switch
                      size="small"
                      checked={adjustmentAppy}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      style={{ marginLeft: 10 }}
                      onChange={changeAdjustmentAppy}
                    />
                  </>
                }
              >
                <Input />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="periodicity"
                label="Periodicidad"
                rules={[ruleRequired]}
              >
                <Select
                  options={paymentPeriodicity}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
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
            {/* <Col lg={8} xs={22}>
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
            </Col> */}
            <Col lg={8} xs={22}>
              <Form.Item
                name="period"
                label="Período"
                rules={[ruleRequired]}
                extra={
                  <>
                    Activo
                    <Switch
                      size="small"
                      checked={periodActive}
                      onChange={changePeriodActive}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      style={{ marginLeft: 10 }}
                    />
                  </>
                }
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangePeriod}
                  picker="year"
                  moment={"YYYY"}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
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
            <Col lg={8} xs={22}>
              <Form.Item name="activation_date" label="Fecha de activación">
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangeActivationDate}
                  moment={"YYYY-MM-DD"}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="pay_before"
                label="¿Pagar días antes?"
                rules={[onlyNumeric]}
                extra={
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <small>Pagar sabados</small>
                        <Switch
                          size="small"
                          checked={paymentSaturday}
                          onChange={changePaymentSaturday}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          style={{ marginLeft: 10 }}
                        />
                      </span>
                      <span>
                        <small>Pagar Domingos</small>
                        <Switch
                          size="small"
                          checked={paymentSunday}
                          onChange={changePaymentSunday}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          style={{ marginLeft: 10 }}
                        />
                      </span>
                    </div>
                  </>
                }
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
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
            <Col lg={8} xs={22}>
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
            {/* <Col lg={8} xs={22}>
              <Form.Item name="active" label="¿Activo?" valuePropName="checked">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="payment_saturday"
                label="¿Pago en sábado?"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="payment_sunday"
                label="¿Pago en domingo?"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
            </Col> */}
          </Row>
          <Row justify={"center"} gutter={10}>
            <Col md={5}>
              <Button
                block
                className="close_modal"
                htmlType="button"
                style={{ marginRight: 10 }}
                onClick={() => onCancel()}
              >
                Cancelar
              </Button>
            </Col>
            <Col md={5}>
              <Button block className="" type="primary" htmlType="submit">
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
};
export default FormPaymentCalendar;
