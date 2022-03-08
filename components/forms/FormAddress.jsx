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
import { typeStreet } from "../../utils/constant";
import WebApiPeople from "../../api/WebApiPeople";
import { ruleRequired } from "../../utils/rules";

const FormAddress = ({ person_id }) => {
  const { Title } = Typography;
  const [formAddress] = Form.useForm();
  const [idAddress, setIdAddress] = useState("");

  useEffect(() => {
    getAddress();
  }, []);

  const getAddress = async () => {
    try {
      let response = await WebApiPeople.getAddress(person_id);
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
    } catch (error) {
      console.log(error);
    }
  };
  const saveAddress = async (data) => {
    try {
      let response = await WebApiPeople.createAddress(data);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
      setIdAddress(response.data.id);
    } catch (error) {
      console.log(error);
    }
  };
  const updateAddress = async (data) => {
    try {
      let response = await WebApiPeople.updateAddress(idAddress, data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
    } catch (error) {
      console.log(error);
    }
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
      <Form layout={"vertical"} form={formAddress} onFinish={formAddressPerson} className="inputs_form_responsive">
        <Row gutter={20}>
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="street_type"
              label="Tipo de calle"
              rules={[ruleRequired]}
            >
              <Select
                options={typeStreet}
                notFoundContent={"No se encontraron resultados."}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="street" label="Calle" rules={[ruleRequired]}>
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="numberOne"
              label="Número exterior"
              rules={[ruleRequired]}
            >
              <Input maxLength={20} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="numberTwo" label="Número interior">
              <Input maxLength={20} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="building" label="Edificio">
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="postalCode"
              label="Código postal"
              rules={[ruleRequired]}
            >
              <Input maxLength={10} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="suburb" label="Suburbio" rules={[ruleRequired]}>
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="location" label="Ubicación" rules={[ruleRequired]}>
              <Input maxLength={50} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={22} md={12}>
            <Form.Item name="reference" label="Referencia">
              <Input maxLength={50} />
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
