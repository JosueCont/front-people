import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Input,
  Select,
  Modal,
  DatePicker,
} from "antd";
import { useRouter } from "next/router";
import SelectCollaborator from "../selects/SelectCollaborator";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ruleRequired, onlyNumeric } from "../../utils/rules";
import { withAuthSync } from "../../libs/auth";
import { connect } from "react-redux";
import WebApiPayroll from "../../api/WebApiPayroll";
import moment from "moment";

const Lendingform = (props) => {
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { confirm } = Modal;

  const route = useRouter();
  const [permissions, setPermissions] = useState({});
  const [disbPeriodicity, setDisbPeriodicity] = useState(false);
  const TypeOptions = [{ value: "EMP", label: "Empresa", key: "type1" }];

  const periodicityOptions = [
    { value: 2, label: "Semanal", key: "p1" },
    { value: 10, label: "Decenal", key: "p2" },
    { value: 3, label: "Catorcenal", key: "p3" },
    { value: 4, label: "Quincenal", key: "p4" },
    { value: 5, label: "Mensual", key: "p5" },
  ];

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  const getPayment = () => {
    let formAmount = Number(form.getFieldValue("amount"));
    let formDeadline = Number(form.getFieldValue("deadline"));
    if (formAmount && formDeadline) {
      formAmount = formAmount ? parseFloat(formAmount) : 0;
      formDeadline = formDeadline ? parseInt(formDeadline) : 1;
      let paym = 0;

      if (props.config && props.config.interest === 0) {
        paym = formAmount / formDeadline;
      } else {
        paym =
          (formAmount + formAmount * (props.config.interest / 100)) /
          formDeadline;
      }
      form.setFieldsValue({
        periodicity_amount: paym,
      });
    } else {
      form.setFieldsValue({
        periodicity_amount: "",
      });
    }
  };

  const changePerson = async (value) => {
    if (value) {
      WebApiPayroll.getPayrollPerson(value)
        .then(function (response) {
          if (response.data) {
            form.setFieldsValue({
              periodicity: parseInt(response.data.periodicity),
            });
            setDisbPeriodicity(true);
          }
        })
        .catch(function (error) {
          form.setFieldsValue({
            periodicity: null,
          });
          setDisbPeriodicity(false);
          console.log("Error", error);
        });
    } else {
      form.setFieldsValue({
        periodicity: null,
      });
      setDisbPeriodicity(false);
    }
  };

  const showMoalapprove = () => {
    confirm({
      title: "¿Está seguro de aprobar la siguiente solicitud de préstamo?",
      icon: <ExclamationCircleOutlined />,
      okText: "Aceptar y notificar",
      cancelText: "Cancelar",
      onOk() {
        props.onApprove();
      },
    });
  };

  useEffect(() => {
    if (props.details) {
      changePerson(props.details.person.id);
      form.setFieldsValue({
        person: props.details.person.id,
        type: props.details.type,
        amount: parseFloat(props.details.amount),
        deadline: parseInt(props.details.deadline),
        periodicity: props.details.periodicity,
        periodicity_amount: props.details.periodicity_amount,
        reason: props.details.reason,
        reference: props.details.reference,
        date_apply_discount: props.details.date_apply_discount
          ? moment(props.details.date_apply_discount, "YYYY-MM-DD")
          : null,
        discount_start_date: props.details.discount_start_date
          ? moment(props.details.discount_start_date, "YYYY-MM-DD")
          : null,
        loan_granting_date: props.details.discount_start_date
          ? moment(props.details.loan_granting_date, "YYYY-MM-DD")
          : "",
      });

      getPayment();
    }
  }, [route]);

  const ruleAmount = ({ getFieldValue }) => ({
    validator() {
      if (Number(getFieldValue("amount"))) {
        let amount = Number(getFieldValue("amount"));
        if (
          amount >= Number(props.config.min_amount) &&
          amount <= Number(props.config.max_amount)
        ) {
          return Promise.resolve();
        } else {
          if (amount < Number(props.config.min_amount)) {
            form.setFieldsValue({
              periodicity_amount: "",
            });
            return Promise.reject(
              `La cantidad no puede ser menor a ${props.config.min_amount}`
            );
          }
          if (amount > props.config.max_amount) {
            form.setFieldsValue({
              periodicity_amount: "",
            });
            return Promise.reject(
              `La cantidad no puede ser mayor a ${props.config.max_amount}`
            );
          }
        }
      } else {
        return Promise.reject(`Ingrese valores numericos`);
      }
    },
  });
  const ruleDeadline = ({ getFieldValue }) => ({
    validator() {
      if (Number(getFieldValue("deadline"))) {
        let amount = Number(getFieldValue("deadline"));
        if (
          amount >= props.config.min_deadline &&
          amount <= props.config.max_deadline
        ) {
          return Promise.resolve();
        } else {
          if (amount < props.config.min_deadline) {
            form.setFieldsValue({
              periodicity_amount: "",
            });
            return Promise.reject(
              `El plazo no puede ser menor a ${props.config.min_deadline}`
            );
          }
          if (amount > props.config.max_deadline) {
            form.setFieldsValue({
              periodicity_amount: "",
            });
            return Promise.reject(
              `El plazo no puede ser mayor a ${props.config.max_deadline}`
            );
          }
        }
      } else {
        return Promise.reject(`Ingrese valores numericos`);
      }
    },
  });

  return (
    <Form form={form} layout="vertical" onFinish={props.onFinish}>
      <Row gutter={24}>
        <Col span={24}>
          <Title key="dats_gnrl" level={4}>
            Nueva solicitud de préstamo
          </Title>
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <SelectCollaborator
            label="Colaborador"
            name="person"
            labelCol={{ span: 24 }}
            onChange={changePerson}
            rules={[ruleRequired]}
          />
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="type"
            label="Tipo de préstamo"
            labelCol={{ span: 24 }}
            rules={[ruleRequired]}
          >
            <Select
              options={TypeOptions}
              allowClear
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            name="date_apply_discount"
            label="Fecha para aplicar descuento"
            rules={[ruleRequired]}
          >
            <DatePicker
              disabled={props.readOnly}
              key="date_apply_discount"
              style={{ width: "100%" }}
              onChange={props.changeDateApplyDiscount}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            name="discount_start_date"
            label="Fecha de inicio de descuento"
            rules={[ruleRequired]}
          >
            <DatePicker
              disabled={props.readOnly}
              key="discount_start_date"
              style={{ width: "100%" }}
              onChange={props.changeDiscountStartDate}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            name="loan_granting_date"
            label="Fecha de otorgamiento de prestamo"
            rules={[ruleRequired]}
          >
            <DatePicker
              disabled={props.readOnly}
              key="loan_granting_date"
              style={{ width: "100%" }}
              onChange={props.changeLoanGratingDate}
            />
          </Form.Item>
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="reference"
            label="Referencia"
            labelCol={{ span: 24 }}
            rules={[ruleRequired]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="amount"
            label="Cantidad solicitada"
            labelCol={{ span: 24 }}
            rules={[ruleRequired, ruleAmount]}
          >
            <Input onChange={getPayment} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="deadline"
            label="Plazos"
            labelCol={{ span: 24 }}
            rules={[ruleRequired, ruleDeadline]}
          >
            <Input style={{ width: "100%" }} onChange={getPayment} />
          </Form.Item>
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="periodicity"
            label="Periodicidad"
            labelCol={{ span: 24 }}
            rules={[ruleRequired]}
          >
            <Select
              disabled={disbPeriodicity}
              options={periodicityOptions}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="periodicity_amount"
            label="Pago"
            labelCol={{ span: 24 }}
          >
            <Input
              style={{ width: "100%" }}
              readOnly
              precision={2}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Motivo" name="reason" labelCol={{ span: 24 }}>
            <TextArea rows="4" style={{ marginLeft: 6 }} />
          </Form.Item>
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            onClick={() => route.push("/lending")}
            key="cancel"
            style={{ padding: "0 30px", marginBottom: 5 }}
          >
            {props.edit ? "Regresar" : "Cancelar"}
          </Button>
          {permissions.reject_loan
            ? props.edit && (
                <Button
                  disabled={props.sending}
                  danger
                  onClick={props.onReject}
                  key="reject"
                  type="primary"
                  style={{ padding: "0 30px", marginLeft: 15, marginBottom: 5 }}
                >
                  Rechazar
                </Button>
              )
            : null}
          {permissions.approve_loan
            ? props.edit && (
                <Button
                  disabled={props.sending}
                  onClick={showMoalapprove}
                  type="primary"
                  className={"btn-success"}
                  key="aprove"
                  style={{ padding: "0 30px", marginLeft: 15, marginBottom: 5 }}
                >
                  Aprobar préstamo
                </Button>
              )
            : null}

          <Button
            loading={props.sending}
            key="save"
            htmlType="submit"
            type="primary"
            style={{ padding: "0 30px", marginLeft: 15 }}
          >
            {props.edit ? "Actualizar" : "Guardar"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const mapState = (state) => {
  return {
    permissions: state.userStore.permissions.loan,
  };
};

export default connect(mapState)(withAuthSync(Lendingform));
