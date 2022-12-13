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
  Tabs
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

const FixedConcepts = ({ permissions, currentNode, ...props }) => {
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

  const data = [
    {
      name: "applies_to_unjustified_absences",
      label: "Aplica para faltas injustificadas.",
      value: false,
    },
    {
      name: "applies_to_excused_absences",
      label: "Aplica para faltas justificadas.",
      value: false,
    },
    {
      name: "applies_to_paid_permit",
      label: "Aplica para permiso con goce.",
      value: false,
    },
    {
      name: "applies_to_unpaid_permit",
      label: "Aplica para permiso sin goce.",
      value: false,
    },
    {
      name: "applies_to_disabilities",
      label: "Aplica para incapacidades.",
      value: false,
    },
    {
      name: "applies_to_vacations",
      label: "Aplica para vacaciones.",
      value: false,
    },
  ];

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
              {permissions.edit && (
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
                                </span>
                                {' '} {item.name}
                              </Row>
                              <Row>
                                <span style={{ fontWeight: "bold" }}>
                                  Conceptos
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
                                      {a.label}:
                                    </span>
                                    {item[a.name] ? "Si" : "No"}
                                  </Row>
                                );
                              })}
                            </>
                          ),
                      })
                    }
                  />
                </Col>
              )}
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
              {permissions.edit && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined
                    onClick={() =>
                      key == 2 ? editGroup(item) : editRegister(item)
                    }
                  />
                </Col>
              )}
              {permissions.delete && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                      });
                    }}
                  />
                </Col>
              )}
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
      setPerceptionsCat(
        props.perceptions_int.map((item) => {
          return { value: item.id, label: item.description };
        })
      );
      setDeductionsCat(
        props.deductions_int.map((item) => {
          return { value: item.id, label: item.description };
        })
      );
      setOtherPaymentsCat(
        props.other_payments_int.map((item) => {
          return { value: item.id, label: item.description };
        })
      );
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
    if (edit) {
      updateRegister(value);
    } else saveRegister(value);
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
    let checksValues = {}

    console.log(item)
    data.map((a) => {
      if (item[a.name]){
        checksValues[a.name] = true;
      }else{
        checksValues[a.name]=false;
      }
    });
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
      "": item.perception_type ? 1 : item.deduction_type ? 2 : 3,
      ...checksValues
    });
    setConceptType(item.perception_type ? 1 : item.deduction_type ? 2 : 3);
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
    } catch (error) {
      console.log(error);
    }
  };

  const data_type = [
    { value: 1, label: "Monto" },
    { value: 2, label: "Porcentaje" },
  ];
  const based_on = [
    { value: 1, label: "Salario" },
    { value: 2, label: "Dias trabajados" },
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

  const RenderConditions = ({ data }) => {
    return data.map((item, i) => {
      return (
        <Col lg={6} xs={22} md={12}>
          <Form.Item
            initialValue={item.value}
            valuePropName="checked"
            name={item.name}
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
    });
  };

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
            <Form layout={"vertical"}  style={{paddingTop:20}} form={form} onFinish={onFinishForm}>
              <Row gutter={20}>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={22} md={12}>
                  <Form.Item
                    name=""
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
                      />
                    </Form.Item>
                  </Col>
                )}
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
                  <Form.Item name="datum" label="Valor" rules={[ruleRequired,{
                    message: 'Se requiere un valor mayor a 0',
                    validator: (_, value) => {
                      if (value>0) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject('Se requiere un valor mayor a 0');
                      }
                    }
                  }]}>
                    <Input type={"number"} />
                  </Form.Item>
                </Col>
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
                    <Input type={"number"} min={0}/>
                  </Form.Item>
                </Col>
                <RenderConditions data={data} />
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
              <Form style={{paddingTop:20}} layout={"vertical"} form={formG} onFinish={saveGroup}>
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
                    <Form.Item name="fixed_concept"  rules={[ruleRequired]} label="Concepto">
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
        <Table
          columns={columns}
          dataSource={catalog}
          locale={{
            emptyText: loading
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
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
