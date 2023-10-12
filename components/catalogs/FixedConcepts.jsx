import React, { useEffect, useState } from "react";
import {
  Typography,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spin,
  Input,
  message,
  Modal,
  Select,
  Checkbox,
  Tabs,
  ConfigProvider,
  DatePicker
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getFixedConcept, getGroupFixedConcept } from "../../redux/payrollDuck";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import WebApiPayroll from "../../api/WebApiPayroll";
import esES from "antd/lib/locale/es_ES";
import moment from "moment";

const FixedConcepts = ({ currentNode, ...props }) => {
  const { Title } = Typography;
  const { TabPane } = Tabs;
  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [formG] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");
  const [conceptType, setConceptType] = useState(0);
  const [perceptionsCat, setPerceptionsCat] = useState([]);
  const [deductionsCat, setDeductionsCat] = useState([]);
  const [otherPaymentsCat, setOtherPaymentsCat] = useState([]);
  const [concepSelect, setConcepSelect] = useState([]);
  const [key, setKey] = useState(1);
  const [catalog, setCat] = useState([]);
  const [showNumPeriods, SetShowNumPeriods] = useState(false);  
  const [applicationDate, setApplicationDate] = useState(null)
  const [showAppliesVacation, setShowAppliesVacation] = useState(false)

  // const data = [   
  //   {
  //     name: "not_applies_to_absences",
  //     label: "No otorgar en caso de faltas.",
  //     value: false,
  //   },    
  //   {
  //     name: "not_applies_to_disabilities",
  //     label: "No otorgar en caso de incapacidades.",
  //     value: false,
  //   },
  //   {
  //     name: "affect_vacations",
  //     label: "Afectar con vacaciones.",
  //     value: false,
  //   },
  //   {
  //     name: "applies_to_vacations",
  //     label: "No otorgar en caso de vacaciones.",
  //     value: false,
  //   },    
  // ];

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "id",
    },
    {
      title: "Detalle",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
                <Col className="gutter-row" offset={1}>
                  <EyeOutlined
                    onClick={() =>
                      Modal.info({
                        title:
                          key == 2
                            ? "Detalle del grupo"
                            : "Detalle del concepto",
                        content:
                          key == 2 ? (
                            <>
                              <Row>
                                <span style={{ fontWeight: "bold" }}>
                                  Nombre:
                                </span>{" "}
                                {item.name}
                              </Row>
                              <Row>
                                <span style={{ fontWeight: "bold" }}>
                                  Conceptos: 
                                </span>
                              </Row>
                              {item.fixed_concept.map((a) => {
                                return (
                                  <>
                                    <Row>{a.name}</Row>
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              <Row>
                                <span style={{ fontWeight: "bold" }}>
                                  Nombre:
                                </span>
                                {item.name}
                              </Row>
                              {data.map((a) => {
                                return (
                                  <Row>
                                    <span style={{ fontWeight: "bold" }}>
                                      {a.label.replaceAll(".", "")}:
                                    </span>
                                    {item[a.name] ? " Si" : " No"}
                                  </Row>
                                );
                              })}
                            </>
                          ),
                      })
                    }
                  />
                </Col>
            </Row>
          </div>
        );
      },
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
                <Col className="gutter-row" offset={1}>
                  <EditOutlined
                    onClick={() =>
                      key == 2 ? editGroup(item) : editRegister(item)
                    }
                  />
                </Col>
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                      });
                    }}
                  />
                </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (
      props.perceptions_int &&
      props.deductions_int &&
      props.other_payments_int
    ) {
      // Solo se muestran los conceptos internos por empresa
      let perceptions = [];
      props.perceptions_int.filter((item) => {
        if (item.node == currentNode.id && item.is_active) {
          perceptions.push({ value: item.id, label: item.description});
        }
      });
      setPerceptionsCat(perceptions);

      let deductions = [];
      props.deductions_int.filter((item) => {
        if (item.node == currentNode.id && item.is_active) {
          deductions.push({ value: item.id, label: item.description });
        }
      });
      setDeductionsCat(deductions);

      let other_paymets = [];
      props.other_payments_int.filter((item) => {
        if (item.node == currentNode.id && item.is_active) {
          other_paymets.push({ value: item.id, label: item.description });
        }
      });
      setOtherPaymentsCat(other_paymets);
    }
  }, [props.perceptions_int, props.deductions_int, props.other_payments_int]);

  const resetForm = () => {
    form.resetFields();
    formG.resetFields();
    setEdit(false);
    setId("");
  };

  useEffect(() => {
    if (props.fixed_concept && key == 1) setCat(props.fixed_concept);
    if (props.group_fixed_concept && key == 2)
      setCat(props.group_fixed_concept);
  }, [props.fixed_concept, props.group_fixed_concept, key]);

  const onFinishForm = (value) => {
    console.log("Values ", value)
    /**
     * Validamos que no puedan meter datos con puros espacios
     */
    if (!(value?.name && value.name.trim())) {
      form.setFieldsValue({ name: undefined });
      value.name = undefined;
    }

    if (value.name === undefined) {
      form.validateFields();
      return;
    }

    value.node = currentNode.id;
    if (value.num_of_periods){
      value.num_of_periods = parseInt(value.num_of_periods)    
    }
    else{
      value.num_of_periods = 0    
    }

    /* Validamos el tipo de concepto */
    if (value.concept_type == 1){
      value.deduction_type = null
      value.other_payment_type = null
    } else if (value.concept_type == 2){
      value.perception_type = null
      value.other_payment_type = null
    } else if (value.concept_type == 3){
      value.perception_type = null
      value.deduction_type = null
    }
    value.application_date = moment (value.application_date).format("YYYY-MM-DD")
    if (value.not_applies_to_vacations == undefined){
      value.not_applies_to_vacations = false
    }
    
    
    

    if (edit) {
      updateRegister(value);
    } else {
      /** Inicializamos el saldo al crear el concepto programado de forma diferida */
      if (value.num_of_periods > 0 && value.discount_type == 2){
        value.balance = value.datum

      }
      saveRegister(value);}
    setShowAppliesVacation(false);
  };

  const saveRegister = async (data) => {
    data.node = currentNode.id;
    setLoading(true);
    try {
      await WebApiPayroll.fixedConcept("post", data);
      props
        .getFixedConcept(currentNode.id)
        .then((response) => {
          resetForm();
          message.success(messageSaveSuccess);
          setLoading(false);
          SetShowNumPeriods(false)
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          message.error(messageError);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error(messageError);
    }
  };

  const editRegister = (item) => {
    let checksValues = {};

    console.log(item);
    // data.map((a) => {
    //   if (item[a.name]) {
    //     checksValues[a.name] = true;
    //   } else {
    //     checksValues[a.name] = false;
    //   }
    // });
    setEdit(true);
    setId(item.id);    

    form.setFieldsValue({
      name: item.name,
      data_type: item.data_type,
      datum: item.datum,
      based_on: item.based_on,
      salary_type: item.salary_type,
      max_delays: item.max_delays,
      perception_type: item.perception_type,
      deduction_type: item.deduction_type,
      other_payment_type: item.other_payment_type,
      concept_type: item.perception_type ? 1 : item.deduction_type ? 2 : 3,
      ...checksValues,
      period_config: item.period_config,
      application_mode: item.application_mode,
      num_of_periods: item.num_of_periods,
      application_date: item.application_date ? moment(item.application_date, 'YYYY-MM-DD'): null,
      not_applies_to_absences: item.not_applies_to_absences,
      not_applies_to_disabilities: item.not_applies_to_disabilities,
      affect_vacations: item.affect_vacations,
      not_applies_to_vacations: item.not_applies_to_vacations
      
    });
    SetShowNumPeriods(item.application_mode == 1 ? false : true)
    setConceptType(item.perception_type ? 1 : item.deduction_type ? 2 : 3);
    if (item.affect_vacations) setShowAppliesVacation(true);    
  };

  const updateRegister = async (value) => {
    try {
      console.log(value);
      delete value["id"];
      delete value[""];
      await WebApiPayroll.fixedConcept(`put`, value, `${id}/`);
      props
        .getFixedConcept(currentNode.id)
        .then((response) => {
          setId("");
          resetForm();
          message.success(messageUpdateSuccess);
          setLoading(false);
          SetShowNumPeriods(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          message.error(messageError);
        });
    } catch (error) {
      setId("");
      setEdit(false);
      setLoading(false);
      resetForm();
      message.error("Ocurrio un error intente de nuevo.");
    }
  };

  const setDeleteRegister = (data) => {
    setDeleted(data);
  };

  useEffect(() => {
    if (deleted.id) {
      Modal.confirm({
        title: "¿Está seguro de eliminar este registro?",
        content: "Si lo elimina no podrá recuperarlo",
        icon: <ExclamationCircleOutlined />,
        okText: "Sí, eliminar",
        okButtonProps: {
          danger: true,
        },
        cancelText: "Cancelar",
        onOk() {
          key == 2 ? deleteGroup() : deleteRegister();
        },
      });
    }
  }, [deleted]);

  const deleteRegister = async () => {
    try {
      await WebApiPayroll.fixedConcept("delete", null, `${deleted.id}/`);
      props
        .getFixedConcept(currentNode.id)
        .then((response) => {
          resetForm();
          message.success(messageDeleteSuccess);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          message.error(messageError);
        });
      const res = await props.getGroupFixedConcept(currentNode.id)
    } catch (error) {
      console.log(error);
    }
  };

  const data_type = [
    { value: 1, label: "Monto" },
    { value: 2, label: "Porcentaje" },
    { value: 3, label: "Veces salario" },
  ];
  const based_on = [
    { value: 1, label: "Periodo" },
    { value: 2, label: "Días trabajados" },
  ];
  const type_salary = [
    { value: 0, label: "N/A" },
    { value: 1, label: "Bruto" },
    { value: 2, label: "Neto" },
  ];
  const concept_type = [
    { value: 1, label: "Percepción" },
    { value: 2, label: "Deducción" },
    { value: 3, label: "Otro pago" },
  ];
  const period_config = [
    {value: 1, label: 'Todos'},
    {value: 2, label: 'Primer periodo'},
    {value: 3, label: 'Último periodo'}
  ]
  const application_mode = [
    {value: 1, label: 'Fijo'},
    {value: 2, label: 'Dividir en periodos'},
    {value: 3, label: 'Frecuencia'}
  ]

  // const RenderConditions = ({ data }) => {
  //   return data.map((item, i) => {
  //     return (
  //       <Col lg={6} xs={22} md={12}>
  //         <Form.Item
  //           initialValue={item.value}
  //           valuePropName="checked"
  //           name={item.name}            
  //         >
  //           <Checkbox
  //             id={item.name}
  //             key={item.value + i}
  //             className="CheckGroup"
  //           >
  //             <span style={{ color: "black" }}>{item.label}</span>
  //           </Checkbox>
  //         </Form.Item>
  //       </Col>
  //     );
  //   });
  // };

  const changeAffectVacations = (e) => {
    if (e.target.checked){
      setShowAppliesVacation(true);
    }
    else{
      setShowAppliesVacation(false);
      let check = document.getElementById("not_applies_to_vacations")
      if (check.checked) check.click()    
    }
    
  }

  const editGroup = (item) => {
    formG.setFieldsValue({
      name: item.name,
      fixed_concept: item.fixed_concept.map((i) => {
        return i.id;
      }),
    });
    setEdit(true);
    setId(item.id);
  };
  const saveGroup = async (value) => {
    /**
     * Validamos que no puedan meter datos con puros espacios
     */
    if (!(value?.name && value.name.trim())) {
      formG.setFieldsValue({ name: undefined });
      value.name = undefined;
    }

    if (value.name === undefined) {
      formG.validateFields();
      return;
    }

    setLoading(true);
    let url = "";
    if (!edit) value.node = currentNode.id;
    else url = `${id}/`;
    try {
      await WebApiPayroll.groupFixedConcept(edit ? "put" : "post", value, url);
      props
        .getGroupFixedConcept(currentNode.id)
        .then((response) => {
          setLoading(false);
          resetForm();
          message.success(messageSaveSuccess);
        })
        .catch((error) => {
          setLoading(false);
          setConcepSelect([]);
          message.error(messageError);
        });
    } catch (error) {
      setId("");
      setEdit(false);
      setLoading(false);
      resetForm();
      message.error("Ocurrio un error intente de nuevo.");
    }
  };

  const deleteGroup = async () => {
    try {
      await WebApiPayroll.groupFixedConcept("delete", null, `${deleted.id}/`);
      props
        .getGroupFixedConcept(currentNode.id)
        .then((response) => {
          resetForm();
          message.success(messageDeleteSuccess);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          message.error(messageError);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const changeApplicationMode = (value) => {    
    if (value && value  > 1){
      SetShowNumPeriods(true);
    }
    else {
      SetShowNumPeriods(false)
      form.setFieldsValue({
        num_of_periods: 0
      })
    }
  }

  const changeApplicationDate = (date, dateString) => {
    console.log("Date ->", dateString);
    setApplicationDate(dateString)
  };

  return (
    <>
      {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}
      <Tabs
        defaultActiveKey="1"
        type="card"
        size={"small"}
        onChange={(value) => setKey(parseInt(value))}
      >
        <TabPane tab="Conceptos fijos" key={"1"}>
          {key == 1 && (
            <Form
              layout={"vertical"}
              style={{ paddingTop: 20 }}
              form={form}
              onFinish={onFinishForm}
            >
              <Row gutter={20}>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    name="concept_type"
                    label="Tipo de concepto"
                    rules={[ruleRequired]}
                  >
                    <Select
                      options={concept_type}
                      onChange={(value) => setConceptType(value)}
                    />
                  </Form.Item>
                </Col>
                {conceptType > 0 && (
                  <Col lg={6} xs={22} md={12}>
                    <Form.Item
                      name={
                        conceptType == 1
                          ? "perception_type"
                          : conceptType == 2
                          ? "deduction_type"
                          : "other_payment_type"
                      }
                      label={
                        conceptType == 1
                          ? "Percepción"
                          : conceptType == 2
                          ? "Deducción"
                          : "Otro pago"
                      }
                      rules={[ruleRequired]}
                    >
                      <Select
                        options={
                          conceptType == 1
                            ? perceptionsCat
                            : conceptType == 2
                            ? deductionsCat
                            : otherPaymentsCat
                        }
                        optionFilterProp="children"
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>
                )}               
              </Row>
              <Row gutter={20}>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    name="data_type"
                    label="Tipo de dato"
                    rules={[ruleRequired]}
                  >
                    <Select options={data_type} />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    name="datum"
                    label="Valor"
                    rules={[
                      ruleRequired,
                      {
                        message: "Se requiere un valor mayor a 0",
                        validator: (_, value) => {
                          if (value > 0) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject(
                              "Se requiere un valor mayor a 0"
                            );
                          }
                        },
                      },
                    ]}
                  >
                    <Input type={"number"} />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
              <Form.Item
                  name='application_date'
                  label='Fecha de inicio de aplicación'
                  rules={[ruleRequired]}
                >
                  <DatePicker                      
                    style={{ width: "100%" }}
                    placeholder='Seleccionar una fecha'                                                
                    format='YYYY-MM-DD'
                    onChange={changeApplicationDate}
                  />
                </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={1}
                    name="based_on"
                    label="Basado en"
                    rules={[ruleRequired]}
                  >
                    <Select options={based_on} />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={0}
                    name="salary_type"
                    label="Tipo de sueldo"
                  >
                    <Select options={type_salary} />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={0}
                    name="max_delays"
                    label="Máximo de retardos"
                  >
                    <Input type={"number"} min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={1}
                    name="period_config"
                    label="Configuración de períodos"                    
                  >
                    <Select options={period_config} />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={1}
                    name="application_mode"
                    label="Modo de aplicación"                    
                  >
                    <Select options={application_mode} onChange={changeApplicationMode}/>
                  </Form.Item>
                </Col>
                { showNumPeriods  && 
                <Col lg={6} xs={22} md={12}>
                <Form.Item
                  initialValue={0}
                  name="num_of_periods"
                  label="Número de periodos"
                  rules={[
                    ruleRequired,
                    {
                      message: "Se requiere un valor mayor a 0",
                      validator: (_, value) => {
                        if (value > 0) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject(
                            "Se requiere un valor mayor a 0"
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Input type={"number"} />
                </Form.Item>
                </Col>}              
              </Row>
              <Row gutter={20}>               
              {/* <RenderConditions data={data} /> */}
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={false}
                    valuePropName="checked"
                    name="not_applies_to_absences"                    
                  >
                    <Checkbox className="CheckGroup">
                      <span style={{ color: "black" }}>No otorgar en caso de faltas</span>
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={false}
                    valuePropName="checked"
                    name="not_applies_to_disabilities"                    
                  >
                    <Checkbox className="CheckGroup">
                      <span style={{ color: "black" }}>No otorgar en caso de incapacidades</span>
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={false}
                    valuePropName="checked"
                    name="affect_vacations"                    
                  >
                    <Checkbox className="CheckGroup" onChange={changeAffectVacations}>
                      <span style={{ color: "black" }}>Afectar con vacaciones</span>
                    </Checkbox>
                  </Form.Item>
                </Col>
                {showAppliesVacation && 
                 <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    initialValue={false}
                    valuePropName="checked"
                    name="not_applies_to_vacations"                    
                    id="not_applies_to_vacations"                    
                  >
                    <Checkbox className="CheckGroup">
                      <span style={{ color: "black" }}>No otorgar en caso de vacaciones</span>
                    </Checkbox>
                  </Form.Item>
                 </Col>}               
              </Row>
              <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
                <Col>
                  <Button onClick={resetForm}>Cancelar</Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit">
                    Guardar
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </TabPane>
        <TabPane tab="Grupos" key={"2"}>
          {key == 2 && (
            <>
              <Form
                style={{ paddingTop: 20 }}
                layout={"vertical"}
                form={formG}
                onFinish={saveGroup}
              >
                <Row gutter={20} style={{ marginBottom: "10px" }}>
                  <Col span={8}>
                    <Form.Item
                      name="name"
                      label="Nombre del grupo"
                      rules={[ruleRequired]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="fixed_concept"
                      rules={[ruleRequired]}
                      label="Concepto"
                    >
                      <Select
                        placeholder="Conceptos fijos"
                        style={{ width: "100%" }}
                        mode="multiple"
                        allowClear
                        options={props.fixed_concept.map((item) => {
                          return { label: item.name, value: item.id };
                        })}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
                  <Col>
                    <Button type="primary" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </Col>
                  <Col>
                    <Button type="primary" htmlType="submit">
                      Guardar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </TabPane>
      </Tabs>

      <Spin tip="Cargando..." spinning={loading}>
        <ConfigProvider locale={esES}>
        <Table
          columns={columns}
          dataSource={catalog}
          pagination={{showSizeChanger:true}}
          locale={{
            emptyText: loading
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
        </ConfigProvider>
      </Spin>
    </>
  );
};

const mapState = (state) => {
  return {
    fixed_concept: state.payrollStore.fixed_concept,
    group_fixed_concept: state.payrollStore.group_fixed_concept,
    perceptions_int: state.fiscalStore.perceptions_int,
    deductions_int: state.fiscalStore.deductions_int,
    other_payments_int: state.fiscalStore.other_payments_int,
  };
};

export default connect(mapState, { getFixedConcept, getGroupFixedConcept })(
  FixedConcepts
);
