import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select } from "antd";
import {
  onlyNumeric,
  rulePhone,
  ruleRequired,
  ruleWhiteSpace,
  ruleMaxPhoneNumber
} from "../../../utils/rules";
import WebApiPeople from "../../../api/WebApiPeople";
import SelectImssDelegation from "../../../components/selects/SelectImssDelegation";
import SelectImssSubdelegation from "../../../components/selects/SelectImssSubdelegation";
import SelectGeographicArea from "../../selects/SelectGeographicArea";

const FormPatronalRegistration = ({
  node,
  form,
  patronalRegistration = {},
  pushed,
  currentNodeId,
  ...props
}) => {

  const [ information, setInformation ] = useState(null)
  const socialReason = Form.useWatch('social_reason', form)
  
  

  useEffect(() => {
    currentNodeId && getInformationfiscal();
  }, [currentNodeId]);

  const getInformationfiscal = () => {
    WebApiPeople.getfiscalInformationNode(currentNodeId)
      .then((response) => {
        setInformation(response.data);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  useEffect(() => {

    if(socialReason){
      form.setFieldsValue({
        social_reason: socialReason
      })
    } else {
            
      form.setFieldsValue({
        social_reason: information?.business_name
      })
    }
  }, [information]);

  return (
    <Form layout={"vertical"} form={form} id="formGeneric">
      <Row gutter={20}>
        <Col lg={6} xs={22}>
          <Form.Item
            name="code"
            label="Clave de registro patronal"
            rules={[ruleRequired, ruleWhiteSpace]}
          >
            <Input maxLength={11} />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="economic_activity"
            label="Actividad económica"
            rules={[ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="social_reason"
            label="Razón social"
            rules={[ruleRequired, ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="subsidy_reimbursement_agreement"
            label="Convenio de reembolso de subsidio"
            rules={[ruleRequired, ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item
            name="phone"
            label="Teléfono"
            rules={[rulePhone, onlyNumeric, ruleWhiteSpace]}
          >
            <Input maxLength={10}/>
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="type_contribution" label="Tipo de contribución">
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <SelectGeographicArea rules={[ruleRequired]} />
        </Col>
        <Col lg={6} xs={22}>
          <SelectImssDelegation rules={[ruleRequired]} />
        </Col>
        <Col lg={6} xs={22}>
          <SelectImssSubdelegation rules={[ruleRequired]} />
        </Col>
      </Row>
    </Form>
  );
};
export default FormPatronalRegistration;
