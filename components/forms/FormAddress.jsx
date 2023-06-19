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
import { typeStreet } from "../../utils/constant";
import WebApiFiscal from "../../api/WebApiFiscal";
import WebApi from "../../api/webApi";
import {ruleRequired, ruleWhiteSpace} from "../../utils/rules";
import {connect} from "react-redux";
const { Option } = Select;

const FormAddress = ({ person_id, ...props }) => {
  const { Title } = Typography;
  const [formAddress] = Form.useForm();
  const [idAddress, setIdAddress] = useState("");
  const [postalCode, setPostalCode] = useState([]);
  const [postalCodeSelect, setPostalCodeSelect] = useState(null);
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  useEffect(() => {
    getAddress();
  }, []);


  const getPostalCode = (value) => {
    if (props.versionCfdi)
      WebApiFiscal.getPostalCode(value, props.versionCfdi)
          .then((response) => {
            setPostalCode(response.data.results);
          })
          .catch((e) => {
            console.log(e);
          });
  };

  /*functions CRUD */
  const getAddress = async () => {
    try {
      let response = await WebApi.getAddress(person_id);
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
      let response = await WebApi.createAddress(data);
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
      let response = await WebApi.updateAddress(idAddress, data);
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
      <Form 
        layout={"vertical"}
        form={formAddress}
        onFinish={formAddressPerson}
        className="form-details-person"
      >
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
                rules={[ruleRequired, ruleWhiteSpace]}
                name="postalCode"
                label="Código postal"
            >
              <Select
                  showSearch
                  showArrow={false}
                  notFoundContent={"No se encontraron resultados."}
                  onSearch={getPostalCode}
                  filterOption={false}
                  filterSort={false}
              >
                {postalCode.length > 0 &&
                    postalCode.map((item) => {
                      return (
                          <>
                            (
                            <Option key={item.id} value={item.code}>
                              {item.code}
                            </Option>
                            ; )
                          </>
                      );
                    })}
              </Select>
            </Form.Item>
            {/*<Form.Item*/}
            {/*  name="postalCode2"*/}
            {/*  label="Código postal"*/}
            {/*>*/}
            {/*  <Input />*/}
            {/*</Form.Item>*/}
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="suburb" label="Colonia" rules={[ruleRequired]}>
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


const mapState = (state) => {
  return {
    versionCfdi: state.fiscalStore.version_cfdi,
  };
};

export default connect(mapState)(FormAddress);
