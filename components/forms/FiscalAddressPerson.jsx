import { Button, Col, Form, Input, Row, Select, Spin, Typography, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { typeStreet, personStreetType } from "../../utils/constant";
import { connect } from 'react-redux';
import WebApiFiscal from "../../api/WebApiFiscal";
import WebApi from "../../api/webApi";
import {ruleRequired, ruleWhiteSpace} from "../../utils/rules";

const FiscalAddressPerson = ({person_id, ...props}) => {
    const { Title } = Typography
    const [form] = Form.useForm()
    const [postalCode, setPostalCode] = useState([]);
    const [idAddress, setIdAddress] = useState("");
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        getFiscalAddress();
      }, []);

      const getFiscalAddress = async () => {
        setLoading(true)
        try {
          let response = await WebApi.getFiscalAddress(person_id);
          console.log('response===>',response)
          if(response.status === 200){
            setIdAddress(response?.data?.id)
            form.setFieldsValue({
              street_type: response?.data?.street_type,
              street: response?.data?.street,
              numberOne: response?.data?.numberOne,
              numberTwo: response?.data?.numberTwo,
              between_street_one: response?.data?.between_street_one,
              between_street_two: response?.data?.between_street_two,
              postalCode: response?.data?.postalCode,
              suburb: response?.data?.suburb,
              location: response?.data?.locality,
              state: response?.data?.state,
              email: response?.data?.email,
              dial_code: response?.data?.dial_code,
              phone_number: response?.data?.phone_number
            });
          }
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.log(error);
        }
      };

      const saveAddress = async (values) => {
        setLoading(true)
        values['person'] = person_id
        let response;
        try {
          if (idAddress){
            response = await WebApi.updFiscalAddress(idAddress, values);
          }else {
            response = await WebApi.createFiscalAddress(values);
          }
          if(response.status === 200){
            message.success("Dirección guardada correctamente.")
          }
          setLoading(false)
          getFiscalAddress(person_id)
        } catch (error) {
          setLoading(false)
          console.log('error', error)
        }
      }
    

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
        <Spin spinning={loading}>
          <Form
              layout={"vertical"}
              form={form}
              onFinish={saveAddress}
              className="form-details-person"
          >
              <Row>
                  <Col lg={6} xs={22} offset={1}>
                      <Form.Item
                          name="street_type"
                          label="Tipo de calle"
                      >
                          <Select
                              options={personStreetType}
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
              <Form.Item name="email" label="Correo electrónico">
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="dial_code" label="Lada">
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="phone_number" label="Telefono">
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
        </Spin>
    </>
  )
}

const mapState = (state) => {
    return {
      versionCfdi: state.fiscalStore.version_cfdi,
    };
  };

export default connect(mapState)(FiscalAddressPerson);