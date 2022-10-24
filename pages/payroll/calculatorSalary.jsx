import {
  Breadcrumb,
  Spin,
  Form,
  Row,
  Col,
  Button,
  Input,
  Card,
  Select,
  message,
  Typography,
  Tabs,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { connect } from "react-redux";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import SelectPeriodicity from "../../components/selects/SelectPeriodicity";
import SelectYear from "../../components/selects/SelectYear";
import MainLayout from "../../layout/MainLayout";
import { monthsName, typeCalculate } from "../../utils/constant";
import webApiFiscal from "../../api/WebApiFiscal";
import { Global } from "@emotion/core";
import { ruleRequired } from "../../utils/rules";
import { numberFormat } from "../../utils/functions";
import { withAuthSync } from "../../libs/auth";
import WebApiPayroll from "../../api/WebApiPayroll";
const { TabPane } = Tabs;

const calculatorSalary = ({ ...props }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState(null);
  const [type, setType] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [changeType, setChangeType] = useState(false);

  const { Text, Title } = Typography;

  const onFinish = async (value) => {
    value.allowance = allowance;
    value.salary = parseFloat(value.salary);
    setSalary(null);
    setLoading(true);
    if (value.person_id) delete value["person_id"];
    await webApiFiscal
      .calculatorSalary(value)
      .then((response) => {
        if (response.status == 200) {
          setTimeout(() => {
            if (response.data.message) return;
            setSalary(response.data);
            setLoading(false);
          }, 500);
        } else {
          message.error("Ocurrio un error intente de nuevo");
          setSalary(null);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Ocurrio un error intente de nuevo, " + error);
        setSalary(null);
        setLoading(false);
      });
  };

  const changeMode = (item) => {
    setSalary(null);
    if (item == "1") {
      setChangeType(false);
      setAllowance(false);
    } else {
      setChangeType(true), setAllowance(true);
    }
  };

  const setPerson = (value) => {
    if (props.peopleCompany) {
      WebApiPayroll.getPayrollPerson(value)
        .then((response) => {
          form.setFieldsValue({ salary: response.data.daily_salary });
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  };

  return (
    <MainLayout currentKey={["calculatorSalary"]} defaultOpenKeys={["payroll"]}>
      <Global
        styles={`
          .card-calculator .ant-card-body{
            padding: 0px;
          }
          .col-calculator, .col-results{
            padding:40px;
          }

          .card-calculator .ant-card-body label{
            color: white !important;
          }
          .btn-calculate{
            background: transparent !important;
            border: solid 1px white !important;
            border-radius: 5px !important;
          }
          .btn-generate{
            background: white !important;
            border: solid 1px white !important;
            border-radius: 5px !important;
          }
          .btn-generate span{
            color: black !important;
          }
          .col-form{
            background-color: #B1B5BA;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          .border-results{
            border: 1px solid #7B25F1;
            border-radius: 13px;
            background: transparent;
            justify-content: end;
            padding: 12px 0px;
          }
          .col-results .ant-row .ant-col{
            display: flex;
          }
          .col-results .ant-row .ant-col .ant-typography{
            margin-top: auto;
            margin-bottom: auto;
          }

          .col-results .ant-row .ant-col-6{
            justify-content: end;
          }
          .table-grid-results{
            margin-top:20;
          }
          .table-grid-results > .ant-col{
            padding: 12px 10px;
            border: solid 1px #DEDEDE;
          }
          .table-grid-title > .ant-col{
            padding: 12px 10px;
          }
          
          .table-grid-footer .ant-col{
            padding: 12px 10px;
          }
          .table-grid-footer{
            margin-top:20px;
          }
        `}
      />
      <Content className="site-layout">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
              className={"pointer"}
              onClick={() => route.push({ pathname: "/home/persons/" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Calculadora</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col md={23}>
            <Row style={{ width: "100%" }}>
              <Tabs
                defaultActiveKey="1"
                type="card"
                size="small"
                moreIcon={false}
                onTabClick={(item) => changeMode(item)}
              >
                <TabPane tab="Asimilado" key="1" />
                <TabPane tab="Nómina" key="2" />
              </Tabs>
            </Row>
            <Card className="card-calculator">
              <Row>
                <Col className="col-calculator col-form" md={12}>
                  <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Row gutter={[24]}>
                      <Col span={24}>
                        <SelectCollaborator
                          placeholder="Colaboradores"
                          name="person_id"
                          size={"large"}
                          onChange={(value) => setPerson(value)}
                        />
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Tipo de calculo" name="type">
                          <Select
                            size="large"
                            options={typeCalculate}
                            placeholder="Tipo de calculo"
                            onChange={(value) => {
                              setType(value), setSalary(null);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <Form.Item label="Salario" name="salary">
                          <Input
                            type="number"
                            placeholder="Salario"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <SelectPeriodicity size="large" />
                      </Col>
                      <Col md={12}>
                        <SelectYear size="large" label={"Periodo"} />
                      </Col>

                      {changeType && (
                        <Col md={12}>
                          <Form.Item
                            name="month"
                            label="Mes"
                            placeholder="Selecciona mes"
                            rules={[ruleRequired]}
                          >
                            <Select size="large" options={monthsName} />
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                    <Row gutter={10}>
                      <Col
                        className="button-filter-person"
                        style={{ display: "flex" }}
                      >
                        <Button
                          className="btn-calculate"
                          htmlType="submit"
                          size="large"
                        >
                          Calcular
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                {salary && (
                  <Col
                    md={12}
                    style={{ display: "flex" }}
                    className="col-results"
                  >
                    <Spin
                      tip="Cargando..."
                      spinning={loading}
                      style={{ display: "flex" }}
                    >
                      {salary && (
                        <div style={{ margin: "auto" }}>
                          <Row className="table-grid-title">
                            <Col span={16}>
                              <Text strong>
                                {changeType ? "Nómina" : "Asimilado"}
                              </Text>
                            </Col>
                            <Col span={8} className="border-results">
                              <Text strong>
                                $ {numberFormat(salary.gross_salary)}
                              </Text>
                            </Col>
                          </Row>
                          <Row
                            className="table-grid-results"
                            style={{ marginTop: 20 }}
                          >
                            <Col span={18}>
                              <span>- Límite inferior</span>
                            </Col>
                            <Col span={6}>
                              <Text strong>
                                {numberFormat(salary.lower_limit)}
                              </Text>
                            </Col>
                            <Col span={18}>
                              <span>= Excedente del límite inferior</span>
                            </Col>
                            <Col span={6}>
                              <Text strong>{numberFormat(salary.surplus)}</Text>
                            </Col>
                            <Col span={18}>
                              <span>
                                × % sobre excedente del límite inferior
                              </span>
                            </Col>
                            <Col span={6}>
                              <Text strong>
                                {salary.percentage_exceeding_lower_limit}
                              </Text>
                            </Col>
                            <Col span={18}>
                              <span>= Impuesto marginal</span>
                            </Col>
                            <Col span={6}>
                              <Text strong>
                                {numberFormat(salary.marginal_tax)}
                              </Text>
                            </Col>
                            <Col span={18}>
                              <span>+ Cuota fija del impuesto</span>
                            </Col>
                            <Col span={6}>
                              <Text strong>
                                {numberFormat(salary.fixed_fee)}
                              </Text>
                            </Col>
                            <Col span={18}>
                              <span>I.S.R. a cargo</span>
                            </Col>
                            <Col span={6}>
                              <Text strong>
                                {numberFormat(salary.charge_isr)}
                              </Text>
                            </Col>
                            {allowance && (
                              <>
                                <Col span={18}>
                                  <span>Retención IMSS</span>
                                </Col>
                                <Col span={6}>
                                  <Text strong>
                                    {numberFormat(salary.retention_imss)}
                                  </Text>
                                </Col>
                                <Col span={18}>
                                  <span>
                                    {salary.retention_isr
                                      ? "ISR a retener"
                                      : "SUBSIDIO PARA EL EMPLEO A ENTREGAR"}
                                  </span>
                                </Col>
                                <Col span={6}>
                                  {salary.retention_isr
                                    ? salary.retention_isr
                                    : salary.allowance_employee}
                                </Col>
                                <Col span={18}>
                                  <span>Percepción del trabajador</span>
                                </Col>
                                <Col span={6}>
                                  <Text strong>
                                    {numberFormat(salary.perception_employee)}
                                  </Text>
                                </Col>
                                <Col span={18}>
                                  <span>IMSS/INFONAVIT</span>
                                </Col>
                                <Col span={6}>
                                  <Text strong>
                                    {numberFormat(salary.imss_infonavit_afore)}
                                  </Text>
                                </Col>
                              </>
                            )}
                          </Row>
                          {!allowance && (
                            <Row className="table-grid-footer">
                              <Col span={16}>
                                <Text strong={type == 1 ? true : false}>
                                  ASIMILADO NETO
                                </Text>
                              </Col>
                              <Col
                                span={8}
                                style={{
                                  backgroundColor: type == 2 && "yellow",
                                }}
                                className="border-results"
                              >
                                <Text strong>
                                  $ {numberFormat(salary.net_salary)}
                                </Text>
                              </Col>
                            </Row>
                          )}
                        </div>
                      )}
                    </Spin>
                  </Col>
                )}
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    permissions: state.userStore.permissions,
    peopleCompany: state.catalogStore.people_company,
  };
};

export default connect(mapState)(withAuthSync(calculatorSalary));
