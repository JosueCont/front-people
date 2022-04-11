import { Form, Row, Col, Input, Button, Switch, Select, message } from "antd";
import React, { useState, useEffect } from "react";
import { curpFormat, rfcFormat, ruleRequired } from "../../utils/rules";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import WebApiPeople from "../../api/WebApiPeople";
import SelectTaxRegime from "../selects/SelectTaxRegime";
import { messageError, messageSaveSuccess } from "../../utils/constant";

const FiscalInformation = ({ form, node, ...props }) => {
  const [pTypeSelected, setPTypeSelected] = useState(false);
  const [id, setId] = useState(null);
  const personType = [
    { value: 1, label: "Fisica" },
    { value: 2, label: "Moral" },
  ];

  // useEffect(() => {
  //   if (node) getInfo(node);
  // }, [node]);

  // const getInfo = async () => {
  //   await WebApiPeople.fiscalInformationNode("get", null, `?node__id=${node}`)
  //     .then((response) => {
  //       if (response.data) {
  //         setId(response.data.id);
  //         setForm(response.data);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const saveInfo = async (data) => {
  //   data.node = parseInt(node);
  //   if (id) data.id = id;
  //   await WebApiPeople.fiscalInformationNode(
  //     id ? "put" : "post",
  //     data,
  //     `${id}/`
  //   )
  //     .then((response) => {
  //       message.success(messageSaveSuccess);
  //       setForm(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       message.error(messageError);
  //     });
  // };

  // const setForm = (data) => {
  //   form.setFieldsValue({
  //     person_type: data.person_type,
  //     curp: data.curp,
  //     rfc: data.rfc,
  //     tax_regime: data.tax_regime,
  //     assimilated_pay: data.assimilated_pay,
  //   });
  // };

  return (
    <Form form={form} layout={"vertical"}>
      <Row gutter={20}>
        <Col lg={4} xs={22} md={12}>
          <Form.Item name="comapny_sector" label="Sector">
            <Select
              options={[
                { value: 1, label: "Publica" },
                { value: 2, label: "Privada" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col lg={4} xs={22} md={12}>
          <Form.Item
            name="person_type"
            label="Tipo de persona"
            rules={[ruleRequired]}
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
          <Form.Item name="rfc" label="RFC" rules={[rfcFormat, ruleRequired]}>
            <Input maxLength={13} />
          </Form.Item>
        </Col>
        <Col lg={13} xs={22}>
          <SelectTaxRegime />
        </Col>
        <Col lg={4} xs={22} md={12}>
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
        {/* <Col span={24} style={{ textAlign: "end" }}>
          <Button htmlType="submit">Guardar</Button>
        </Col> */}
      </Row>
    </Form>
  );
};

export default FiscalInformation;
