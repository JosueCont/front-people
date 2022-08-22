import { ContactsOutlined } from "@material-ui/icons";
import { Form, Input, Row, Col, Select, DatePicker } from "antd";
import { set } from "lodash";
import moment from "moment";
import { useState, useEffect } from "react";
import { onlyNumeric, ruleRequired, treeDecimal, ruleWhiteSpace } from "../../../utils/rules";


const JobRiskPremium = ({node,
  form,
  jobRisk = {},
  pushed,
  ...props}) => {

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
    
  const yearFormat = 'YYYY';
  const monthFormat = 'MM'; 


  return (
    <Form layout={"vertical"} form={form} id="formGeneric">
      <Row gutter={20}>
        <Col lg={6} xs={22}>
          <Form.Item name="job_risk_class" label="Clave de riesgo de trabajo" rules={[ruleRequired, ruleWhiteSpace]}>
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
        <Form.Item name="job_risk_percent" label="Porcentaje de riesgo" rules={[treeDecimal ,ruleRequired, ruleWhiteSpace]}>
            <Input />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="year" label="Año" rules={[ruleRequired]} >
            {/* <Input /> */}
            <DatePicker style={{width:"100%"}} picker="year" format={yearFormat}/>
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="month" label="Mes" rules={[ruleRequired]}>
            {/* <Input /> */}
            <DatePicker style={{width:"100%"}} picker="month" format={monthFormat}/>
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="stps_accreditation" label="Acreditación STPS">
            <Select defaultValue={false}>
              <option value={true}>Si</option>
              <option value={false}>No</option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="rt_fraction" label="Fracción RT" rules={[ruleRequired, ruleWhiteSpace]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default JobRiskPremium;
