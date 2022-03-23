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
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getFixedConcept,
  getGroupFixedConcept,
} from "../../redux/catalogCompany";
import {
  messageDeleteSuccess,
  messageError,
  messageSaveSuccess,
  messageUpdateSuccess,
} from "../../utils/constant";
import WebApiPayroll from "../../api/WebApiPayroll";

const Departaments = ({ permissions, currentNode, ...props }) => {
  const { Title } = Typography;
  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [id, setId] = useState("");
  const [conceptType, setConceptType] = useState(0);
  const [perceptionsCat, setPerceptionsCat] = useState([]);
  const [deductionsCat, setDeductionsCat] = useState([]);
  const [otherPaymentsCat, setOtherPaymentsCat] = useState([]);
  const [visible, setVisible] = useState(false);
  const [concepKeys, setConcepKeys] = useState([]);
  const [concepSelect, setConcepSelect] = useState([]);
  const [nameGroup, setNameGroup] = useState(null);
  const [groups, setGroups] = useState(false);

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
                        title: groups
                          ? "Detalle del grupo"
                          : "Detalle del concepto",
                        content: groups ? (
                          <>
                            <Row>
                              <span style={{ fontWeight: "bold" }}>
                                Nombre:
                              </span>
                              {item.name}
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
                              console.log(item);
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
                    onClick={() => (groups ? null : editRegister(item, "dep"))}
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
    setEdit(false);
    setId("");
  };

  const onFinishForm = (value) => {
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

  const editRegister = (item, param) => {
    data.map((a) => {
      let checked = document.getElementById(a.name);
      if (item[a.name]) checked.click();
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
    });
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
        okText: "Si, eliminar",
        okButtonProps: {
          danger: true,
        },
        cancelText: "Cancelar",
        onOk() {
          groups ? deleteGroup() : deleteRegister();
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
    { value: 1, label: "Porcentaje" },
    { value: 2, label: "Monto" },
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

  const selectItem = {
    selectedRowKeys: concepKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setConcepKeys(selectedRowKeys);
      setConcepSelect(selectedRows);
    },
  };

  const SelectRows = ({ data }) => {
    return (
      <>
        {data.map((item, i) => {
          return (
            <Row>
              {i + 1}.- {item.name}
            </Row>
          );
        })}
      </>
    );
  };

  const viewModal = () => {
    visible ? setVisible(false) : setVisible(true);
  };

  const saveGroup = async () => {
    setLoading(true);
    const data = {
      node: currentNode.id,
      name: nameGroup,
      fixed_concept: concepKeys,
    };
    await WebApiPayroll.groupFixedConcept("post", data)
      .then((response) => {
        setLoading(false);
        message.success(messageSaveSuccess);
        props.getGroupFixedConcept(currentNode.id);
        setVisible(false);
      })
      .catch((error) => {
        setLoading(false);
        setNameGroup(null);
        setConcepKeys([]);
        setConcepSelect([]);
        message.error(messageError);
        setVisible(false);
      });
  };

  const deleteGroup = async (id) => {
    setLoading(true);
    await WebApiPayroll.groupFixedConcept("delete", null, `${deleted.id}/`)
      .then((response) => {
        setLoading(false);
        message.success(messageSaveSuccess);
        props.getGroupFixedConcept(currentNode.id);
        setDeleted({});
      })
      .catch((error) => {
        setLoading(false);
        setNameGroup(null);
        setConcepKeys([]);
        setConcepSelect([]);
        message.error(messageError);
        setDeleted({});
      });
  };

  useEffect(() => {
    console.log(props.cat_group_fixed_concept);
  }, [props.cat_group_fixed_concept]);

  return (
    <>
      {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}
      {permissions.create && (
        <Form layout={"vertical"} form={form} onFinish={onFinishForm}>
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
                      ? "Percepcion"
                      : conceptType == 2
                      ? "Deduccion"
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
              <Form.Item name="datum" label="Valor" rules={[ruleRequired]}>
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
                label="Typo de sueldo"
              >
                <Select options={type_salary} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} md={12}>
              <Form.Item
                initialValue={0}
                name="max_delays"
                label="Maximo de retardos"
              >
                <Input type={"number"} />
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
            {concepKeys.length > 0 && (
              <Col>
                <Button type="primary" onClick={viewModal}>
                  Crear Grupo
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      )}
      <Spin tip="Cargando..." spinning={loading}>
        <Row justify="end">
          <Col style={{ marginBottom: "10px" }}>
            <Button onClick={() => setGroups(!groups)}>
              <EyeOutlined />
              {groups ? "Conceptos" : "Grupos"}
            </Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={
            groups ? props.cat_group_fixed_concept : props.cat_fixed_concept
          }
          locale={{
            emptyText: loading
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
          rowSelection={!groups && selectItem}
        />
      </Spin>
      <Modal
        onCancel={() => {
          viewModal(), setConcepKeys([]), setConcepSelect([]);
        }}
        title="Grupo de conceptos fijos"
        visible={visible}
        okText="Guardar"
        onOk={saveGroup}
        okButtonProps={{
          disabled: nameGroup && nameGroup.trim() != "" ? false : true,
          loading: loading,
        }}
      >
        <Row style={{ marginBottom: "10px" }}>
          <Input
            placeholder="Nombre del grupo"
            onChange={(value) => setNameGroup(value.target.value)}
          />
        </Row>
        <SelectRows data={concepSelect} />
      </Modal>
    </>
  );
};

const mapState = (state) => {
  return {
    cat_fixed_concept: state.catalogStore.cat_fixed_concept,
    perceptions_int: state.fiscalStore.perceptions_int,
    deductions_int: state.fiscalStore.deductions_int,
    other_payments_int: state.fiscalStore.other_payments_int,
    cat_group_fixed_concept: state.catalogStore.cat_group_fixed_concept,
  };
};

export default connect(mapState, { getFixedConcept, getGroupFixedConcept })(
  Departaments
);
