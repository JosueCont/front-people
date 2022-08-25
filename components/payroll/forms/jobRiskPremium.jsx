import { ContactsOutlined } from "@material-ui/icons";
import { Form, Input, Row, Col, Select, DatePicker } from "antd";
import { set } from "lodash";
import moment from "moment";
import { useState, useEffect } from "react";
import { onlyNumeric, ruleRequired, treeDecimal, ruleWhiteSpace } from "../../../utils/rules";
import SelectJobRisk from "../../selects/SelectJobRisk";
import {connect} from "react-redux";
import SelectFractions from "../../selects/SelectFractions";


const JobRiskPremium = ({node,
  form,
  cat_job_risk,
  cat_fractions,
  jobRisk = {},
  pushed,
  ...props}) => {

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [jobRiskSelected, setJobRiskSelected] = useState(null);

  const yearFormat = 'YYYY';
  const monthFormat = 'MM'; 

  const setPercent=(risk)=>{
    console.log(risk)
    if(risk?.percent)
      form.setFieldsValue({
        job_risk_percent:risk.percent
      })
  }

  useEffect(()=>{
      if(jobRiskSelected){
        const found = cat_job_risk.find(element => element.id === jobRiskSelected);
        console.log(found)
        setPercent(found)
      }
  },[jobRiskSelected, cat_job_risk])

  return (
    <Form layout={"vertical"} form={form} id="formGeneric">
      <Row gutter={20}>
        <Col lg={6} xs={22}>
           <SelectJobRisk name={'job_risk_class'} onChange={setJobRiskSelected} rules={[ruleRequired]} />
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
            <SelectFractions name={'rt_fraction'} rules={[ruleRequired]} />
        </Col>
      </Row>
    </Form>
  );
};

const mapState = (state) => {
  return {
    cat_job_risk: state.catalogStore.cat_job_risk,
    cat_fractions: state.catalogStore.cat_fractions,
  };
};

export default connect(mapState)(JobRiskPremium);
