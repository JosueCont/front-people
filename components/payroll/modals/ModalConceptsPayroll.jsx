import React, { useState } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Form,
  Space,
  Modal,
  Steps,
  Card,
  Checkbox,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { numberFormat } from "../../../utils/functions";
import { connect } from "react-redux";

const { Step } = Steps;
const { Column } = Table;

const ModalConceptsPayroll = ({
  setVisible,
  visible,
  person_id = null,
  payroll = null,
  setLoading,
  saveConcepts,
  ...props
}) => {
  const [formQuantity] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  const RenderCheckConcept = ({ data }) => {
    return (
      <>
        {data.map((item) => {
          return (
            <Col span={12}>
              <Checkbox
                key={item.code}
                className="CheckGroup"
                value={{ id: item.id, value: 0, data_type: item.data_type }}
              >
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

  const onChangeCheckConcepts = (checkedValues, type) => {
    if (type === 1) setPerceptions(checkedValues);
    if (type === 2) setDeductions(checkedValues);
    if (type === 3) setOtherPayments(checkedValues);
  };

  return (
    <Modal
      visible={visible}
      footer={
        <Col>
          <Space>
            <Button
              size="large"
              htmlType="button"
              onClick={() => setVisible(false)}
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >
              Cancelar
            </Button>
            {currentStep == 2 && (
              <Button
                size="large"
                htmlType="button"
                onClick={() => saveData()}
                style={{ paddingLeft: 50, paddingRight: 50 }}
              >
                Guardar
              </Button>
            )}
          </Space>
        </Col>
      }
      width={"90%"}
      centered={true}
      onCancel={() => setVisible(false)}
      title="Conceptos de nomina"
    >
      <Row>
        <Steps current={currentStep} onChange={(item) => setCurrentStep(item)}>
          <Step title="Conceptos" description="Agregar conceptos" />
          <Step title="Montos" description="Capturar valores" />
          <Step title="Finalizar" description="Finalizar" />
        </Steps>
        <Card hoverable>
          {currentStep == 0 ? (
            <>
              {props.perceptions_int.length > 0 && (
                <>
                  <h2>Percepsiones</h2>
                  <Checkbox.Group
                    className="CheckGroup"
                    onChange={(checkedValues) =>
                      onChangeCheckConcepts(checkedValues, 1)
                    }
                  >
                    <Row>
                      <RenderCheckConcept
                        data={props.perceptions_int}
                        type={1}
                      />
                    </Row>
                  </Checkbox.Group>
                </>
              )}
              {props.deductions_int.length > 0 && (
                <>
                  <hr />
                  <h2>Deducciones</h2>
                  <Checkbox.Group
                    className="CheckGroup"
                    onChange={(checkedValues) =>
                      onChangeCheckConcepts(checkedValues, 2)
                    }
                  >
                    <Row>
                      <RenderCheckConcept
                        data={props.deductions_int}
                        type={2}
                      />
                    </Row>
                  </Checkbox.Group>
                </>
              )}
              {props.other_payments_int.length > 0 && (
                <>
                  <hr />
                  <h2>Otros pagos</h2>
                  <Checkbox.Group
                    className="CheckGroup"
                    onChange={(checkedValues) =>
                      onChangeCheckConcepts(checkedValues, 3)
                    }
                  >
                    <Row>
                      <RenderCheckConcept
                        data={props.other_payments_int}
                        type={3}
                      />
                    </Row>
                  </Checkbox.Group>
                </>
              )}
            </>
          ) : currentStep == 1 ? (
            "Dos"
          ) : (
            <Table
              dataSource={dataSource}
              locale={{ emptyText: "No hay datos aún" }}
            >
              <Column
                title="Concepto"
                dataIndex="perception"
                key="perception"
                render={(text, record) => <div>{record.label}</div>}
              />
              <Column
                width={120}
                title="Monto"
                align="center"
                dataIndex="amount"
                key="amount"
                render={(text, record) => (
                  <div>{numberFormat(record.amount)}</div>
                )}
              />
              <Column
                width={100}
                title="Opciones"
                dataIndex="options"
                key="options"
                align="center"
                render={(text, record, index) =>
                  !record.locked && (
                    <>
                      <EditOutlined
                        style={{ marginRight: "10px" }}
                        key={"edit" + record.perception}
                        onClick={() => editAmount(record, index)}
                      />
                      <DeleteOutlined
                        key={"delete" + record.perception}
                        onClick={() => deleteAmount(index)}
                      />
                    </>
                  )
                }
              />
            </Table>
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
