import {
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import Axios from "axios";
import { API_URL } from "../../config/config";

const FormAddress = ({ person_id = null }) => {
  const { Title } = Typography;
  const [formAddress] = Form.useForm();
  const [idAddress, setIdAddress] = useState("");
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  const typeStreet = [
    {
      label: "Avenida",
      value: 1,
    },
    {
      label: "Boulevard",
      value: 2,
    },
    {
      label: "Calle",
      value: 3,
    },
  ];

  useEffect(() => {
    getAddress();
  }, []);

  /*functions CRUD */
  const getAddress = () => {
    Axios.get(API_URL + `/person/person/${person_id}/address_person/`)
      .then((response) => {
        formAddress.setFieldsValue({
          street_type: response.data[0].street_type,
          street: response.data[0].street,
          numberOne: response.data[0].numberOne,
          numberTwo: response.data[0].numberTwo,
          building: response.data[0].building,
          postalCode: response.data[0].postalCode,
          suburb: response.data[0].suburb,
          location: response.data[0].location,
          reference: response.data[0].reference,
        });
        setIdAddress(response.data[0].id);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const saveAddress = (data) => {
    Axios.post(API_URL + `/person/address/`, data)
      .then((response) => {
        message.success({
          content: "Guardado correctamente.",
          className: "custom-class",
        });

        setIdAddress(response.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateAddress = (data) => {
    Axios.put(API_URL + `/person/address/${idAddress}/`, data)
      .then((response) => {
        message.success({
          content: "Actualizado correctamente.",
          className: "custom-class",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* Events */
  const formAddressPerson = (value) => {
    if (idAddress != "" && idAddress != undefined) {
      updateAddress(value);
    } else {
      value.person = person_id;
      saveAddress(value);
    }
  };

  return (
    <>
      <Row>
        <Title style={{ fontSize: "20px" }}>Dirección</Title>
      </Row>
      <Form layout={"vertical"} form={formAddress} onFinish={formAddressPerson}>
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="street_type"
              label="Tipo de calle"
              rules={[ruleRequired]}
            >
              <Select
                options={typeStreet}
                notFoundContent={"No se encontraron resultado."}
              />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="street" label="Calle" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="numberOne"
              label="Número exterior"
              rules={[ruleRequired]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="numberTwo" label="Número interior">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="building" label="Edificio">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="postalCode"
              label="Código postal"
              rules={[ruleRequired]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="suburb" label="Suburbio" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="location" label="Ubicación" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="reference" label="Referencia">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"end"}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default FormAddress;
