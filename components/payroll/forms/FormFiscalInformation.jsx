import { Form, Row, Col, Input, Switch, Select } from "antd";
import React, { useState, useEffect } from "react";
import { curpFormat, rfcFormat, ruleRequired } from "../../../utils/rules";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import SelectTaxRegime from "../../selects/SelectTaxRegime";

const FormFiscalInformation = ({ form, fiscalData, ...props }) => {
  const [pTypeSelected, setPTypeSelected] = useState(false);
  const personType = [
    { value: 1, label: "Física" },
    { value: 2, label: "Moral" },
  ];
  useEffect(() => {
    if (fiscalData) setForm(fiscalData);
  }, [fiscalData]);

  const setForm = (data) => {
    form.setFieldsValue({
      company_sector: data.company_sector? data.company_sector : 2,
      person_type: data.person_type,
      curp: data.curp,
      rfc: data.rfc,
      tax_regime: data.tax_regime,
      assimilated_pay: data.assimilated_pay,
      has_personnel_outsourcing: data.has_personnel_outsourcing,
      business_name: data.business_name,
    });
  };

  const person = Form.useWatch('person_type', form)

  console.log('Person', person)

  return (
    <Form form={form} layout={"vertical"} defaultValue={{ rfc: '' }}>
      <Row gutter={20}>
        <Col lg={4} xs={22} md={12}>
          <Form.Item name="company_sector" label="Sector">
            <Select
              options={[
                { value: 1, label: "Pública" },
                { value: 2, label: "Privada" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col lg={4} xs={22} md={12}>
          <Form.Item
            name="person_type"
            label="Tipo de persona"
            // rules={[ruleRequired]}
          >
            <Select
              options={personType}
              onChange={(value) => setPTypeSelected(value)}
              notFoundContent={"No se encontraron resultados."}
            />
          </Form.Item>
        </Col>
        {pTypeSelected === 1 && (
          <Col lg={8} xs={22} md={12}>
            <Form.Item
              name="curp"
              label="CURP"
              rules={[curpFormat, ruleRequired]}
            >
              <Input maxLength={18} />
            </Form.Item>
          </Col>
        )}
        <Col lg={8} xs={22} md={12}>
          <Form.Item name="rfc" label="RFC" rules={ person? [rfcFormat, ruleRequired] : []}>
            <Input maxLength={person && person ===1? 13 : 12} />
          </Form.Item>
        </Col>
        <Col lg={8} xs={22} md={12}>
          <Form.Item name="business_name" label="Razón social">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={13} xs={22}>
          <SelectTaxRegime />
        </Col>
        <Col lg={4} xs={22} md={12}>
          <Form.Item
            name="assimilated_pay"
            label="Pagos asimilados"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22} md={12}>
          <Form.Item
            name="has_personnel_outsourcing"
            label="Subcontratacion de personal"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormFiscalInformation;
