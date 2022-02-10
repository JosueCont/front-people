import { Form, Row, Col, Input, Button, Switch, Select } from 'antd';
import React, {useState, useEffect} from 'react';
import { curpFormat, rfcFormat, ruleRequired } from "../../utils/rules";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";


const FiscalInformation = ({infoId, formTaxInfo, taxRegimePhysical, taxRegimeMoral, pTypeSelected, setPTypeSelected,  ...props}) => {

    const personType = [
        { value: 1, label: "Fisica" },
        { value: 2, label: "Moral" },
    ];

    const selectPersonType = (value) => {
        setPTypeSelected(value);
    };

    useEffect(() => {
      console.log('taxRegimePhysical =>',taxRegimePhysical);
      console.log('taxRegimeMoral => ',taxRegimeMoral);
      const info = formTaxInfo.getFieldValue('tax_regime')
      console.log('info',info);
      formTaxInfo.setFieldsValue({
        tax_regime: info
      })
    }, [formTaxInfo, taxRegimePhysical])

    const saveInfo = (values) =>{
      console.log('values', values);
    }
    

  return <Form form={formTaxInfo} onFinish={saveInfo} layout={"vertical"}>
      <Row gutter={20}>
          <Col lg={8} xs={22} md={12}>
                <Form.Item
                  name="person_type"
                  label="Tipo de persona"
                  rules={[ruleRequired]}
                >
                  <Select
                    options={personType}
                    onChange={selectPersonType}
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              {pTypeSelected === 1 && (
                <Col lg={8} xs={22} md={12}>
                  <Form.Item name="curp" label="CURP" rules={[curpFormat]}>
                    <Input maxLength={18} />
                  </Form.Item>
                </Col>
              )}

              <Col lg={8} xs={22} md={12}>
                <Form.Item name="rfc" label="RFC" rules={[rfcFormat]}>
                  <Input maxLength={13} />
                </Form.Item>
              </Col>
              <Col lg={13} xs={22}>
                <Form.Item
                  name="tax_regime"
                  label="Regimen fiscal"
                  rules={[ruleRequired]}
                >
                  <Select
                    options={
                      pTypeSelected == 1 ? taxRegimePhysical : taxRegimeMoral
                    }
                    notFoundContent={"No se encontraron resultados."}
                  />
                </Form.Item>
              </Col>
              <Col lg={8} xs={22} md={12}>
                <Form.Item
                  name="assimilated_pay"
                  label="Pago asimilados"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: 'end' }} >
                    <Button type="submit">
                        Guardar
                    </Button>
              </Col>
      </Row>
  </Form>;
};

export default FiscalInformation;
