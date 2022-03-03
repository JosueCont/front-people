import React, { useEffect, useState } from "react";
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
  setObjectStamp = null,
  payroll = null,
  setLoading,
  saveConcepts,
  ...props
}) => {
  const [formQuantity] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [concept, setConcept] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [indexData, setIndexData] = useState(null);

  const editAmount = (data, index) => {
    setIndexData(index);
    setIsEdit(true);
    setConcept(data.concept);
    formQuantity.setFieldsValue({
      concept: data.concept,
      perception: data.concept == 1 ? data.code : null,
      deduction: data.concept == 2 ? data.code : null,
      other_payments: data.concept == 3 ? data.code : null,
      amount: data.amount,
    });
  };

  const deleteAmount = (index) => {
    if (!isEdit) {
      let data_Source = dataSource.slice();
      data_Source.splice(index, 1);
      setDataSource(data_Source);
    }
  };

  const saveData = () => {
    setLoading(true);
    if (dataSource.length > 0) {
      let perceptions_list = [];
      let deductions_list = [];
      let other_payments_list = [];

      dataSource.map((a) => {
        if (a.concept === 1) {
          let label_perception = perceptions.find(
            (element) => element.value === a.code
          );
          perceptions_list.push({
            locked: a.locked,
            label: label_perception.label,
            concept: label_perception.label,
            key: a.code,
            code: a.code,
            amount: numberFormat(a.amount),
            taxed_amount: numberFormat(a.taxed_amount),
            exempt_amount: numberFormat(a.exempt_amount),
          });
        }
        if (a.concept === 2) {
          let label_deduction = deductions.find(
            (element) => element.value === a.code
          );
          deductions_list.push({
            locked: a.locked,
            label: label_deduction.label,
            concept: label_deduction.label,
            key: a.code,
            code: a.code,
            amount: numberFormat(a.amount),
          });
        }
        if (a.concept === 3) {
          let label_otherPayments = otherPayments.find(
            (element) => element.value === a.code
          );
          other_payments_list.push({
            locked: a.locked,
            label: label_otherPayments.label,
            concept: label_otherPayments.label,
            key: a.code,
            code: a.code,
            amount: numberFormat(a.amount),
            taxed_amount: numberFormat(a.taxed_amount),
            exempt_amount: numberFormat(a.exempt_amount),
          });
        }
      });

      saveConcepts({
        person_id: person_id,
        perceptions: perceptions_list,
        deductions: deductions_list,
        other_payments: other_payments_list,
      });
      setIsModalVisible(false);
    } else {
      setObjectStamp({
        person_id: person_id,
        perceptions: [],
        deductions: [],
        other_payments: [],
      });
      setIsModalVisible(false);
    }
  };

  // useEffect(() => {
  //   if (payroll !== null && payroll.length > 0) {
  //     let objectPayroll = payroll.find((elem) => elem.person_id == person_id);
  //     let array_data = [];
  //     if (objectPayroll) {
  //       if (objectPayroll.perceptions.length > 0) {
  //         objectPayroll.perceptions.map((x) => {
  //           if (x.code) {
  //             array_data.push({
  //               locked: x.locked,
  //               code: x.code,
  //               key: x.label,
  //               label: x.label,
  //               amount: Number(x.amount),
  //               taxed_amount: Number(x.taxed_amount),
  //               exempt_amount: Number(x.exempt_amount),
  //               concept: 1,
  //             });
  //           }
  //         });
  //       }
  //       if (objectPayroll.deductions.length > 0) {
  //         objectPayroll.deductions.map((x) => {
  //           if (x.code) {
  //             array_data.push({
  //               locked: x.locked,
  //               code: x.code,
  //               key: x.label,
  //               label: x.label,
  //               amount: x.amount,
  //               concept: 2,
  //             });
  //           }
  //         });
  //       }
  //       if (objectPayroll.other_payments.length > 0) {
  //         objectPayroll.other_payments.map((x) => {
  //           if (x.code) {
  //             array_data.push({
  //               locked: x.locked,
  //               code: x.code,
  //               key: x.label,
  //               label: x.label,
  //               amount: x.amount,
  //               exempt_amount: x.exempt_amount,
  //               taxed_amount: x.taxed_amount,
  //               concept: 3,
  //             });
  //           }
  //         });
  //       }
  //       setDataSource(array_data);
  //     }
  //   }
  // }, [payroll]);

  const RenderCheckConcept = ({ data }) => {
    return (
      <>
        {data.map((item) => {
          return (
            <Col span={12}>
              <Checkbox className="CheckGroup" value={item.code}>
                {item.description}.
              </Checkbox>
            </Col>
          );
        })}
      </>
    );
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
            <Button
              size="large"
              htmlType="button"
              onClick={() => saveData()}
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >
              Guardar
            </Button>
          </Space>
        </Col>
      }
      width={"60%"}
      onCancel={() => setVisible(false)}
      title="Conceptos de nomina"
    >
      <Row>
        <Steps current={currentStep} onChange={(item) => setCurrentStep(item)}>
          <Step title="Conceptos" description="Agregar conceptos" />
          <Step title="Montos" description="Capturar valores" />
          <Step
            title="Previsualizar"
            description="Previsualizacion de conceptos"
          />
        </Steps>
        <Card hoverable style={{ width: "100%" }}>
          {currentStep == 0 ? (
            <>
              {props.perceptions.length > 0 && (
                <Checkbox.Group className="CheckGroup">
                  <Row>
                    <RenderCheckConcept data={props.perceptions} />
                  </Row>
                </Checkbox.Group>
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
  return { perceptions: state.fiscalStore.cat_perceptions };
};

export default connect(mapState)(ModalConceptsPayroll);
