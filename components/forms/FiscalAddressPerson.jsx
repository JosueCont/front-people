import { Button, Col, Form, Input, Row, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { typeStreet } from "../../utils/constant";
import { connect } from 'react-redux';
import WebApiFiscal from "../../api/WebApiFiscal";
import WebApi from "../../api/webApi";
import {ruleRequired, ruleWhiteSpace} from "../../utils/rules";

const FiscalAddressPerson = ({person_id, ...props}) => {
    const { Title } = Typography
    const [form] = Form.useForm()
    const [postalCode, setPostalCode] = useState([]);
    const [idAddress, setIdAddress] = useState("");


    useEffect(() => {
        getFiscalAddress();
      }, []);

      const getFiscalAddress = async () => {
        try {
          let response = await WebApi.getFiscalAddress(person_id);
          console.log('response===>',response)
          /* formAddress.setFieldsValue({
            street_type: response.data[0].street_type,
            street: response.data[0].street,
            numberOne: response.data[0].numberOne,
            numberTwo: response.data[0].numberTwo,
            building: response.data[0].building,
            postalCode: response.data[0].postalCode,
            suburb: response.data[0].suburb,
            location: response.data[0].location,
            reference: response.data[0].reference,
          }); */
          /* setIdAddress(response.data[0].id); */
        } catch (error) {
          console.log(error);
        }
      };
    

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

  return (
    <>
        <Row>
            <Title style={{ fontSize: "20px" }}>Dirección Fiscal</Title>
        </Row>
        <Form
            layout={"vertical"}
            form={form}
            /* onFinish={formAddressPerson} */
            className="form-details-person"
        >
            <Row>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                        name="street_type"
                        label="Tipo de calle"
                    >
                        <Select
                            options={typeStreet}
                            notFoundContent={"No se encontraron resultado."}
                        />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="street" label="Calle" >
                        <Input />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                    name="numberOne"
                    label="Número exterior"
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
                    <Form.Item name="between_street_one" label="Entre calle 1">
                    <Input />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="between_street_two" label="Entre calle 2">
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
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="suburb" label="Colonia">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="location" label="Localidad" >
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="state" label="Estado">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="state" label="Correo electrónico">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="state" label="Lada">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="state" label="Telefono">
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
  )
}

const mapState = (state) => {
    return {
      versionCfdi: state.fiscalStore.version_cfdi,
    };
  };

export default connect(mapState)(FiscalAddressPerson);