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
import SelectGeographicArea from "../../components/selects/SelectGeographicArea";
import SelectYear from "../../components/selects/SelectYear";
import MainLayout from "../../layout/MainInter";
import { monthsName, typeCalculate } from "../../utils/constant";
import webApiFiscal from "../../api/WebApiFiscal";
import { Global } from "@emotion/core";
import { ruleRequired } from "../../utils/rules";
import { numberFormat, verifyMenuNewForTenant } from "../../utils/functions";
import { withAuthSync } from "../../libs/auth";
import WebApiPayroll from "../../api/WebApiPayroll";
import { useEffect } from "react";
const { TabPane } = Tabs;

const calculatorSalary = ({ ...props }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState(null);
  const [type, setType] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [changeType, setChangeType] = useState(false);
  const [personSalary, setPersonSalary] = useState(null);
  const [periodicity, setPeriodicity] = useState(null);
  const [textPeriodicity, setTextPeriodicity] = useState("");
  const [antiquity, setAntiquity] = useState(null)

  const { Text, Title } = Typography;

  const onFinish = async (value) => {
    if (value.salary > 0 || value.daily_salary > 0) {
      value.allowance = allowance;
      value.salary = parseFloat(value.salary);
      value.daily_salary = parseFloat(value.daily_salary);
      value.antiquity = antiquity
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
    } else {
      message.error("Ingresa el salario");
    }
  };

  const changeMode = (item) => {
    setSalary(null);
    form.setFieldsValue({type:null})
    if (item == "1") {
      setChangeType(false);
      setAllowance(false);
    } else {
      setChangeType(true), setAllowance(true);
    }
  };

  const setPerson = (value) => {
    if (props.peopleCompany && value) {
      WebApiPayroll.getPayrollPerson(value)
        .then((response) => {
          setPersonSalary(response.data.daily_salary);
          setAntiquity(response.data.person.antiquity)
          form.setFieldsValue({
            daily_salary: response.data.daily_salary,
          });
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    } else {
      form.setFieldsValue({
        daily_salary: null,
      });
      setPersonSalary(null);
    }
  };

  useEffect(() => {
    const periodicitySelected = props.periodicities.find(
      (item) => item.id == periodicity
    )?.description;
    setTextPeriodicity(periodicitySelected ? periodicitySelected : "");
    // let new_salary = "";
    // if (
    //   personSalary &&
    //   periodicitySelected &&
    //   periodicitySelected != undefined
    // ) {
    //   switch (periodicitySelected) {
    //     case "Diario":
    //       new_salary = personSalary;
    //       break;
    //     case "Semanal":
    //       new_salary = personSalary * 7;
    //       break;
    //     case "Catorcenal":
    //       new_salary = personSalary * 14;
    //       break;
    //     case "Quincenal":
    //       new_salary = personSalary * 15;
    //       break;
    //     case "Mensual":
    //       new_salary = personSalary * 30;
    //       break;
    //     default:
    //       break;
    //   }
    //   console.log("New Salary", new_salary);
    //   form.setFieldsValue({
    //     salary: new_salary.toFixed(4),
    //   });
    // }
  }, [personSalary, periodicity]);

  return (
    <MainLayout
      currentKey={["calculatorSalary"]}
      defaultOpenKeys={["managementRH", "payroll"]}
    >
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
          {verifyMenuNewForTenant() && (
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
          )}
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
                      {personSalary && (
                        <Col md={24}>
                          <Form.Item
                            label="Salario diario actual"
                            name="daily_salary"
                          >
                            <Input
                              type="number"
                              placeholder="Salario diario"
                              size="large"
                              disabled={true}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      <Col md={12}>
                        <SelectPeriodicity
                          size="large"
                          onChangePeriodicy={(value) => setPeriodicity(value)}
                          rules={[ruleRequired]}
                        />
                      </Col>
                      <Col md={12}>
                        <Form.Item
                          label={"Nuevo salario " + textPeriodicity}
                          name="salary"
                          rules={!personSalary ? [ruleRequired] : []}
                        >
                          <Input
                            type="number"
                            placeholder="Salario por periodo"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={12}>
                        <SelectYear
                          size="large"
                          label={"Periodo"}
                          rules={[ruleRequired]}
                        />
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Tipo de calculo"
                          name="type"
                          rules={[ruleRequired]}
                        >
                          <Select
                            size="large"
                            // options={changeType?[{
                            //   label: "Bruto-Neto",
                            //   value: 1,
                            // },]:typeCalculate}
                            options={typeCalculate}
                            placeholder="Tipo de calculo"
                            onChange={(value) => {
                              setType(value), setSalary(null);
                            }}
                          />
                        </Form.Item>
                      </Col>

                      {changeType && (
                        <>
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
                          <Col md={12}>
                            <SelectGeographicArea
                              size="large"
                              rules={[ruleRequired]}
                            />
                          </Col>
                        </>
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
                            <Col
                              span={8}
                              style={{
                                backgroundColor: type == 1 && "yellow",
                              }}
                              className="border-results"
                            >
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
                                  <Text strong>
                                    {salary.retention_isr
                                      ? salary.retention_isr
                                      : salary.allowance_employee}
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
                            {/*{salary.new_daily_salary && (
                              <>
                                <Col span={18}>
                                  <span style={{}}>Nuevo Salario diario</span>
                                </Col>
                                <Col span={6}>
                                  <Text strong>
                                    {numberFormat(salary.new_daily_salary)}
                                  </Text>
                                </Col>
                              </>
                            )}*/}
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
                          {allowance && (
                            <Row className="table-grid-footer">
                              <Col span={16}>
                                <Text strong={type == 1 ? true : false}>
                                  SALARIO NETO
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
                                  $ {numberFormat(salary.perception_employee)}
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
    periodicities: state.fiscalStore.payment_periodicity,
  };
};

export default connect(mapState)(withAuthSync(calculatorSalary));
