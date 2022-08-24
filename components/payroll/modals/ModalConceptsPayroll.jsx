import React, { useEffect, useLayoutEffect, useState } from "react";
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
  Input,
  Spin,
  Alert,
  InputNumber,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { numberFormat } from "../../../utils/functions";
import { connect } from "react-redux";
import { get } from "lodash";

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
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [concepts, setConcepts] = useState([]);
  const [perceptionsCat, setPerceptionsCat] = useState([]);
  const [deductionsCat, setDeductionsCat] = useState([]);
  const [otherPaymentsCat, setOtherPaymentsCat] = useState([]);
  const [perceptions, setPerceptions] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [otherPayments, setOtherPayments] = useState([]);
  const [ceros, setCeros] = useState(false);

  useEffect(() => {
    if (
      props.perceptions_int &&
      props.deductions_int &&
      props.other_payments_int
    ) {
      console.log("Percepciones =>", props.perceptions_int);
      if (payrollType === "046") {
        props.perceptions_int = props.perceptions_int.filter(
          (item) =>
            item.perception_type.is_assimilated &&
            item.perception_type.code !== "046"
        );
        props.deductions_int = props.deductions_int.filter(
          (item) =>
            item.deduction_type.is_assimilated &&
            item.deduction_type.code !== "002"
        );
        props.other_payments_int = props.other_payments_int.filter(
          (item) => item.other_type_payment.is_assimilated
        );
      } else {
        props.perceptions_int = props.perceptions_int.filter(
          (item) =>
            item.perception_type.is_payroll && item.node != null && item.show
        );
        props.deductions_int = props.deductions_int.filter(
          (item) =>
            item.deduction_type.is_payroll &&
            item.node != null &&
            item.deduction_type.code !== "002" &&
            item.show
        );
        props.other_payments_int = props.other_payments_int.filter(
          (item) =>
            item.other_type_payment.is_payroll && item.node != null && item.show
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

  const RenderCheckConcept = ({ data, type }) => {
    return (
      <>
        {data.map((item) => {
          return (
            <Col span={12}>
              <Checkbox key={item.code} className="CheckGroup" value={item}>
                <span style={{ textTransform: "uppercase" }}>
                  {item.description}
                </span>
              </Checkbox>
            </Col>
          );
        })}
      </>
    );
  };

  const RenderConcept = ({ data = [], type }) => {
    return (
      <>
        {data.map((item) => {
          item.value = item.value != "" && item.value > 0 ? item.value : 0;
          return (
            <Col span={12}>
              <Row style={{ marginBottom: "8px" }}>
                <Col span={18}>{item.description}</Col>
                <Col span={4}>
                  <InputNumber
                    type="number"
                    name={item.id}
                    defaultValue={item.value}
                    formatter={(value) => value.replace("-", "")}
                    controls={false}
                    onChange={(e) => changeHandler(type, item.id)(e)}
                  />
                </Col>
              </Row>
            </Col>
          );
        })}
      </>
    );
  };

  const onChangeCheckConcepts = (checkedValues, type) => {
    if (type === 1) setPerceptions(checkedValues);
    if (type === 2) setDeductions(checkedValues);
    if (type === 3) setOtherPayments(checkedValues);
  };

  const changeHandler = (type, name) => (value) => {
    if (type === 1)
      perceptions.map((item) => {
        if (item.id === name)
          item.value = value != "" && Number(value) > 0 ? Number(value) : 0;
      });
    if (type === 2)
      deductions.map((item) => {
        if (item.id === name)
          item.value = value != "" && Number(value) > 0 ? Number(value) : 0;
      });
    if (type === 3)
      otherPayments.map((item) => {
        if (item.id === name)
          item.value = value != "" && Number(value) > 0 ? Number(value) : 0;
      });
  };

  const listConcepts = (value = null) => {
    if (value != null) {
      setCurrentStep(value);
      return;
    }
    let is_cero = false;
    setCeros(false);
    setConcepts([]);
    let data = [];
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
    let data = [];
    payroll.map((item) => {
      if (item.person.id === person_id) {
        item.perceptions.map((p) => {
          if (p.type == "046") {
            perceptions.push(p);
            return;
          }
        });
        data.push({
          person_id: person_id,
          perceptions: perceptions,
          deductions: deductions,
          other_payments: otherPayments,
        });
      } else {
        data.push({
          person_id: item.person.id,
          perceptions: item.perceptions,
          deductions: item.deductions.filter(
            (item) => item.type != "001" && item.type != "002"
          ),
          other_payments: item.otherPayments,
        });
      }
    });
    clearConcept();
    calendar.payroll = data;
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
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      destroyOnClose={true}
      footer={
        <Col>
          <Space>
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
            otherPayments.length > 0 ? (
              <Button
                size="large"
                htmlType="button"
                disabled={ceros && currentStep == 2 ? true : false}
                onClick={() =>
                  currentStep == 2 ? createObjectSend() : listConcepts()
                }
                style={{ paddingLeft: 50, paddingRight: 50 }}
              >
                {currentStep == 2 ? "Guardar" : "Siguiente"}
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
      title="Conceptos de nómina"
    >
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
              otherPayments.length > 0
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
          {currentStep == 0 ? (
            <>
              {perceptionsCat.length > 0 && (
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
              {deductionsCat.length > 0 && (
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
              {otherPaymentsCat.length > 0 && (
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
                    <div>{record.data_type == 2 ? record.value : 0}</div>
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
                        : `$ 0.00`}
                    </div>
                  )}
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
                          onClick={() => listConcepts()}
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
  };
};

export default connect(mapState)(ModalConceptsPayroll);
