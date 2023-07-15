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
  Checkbox,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import WebApiPayroll from "../../../api/WebApiPayroll";
import {
  BelongTo,
  CalculationEmploymentSubsidy,
  messageSaveSuccess,
  salaryDays,
  VacationPayment,
} from "../../../utils/constant";
import { onlyNumeric, ruleRequired } from "../../../utils/rules";
import { Global } from "@emotion/core";
import SelectFixedConcept from "../../selects/SelectFixedConcept";
import SelectPeriodicity from "../../selects/SelectPeriodicity";
import SelectTypeTax from "../../selects/SelectTypeTax";
import SelectIntegrationFactors from "../../selects/SelectIntegrationFactors";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import locale from "antd/lib/date-picker/locale/es_ES";
import WebApiPeople from "../../../api/WebApiPeople";
import { getCompanyFiscalInformation } from "../../../redux/fiscalDuck";

const FormPaymentCalendar = ({ idPaymentCalendar = null, getCompanyFiscalInformation, companyFiscalInformation = null, ...props }) => {
  const router = useRouter();
  const { Title } = Typography;
  const [formPaymentCalendar] = Form.useForm();
  const [perceptionType, setPerceptionType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [activationDate, setActivationtDate] = useState("");
  const [period, setPeriod] = useState("");
  const [incidenceStart, setIncidenceStart] = useState("");
  const [versions, setVersions] = useState([]);
  const [selectPeriodicity, setSelectPeriodicity] = useState(null);
  const currentYear = moment().year();
  const [bankDispersionList, setBankDispersionList] = useState([])

  /* Const switchs */
  const [monthlyAdjustment, setMonthlyAdjustment] = useState(false);
  const [annualAdjustment, setAnnualAdjustment] = useState(false);
  const [periodActive, setPeriodActive] = useState(true);
  const [paymentSaturday, setPaymentSaturday] = useState(false);
  const [paymentSunday, setPaymentSunday] = useState(false);
  const [paymentCalendar, setPaymentCalendar] = useState(null);
  const [locked, setLocked] = useState(false);
  const [politics, setPolitics] = useState(false);
  const [benefits, setBenefits] = useState(null);

  const checks =
    selectPeriodicity &&
    selectPeriodicity !== "95efb4e793974e318e6cb49ab30a1269"
      ? [
          {
            name: "applied_isr_christmas_bonus",
            label: "Cálculo de ISR de aguinaldo aplicando art. 174",
            value: false,
          },
          {
            name: "sua_absenteeism",
            label: "¿Afectar ausentismos en SUA?",
            value: false,
          },
          {
            name: "import_issues",
            label: "¿Importar incidencias con fecha?",
            value: false,
          },
          {
            name: "accumulate_vacation",
            label: "¿Acumula vacaciones?",
            value: true,
          },
        ]
      : [
          {
            name: "applied_isr_christmas_bonus",
            label: "Cálculo de ISR de aguinaldo aplicando art. 174",
            value: false,
          },

          {
            name: "seventh_day_breakdown",
            label: "¿Desglose del séptimo día?",
            value: false,
          },

          {
            name: "seventh_day_discount",
            label: "¿Descuento proporción séptimo día?",
            value: false,
          },
          {
            name: "sua_absenteeism",
            label: "¿Afectar ausentismos en SUA?",
            value: false,
          },
          {
            name: "import_issues",
            label: "¿Importar incidencias con fecha?",
            value: false,
          },
          {
            name: "accumulate_vacation",
            label: "¿Acumula vacaciones?",
            value: true,
          },
        ];

  useEffect(() => {
    if(props?.currentNode?.id){
      console.log('getBankDispersion')
      getBankDispersion()      
    }
  }, [props?.currentNode?.id])

  useEffect(() => {
    if (idPaymentCalendar) {
      getPaymentCalendar();
      setLocked(true);
    } else {
      formPaymentCalendar.setFieldsValue({
        belongs_to: BelongTo[0].value,
      });
    }
  }, [idPaymentCalendar]);

  useEffect(() => {
    if (props.catCfdiVersion) {
      let data = props.catCfdiVersion.map((item) => {
        return {
          label: `Versión - ${item.version}`,
          value: item.id,
        };
      });
      setVersions(data);
    }
  }, [props.catCfdiVersion]);

  useEffect(() => {    
    if (props.catPerception && props.catPerception.length > 0) {
      let code = companyFiscalInformation?.assimilated_pay ? "046" : "001"
      let perception_types = props.catPerception
        // .filter((item) => item.code == "001" || item.code == "046")
        .filter((item) => item.code == code)
        .map((a) => {
          return { value: a.id, label: a.description };
        });
      setPerceptionType(perception_types);
      getCompanyFiscalInformation();
      formPaymentCalendar.setFieldsValue({
        perception_type: perception_types[0]?.value
      })
    }
  }, [props.catPerception, companyFiscalInformation]);


  const getPaymentCalendar = async () => {
    setLoading(true);
    try {
      let response = await WebApiPayroll.getDetailPaymentCalendar(
        idPaymentCalendar
      );
      if (response.data) {
        setPaymentCalendar(response.data);
        let item = response.data;
        formPaymentCalendar.setFieldsValue({
          name: item.name,
          periodicity: item.periodicity.id,
          type_tax: item.type_tax.id,
          perception_type: item.perception_type.id,
          bank_dispersion: item?.bank_dispersion?.id,
          start_date: item.start_date ? moment(item.start_date) : "",
          period: item.period ? moment().year(item.period) : "",
          incidence_start: item.incidence_start
            ? moment(item.incidence_start)
            : "",
          // end_incidence: item.end_incidence,
          pay_before: item.pay_before ? parseInt(item.pay_before) : 0,
          activation_date: item.activation_date
            ? moment(item.activation_date)
            : "",
          group_fixed_concept: item.group_fixed_concept,
          version_cfdi: item.version_cfdi,
          salary_days: item.salary_days,
          belongs_to: BelongTo[0].value,
          vacation_bonus_payment: item.vacation_bonus_payment,
          benefits: item.benefits,
          calculation_employment_subsidy: item.calculation_employment_subsidy,
        });
        setAnnualAdjustment(item.annual_adjustment);
        setMonthlyAdjustment(item.monthly_adjustment);
        setPeriodActive(item.active);
        setPaymentSaturday(item.payment_saturday);
        setPaymentSunday(item.payment_sunday);
        setStartDate(item.start_date);
        setActivationtDate(item.activation_date);
        setIncidenceStart(item.incidence_start);
        setPeriod(item.period);
        setLocked(item.locked);
        setBenefits(item.benefits);
        setSelectPeriodicity(item.periodicity.id);
        if (item.belongs_to) {
          checks.map((a) => {
            let checked = document.getElementById(a.name);
            if (a.name === "accumulate_vacation") {
              if (!item[a.name]) {
                checked.click();
              }
            } else {
              if (item[a.name]) checked.click();
            }
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const savePaymentCalendar = async (data) => {
    setLoading(true);
    await WebApiPayroll.createPaymentCalendar(data)
      .then((response) => {
        setLoading(false);
        message.success({
          content: messageSaveSuccess,
          className: "custom-class",
        });
        router.push({ pathname: "/payroll/paymentCalendar" });
      })
      .catch((err) => {
        console.log(err);
        let errorMessage = err?.response?.data?.message || "";
        errorMessage !== "" && message.error(errorMessage);
        setLoading(false);
      });
  };

  const updatePaymentCalendar = async (data) => {
    setLoading(true);
    WebApiPayroll.updatePaymentCalendar(data)
      .then((response) => {
        setLoading(false);
        message.success({
          content: "Guardado correctamente.",
          className: "custom-class",
        });
        router.push({ pathname: "/payroll/paymentCalendar" });
      })
      .catch((error) => {
        setLoading(false);
        let errorMessage = error?.response?.data?.message || "";
        errorMessage !== "" && message.error(errorMessage);
        console.log(error);
      });
  };

  const onChangeLastDayPaid = (date, dateString) => {
    setStartDate(dateString);
  };
  const onChangeActivationDate = (date, dateString) => {
    setActivationtDate(dateString);
  };
  const onChangeIncidenceStart = (date, dateString) => {
    setIncidenceStart(dateString);
  };

  const onChangePeriod = (date, dateString) => {
    setPeriod(dateString);
  };
  const formFinish = (value) => {
    if (benefits == null) value.benefits = "ley";
    else value.benefits = benefits;

    value.node = props.currentNode.id;
    value.active = periodActive;
    value.monthly_adjustment = monthlyAdjustment;
    value.annual_adjustment = annualAdjustment;
    value.pay_before = value.pay_before ? parseInt(value.pay_before) : 0;
    value.payment_saturday = paymentSaturday;
    value.payment_sunday = paymentSunday;
    value.bank_dispersion = value.bank_dispersion ? value.bank_dispersion : null
    if (!value.group_fixed_concept) {
      value.group_fixed_concept = null;
    }

    if (startDate) {
      value.start_date = startDate;
    }
    if (activationDate) value.activation_date = activationDate;

    if (period) {
      value.period = parseInt(period);
    }
    if (incidenceStart) {
      value.incidence_start = incidenceStart;
    } else {
      value.incidence_start = 0;
    }
    /* if(!value.belongs_to){
      value.belongs_to = ""
      value.vacation_bonus_payment = ""
      value.calculation_employment_subsidy = ""
      value.benefits = ""
    } */

    if (idPaymentCalendar) {
      value.id = idPaymentCalendar;
      updatePaymentCalendar(value);
    } else {
      savePaymentCalendar(value);
    }
  };

  const changeMonthlyAdjustment = (checked) => {
    setMonthlyAdjustment(checked);
  };

  const changeAnnualAdjustment = (checked) => {
    setAnnualAdjustment(checked);
  };

  const changePeriodActive = (checked) => {
    setPeriodActive(checked);
  };

  const changePaymentSaturday = (checked) => {
    setPaymentSaturday(checked);
  };

  const changePaymentSunday = (checked) => {
    setPaymentSunday(checked);
  };

  const RenderChecks = ({ data }) => {
    return data.map((item, i) => {
      if (item.name != "import_issues") {
        return (
          <Col key={i} lg={6} xs={22} md={12}>
            <Form.Item
              initialValue={item.value}
              valuePropName="checked"
              name={item.name}
              label={" "}
            >
              <Checkbox
                id={item.name}
                key={item.value + i}
                className="CheckGroup"
              >
                <span style={{ color: "black" }}>{item.label}</span>
              </Checkbox>
            </Form.Item>
          </Col>
        );
      }
    });
  };

  // const disabledDate = (current) => {
  //   return current && moment(current).year() < currentYear;
  // };

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

  const disableActivationDate = (current) => {
    let start_date = moment(startDate, "YYYY-MM-DD");
    // Desactivamos las fechas anteriores al inicio de calendario
    if (current < start_date) return true;
    else false;
  };

  const disableStartInsindeceDate = (current) => {
    let periodicity_code = "04";
    let days = 16;
    if (props.periodicities) {
      props.periodicities.map((p) => {
        if (selectPeriodicity && p.id == selectPeriodicity) {
          periodicity_code = p.code;
        }
      });

      switch (periodicity_code) {
        case "02":
          days = 8;
          break;
        case "03":
          days = 15;
          break;
        case "04":
          days = 16;
          break;
        case "05":
          days = 31;
          break;
        default:
          break;
      }
    }

    let start_date = moment(startDate, "YYYY-MM-DD");
    let start_insidence = new Date(start_date);
    start_insidence.setDate(start_insidence.getDate() - days);
    // Desactivamos las fechas anteriores al inicio de calendario
    if (current < start_insidence) return true;
    else false;
  };

  const onChangePeriodicy = (value) => {
    setSelectPeriodicity(value);
  };

  const selectBenefit = (value) => {
    //formPaymentCalendar.setFieldsValue({ benefits: value });
    setBenefits(value);
  };

  const getBankDispersion = async () => {
    try {
      let filters = `?node__id=${props?.currentNode?.id}`
      let response = await WebApiPayroll.getPayrollSpred(filters)
      if(response.status === 200){
        let list = response.data.results.map(item => {
          return {value: item.id, label: item.name}
        })
        setBankDispersionList(list)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  // const getFiscalInformation = async (node_id) => {
  //   try {
  //     let response = await WebApiPeople.getfiscalInformationNode(node_id)
  //     if(response.status === 200){
  //       setFiscalInformation(response.data)
  //     }
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }

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
          <Title style={{ fontSize: "20px" }}>
            {paymentCalendar && paymentCalendar.locked
              ? `Calendario: ${paymentCalendar.name}`
              : idPaymentCalendar
              ? "Editar calendario"
              : "Nuevo calendario"}
          </Title>
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
                    Activo
                    <Switch
                      size="small"
                      checked={periodActive}
                      onChange={changePeriodActive}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      style={{ marginLeft: 10 }}
                      disabled={
                        paymentCalendar ? paymentCalendar.locked : false
                      }
                    />
                  </>
                }
              >
                <Input
                  maxLength={100}
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <SelectPeriodicity
                size={"large"}
                rules={[ruleRequired]}
                disabled={paymentCalendar ? paymentCalendar.locked : false}
                onChangePeriodicy={onChangePeriodicy}
              />
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                key="SelectSalaryDays"
                name="salary_days"
                label="Días a pagar"
                rules={[ruleRequired]}
              >
                <Select
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                  placeholder="Días a pagar"
                  style={
                    props.style ? props.style : { width: "100% !important" }
                  }
                  options={salaryDays}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <SelectTypeTax
                rules={[ruleRequired]}
                disabled={paymentCalendar ? paymentCalendar.locked : false}
              />
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="perception_type"
                label="Tipo de percepción"
                rules={[ruleRequired]}
              >
                <Select
                  options={perceptionType}
                  notFoundContent={"No se encontraron resultados."}
                  optionFilterProp="children"
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="period"
                label="Período"
                rules={[ruleRequired]}
                extra={
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <small>Ajuste mensual</small>
                        <Switch
                          size="small"
                          checked={monthlyAdjustment}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          style={{ marginLeft: 10 }}
                          onChange={changeMonthlyAdjustment}
                          // disabled={
                          //   paymentCalendar ? paymentCalendar.locked : false
                          // }
                        />
                      </span>
                      <span>
                        <small>Ajuste anual</small>
                        <Switch
                          size="small"
                          checked={annualAdjustment}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          style={{ marginLeft: 10 }}
                          onChange={changeAnnualAdjustment}
                          // disabled={
                          //   paymentCalendar ? paymentCalendar.locked : false
                          // }
                        />
                      </span>
                    </div>
                  </>
                }
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangePeriod}
                  picker="year"
                  moment={"YYYY"}
                  disabledDate={(currentDate) => currentDate.year() < 2022}
                  placeholder=""
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                  locale={locale}
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
                  placeholder=""
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                  locale={locale}
                  disabledDate={disablePeriod}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="activation_date"
                label="Inicio de uso de calendario"
                rules={[ruleRequired]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangeActivationDate}
                  moment={"YYYY-MM-DD"}
                  placeholder=""
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                  locale={locale}
                  disabledDate={disableActivationDate}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item name="bank_dispersion" label="Dispersión bancaria">
                <Select options={bankDispersionList} allowClear />
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
                        <small>Pagar sábados</small>
                        <Switch
                          size="small"
                          checked={paymentSaturday}
                          onChange={changePaymentSaturday}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          style={{ marginLeft: 10 }}
                          disabled={
                            paymentCalendar ? paymentCalendar.locked : false
                          }
                        />
                      </span>
                      <span>
                        <small>Pagar domingos</small>
                        <Switch
                          size="small"
                          checked={paymentSunday}
                          onChange={changePaymentSunday}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          style={{ marginLeft: 10 }}
                          disabled={
                            paymentCalendar ? paymentCalendar.locked : false
                          }
                        />
                      </span>
                    </div>
                  </>
                }
              >
                <Input
                  maxLength={10}
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="incidence_start"
                label="Inicio de incidencia"
                maxLength={2}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={onChangeIncidenceStart}
                  placeholder=""
                  moment={"YYYY"}
                  disabled={paymentCalendar ? paymentCalendar.locked : false}
                  locale={locale}
                  disabledDate={disableStartInsindeceDate}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item
                name="version_cfdi"
                label="Version de cfdi"
                maxLength={2}
                rules={[ruleRequired]}
              >
                <Select
                  placeholder="Seleccione la version"
                  options={versions}
                  // disabled={paymentCalendar ? paymentCalendar.locked : false}
                />
              </Form.Item>
            </Col>
            <Col lg={8} xs={22}>
              <SelectFixedConcept
                type={2}
                name={"group_fixed_concept"}
                // disabled={paymentCalendar ? paymentCalendar.locked : false}
              />
            </Col>
            <Col lg={8} xs={22}>
              <Form.Item label={idPaymentCalendar ? "Ver Políticas" : "Políticas"}>
                <Switch
                  // defaultChecked={politics}
                  checked={politics}
                  checkedChildren={idPaymentCalendar ? "" : "Personalizado"}
                  unCheckedChildren={idPaymentCalendar ? "" : "Por defecto"}
                  onChange={(value) => setPolitics(value)}
                />
              </Form.Item>
            </Col>
          </Row>
          {politics && (
            <>
              <hr />
              <Title style={{ fontSize: "20px" }}>Políticas de nómina</Title>
              <Row gutter={30} style={{ marginBottom: 20 }}>
                <Col lg={8} xs={22}>
                  <Form.Item
                    name="belongs_to"
                    label="Pertenece a "
                    rules={[ruleRequired]}
                  >
                    <Select maxLength={100} options={BelongTo} disabled />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={22}>
                  <Form.Item
                    name="vacation_bonus_payment"
                    label="Pago de prima vacacional"
                    rules={[ruleRequired]}
                  >
                    <Select maxLength={100} options={VacationPayment} />
                  </Form.Item>
                </Col>{" "}
                <Col lg={8} xs={22}>
                  <Form.Item
                    name="calculation_employment_subsidy"
                    label="Cálculo de subsidio al empleo"
                    rules={[ruleRequired]}
                  >
                    <Select
                      maxLength={100}
                      options={CalculationEmploymentSubsidy}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={22}>
                  {/* <Select
                      maxLength={100}
                      options={CalculationEmploymentSubsidy}
                    /> */}
                  <SelectIntegrationFactors
                    benefit="benefits"
                    chengeBenefit={selectBenefit}
                  />
                </Col>
                {<div style={{ width: "100%" }}></div>}
                <RenderChecks data={checks} />
              </Row>
            </>
          )}
          <Row justify={"end"} gutter={10}>
            <Col md={5}>
              <Button
                block
                className="close_modal"
                htmlType="button"
                style={{ marginRight: 10 }}
                onClick={() =>
                  router.push({ pathname: "/payroll/paymentCalendar" })
                }
              >
                {locked ? "Cerrar" : "Cancelar"}
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

const mapState = (state) => {  
  return {
    catPerception: state.fiscalStore.cat_perceptions,
    catCfdiVersion: state.fiscalStore.cat_cfdi_version,
    currentNode: state.userStore.current_node,
    periodicities: state.fiscalStore.payment_periodicity,
    companyFiscalInformation: state.fiscalStore.company_fiscal_information
  };
};

export default connect(mapState, {getCompanyFiscalInformation})(FormPaymentCalendar);
