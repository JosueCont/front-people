import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select,DatePicker, Checkbox } from "antd";
import {
  onlyNumeric,
  rulePhone,
  ruleRequired,
  ruleWhiteSpace,
  ruleMaxPhoneNumber,
} from "../../../utils/rules";
import WebApiPeople from "../../../api/WebApiPeople";
import SelectImssDelegation from "../../../components/selects/SelectImssDelegation";
import SelectImssSubdelegation from "../../../components/selects/SelectImssSubdelegation";
import SelectGeographicArea from "../../selects/SelectGeographicArea";
import moment from 'moment'
import locale from "antd/lib/date-picker/locale/es_ES";

const FormPatronalRegistration = ({
  node,
  form,
  patronalRegistration = {},
  pushed,
  hasImss,
  currentNodeId,
  imssDelegation = null,
  ...props
}) => {
  const [information, setInformation] = useState(null);
  const socialReason = Form.useWatch("social_reason", form);
  const [imssDelegationId, setImssDelegationId] = useState(null);
  const [yearPeriod, setYearPeriod] = useState(null);

  useEffect(() => {
    currentNodeId && getInformationfiscal();
  }, [currentNodeId]);

  const getInformationfiscal = () => {
    WebApiPeople.getfiscalInformationNode(currentNodeId)
      .then((response) => {
        console.log('fiscal patronal', response.data)
        setInformation(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (socialReason) {
      form.setFieldsValue({
        social_reason: socialReason,
      });
    } else {
      form.setFieldsValue({
        social_reason: information?.business_name,
      });
    }
  }, [information]);

  const changeImssDelegation = (value) => {
    form.setFieldsValue({ imss_subdelegation: null });
    setImssDelegationId(value);
  };


  const changeYear = (value,yearText) => {
    setYearPeriod(parseInt(yearText))
    form.setFieldsValue({ setup_period: moment().year(parseInt(yearText)) });
    console.log(form.getFieldsValue())
  };


  useEffect(() => {
    if (imssDelegation) {
      setImssDelegationId(imssDelegation);
    }
  }, [imssDelegation]);

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
        {/* <Col lg={6} xs={22}>
          <Form.Item
            name="subsidy_reimbursement_agreement"
            label="Convenio de reembolso de subsidio"
            rules={[ruleWhiteSpace]}
          >
            <Input />
          </Form.Item>
        </Col> */}
        <Col lg={6} xs={22}>
          <Form.Item
            name="phone"
            label="Teléfono"
            rules={[rulePhone, onlyNumeric, ruleWhiteSpace]}
          >
            <Input maxLength={10} />
          </Form.Item>
        </Col>
        {/* <Col lg={6} xs={22}>
          <Form.Item name="type_contribution" label="Tipo de contribución">
            <Input />
          </Form.Item>
        </Col> */}
        <Col lg={6} xs={22}>
          <Form.Item  name='setup_period' label="Periodo">
            <DatePicker
                style={{ width: "100%" }}
                onChange={changeYear}
                picker="year"
                moment={"YYYY"}
                disabledDate={(currentDate) => currentDate.year() > new Date().getFullYear() }
                placeholder=""
                locale={locale}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <SelectGeographicArea period={yearPeriod} rules={[ruleRequired]} />
        </Col>
        <Col lg={6} xs={22}>
          <SelectImssDelegation
            rules={[ruleRequired]}
            changeImssDelegation={changeImssDelegation}
          />
        </Col>
        <Col lg={6} xs={22}>
          <SelectImssSubdelegation
            rules={[ruleRequired]}
            imssDelegationId={imssDelegationId}
          />
        </Col>
        {
          hasImss ? <>
            <Col lg={6} xs={22}>
              <Form.Item label={" "} name="save_automatic_emissions"
                         tooltip={"Si activa esta opción, el sistema obtendrá mes a mes las Emisiones."}
                         valuePropName="checked">
                <Checkbox>Obtener automáticamente las EMA/EBA</Checkbox>
              </Form.Item>
            </Col>
            <Col lg={6} xs={22}>
              <Form.Item label={' '} name="save_job_risk_premium"
                         tooltip={"Si se activa esta opción se estará actualizando la prima de riesgo cada vez que se obtenga las emisiones."}
                         valuePropName="checked">
                <Checkbox>Actualizar prima de riesgo al obtener Ema y EBA</Checkbox>
              </Form.Item>

            </Col>
          </>:null
        }

      </Row>
    </Form>
  );
};
export default FormPatronalRegistration;
