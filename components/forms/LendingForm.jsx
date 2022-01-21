import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Input,
  Image,
  Select,
  Modal,
  InputNumber,
  DatePicker,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import SelectCollaborator from "../selects/SelectCollaborator";
import details from "../../pages/holidays/[id]/details";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import jsCookie from "js-cookie";

const Lendingform = (props) => {
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const { confirm } = Modal;

  const route = useRouter();

  const [personList, setPersonList] = useState([]);
  const [payment, setPayment] = useState(null);
  const [amount, setAmount] = useState(null);
  const [permissions, setPermissions] = useState({});

  /* Options List */
  const TypeOptions = [
    { value: "EMP", label: "Empresa", key: "type1" },
    // { value: "EPS", label: "E-Pesos", key: "type_2" },
  ];

  const periodicityOptions = [
    { value: 1, label: "Semanal", key: "p1" },
    { value: 2, label: "Catorcenal", key: "p2" },
    { value: 3, label: "Quincenal", key: "p3" },
    { value: 4, label: "Mensual", key: "p4" },
  ];

  const getPersons = async () => {
    try {
      let response = await Axios.get(API_URL + `/person/person/`);
      let data = response.data.results;
      let list = [];
      data = data.map((a, index) => {
        let item = {
          label: a.first_name + " " + a.flast_name,
          value: props.khonnect_id ? a.khonnect_id : a.id,
          key: a.id + index,
        };
        list.push(item);
      });
      setPersonList(list);
    } catch (error) {
      console.log(error);
    }
  };

  const getPayment = () => {
    let formAmount = form.getFieldValue("amount");
    let formDeadline = form.getFieldValue("deadline");

    formAmount = formAmount ? parseFloat(formAmount) : 0;
    formDeadline = formDeadline ? parseInt(formDeadline) : 1;
    /* let paym = formAmount/formDeadline; */

    /* PARA TOMAR EN CUENTA EL INTERES */
    let paym = 0;

    if (props.config && props.config.interest === 0) {
      paym = formAmount / formDeadline;
    } else {
      paym =
        (formAmount + formAmount * (props.config.interest / 100)) /
        formDeadline;
    }

    /* setPayment(paym) */
    form.setFieldsValue({
      periodicity_amount: paym,
    });
  };

  const showMoalapprove = () => {
    /* props.onApprove */
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
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    getPersons();
    if (props.details) {
      form.setFieldsValue({
        person: props.details.person.id,
        type: props.details.type,
        amount: parseFloat(props.details.amount),
        deadline: parseInt(props.details.deadline),
        periodicity: props.details.periodicity,
        periodicity_amount: props.details.periodicity_amount,
        reason: props.details.reason,
      });
      getPayment();
      //form.setFieldsValue({ type: props.details.type });
    }
  }, [route]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.loan.can.view")) perms.view = true;
      if (a.includes("people.loan.can.create")) perms.create = true;
      if (a.includes("people.loan.can.edit")) perms.edit = true;
      if (a.includes("people.loan.can.delete")) perms.delete = true;
      if (a.includes("people.loan.function.configure_loan"))
        perms.config = true;
      if (a.includes("people.loan.function.approve_loan")) perms.approve = true;
      if (a.includes("people.loan.function.reject_loan")) perms.reject = true;
    });
    setPermissions(perms);
  };

  const ruleRequired = {
    required: true,
    message: "Este campo es requerido",
  };
  const ruleAmount = ({ getFieldValue }) => ({
    validator() {
      if (
        getFieldValue("amount") >= props.config.min_amount &&
        getFieldValue("amount") <= props.config.max_amount
      ) {
        return Promise.resolve();
      } else {
        if (getFieldValue("amount") < props.config.min_amount)
          return Promise.reject(
            `La cantidad no puede ser menor a ${props.config.min_amount}`
          );
        if (getFieldValue("amount") > props.config.max_amount)
          return Promise.reject(
            `La cantidad no puede ser mayor a ${props.config.max_amount}`
          );
      }
    },
  });
  const ruleDeadline = ({ getFieldValue }) => ({
    validator() {
      if (
        getFieldValue("deadline") >= props.config.min_deadline &&
        getFieldValue("deadline") <= props.config.max_deadline
      ) {
        return Promise.resolve();
      } else {
        if (getFieldValue("deadline") < props.config.min_deadline)
          return Promise.reject(
            `El plazo no puede ser menor a ${props.config.min_deadline}`
          );
        if (getFieldValue("deadline") > props.config.max_deadline)
          return Promise.reject(
            `El plazo no puede ser mayor a ${props.config.max_deadline}`
          );
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
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="amount"
            label="Cantidad solicitada"
            labelCol={{ span: 24 }}
            rules={[ruleRequired, ruleAmount]}
          >
            <InputNumber
              onChange={getPayment}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
            {/* <InputNumber style={{ width: '100%' }} /> */}
          </Form.Item>
        </Col>
        <Col xxl={12} xl={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="deadline"
            label="Plazos"
            labelCol={{ span: 24 }}
            rules={[ruleRequired, ruleDeadline]}
          >
            <InputNumber style={{ width: "100%" }} onChange={getPayment} />
            {/* <InputNumber style={{ width: '100%' }} onChange={getPayment}/> */}
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
            <InputNumber
              style={{ width: "100%" }}
              readOnly
              precision={2}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
            {/* <Input/> */}
            {/* <InputNumber style={{ width: '100%' }} /> */}
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
            style={{ padding: "0 50px" }}
          >
            {props.edit ? "Regresar" : "Cancelar"}
          </Button>
          {permissions.reject
            ? props.edit && (
                <Button
                  disabled={props.sending}
                  danger
                  onClick={props.onReject}
                  key="reject"
                  type="primary"
                  style={{ padding: "0 50px", marginLeft: 15 }}
                >
                  Rechazar
                </Button>
              )
            : null}
          {permissions.approve
            ? props.edit && (
                <Button
                  disabled={props.sending}
                  onClick={showMoalapprove}
                  type="primary"
                  className={"btn-success"}
                  key="aprove"
                  style={{ padding: "0 50px", marginLeft: 15 }}
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
            style={{ padding: "0 50px", marginLeft: 15 }}
          >
            {props.edit ? "Actualizar" : "Guardar"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Lendingform;
