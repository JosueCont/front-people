import { Form, Input, Row, Col, Select } from "antd";
import { useState, useEffect } from "react";
import {
  ruleRequired,
  treeDecimal,
  ruleWhiteSpace,
} from "../../../utils/rules";
import SelectJobRisk from "../../selects/SelectJobRisk";
import { connect } from "react-redux";
import SelectFractions from "../../selects/SelectFractions";
import { monthsName } from "../../../utils/constant";
import { generateYear } from "../../../utils/functions";
import { PercentageOutlined } from "@ant-design/icons";
import {getJobRiskClass} from "../../../redux/catalogCompany";

const JobRiskPremium = ({
  node,
  form,
  cat_job_risk,
  cat_fractions,
  jobRisk = null,
  getJobRiskClass,
  pushed,
  ...props
}) => {
  const [jobRiskSelected, setJobRiskSelected] = useState(null);
  const [percent, setPercent] = useState(null);

  useEffect(()=>{
    getJobRiskClass()
  },[])

  useEffect(() => {
    if (jobRiskSelected) {
      const found = cat_job_risk.find(
        (element) => element.id === jobRiskSelected
      );
      setPercent(found.percent);
    } else {
      setPercent(null);
    }
  }, [jobRiskSelected, cat_job_risk]);

  useEffect(() => {
    if (percent) {
      form.setFieldsValue({
        risk_percent: percent,
      });
    } else {
      form.setFieldsValue({
        risk_percent: "0.00000",
      });
    }
  }, [percent]);

  useEffect(() => {
    if (jobRisk) {
      form.setFieldsValue({
        job_risk_class: jobRisk?.job_risk_class?.id,
        risk_percent:
          jobRisk.risk_percent == "0.00000"
            ? jobRisk.job_risk_class.percent
            : jobRisk.risk_percent,
        year: jobRisk.year,
        month: jobRisk.month,
        stps_accreditation: jobRisk.stps_accreditation,
        rt_fraction: jobRisk.rt_fraction,
      });
      // setPercent(jobRisk.risk_percent)
    }
  }, [jobRisk]);

  return (
    <Form layout={"vertical"} form={form} id="formGeneric">
      <Row gutter={20}>
        <Col lg={6} xs={22}>
          <SelectJobRisk
            name={"job_risk_class"}
            onChange={setJobRiskSelected}
            rules={[ruleRequired]}
          />
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item label="Porcentaje de riesgo" name="risk_percent">
            <Input
              suffix={<PercentageOutlined />}
              style={{ paddingLeft: "10px" }}
            />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="year" label="Año" rules={[ruleRequired]}>
            <Select options={generateYear()} />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="month" label="Mes" rules={[ruleRequired]}>
            <Select options={monthsName} />
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <Form.Item name="stps_accreditation" label="Acreditación STPS">
            <Select>
              <option value={true}>Si</option>
              <option value={false}>No</option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={6} xs={22}>
          <SelectFractions name={"rt_fraction"} />
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

export default connect(mapState,{getJobRiskClass})(JobRiskPremium);
