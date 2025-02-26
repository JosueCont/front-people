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
  Tooltip,
  Select,
  Switch,
  Table,
  Popconfirm,
  Alert,
  Divider,
} from "antd";
import { CloseOutlined, CheckOutlined, CheckCircleOutlined, DeleteOutlined, StopOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { ruleRequired, fourDecimal } from "../../../utils/rules";
import { connect } from "react-redux";
import {
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
  movementType,
  PaymentTypes,
} from "../../../utils/constant";
import SelectCostCenter from "../../selects/SelectCostCenter";
import SelectTags from "../../selects/SelectTags";
import SelectFixedConcept from "../../selects/SelectFixedConcept";
import ButtonUpdateSalaryMovement from "../ImssMovements/ButtonUpdateSalaryMovement";
import _ from "lodash";
import GenericModal from "../../modal/genericModal";
import WebApiPeople from "../../../api/WebApiPeople";
import locale from 'antd/lib/date-picker/locale/es_ES';
import Link from "next/link";

import FormImssInfonavit from "./FormImssInfonavit";

const FormPayrollPerson = ({
  person = null,
  refreshtab = false,
  refreshTab12 = false,
  onFinishRefreshTab12,
  node = null,
  assimilated_pay = null,
  ...props
}) => {
  const { Title } = Typography;
  const [formPayrollPerson] = Form.useForm();
  const [contrctsType, setContractsType] = useState([]);
  const [hiringRegimeType, setHiringRegimeType] = useState([]);
  const [typeTax, setTypeTax] = useState([]);
  const [typeworkingday, setTypeworkingday] = useState([]);
  const [banks, setBanks] = useState([]);
  const [paymentCalendars, setPaymentCalendars] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [bankDisabled, setBankDisabled] = useState(false);
  const [dailySalaryDisabled, setDailySalaryDisabled] = useState(false);
  const [disabledCalendar, setDisabledCalendar] = useState(false);
  const [lastDayPaid, setLastDayPaid] = useState("");
  const [idPayroll, setIdPayroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [payrollPersonList, setPayrolPersonList] = useState([]);
  const [payrollPerson, setPayrollPerson] = useState(null);
  const [perceptionTypes, setPerceptionTypes] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [calendar, setCalendar] = useState(null);
  const [applyAssimilated, SetApplyAssimilated] = useState(null);
  const [perceptionCode, setPerceptionCode] = useState(null);
  const [deletingPayroll, setDeletingPayroll] = useState(false);
  const [contractTypeSelected, setContractTypeSelected] = useState(null); 
  const [refreshImssTable, setRefreshImssTable] = useState(false); 
  

  useEffect(() => {
    if (props.catPerception) {
      let data = props.catPerception.map((item) => {
        return {
          label: item.description,
          value: item.id,
        };
      });
      setPerceptionTypes(data);
    }
  }, [props.catPerception]);

  useEffect(()=> {
    setRefreshImssTable(refreshTab12); 
  },[refreshTab12])

  useEffect(() => {
    if (props.catHiringRegime) {      
      let data = props.catHiringRegime.map((item) => {
        return {
          label: item.code !== "02" ? item.description : "Sueldos",
          value: item.id,
          code: item.code
        };
      });
      let regime = []
      if(assimilated_pay == false){
        regime = data.filter((item) => item.code == "02")
      }
      else{
        regime = data.filter((item) => item.code == "05" || item.code == "06" || item.code == "07" 
        || item.code == "08" || item.code == "09" || item.code == "10" || item.code == "11")
      }

      setHiringRegimeType(regime);
    }
  }, [props.catHiringRegime]);

  useEffect(() => {
    if (refreshtab) {
      getPayrollPerson();
      getPaymentCalendar();
      PayrollList();
      props.onFinishRefresh();
    }
  }, [refreshtab]);

  useEffect(() => {
    if (props.catContracType) {
      let data = props.catContracType.map((item) => {
        return {
          label: item.description,
          value: item.id,
        };
      });
      setContractsType(data);
    }
  }, [props.catContracType]);

  useEffect(() => {
    if (props.catJourneyType) {
      let data = props.catJourneyType.map((item) => {
        return {
          label: item.description,
          value: item.id,
        };
      });
      setTypeworkingday(data);
    }
  }, [props.catJourneyType]);

  useEffect(() => {
    if (props.catTypeTax) {
      let data = props.catTypeTax.map((item) => {
        return {
          label: item.description,
          value: item.id,
        };
      });
      setTypeTax(data);
    }
  }, [props.catJourneyType]);

  useEffect(() => {
    if (props.catBanks) {
      let data = props.catBanks.map((item) => {
        return {
          label: `${item.name} / ${item?.description}`,
          value: item.id,
        };
      });
      setBanks(data);
    }
  }, [props.catBanks]);

  useEffect(() => {
    getPayrollPerson();
    getPaymentCalendar();
    PayrollList();
  }, []);

  const deletePayrollPerson=async(payrollPersonId)=>{
    try {
      setDeletingPayroll(true)
      let response = await WebApiPayroll.deletePayrollPerson(payrollPersonId);
      console.log(response)
      message.success('Eliminado correctamente')
      PayrollList()
      getPayrollPerson()
    }catch (e){
      let msg = e.response?.data?.message;
      if(msg){
        message.error(msg)
      }else{
        message.error('no se pudo eliminar, intenta nuevamente')
      }

    }finally {
      setDeletingPayroll(false)
    }
  }

  useEffect(() => {
    if (node) {
      getFiscalInformationNode(node);
    }
  }, [node]);

  const getPayrollPerson = async () => {
    setLoading(true);
    await WebApiPayroll.getPayrollPerson(person.id)
      .then((response) => {
        if (response.data) {
          let item = response.data;          
          if (item.id) {            
            setIdPayroll(item.id);
            if (item.daily_salary) {
              setDailySalaryDisabled(true);
            }
          }
          setPerceptionCode(item.payment_calendar?.perception_type?.code)
          setPayrollPerson(item);
          setContractTypeSelected(item.contract_type)
          formPayrollPerson.setFieldsValue({
            daily_salary: item.daily_salary,
            contract_type: item.contract_type ? item.contract_type.id : null,
            hiring_regime_type: item.hiring_regime_type
              ? item.hiring_regime_type.id
              : null,
            type_tax: item.type_tax ? item.type_tax.id : null,
            unionized: item.unionized ? item.unionized : false,
            payment_type: item.payment_type,
            bank: item.bank,
            type_working_day: item.type_working_day,
            apply_annual_adjustment: item.apply_annual_adjustment
              ? item.apply_annual_adjustment
              : false,
            payment_calendar: item.payment_calendar
              ? item.payment_calendar.id
              : null,
            payment_period: item.payment_period,
            perception_type: item.perception_type,
            last_day_paid: item.last_day_paid
              ? moment(item.last_day_paid)
              : moment(person.date_of_admission).subtract(1, 'day') ,
            integrated_daily_salary: item.integrated_daily_salary,
            apply_monthly_adjustment: item.apply_monthly_adjustment,
            tag: item?.tag,
            cost_center: item?.cost_center,
            fixed_concept: item.fixed_concept,
          });

          

          setCalendar(item.payment_calendar ? item.payment_calendar.id : null);
          changePaymentType(item.payment_type);
          if(item.contract_type){
            changeContractType(item.contract_type.id)
            formPayrollPerson.setFieldsValue({
              contract_start: item.contract_start ? moment(item.contract_start) : null,
              contract_end: item.contract_end ? moment(item.contract_end) : null
            })
          }
          
          setLastDayPaid(item.last_day_paid);         
        }
        setLoading(false);
      })
      .catch((e) => {
        // si no hay datos de nomina de la persona entonces hacemos que se seleccione datos estaticos (sugeridos)
        setLoading(false);

        if (props.catJourneyType) {
          // se elige Tipo jornada Diurna
          let workingDay = props.catJourneyType.find((ele) => ele.code == "01");
          formPayrollPerson.setFieldsValue({
            type_working_day: workingDay?.id,
          });
        }

        if (props.catContracType) {
          // se elige Tipo de contrato "Contrato de trabajo por tiempo indeterminado"
          let contractType = props.catContracType.find(
            (ele) => ele.code == "01"
          );
          formPayrollPerson.setFieldsValue({
            contract_type: contractType?.id,
          });
        }

        if(props?.user?.date_of_admission){
          console.log('date',moment(person?.date_of_admission).format('YYYY-MM-DD'))
          //setLastDayPaid(moment());
          let date = moment(person?.date_of_admission)
          formPayrollPerson.setFieldsValue({
            //hiring_regime_type: contractType?.id,
            last_day_paid : date.subtract(1, 'd')
          });
        }

        if (props.catHiringRegime) {
          // se elige Tipo de régimen de contratación "Sueldos"
          let contractType = props.catHiringRegime.find(
            (ele) => ele.code == "02"
          );
          formPayrollPerson.setFieldsValue({
            hiring_regime_type: contractType?.id,
          });
        }

        /// Forma de pago "Efectivo"
        formPayrollPerson.setFieldsValue({
          payment_type: 0,
        });

        setBankDisabled(true);
      });
  };

  const getPaymentCalendar = async (fil) => {
    try {
      let response = await WebApiPayroll.getPaymentCalendar(node);
      setCalendars(response.data.results);
      let payment_calendar;
      if (fil) {
        payment_calendar = response.data.results.reduce(
          (acc, { id, name, perception_type }) => {
            perception_type.description.includes("Asimilados".toLowerCase()) &&
              acc.push({ value: id, label: name });
            return acc;
          },
          []
        );
      } else {
        payment_calendar = response.data.results.map((a) => {
          return { value: a.id, label: a.name };
        });
      }
      setPaymentCalendars(payment_calendar);      
    } catch (error) {
      console.log(error);
    }
  };

  const savePayrollPerson = async (data) => {
    try {
      setLoading(true);
      if (!data.last_day_paid) data.last_day_paid = null;
      data.modified_by = props.user.id;
      let response = await WebApiPayroll.createPayrollPerson(data);
      if (response.status == 200) {
        message.success(messageSaveSuccess);
        if (response.data) {
          formPayrollPerson.setFieldsValue({
            integrated_daily_salary: response.data.integrated_daily_salary,
          });
        }
        setRefreshImssTable(true); 
        PayrollList();
        getPayrollPerson();
      } else {
        message.warning({
          content: response.data.message,
          className: "custom-class",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(messageError);
      console.log(error);
    }
  };

  const updatePayrollPerson = async (data) => {
    try {
      data.modified_by = props.user.id;
      setLoading(true);
      let response = await WebApiPayroll.updatePayrollPerson(data);
      message.success(messageUpdateSuccess);
      if (response.data) {
        formPayrollPerson.setFieldsValue({
          integrated_daily_salary: response.data.integrated_daily_salary,
        });
      }
      setRefreshImssTable(true); 
      getPayrollPerson();
      PayrollList();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(messageError);
      console.log(error);
    }
  };

  /* Events */
  const onChangeLastDayPaid = (date, dateString) => {
    if (date) {
      setLastDayPaid(moment(date).format("YYYY-MM-DD"));
    } else {
      setLastDayPaid(null);
    }
  };
  const selectCalendar = (value) => {
    if (value) {
      let calendar = calendars.find((calendar) => calendar.id == value);      
      setPerceptionCode(calendar.perception_type.code);
      if (calendar) {
        formPayrollPerson.setFieldsValue({
          perception_type: calendar.perception_type.id,
          type_tax: calendar.type_tax.id,
        });
      }
    }
  };

  const changePaymentType = (type) => {
    if (type === 3) {
      setBankDisabled(false);
    } else {
      setBankDisabled(true);
      formPayrollPerson.setFieldsValue({
        bank: "",
      });
    }
  };

  const formFinish = (value) => {
    if (calendar != formPayrollPerson.getFieldsValue(true).payment_calendar) {
      setConfirm(true);
    } else {
      confirmDataForm();
    }
  };

  const confirmDataForm = () => {
    
    console.log(person)

    if(!person.date_of_admission){
      message.warning("Debes agregar agregar la fecha de ingreso laboral")
      return
    }

    if(!person.patronal_registration && !person.imss && !assimilated_pay){
      message.warning("Debes agregar el registro patronal y número del Imss")
      return
    }
    
    let value = formPayrollPerson.getFieldsValue();
    if (idPayroll) {
      value.person = person.id;
      value.id = idPayroll;
      if (value.last_day_paid) {
        value.last_day_paid = value.last_day_paid.format("YYYY-MM-DD");
      } else {
        value.last_day_paid = moment().format("YYYY-MM-DD");
      }

      value.payment_type = parseInt(value.payment_type);
      value.daily_salary = parseFloat(value.daily_salary);
      if(value.contract_start && value.contract_end){
        value.contract_start = moment(value.contract_start).format("YYYY-MM-DD")
        value.contract_end = moment(value.contract_end).format("YYYY-MM-DD")
      }
      updatePayrollPerson(value);
    } else {
      value.person = person.id;
      if (value.last_day_paid) {
        value.last_day_paid = value.last_day_paid.format("YYYY-MM-DD");
      } else {
        value.last_day_paid = moment().format("YYYY-MM-DD");
      }
      value.daily_salary = parseFloat(value.daily_salary);
      if(value.contract_start && value.contract_end){
        value.contract_start = moment(value.contract_start).format("YYYY-MM-DD")
        value.contract_end = moment(value.contract_end).format("YYYY-MM-DD")
      }
      savePayrollPerson(value);
    }
  };

  const getFiscalInformationNode = async (node) => {
    try {
      let response = await WebApiPeople.getfiscalInformation(node);
      if (response.data) {
        SetApplyAssimilated(response.data.assimilated_pay);
      }
    } catch (error) {
      console.log("Error-> ", error);
      setLoading(false);
      message.error(messageError);
    }
  };

  const columns = [
    {
      title: "¿Activo?",
      width:50,
      render: (item) => {
        return (
            <>
              {item?.active
                  ? <p style={{textAlign:'center'}}><CheckCircleOutlined style={{color:'green',fontSize:20}} /></p>
                  : <p style={{textAlign:'center'}}><StopOutlined style={{color:'orange',fontSize:20}} /></p>}
            </>
        );
      },
      key: "active",
    },
    {
      title: "Fecha modificación",
      width:100,
      render: (item) => {
        return (
            <>
              {item?.timestamp
                  ? moment(item.timestamp).format("DD/MM/YYYY hh:mm:ss a")
                  : "--"}
            </>
        );
      },
      key: "modificacion",
    },
    {
      title: "Fecha actualización",
      width:150,
      render: (item) => {
        return (
            <>
              {item?.update_date
                  ? moment(item.update_date).format("DD/MM/YYYY")
                  : "--"}
            </>
        );
      },
      key: "update",
    },
    {
      title: "SD",
      width:100,
      render: (item) => {
        return <>{item.daily_salary ? ` $ ${item.daily_salary}` : "$ 0.00"}</>;
      },
      key: "sd",
    },
    {
      title: "SDI",
      width:100,
      hidden: false,
      render: (item) => {
        return (
          <>
            {item.integrated_daily_salary
              ? `$ ${item.integrated_daily_salary}`
              : "$ 0.00"}
          </>
        );
      },
      key: "sdi",
    },
    {
      title: "Movimiento",
      key: "id",
      width:150,
      render: (item) => {
        return (
          <>
            {item.movement
              ? movementType.find((a) => a.value === item.movement).label
              : ""}
          </>
        );
      },
    },
    {
      title: "Modificado por",
      width:150,
      render: (item) => {
        return <>{item?.modified ? item?.modified : "Por sistema"}</>;
      },
      key: "name",
    },
    {
      title: "Acciones",
      width:100,
      render: (item) => {
        return item.movement !== 2 ? <Popconfirm
            title="¿Estás seguro de eliminar este registro? Esta acción también eliminará los registros
            de imss pendientes generados por esta actualización de salario."
            onConfirm={() => deletePayrollPerson(item.id)}
            okText="Si"
            okButtonProps={{ loading: deletingPayroll }}
            cancelText="No"
        >
          <Button size={'small'}><DeleteOutlined/></Button>
        </Popconfirm> : <></>

      },
      key: "actions",
    },
    {
      title: "¿Movimiento IMSS?",
      width:120,
      render: (item) => {
        const hasMovementRegistered = !!item?.imss_movement_log; // if object is returned it means that a movement has been registered, if null is returned, it means that it doesn't have registered any movement
        return (
          <div style={{display:'flex', flexDirection:'center'}}>
              {hasMovementRegistered
                  ? 
                  
                  <Link href={`/payroll/imssMovements/?regPatronal=${person?.patronal_registration}`}>
                    <a style={{color:'blue'}}>
                      <div>Ver movimientos IMSS</div>
                    </a>
                  </Link>
                  :
                    <Tooltip title="No se ha registrado movimientos en el IMSS">
                      <StopOutlined style={{color:'orange',fontSize:20, margin:'auto'}} />
                    </Tooltip>
                   }
            </div>
        );
      },
      key: "imss-modification",
    },
    {
      title: "¿Modificación SDI?",
      width:50,
      render: (item) => {
        const hasMovementRegistered = item?.sdi_change; //boolean value
        return (
          <div style={{display:'flex', flexDirection:'center'}}>
              {hasMovementRegistered
                  ? 
                  <Tooltip title="Se han registrado movimientos en el SDI">
                    <CheckCircleOutlined style={{color:'green',fontSize:20, margin:'auto'}} />
                  </Tooltip>
                  :
                  <Tooltip title="No se ha registrado movimientos en el SDI">
                    <StopOutlined style={{color:'orange',fontSize:20, margin:'auto'}} />
                  </Tooltip> }
            </div>
        );
      },
      key: "sdi-modification",
    }
  ].filter((item) => !item.hidden);

  const PayrollList = () => {
    WebApiPayroll.getPayrollList({ person_id: person.id })
      .then((response) => {
        setPayrolPersonList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const endContract = (current) => {
    let dateEnd = formPayrollPerson.getFieldValue('contract_end')
      /* let valid_start = current < dateStart?.startOf('day'); */
      let valid_end = current > dateEnd?.endOf('day');
      return valid_end
  }

  const startContract = (current) =>{
    let dateStart = formPayrollPerson.getFieldValue('contract_start')
    console.log('dateStard', dateStart)
      let valid_start = current < dateStart?.startOf('day');
      /* let valid_end = current > dateEnd?.endOf('day'); */
      return valid_start
  }

  const handleValuesChange = (changedValues) => {
    if (changedValues.hiring_regime_type) {
      const type = props.catHiringRegime.filter(
        (item) => item.id === changedValues.hiring_regime_type
      );
      const asimilado = type[0].description.includes("Asimilados");
      formPayrollPerson.setFieldsValue({ payment_calendar: null });
      getPaymentCalendar(asimilado);
    }
  };

  const changeContractType = (val) => {
    if(!val){
      setContractTypeSelected(null)
    }else{
      let filterTypes = props.catContracType?.filter(item => item.id === val)
      if(filterTypes.length > 0){
        console.log(filterTypes[0])
        setContractTypeSelected(filterTypes[0])
      }
    }
  }


  useEffect(() => {
    console.log('person', person)
  }, [person])
  
  return (
    <>
      <Spin tip="Cargando..." spinning={loading}>
        <Row>
          <Title style={{ fontSize: "20px" }}>Nómina</Title>
        </Row>
        {person.date_of_admission ||
        applyAssimilated ||
        payrollPerson?.last_day_paid ? (
          <>
            <Form
              layout={"vertical"}
              form={formPayrollPerson}
              onFinish={formFinish}
              className="inputs_form_responsive form-details-person"
              onValuesChange={handleValuesChange}
            >
              {!bankDisabled && (
                    <Alert
                        banner
                        style={{marginBottom:20}}
                        message="Los datos bancarios de la personas se puede confgurar en la sección: Cuentas bancarias" type="info" />
              )}
              <Row gutter={20}>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    name="daily_salary"
                    label="Salario diario"
                    maxLength={13}
                    rules={[fourDecimal, ruleRequired]}
                  >
                    <Input disabled={dailySalaryDisabled} maxLength={10} />
                  </Form.Item>
                </Col>
                {
                  <Col lg={6} xs={22} md={12}>
                    <Form.Item
                      name="integrated_daily_salary"
                      label="Salario diario integrado"
                      maxLength={13}
                      rules={[fourDecimal]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                }
                <Col lg={12} xs={22} md={12}>
                  <Form.Item
                    name="contract_type"
                    label="Tipo de contrato"
                    rules={[ruleRequired]}
                  >
                    <Select
                      options={contrctsType}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      allowClear
                      onChange={changeContractType}
                    />
                  </Form.Item>
                </Col>
                {
                  contractTypeSelected?.code === '03' &&
                  <>
                    <Col lg={10} xs={22} md={12}>
                      <Form.Item
                        name="contract_start"
                        label="Inicio del contrato"
                      >
                        <DatePicker disabledDate={endContract} locale={locale} style={{ width:'100%' }} />
                      </Form.Item>
                  </Col>
                  <Col lg={10} xs={22} md={12}>
                      <Form.Item
                        name="contract_end"
                        label="Fin del contrato"
                      >
                        <DatePicker disabledDate={startContract} locale={locale} style={{ width:'100%' }} />
                      </Form.Item>
                  </Col>
                  </>
                }
                <Col lg={8} xs={22} md={12}>
                  <Form.Item
                    name="hiring_regime_type"
                    label="Tipo de régimen de contratación"
                    rules={[ruleRequired]}
                  >
                    <Select
                      options={hiringRegimeType}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent={"No se encontraron resultados."}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={22} md={12}>
                  <Form.Item
                    name="type_working_day"
                    label="Tipo de jornada"
                    rules={[ruleRequired]}
                  >
                    <Select
                      options={typeworkingday}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent={"No se encontraron resultados."}
                      allowClear
                      disabled={assimilated_pay}
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={22} md={12}>
                  <Form.Item
                    name="unionized"
                    label="¿Sindicalizado?"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={24} md={12}>
                  <Form.Item
                    name="payment_type"
                    label="Forma de pago"
                    rules={[ruleRequired]}
                  >
                    <Select
                      options={_.orderBy(PaymentTypes, ["label"], ["asc"])}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      notFoundContent={"No se encontraron resultados."}
                      onChange={changePaymentType}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={22} md={12}>
                  <Form.Item
                    name="apply_monthly_adjustment"
                    label="¿Aplicar ajuste mensual?"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={22} md={12}>
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
                <Col lg={8} xs={22} md={12}>
                  <Form.Item
                    name="last_day_paid"
                    rules={[ruleRequired]}
                    label="Último día de pago"
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={onChangeLastDayPaid}
                      format={"DD-MM-YYYY"}
                      locale={locale}
                    />
                  </Form.Item>
                </Col>
                <Col lg={8} xs={22} md={12}>
                  <SelectFixedConcept type={1} />
                </Col>
                <Col lg={8} xs={22} md={12}>
                  <SelectCostCenter
                    required={false}
                    multiple={true}
                    viewLabel={"Centro de costos"}
                  />
                </Col>
                <Col lg={8} xs={22} md={12}>
                  <SelectTags
                    required={false}
                    multiple={true}
                    viewLabel={"Etiquetas"}
                  />
                </Col>
                {paymentCalendars.length > 0 && (
                  <>
                    <Col lg={8} xs={22} md={12}>
                      <Form.Item
                        name="payment_calendar"
                        label="Calendario de pago"
                        rules={[ruleRequired]}
                      >
                        <Select
                          options={_.orderBy(
                            paymentCalendars,
                            ["description"],
                            ["asc"]
                          )}
                          notFoundContent={"No se encontraron resultados."}
                          onChange={selectCalendar}
                          disabled={disabledCalendar}
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xs={22} md={12}>
                      <Form.Item
                        name="perception_type"
                        label="Tipo de percepción"
                      >
                        <Select
                          options={perceptionTypes}
                          notFoundContent={"No se encontraron resultados."}
                          disabled
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} xs={22} md={12}>
                      <Form.Item name="type_tax" label="Tipo de impuesto">
                        <Select
                          options={typeTax}
                          notFoundContent={"No se encontraron resultados."}
                          disabled
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>
              <Row justify={"end"}>
                {
                    payrollPerson && payrollPerson.payment_calendar && <Form.Item>
                      <ButtonUpdateSalaryMovement
                          onRefresh={() => {
                            getPayrollPerson();
                            getPaymentCalendar();
                            PayrollList();
                          }}
                          person={person}
                          node={person.node}
                          payrollPerson={payrollPerson}
                          perceptionCode={perceptionCode}
                      />
                    </Form.Item>
                }

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Guardar
                  </Button>
                </Form.Item>
              </Row>
            </Form>
            <Divider/>
            <FormImssInfonavit
              person={person}
              refreshtab={refreshImssTable}
              onFinishRefresh={onFinishRefreshTab12}
              person_id={person.id}
              node={person.node}
            />
            <Row>
              <Table dataSource={payrollPersonList} scroll={{ x: 1500 }} columns={columns} size={'small'} />
            </Row>
          </>
        ) : (
          <Alert
            message="Información necesaria"
            description="Para continuar con la nómina de la persona es necesario capturar su fecha de inicio laboral, y registrar su registro patronal."
            type="info"
            showIcon
          />
        )}
      </Spin>
      <GenericModal
        visible={confirm}
        setVisible={(value) => setConfirm(value)}
        title="Confirmación"
        titleActionButton="Aceptar"
        width="50%"
        children="Estas punto de hacer un cambio de calendario de la nómina de esta persona"
        actionButton={() => {
          confirmDataForm();
          setConfirm(false);
        }}
      ></GenericModal>
    </>
  );
};

const mapState = (state) => {
  return {
    catPerception: state.fiscalStore.cat_perceptions,
    catContracType: state.fiscalStore.cat_contract_type,
    catHiringRegime: state.fiscalStore.cat_hiring_regime,
    catJourneyType: state.fiscalStore.cat_journey_type,
    catTypeTax: state.fiscalStore.type_tax,
    catBanks: state.fiscalStore.banks,
    user: state.userStore.user,
    companyFiscalInformation: state.fiscalStore.company_fiscal_information
  };
};

export default connect(mapState)(FormPayrollPerson);
