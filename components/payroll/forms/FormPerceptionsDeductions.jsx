import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Select,
  Input,
  Form,
  message,
  Space,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import webApiFiscal from "../../../api/WebApiFiscal";
import { ruleRequired, treeDecimal } from "../../../utils/rules";

const FormPerceptionsDeductions = ({
  setIsModalVisible,
  person_id = null,
  setObjectStamp = null,
  payroll = null,
  setLoading,
  saveConcepts,
}) => {
  const [formQuantity] = Form.useForm();
  const { Column } = Table;
  const [perceptions, setPerceptions] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [otherPayments, setOtherPayments] = useState([]);
  const [concept, setConcept] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [indexData, setIndexData] = useState(null);

  const optionsConcept = [
    { value: 1, label: "Percepciones" },
    { value: 2, label: "Deducciones" },
    { value: 3, label: "Otros tipos de pagos" },
  ];

  /** Get initial values */
  const getPerceptions = async () => {
    let response = await webApiFiscal.getPerseptions();

    if (response.data.results.length > 0) {
      let perceptions = response.data.results.map((a) => {
        return { value: a.code, label: a.description };
      });
      setPerceptions(perceptions);
    }
  };
  const getDeductions = async () => {
    let response = await webApiFiscal.getDeductions();
    if (response.data.results.length > 0) {
      let deductions = response.data.results.map((a) => {
        return { value: a.code, label: a.description };
      });
      setDeductions(deductions);
    }
  };
  const getOtherPayments = async () => {
    let response = await webApiFiscal.getOtherPayments();
    if (response.data.results.length > 0) {
      let other_payments = response.data.results.map((a) => {
        return { value: a.code, label: a.description };
      });
      setOtherPayments(other_payments);
    }
  };

  /** Events */

  const changeConcept = (value) => {
    setConcept(value);
    formQuantity.setFieldsValue({
      perception: null,
      deduction: null,
      otherpayment: null,
    });
  };

  const onCancel = () => {
    formQuantity.resetFields();
    setIsModalVisible(false);
  };

  const formFinish = (value) => {
    let tempArray = [...dataSource];
    let code = value.perception
      ? value.perception
      : value.deduction
      ? value.deduction
      : value.other_payments;

    let exist = tempArray.filter(
      (item) => item.concept == value.concept && item.code == code
    );
    let label = "";
    if (value.concept === 1) {
      label = perceptions.find((element) => element.value === code);
    } else if (value.concept === 2) {
      label = deductions.find((element) => element.value === code);
    } else if (value.concept === 3) {
      label = otherPayments.find((element) => element.value === code);
    }

    if (exist.length > 0) {
      if (isEdit) {
        let data_source = dataSource.filter((item) => item);
        if (data_source.length > 0) {
          let editData = {
            locked: false,
            concept: value.concept,
            code: code,
            label: label.label,
            amount: value.amount,
          };
          data_source[indexData] = editData;
          setDataSource(data_source);
          formQuantity.resetFields();
        }
      } else {
        message.error("Concepto existente");
      }
    } else {
      let newData = {
        locked: false,
        key: code,
        concept: value.concept,
        label: label.label,
        code: code,
        amount: value.amount,
      };
      setDataSource([...tempArray, newData]);
      formQuantity.resetFields();
      setConcept(null);
    }
  };

  const onCancelForm = () => {
    formQuantity.resetFields();
    setIsEdit(false);
    setIndexData(null);
    setConcept(null);
  };

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
            amount: Number(a.amount),
            taxed_amount: Number(a.taxed_amount),
            exempt_amount: Number(a.exempt_amount),
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
            amount: Number(a.amount),
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
            amount: Number(a.amount),
            taxed_amount: Number(a.taxed_amount),
            exempt_amount: Number(a.exempt_amount),
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

  useEffect(() => {
    /* if (person_id) { */
    getPerceptions();
    getDeductions();
    getOtherPayments();
    /* } */
  }, []);

  useEffect(() => {
    if (payroll !== null && payroll.length > 0) {
      let objectPayroll = payroll.find((elem) => elem.person_id == person_id);
      let array_data = [];
      if (objectPayroll) {
        if (objectPayroll.perceptions.length > 0) {
          objectPayroll.perceptions.map((x) => {
            if (x.code) {
              array_data.push({
                locked: x.locked,
                code: x.code,
                key: x.label,
                label: x.label,
                amount: Number(x.amount),
                taxed_amount: Number(x.taxed_amount),
                exempt_amount: Number(x.exempt_amount),
                concept: 1,
              });
            }
          });
        }
        if (objectPayroll.deductions.length > 0) {
          objectPayroll.deductions.map((x) => {
            if (x.code) {
              array_data.push({
                locked: x.locked,
                code: x.code,
                key: x.label,
                label: x.label,
                amount: x.amount,
                concept: 2,
              });
            }
          });
        }
        if (objectPayroll.other_payments.length > 0) {
          objectPayroll.other_payments.map((x) => {
            if (x.code) {
              array_data.push({
                locked: x.locked,
                code: x.code,
                key: x.label,
                label: x.label,
                amount: x.amount,
                exempt_amount: x.exempt_amount,
                taxed_amount: x.taxed_amount,
                concept: 3,
              });
            }
          });
        }
        setDataSource(array_data);
      }
    }
  }, [payroll]);

  useEffect(() => {}, [dataSource]);

  return (
    <>
      <Form
        size="large"
        layout={"vertical"}
        className="form_concept"
        form={formQuantity}
        onFinish={formFinish}
      >
        <Row style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Form.Item name="concept" label="Concepto" rules={[ruleRequired]}>
              <Select
                options={optionsConcept}
                onChange={changeConcept}
                notFoundContent={"No se encontraron resultados."}
              />
            </Form.Item>
          </Col>
          {concept == 1 && (
            <Col span={24}>
              <Form.Item
                name="perception"
                label="Percepción"
                rules={[ruleRequired]}
              >
                <Select
                  options={perceptions}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
          )}
          {concept == 2 && (
            <Col span={24}>
              <Form.Item
                name="deduction"
                label="Deducción"
                rules={[ruleRequired]}
              >
                <Select
                  options={deductions}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
          )}
          {concept == 3 && (
            <Col span={24}>
              <Form.Item
                name="other_payments"
                label="Otro pago"
                rules={[ruleRequired]}
              >
                <Select
                  options={otherPayments}
                  notFoundContent={"No se encontraron resultados."}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={24}>
            <Form.Item
              name="amount"
              label="Monto"
              maxLength={8}
              type="number"
              rules={[treeDecimal, ruleRequired]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"center"}>
          <Space>
            <Button
              htmlType="button"
              onClick={() => onCancelForm()}
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >
              Cancelar
            </Button>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ paddingLeft: 50, paddingRight: 50 }}
            >
              Pre cargar
            </Button>
          </Space>
        </Row>
      </Form>
      <Row justify="center">
        <Col span={24}>
          <Table
            dataSource={dataSource}
            style={{ marginTop: 30 }}
            locale={{ emptyText: "No hay datos aún" }}
          >
            <Column
              title="Concepto"
              dataIndex="perception"
              key="perception"
              render={(text, record) => (
                <div>
                  {record.label}
                  {/* {record.concept == 1
                      ? "Percepcion"
                      : record.concept == 2
                      ? "Deduccion"
                      : "Otros pagos"} */}
                </div>
              )}
            />
            <Column
              width={120}
              title="Monto"
              align="center"
              dataIndex="amount"
              key="amount"
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
        </Col>
        <Col>
          <Space>
            <Button
              size="large"
              htmlType="button"
              onClick={() => onCancel()}
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
      </Row>
    </>
  );
};
export default FormPerceptionsDeductions;
