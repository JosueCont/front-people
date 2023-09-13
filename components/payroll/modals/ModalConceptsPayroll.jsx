import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Space,
  Modal,
  Steps,
  Card,
  Checkbox,
  Alert,
  InputNumber,
  DatePicker,
  Form,
  message,
  Select,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { numberFormat } from "../../../utils/functions";
import { connect } from "react-redux";
import locale from "antd/lib/date-picker/locale/es_ES";
import { departureMotive } from "../../../utils/constant";
import moment from "moment";
import DatePickerHoliDays from "../DatePickerHolidays";
import _ from "lodash";
import WebApiPeople from "../../../api/WebApiPeople";

const { Step } = Steps;
const { Column } = Table;

const ModalConceptsPayroll = ({
  setVisible,
  visible,
  person_id = null,
  setLoading,
  payroll = null,
  calendar,
  sendCalculatePayroll,
  payrollType,
  extraOrdinary = false,
  movementType = null,
  payment_period = null,
  workingDays = null,
  idx=0,
  ...props
}) => {
  const { Text, Title } = Typography;

  const [departureForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [concepts, setConcepts] = useState([]);
  const [perceptionsCat, setPerceptionsCat] = useState([]);
  const [deductionsCat, setDeductionsCat] = useState([]);
  const [otherPaymentsCat, setOtherPaymentsCat] = useState([]);
  const [perceptions, setPerceptions] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [otherPayments, setOtherPayments] = useState([]);
  const [ceros, setCeros] = useState(false);
  const [twentyDays, setTwentyDays] = useState(false);
  const [threeMonths, setThreeMonths] = useState(false);
  const [antiquity, setAntiquity] = useState(false);
  const [motiveDeparture, setMotiveDeparture] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [errorExtraHours, setErrorExtraHours] = useState({});
  const [errorExistExtraHours, setErrorExistExtraHours] = useState(false);
  const [daysActive, setDaysActive] = useState([]);
  const [nonWorkingDays, setNonWorkingDays] = useState([]);
  const [showAlertDays, setShowAlertDays] = useState(false)

  useEffect(() => {
    if (
      props.perceptions_int &&
      props.deductions_int &&
      props.other_payments_int
    ) {
      if (payrollType === "046") {
        props.perceptions_int = props.perceptions_int.filter(
          (item) =>
            item.apply_assimilated &&
            // item.perception_type.code !== "046" &&
            item.node != null
        );
        props.deductions_int = props.deductions_int.filter(
          (item) =>
            item.apply_assimilated &&
            item.deduction_type.code !== "002" &&
            item.node != null
        );
        props.other_payments_int = props.other_payments_int.filter(
          (item) => item.apply_assimilated && item.node != null
        );
      } else {
        props.perceptions_int = props.perceptions_int.filter(
          (item) =>
            item.perception_type.is_payroll &&
            item.node != null &&
            item.show &&
            item.is_active
        );
        props.deductions_int = props.deductions_int.filter(
          (item) =>
            item.deduction_type.is_payroll &&
            item.node != null &&
            item.deduction_type.code !== "002" &&
            item.show &&
            item.is_active
        );
        props.other_payments_int = props.other_payments_int.filter(
          (item) =>
            item.other_type_payment.is_payroll &&
            item.node != null &&
            item.show &&
            item.is_active
        );
      }
      setPerceptionsCat(
        props.perceptions_int.map((item) => {
          return {
            id: item.id,
            value: 0,
            code: item.code,
            description: item.description,
            datum: 0,
            amount: 0,
            data_type: item.data_type,
            data_config: item.data_config,
            perception_type: item.perception_type,
            is_rest_day: item.is_rest_day,
          };
        })
      );

      setDeductionsCat(
        props.deductions_int.map((item) => {
          return {
            id: item.id,
            value: 0,
            code: item.code,
            description: item.description,
            datum: 0,
            amount: 0,
            data_type: item.data_type,
            data_config: item.data_config,
            deduction_type: item.deduction_type,
          };
        })
      );

      setOtherPaymentsCat(
        props.other_payments_int.map((item) => {
          return {
            id: item.id,
            value: 0,
            code: item.code,
            description: item.description,
            datum: 0,
            amount: 0,
            data_type: item.data_type,
            data_config: item.data_config,
            other_type_payment: item.other_type_payment,
          };
        })
      );
    }
  }, [
    props.perceptions_int,
    props.deductions_int,
    props.other_payments_int,
    visible,
  ]);

  useEffect(() => {
    console.log("errorExtraHours", errorExtraHours);
  }, [errorExtraHours]);

  useEffect(() => {}, [payment_period]);

  useEffect(() => {
    if (props?.currentNode?.id) {
      getWorkingWeek();
      getNonWorkingDays();
    }
    console.log('payment_period',payment_period)
  }, []);

  /* useEffect(() => {
    setTotalWorkingDays(workingDays)
  }, [workingDays]) */  


  const RenderCheckConcept = ({ data, type }) => {
    return (
      <>
        {data.map((item) => {
          return (
            <Col span={12}>
              <Checkbox key={item.code} className="CheckGroup" value={item}>
                <span style={{ textTrapayrollnsform: "uppercase" }}>
                  {item.description} {`(${item.data_type===1?'M':'D'})`}
                </span>
              </Checkbox>
            </Col>
          );
        })}
      </>
    );
  };

  const getNonWorkingDays = async () => {
    try {
      let response = await WebApiPeople.getNonWorkingDays({
        node: props?.currentNode?.id,
        limit: 10000,
      });
      console.log("response getNonWorkingDays", response);
      if (response.status === 200) {
        let disabledDays = [];
        response.data.results.map((day) => {
          if(day.type === 1 || day.type === 2){
            disabledDays.push(day.date);
          }
        });
        console.log('disabledDays',disabledDays)
        setNonWorkingDays(disabledDays);
      }
    } catch (error) {
      console.log("getNonWorkingDays", error.message);
    }
  };

  const getWorkingWeek = async () => {
    try {
      let response = await WebApiPeople.getWorkingWeekDays(
        props.currentNode.id
      );
      if (response.status == 200) {
        let actives = [];
        let days = response.data.results[0];
        if (days["sunday"]) {
          actives.push(0);
        }
        if (days["monday"]) {
          actives.push(1);
        }
        if (days["tuesday"]) {
          actives.push(2);
        }
        if (days["wednesday"]) {
          actives.push(3);
        }
        if (days["thursday"]) {
          actives.push(4);
        }
        if (days["friday"]) {
          actives.push(5);
        }
        if (days["saturday"]) {
          actives.push(6);
        }

        setDaysActive(actives);
      }
    } catch (error) {
      console.log("error====Z", error);
    }
  };

  const resetperceptionsDeductions = () => {
    setConcepts([]);
    setPerceptions([]);
    setDeductions([]);
    setOtherPayments([]);
    createObjectSend();
  };

  const extraHoursValidation = () => {
    let errorsExist = false;

    perceptions.map((item) => {
      let _periodicity = props.periodicity;
      //P119 es doble , P118 triple */
      /* Validamos las horas dobles */
      if (item.code == "P119") {
        if (_periodicity.code == "02" && item.value > 9) {
          setErrorExtraHours({
            ...errorExtraHours,
            [item.id]: `El valor debe ser menor a 10`,
          });
          setErrorExistExtraHours(true);
          errorsExist = true;
        } else if (
          (_periodicity.code == "03" || _periodicity.code == "04") &&
          item.value > 18
        ) {
          setErrorExtraHours({
            ...errorExtraHours,
            [item.id]: `El valor debe ser menor a 19`,
          });
          setErrorExistExtraHours(true);
          errorsExist = true;
        } else if (_periodicity.code == "05" && item.value > 36) {
          setErrorExtraHours({
            ...errorExtraHours,
            [item.id]: `El valor debe ser menor a 37`,
          });
          setErrorExistExtraHours(true);
          errorsExist = true;
        } else {
          setErrorExtraHours({ ...errorExtraHours, [item.id]: false });
          setErrorExistExtraHours(false);
        }
      }
    });

    return errorsExist;
  };

  const resetErrors = (name) => {
    setErrorExtraHours({ ...errorExtraHours, [name]: false });
  };

  const debouncedErrors = useMemo(() => {
    return _.debounce((name) => resetErrors(name), 600);
  }, []);

  const RenderConcept = ({ data = [], type }) => {
    return (
      <>
        {data.map((item) => {
          item.value = item.value != "" && item.value > 0 ? item.value : 0;
          return (
            <Col span={12}>
              <Row style={{ marginBottom: "8px" }}>
                <Col span={16}>
                  {item.description}
                  {!_.isEmpty(errorExtraHours) &&
                    item.id in errorExtraHours && (
                      <p>
                        <Text type="danger">{errorExtraHours[item.id]}</Text>
                      </p>
                    )}
                </Col>
                <Col span={6}>
                  {item.data_type === 1 && (
                    <span style={{ marginRight: "7px", marginTop: "3px" }}>
                      $
                    </span>
                  )}
                  <InputNumber
                  status={item.error ? 'error' : null}
                    key={item.id}
                    type="number"
                    name={item.id}
                    defaultValue={item.value}
                    formatter={(value) => value.replace("-", "")}
                    controls={false}
                    onChange={(e) => changeHandler(type, item.id)(e, item)}
                    onKeyUp={(e) => debouncedErrors(item.id)}
                  />
                  {item.data_type === 2 && (
                    <span style={{ marginLeft: "7px", marginTop: "3px" }}>
                      UNIDAD(ES)
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
          );
        })}
      </>
    );
  };

  const onChangeCheckConcepts = (checkedValues, type) => {
    console.log(checkedValues)

    if (type === 1) setPerceptions(checkedValues);
    if (type === 2) setDeductions(checkedValues);
    if (type === 3) setOtherPayments(checkedValues);
  };


  const validateWorkingDays = (item_concept) => {
    let days = 0;
    perceptions.map((item) => {
      if(
        (item.perception_type.code === '001' && item.perception_type.description.toLowerCase().includes("sueldos"))
        ||
        (item.perception_type.code === '001' && item.perception_type.description.toLowerCase().includes("vacaciones"))
      ){
        days += item.value
      }
    });

    deductions.map(item => {
      if(item.deduction_type.code === '006' || item.deduction_type.code === '020'){
        days += item.value
      }
    })


    if((workingDays-days) < 0){
      item_concept['error'] = 'Los dias no deben ser mayor a 14'
      setShowAlertDays(true)
    }else{
      item_concept['error'] = false
      setShowAlertDays(false)
    }
  }

  const changeHandler = (type, name) => (value, item_concept) => {
    
    
    /* setErrorExtraHours({...errorExtraHours,[name]: false }) */
    let _periodicity = props.periodicity;
    const { code, description } = item_concept; //P119 es doble , P118 triple
    //GDZUL --- validacion de conceptos
    //validar las horas extras dobles y triples

    item_concept.value = value != "" && Number(value) > 0 ? Number(value) : 0;
    validateWorkingDays(item_concept)
  };

  const listConcepts = (value = null) => {
    if (extraHoursValidation()) {
      return;
    }
    if (value != null) {
      setCurrentStep(value);
      return;
    }
    let is_cero = false;
    setCeros(false);
    setConcepts([]);
    let data = [];

    /* extraHoursValidation(); */

    if (perceptions.length > 0)
      perceptions.map((item) => {
        data.push(item);
        if (item.value <= 0) is_cero = true;
      });
    if (deductions.length > 0)
      deductions.map((item) => {
        data.push(item);
        if (item.value <= 0) is_cero = true;
      });
    if (otherPayments.length > 0)
      otherPayments.map((item) => {
        data.push(item);
        if (item.value <= 0) is_cero = true;
      });
      console.log('concepts', concepts)
    setConcepts(data);

    currentStep == 0
      ? setCurrentStep(currentStep + 1)
      : is_cero && currentStep == 1
      ? (setCeros(is_cero),
        setTimeout(() => {
          setCeros(false);
        }, 5000))
      : setCurrentStep(currentStep + 1);
  };

  const createObjectSend = () => {
    let errorAmount = false;
    concepts.map((item) => {
      let datesValue = 0;
      if (item?.dates) {
        item?.dates.map((date) => {
          datesValue += date.value;
        });

        if (item.value > datesValue) {
          errorAmount = true;
          item["error_value"] = true;
        }
      }
    });

    if (errorAmount) {
      console.log("error");
      return;
    }

    if (extraOrdinary) {
      if (
        departureDate == undefined ||
        departureDate == null ||
        departureDate == ""
      ) {
        message.error("Debe seleccionar una fecha de salida");
        return;
      }
      if (
        motiveDeparture == undefined ||
        motiveDeparture == null ||
        motiveDeparture == ""
      ) {
        message.error("Debe esribir un motivo de salida");
        return;
      }
    }
    let data = [];
    payroll.map((item) => {
      if (item.person.id === person_id) {
        if (item.perceptions)
          item.perceptions.map((p) => {
            if (p.type == "046") {
              perceptions.push(p);
              return;
            }
          });

        const obj = {
          person_id: person_id,
          perceptions: perceptions,
          deductions: deductions,
          other_payments: otherPayments,
        };
        if (extraOrdinary) {
          obj.twenty_day_compensantion = twentyDays;
          obj.three_months_compensation = threeMonths;
          obj.antiquity_compensation = antiquity;
          obj.departure_date = departureDate;
          obj.departure_motive = motiveDeparture;
          obj.person = item.person;
          obj.key = item.key;
        }
        data.push(obj);
      } else {
        const obj = {
          person_id: item.person.id,
          perceptions: item.perceptions,
          other_payments: item.otherPayments ? item.otherPayments : [],
        };
        // cuando la nomina está cerrada, devolvemos todas las deducciones
        if (
          item.payroll_cfdi_person &&
          item.payroll_cfdi_person.is_open == false
        ) {
          obj.deductions = item.deductions;
        } else {
          obj.deductions = item.deductions?.filter(
            (item) => item.type != "001" && item.type != "002"
          );
        }

        if (extraOrdinary) {
          if (item.three_months_compensantion)
            obj.twenty_day_compensantion = item.three_months_compensantion;
          if (item.antiquity_compensation)
            obj.antiquity_compensation = item.antiquity_compensation;
          if (item.twenty_day_compensantion)
            obj.twenty_day_compensantion = item.twenty_day_compensantion;
          obj.person = item.person;
          obj.key = item.key;
          if (item.departure_date) obj.departure_date = item.departure_date;
          if (item.departure_motive)
            obj.departure_motive = item.departure_motive;
        }
        if (item.payroll_cfdi_person)
          obj.payroll_cfdi_person = item.payroll_cfdi_person;
        data.push(obj);
      }
    });

    clearConcept();
    calendar.payroll = data;
    console.log(
      "🚀 ~ file: ModalConceptsPayroll.jsx:341 ~ createObjectSend ~ data",
      data
    );
    if (!extraOrdinary) {
      calendar.status = true;
      calendar.persona_edit = person_id;
    }
    sendCalculatePayroll(calendar);
  };

  const removeItem = (data, index) => {
    perceptions.map((item, i) => {
      if (item.code == data.code) {
        perceptions.pop(i);
      }
    });
    deductions.map((item, i) => {
      if (item.code == data.code) {
        deductions.pop(i);
      }
    });
    otherPayments.map((item, i) => {
      if (item.code == data.code) {
        otherPayments.pop(i);
      }
    });
  };

  const clearConcept = () => {
    setCurrentStep(0);
    setConcepts([]);
    setPerceptions([]);
    setDeductions([]);
    setOtherPayments([]);
    payroll = null;
    person_id = null;
    setAntiquity(false);
    setThreeMonths(false);
    setTwentyDays(false);
    setMotiveDeparture(null);
    setDepartureDate("");
    setVisible(false);
  };

  const disablePeriod = (current) => {
    let start_date = moment(payment_period.start_date);
    let end_date = moment(payment_period.end_date);

    // Validamos que la fecha esté dentro del rango del periodo
    if (current >= start_date && end_date.add(1, "days") >= current)
      return false;
    return true;
  };

  return (
    <Modal
      visible={visible}
      destroyOnClose={true}
      footer={
        <Col>
          <Space>
            {!extraOrdinary && (
              <Button
                size="large"
                htmlType="button"
                onClick={() => {
                  resetperceptionsDeductions();
                }}
                style={{ paddingLeft: 50, paddingRight: 50 }}
              >
                Reiniciar conceptos
              </Button>
            )}

            <Button
              size="large"
              htmlType="button"
              onClick={() => {
                clearConcept();
              }}
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >
              Cancelar
            </Button>
            {perceptions.length > 0 ||
            deductions.length > 0 ||
            otherPayments.length > 0 ||
            threeMonths ||
            antiquity ||
            (motiveDeparture != "" && motiveDeparture != null) ||
            twentyDays ? (
              <Button
                size="large"
                htmlType="button"
                disabled={ceros && currentStep == 2 ? true : false}
                onClick={() =>
                  movementType == 3
                    ? createObjectSend()
                    : currentStep == 2
                    ? createObjectSend()
                    : listConcepts()
                }
                style={{ paddingLeft: 50, paddingRight: 50 }}
              >
                {movementType == 3
                  ? "Guardar"
                  : currentStep == 2
                  ? "Guardar"
                  : "Siguiente"}
              </Button>
            ) : (
              <></>
            )}
          </Space>
        </Col>
      }
      width={"90%"}
      centered={true}
      onCancel={() => {
        clearConcept(), setVisible(false);
      }}
      title={'Conceptos de nómina'}
    >
      <Row justify="center" style={{ marginBottom:30 }}>
          <Col>
            <Space size={50}>
              <Text>
                <b>Periodicidad:</b> {props?.periodicity?.description}
              </Text>
              <Text>
                <b>Periodo:</b> {payment_period.name} - {payment_period.start_date} - {payment_period.end_date}
              </Text>
              <Text>
                <b>Periodo incidencia:</b> {payment_period?.incidences?.start_date} - {payment_period?.incidences?.end_date}
              </Text>
            </Space>
          </Col>
          <Col>
          </Col>
        </Row>
      <Row>
        <Steps
          current={currentStep}
          onChange={(item) => {
            listConcepts(item);
          }}
        >
          <Step title="Conceptos" description="Agregar conceptos" />
          <Step
            disabled={
              perceptions.length > 0 ||
              deductions.length > 0 ||
              otherPayments.length > 0 ||
              threeMonths ||
              antiquity ||
              twentyDays
                ? false
                : true
            }
            title="Montos"
            description="Capturar valores"
          />
          <Step
            disabled={
              perceptions.length > 0 ||
              deductions.length > 0 ||
              otherPayments.length > 0
                ? false
                : true
            }
            title="Finalizar"
            description="Finalizar"
          />
        </Steps>
        <Card hoverable style={{ width: "100%" }}>
          {extraOrdinary && (
            <>
              <Row>
                <Col span={24} style={{ marginBottom: "8px" }}>
                  <Checkbox
                    key={"twenty_day_compensantion"}
                    className="CheckGroup"
                    checked={twentyDays}
                    onChange={(value) => setTwentyDays(value.target.checked)}
                  >
                    <span style={{ textTransform: "uppercase" }}>
                      20 dias por año trabajado
                    </span>
                  </Checkbox>
                </Col>
                <Col span={24} style={{ marginBottom: "8px" }}>
                  <Checkbox
                    key={"three_months_compensantion"}
                    className="CheckGroup"
                    checked={threeMonths}
                    onChange={(value) => setThreeMonths(value.target.checked)}
                  >
                    <span style={{ textTransform: "uppercase" }}>
                      90 dias de indemnizacion
                    </span>
                  </Checkbox>
                </Col>
                <Col span={24} style={{ marginBottom: "8px" }}>
                  <Checkbox
                    key={"antiquity_premium"}
                    className="CheckGroup"
                    checked={antiquity}
                    onChange={(value) => setAntiquity(value.target.checked)}
                  >
                    <span style={{ textTransform: "uppercase" }}>
                      Prima de antigüedad
                    </span>
                  </Checkbox>
                </Col>
              </Row>
              <Row style={{ paddingTop: "20px" }}>
                <Col span={4}>
                  <DatePicker
                    moment={"YYYY"}
                    id="departure_date"
                    placeholder="Fecha de salida."
                    onChange={(value, d) => setDepartureDate(d)}
                    locale={locale}
                    // disabledDate={disablePeriod}
                  />

                  <Alert
                    message="Importante"
                    description="Elige una fecha dentro del periodo seleccionado."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 10 }}
                  />
                </Col>
                <Col span={8}>
                  <Select
                    placeholder="Motivo de baja"
                    style={{ width: "50%" }}
                    options={departureMotive}
                    onChange={(value) => setMotiveDeparture(value)}
                  />
                </Col>
              </Row>
              <br />
              <hr />
            </>
          )}
          {currentStep == 0 ? (
            <>
              {perceptionsCat.length > 0 && movementType != 3 && (
                <>
                  <h2>Percepciones</h2>
                  <Checkbox.Group
                    defaultValue={perceptions}
                    className="CheckGroup"
                    onChange={(checkedValues) =>
                      onChangeCheckConcepts(checkedValues, 1)
                    }
                  >
                    <Row>
                      <RenderCheckConcept data={perceptionsCat} type={1} />
                    </Row>
                  </Checkbox.Group>
                </>
              )}
              {deductionsCat.length > 0 && movementType != 3 && (
                <>
                  <hr />
                  <h2>Deducciones</h2>
                  <Checkbox.Group
                    defaultValue={deductions}
                    className="CheckGroup"
                    onChange={(checkedValues) =>
                      onChangeCheckConcepts(checkedValues, 2)
                    }
                  >
                    <Row>
                      <RenderCheckConcept data={deductionsCat} type={2} />
                    </Row>
                  </Checkbox.Group>
                </>
              )}
              {otherPaymentsCat.length > 0 && movementType != 3 && (
                <>
                  <hr />
                  <h2>Otros pagos</h2>
                  <Checkbox.Group
                    defaultValue={otherPayments}
                    className="CheckGroup"
                    onChange={(checkedValues) =>
                      onChangeCheckConcepts(checkedValues, 3)
                    }
                  >
                    <Row>
                      <RenderCheckConcept data={otherPaymentsCat} type={3} />
                    </Row>
                  </Checkbox.Group>
                </>
              )}
            </>
          ) : currentStep == 1 ? (
            <>
              {ceros && (
                <Alert
                  message="Importante"
                  description="No puede tener conceptos con valor cero."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 10 }}
                />
              )}
              {
                showAlertDays && (
                  <Alert
                    message="Importante"
                    description={`Los dias capturados no deben ser mayor a ${workingDays}`}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 10 }}
                  /> 
                )
              }
              <Row>
                {perceptions.length > 0 && (
                  <RenderConcept data={perceptions} type={1} />
                )}
                {deductions.length > 0 && (
                  <RenderConcept data={deductions} type={2} />
                )}
                {otherPayments.length > 0 && (
                  <RenderConcept data={otherPayments} type={3} />
                )}
              </Row>
            </>
          ) : (
            <>
              <Table
                dataSource={concepts}
                locale={{ emptyText: "No hay datos aún" }}
                width={30}
              >
                <Column
                  title="Concepto"
                  key="perception"
                  render={(record) => <div>{record.description}</div>}
                />
                <Column
                  title="Dato"
                  align="center"
                  key="amount"
                  render={(record) => (
                    <div>{record.data_type == 2 ? record.value : '--'}</div>
                  )}
                />
                <Column
                  title="Monto"
                  align="center"
                  key="amount"
                  render={(record) => (
                    <div>
                      {record.data_type == 1
                        ? `$ ${numberFormat(record.value)}`
                        : `--`}
                    </div>
                  )}
                />
                <Column
                  title={"Fechas"}
                  align={"center"}
                  key={"date"}
                  render={(record) =>
                    record.data_type == 2 ? (
                      <DatePickerHoliDays
                        daysActives={daysActive}
                        //disabledDays={nonWorkingDays}
                        data_config={record?.data_config}
                        withData={
                          record.data_config === 2 || record.description.toLowerCase().includes("hora")
                        }
                        concept={record}
                        onChangeData={(dates) => (record.dates = dates)}
                      />
                    ) : (
                      "No aplica"
                    )
                  }
                />
                <Column
                  title="Acciones"
                  align="center"
                  key="amount"
                  render={(text, record, index) => (
                    <div>
                      <>
                        <EditOutlined
                          style={{ marginRight: "10px" }}
                          key={"edit" + record.perception}
                          onClick={() => listConcepts(1)}
                        />
                        <DeleteOutlined
                          key={"delete" + record.perception}
                          onClick={() => {
                            concepts.filter((item) => item.id != record.id)
                              .length < 1
                              ? setCurrentStep(0)
                              : setConcepts(
                                  concepts.filter(
                                    (item) => item.id != record.id
                                  )
                                ),
                              removeItem(record, index);
                          }}
                        />
                      </>
                    </div>
                  )}
                />
              </Table>
            </>
          )}
        </Card>
      </Row>
    </Modal>
  );
};

const mapState = (state) => {
  return {
    perceptions_int: state.fiscalStore.perceptions_int,
    deductions_int: state.fiscalStore.deductions_int,
    other_payments_int: state.fiscalStore.other_payments_int,
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(ModalConceptsPayroll);
