import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button, Select, Input, Form, message } from "antd";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { userCompanyId } from "../../../libs/auth";
import webApiPayroll from "../../../api/webApiPayroll";
import { StepContent } from "@material-ui/core";
import { Receipt, Reorder } from "@material-ui/icons";
import { treeDecimal } from "../../../utils/constant";

const FormPerceptionsDeductions = ({
  setIsModalVisible,
  person_id = null,
  setObjectStamp = null,
}) => {
  const [formQuantity] = Form.useForm();
  const { Column } = Table;
  const ruleRequired = { required: true, message: "Este campo es requerido" };
  const [perceptions, setPerceptions] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [otherPayments, setOtherPayments] = useState([]);
  const [concept, setConcept] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  // const [isEdit, setIsEdit] = useState(false);

  const optionsConcept = [
    { value: 1, label: "Percepciones" },
    { value: 2, label: "Deducciones" },
    { value: 3, label: "Otros tipos de pagos" },
  ];

  useEffect(() => {
    if (person_id) {
      getPerceptions();
      getDeductions();
      getOtherPayments();
    }
  }, [person_id]);

  const getPerceptions = async () => {
    let response = await webApiPayroll.getPerseptions();
    if (response.data.results.length > 0) {
      let perceptions = response.data.results.map((a) => {
        return { value: a.code, label: a.description };
      });
      setPerceptions(perceptions);
    }
  };
  const getDeductions = async () => {
    let response = await webApiPayroll.getDeductions();
    if (response.data.results.length > 0) {
      let deductions = response.data.results.map((a) => {
        return { value: a.code, label: a.description };
      });
      setDeductions(deductions);
    }
  };
  const getOtherPayments = async () => {
    let response = await webApiPayroll.getOtherPayments();
    if (response.data.results.length > 0) {
      let other_payments = response.data.results.map((a) => {
        return { value: a.code, label: a.description };
      });
      setOtherPayments(other_payments);
    }
  };

  const changeConcept = (value) => {
    // console.log("Valor", value);
    setConcept(value);
    formQuantity.setFieldsValue({
      perception: null,
      deduction: null,
      otherpayment: null,
    });
  };

  const formFinish = (value) => {
    let code = value.perception
      ? value.perception
      : value.deduction
      ? value.deduction
      : value.others_payments;
    let exist = dataSource.filter(
      (item) => item.concept == value.concept && item.code == code
    );
    if (exist.length > 0) {
      message.error("Concepto existente");
    } else {
      let newData = {
        concept: value.concept,
        code: code,
        amount: value.amount,
        key: value.perception
          ? "P-" + value.perception
          : value.deduction
          ? "D-" + value.deduction
          : "O-" + value.others_payments,
      };
      setDataSource([...dataSource, newData]);
      formQuantity.resetFields();
    }
  };

  // const editAmount = (data) => {
  //   setIsEdit(true);
  //   formQuantity.setFieldsValue({
  //     concept: data.concept,
  //     perception: data.concept == 1 ? data.perception : null,
  //     deduction: data.concept == 2 ? data.deduction : null,
  //     others_payments: data.concept == 3 ? data.others_payments : null,
  //     amount: data.amount,
  //   });
  // };

  const deleteAmount = (data) => {
    let data_Source = dataSource.filter((item) => item.code !== data.code);
    setDataSource(data_Source);
  };

  const saveData = () => {
    if (dataSource.length > 0) {
      let perceptions = [];
      dataSource.map((a) => {
        if (a.concept == 1) {
          perceptions.push({ code: a.code, amount: Number(a.amount) });
        }
      });
      console.log("Percepciones", perceptions);

      let deductions = [];
      dataSource.map((a) => {
        if (a.concept == 2) {
          deductions.push({ code: a.code, amount: Number(a.amount) });
        }
      });
      console.log("Deducciones", deductions);

      let others_payments = [];
      dataSource.map((a) => {
        if (a.concept == 3) {
          others_payments.push({ code: a.code, amount: Number(a.amount) });
        }
      });
      console.log("Deducciones", others_payments);
      setObjectStamp({
        person_id: person_id,
        perceptions: perceptions,
        deductions: deductions,
        others_payments: others_payments,
      });
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    if (concept) {
    }
  }, [concept]);

  return (
    <>
      <Col span={24}>
        <Form layout={"vertical"} form={formQuantity} onFinish={formFinish}>
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
                  name="others_payments"
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
          <Row justify={"end"}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Agregar
              </Button>
            </Form.Item>
          </Row>
        </Form>
        <Row justify="center">
          <Col span={24}>
            <Table dataSource={dataSource}>
              <Column
                title="Concepto"
                dataIndex="perception"
                key="perception"
                render={(text, record) => (
                  <div>
                    {record.concept == 1
                      ? "Percepcion"
                      : record.concept == 2
                      ? "Deduccion"
                      : "Otros pagos"}
                  </div>
                )}
              />
              <Column title="Monto" dataIndex="amount" key="amount" />
              <Column
                title="Opciones"
                dataIndex="options"
                key="options"
                render={(text, record) => (
                  <>
                    {/* <EditOutlined
                      style={{ marginRight: "10px" }}
                      key={"edit" + record.perception}
                      onClick={() => editAmount(record)}
                    /> */}
                    <DeleteOutlined
                      key={"delete" + record.perception}
                      onClick={() => deleteAmount(record)}
                    />
                  </>
                )}
              />
            </Table>
          </Col>
        </Row>
        <Col span={24}>
          <Button
            htmlType="button"
            style={{ marginRight: 10 }}
            onClick={() => setIsModalVisible(false)}
          >
            Cancelar
          </Button>
          <Button
            htmlType="button"
            style={{ marginRight: 10 }}
            onClick={() => saveData()}
          >
            Guardar
          </Button>
        </Col>
      </Col>
    </>
  );
};
export default FormPerceptionsDeductions;
