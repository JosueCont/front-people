import { Row, Col, Form, Input, Radio, Switch, Select } from "antd";
import { useEffect } from "react";
import SelectTypeTax from "../../../../components/selects/SelectTypeTax";
import { salaryDays } from "../../../../utils/constant";
import { ruleRequired } from "../../../../utils/rules";
import { connect } from "react-redux";
import {setDataImport} from "../../../../redux/ImportCalendarDuck"

const FormCaledanrXml = ({ calendar, paymentPeriodicity = [],dataImportCalendar,setDataImport, ...props }) => {
  const [formCalendar] = Form.useForm();

  useEffect(()=>{
    calendar.calendar.perception_type = calendar.perception;
  },[])

  const onChangePeriod = (item) => {
    calendar.calendar.start_date = item.target.value.split('|')[0];
    console.log(item.target.value)
    setDataImport(item.target.value)
  };

  const isCheched=(item,index)=>{
    if(!calendar.calendar.start_date){
      return false
    }else{
      if(dataImportCalendar.periodSelected===`${item.payment_start_date},${item.payment_end_date}|${calendar.periodicity}${index}`){
        return true;
      }
    }

  }

  const PrintPeriods = ({ periods = [] }) => {
    return (
      <>
        {periods.map((item, i) => {
          return (
            <Col>
              <Radio
                key={item.payment_start_date + i}
                checked={isCheched(item,i)}
                value={`${item.payment_start_date},${item.payment_end_date}|${calendar.periodicity}${i}`}
              >
                {item.payment_start_date} - {item.payment_end_date}
              </Radio>
            </Col>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    formCalendar.setFieldsValue({
      active: calendar.calendar.active,
      annual_adjustment: calendar.calendar.annual_adjustment,
      monthly_adjustment: calendar.calendar.monthly_adjustment,
      name: calendar.calendar.name,
      perception_type: calendar.calendar.perception_type,
      period: calendar.calendar.period,
      periodicity: calendar.calendar.periodicity,
      start_date: calendar.calendar.start_date,
      type_tax: calendar.calendar.type_tax,
    });
  }, [calendar]);

  return (
    <>
      {calendar && (
        <>
          <Row style={{ width: "100%", padding: 10 }}>
            <Col span={24}>
              <h3><b>Fecha de inicio del calendario</b></h3>
            </Col>
            <Col span={24}>
              <Radio.Group onChange={(e)=>onChangePeriod(e)} required>
                <PrintPeriods periods={calendar.period_list} />
              </Radio.Group>
            </Col>
          </Row>
          <Form form={formCalendar} layout="vertical" >
            <Row gutter={[16, 6]}>
              <Col>
                <Form.Item
                  name={"name"}
                  label="Nombre de calendario"
                  rules={[ruleRequired]}
                  initialValue={calendar.calendar.name}
                >
                  <Input
                    onChange={(value) =>
                      (calendar.calendar.name = value.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col >
                <Form.Item name="period" label="Periodo">
                  <Input type={"number"} readOnly />
                </Form.Item>
              </Col>
              <Col >
                <Form.Item label="Periodicidad">
                  <Input
                    readOnly
                    value={
                      paymentPeriodicity.length > 0 ?
                      paymentPeriodicity.find(
                        (item) => item.id == calendar.calendar.periodicity
                      ).description : '--'
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 6]} style={{ marginTop: "5px" }}>
              <Col span={10}
              >
                <SelectTypeTax
                  style={{ width: 240 }}
                  rules={[ruleRequired]}
                  onChange={(value) => (calendar.calendar.type_tax = value)}
                />
              </Col>
              <Col lg={12} xs={22}>
                <Form.Item
                  key="SelectSalaryDays"
                  name="salary_days"
                  label="Dias a pagar"
                  rules={[ruleRequired]}
                >
                  <Select
                    placeholder="Dias a pagar"
                    options={salaryDays}
                    onChange={(value) =>
                      (calendar.calendar.salary_days = value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="active" label="¿Activo?">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Si"
                    unCheckedChildren="No"
                    onChange={(value) => (calendar.calendar.active = value)}
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="monthly_adjustment" label="Ajuste mensual">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Si"
                    unCheckedChildren="No"
                    onChange={(value) =>
                      (calendar.calendar.monthly_adjustment = value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="annual_adjustment" label="Ajuste anual">
                  <Switch
                    defaultChecked={false}
                    checkedChildren="Si"
                    unCheckedChildren="No"
                    onChange={(value) =>
                      (calendar.calendar.annual_adjustment = value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
};


const mapState = (state) => {
  return {
    dataImportCalendar: state.importCalendarStore,
  };
};


export default connect(mapState, {setDataImport})(FormCaledanrXml);
