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
  InputNumber,
  DatePicker,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import SelectPerson from "../selects/SelectPerson";
import details from "../../pages/holidays/[id]/details";
import Axios from "axios";
import { API_URL } from "../../config/config";

const Lendingform = (props) => {
  const [form] = Form.useForm();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;

  const route = useRouter();

  const [personList, setPersonList] = useState([]);
  const [payment, setPayment] = useState(null);
  const [amount, setAmount] = useState(null);

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
      console.log("error", error);
    }
  };

  const getPayment = () => {
    let formAmount = form.getFieldValue("amount");
    let formDeadline = form.getFieldValue("deadline");

    formAmount = formAmount ? parseFloat(formAmount) : 0;
    formDeadline = formDeadline ? parseInt(formDeadline) : 1;

    console.log(formAmount);
    console.log(formDeadline);
    /* let paym = formAmount/formDeadline; */

    /* PARA TOMAR EN CUENTA EL INTERES */
    let paym = 0;

    if (props.config.interest === 0) {
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

  useEffect(() => {
    getPersons();
    if (props.details) {
      console.log("details", props.details);
      form.setFieldsValue({
        person: props.details.person.id,
        type: props.details.type,
        amount: props.details.amount,
        deadline: parseInt(props.details.deadline),
        periodicity: props.details.periodicity,
        periodicity_amount: props.details.periodicity_amount,
        reason: props.details.reason,
      });
      getPayment();
      //form.setFieldsValue({ type: props.details.type });
    }
  }, [route]);

  /*  */
  /* const onNumberChange = (value, e) => {
        if (Number.isNaN(value)) {
          return;
        }
        setAmount(value);
      }; */

  const ruleRequired = {
    required: true,
    message: "Este campo es requerido",
  };

  return (
    <Form form={form} layout="horizontal" onFinish={props.onFinish}>
      <Row justify={"start"}>
        <Col span={24}>
          <Title key="dats_gnrl" level={4}>
            Nueva solicitud de préstamo
          </Title>
        </Col>
        <Col span="8">
          <Form.Item
            label="Colaborador"
            name="person"
            labelCol={{ span: 10 }}
            labelAlign={"left"}
            rules={[ruleRequired]}
          >
            <Select
              key="selectPerson"
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Todos"
              value={props.defaultValue}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {personList
                ? personList.map((item) => {
                    return (
                      <Option key={item.key} value={item.value}>
                        {item.label}
                      </Option>
                    );
                  })
                : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="Tipo de préstamo"
            labelCol={{ span: 10 }}
            labelAlign={"left"}
            rules={[ruleRequired]}
          >
            <Select options={TypeOptions} allowClear />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Cantidad solicitada"
            labelCol={{ span: 10 }}
            labelAlign={"left"}
            rules={[ruleRequired]}
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
          <Form.Item
            name="deadline"
            label="Plazos"
            labelCol={{ span: 10 }}
            labelAlign={"left"}
            rules={[ruleRequired]}
          >
            <InputNumber onChange={getPayment} style={{ width: "100%" }} />
            {/* <InputNumber style={{ width: '100%' }} onChange={getPayment}/> */}
          </Form.Item>
          <Form.Item
            name="periodicity"
            label="Periodicidad"
            labelCol={{ span: 10 }}
            labelAlign={"left"}
            rules={[ruleRequired]}
          >
            <Select options={periodicityOptions} />
          </Form.Item>
          <Form.Item
            name="periodicity_amount"
            label="Pago"
            labelCol={{ span: 10 }}
            labelAlign={"left"}
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
        <Col span={19} style={{ textAlign: "right" }}>
          <Form.Item
            label="Motivo"
            name="reason"
            labelCol={{ span: 4 }}
            labelAlign={"left"}
          >
            <TextArea rows="4" style={{ marginLeft: 6 }} />
          </Form.Item>
          <Button
            onClick={() => route.push("/lending")}
            key="cancel"
            style={{ padding: "0 50px" }}
          >
            {props.edit ? "Regresar" : "Cancelar"}
          </Button>
          {props.edit ? (
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
          ) : null}
          {props.edit ? (
            <Button
              disabled={props.sending}
              onClick={props.onApprove}
              type="primary"
              key="aprove"
              style={{ padding: "0 50px", marginLeft: 15 }}
            >
              Aprobar préstamo
            </Button>
          ) : null}

          <Button
            loading={props.sending}
            key="save"
            htmlType="submit"
            type="primary"
            style={{ padding: "0 50px", marginLeft: 15 }}
          >
            {props.edit ? "Actualizar datos" : "Guardar"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Lendingform;
