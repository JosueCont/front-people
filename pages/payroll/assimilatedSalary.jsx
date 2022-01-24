import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Spin,
  Form,
  Row,
  Col,
  Button,
  Input,
  Card,
  Skeleton,
  Select,
  message,
  Checkbox,
  Typography,
} from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Meta from "antd/lib/card/Meta";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { connect } from "react-redux";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import SelectPeriodicity from "../../components/selects/SelectPeriodicity";
import SelectYear from "../../components/selects/SelectYear";
import MainLayout from "../../layout/MainLayout";
import { monthsName } from "../../utils/constant";
import webApiFiscal from "../../api/WebApiFiscal";
import { Global } from "@emotion/core";
import { ruleRequired } from "../../utils/rules";

const assimilatedSalary = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState(null);
  const [type, setType] = useState(0);
  const [allowance, setAllowance] = useState(false);
  const [mont, setMonth] = useState(0);

  const { Text, Title } = Typography;

  const onFinish = async (value) => {
    value.allowance = allowance;
    value.salary = parseFloat(value.salary);
    setSalary(null);
    setLoading(true);
    try {
      let response = await webApiFiscal.assimilatedSalaryCalculation(value);
      if (response.status == 200) {
        setTimeout(() => {
          setSalary(response.data);
          setLoading(false);
        }, 500);
      } else {
        message.error("Ocurrio un error intente de nuevo");
        setSalary(null);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      message.error("Ocurrio un error intente de nuevo, " + error);
      setSalary(null);
      setLoading(false);
    }
  };
  const types = [
    {
      label: "Bruto-Neto",
      value: 1,
    },
    {
      label: "Neto-Bruto",
      value: 2,
    },
  ];

  const generateCfdi = () => {
    try {
      if (form.getFieldValue("person_id")) return;
      else message.error("Seleccione un colaborador.");
      // let response = WebApi.getCfdi()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout currentKey={["asimilado"]} defaultOpenKeys={["nomina"]}>
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
            background-color: #7B25F1;
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
          <Breadcrumb.Item href="/home/">Inicio</Breadcrumb.Item>
          <Breadcrumb.Item>Nomina</Breadcrumb.Item>
          <Breadcrumb.Item>Nomina asimilados</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col md={23}>
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
                        />
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Tipo de calculo" name="type">
                          <Select
                            size="large"
                            options={types}
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
                        <SelectYear size="large" />
                      </Col>
                      <Col md={12}>
                        <Form.Item label="Subsidio" name="allowance">
                          <Checkbox
                            onChange={() => {
                              allowance
                                ? setAllowance(false)
                                : setAllowance(true);
                            }}
                            placeholder="Subsidio"
                          />
                        </Form.Item>
                      </Col>
                      {allowance && (
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
                      <Col
                        className="button-filter-person"
                        style={{ display: "flex" }}
                      >
                        <Button
                          className="btn-generate"
                          onClick={() => generateCfdi()}
                          size="large"
                        >
                          {/* Generar cfdi */}
                          Guardar PDF
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
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
                          <Col span={18}>
                            <Text strong={type == 1 ? true : false}>
                              {/* <span style={{ fontWeight: type == 1 && "bold" }}> */}
                              ASIMILADO BRUTO
                            </Text>
                          </Col>
                          <Col span={6} className="border-results">
                            <Text>$ {salary.gross_salary}</Text>
                          </Col>
                        </Row>
                        <Row
                          className="table-grid-results"
                          style={{ marginTop: 20 }}
                        >
                          <Col span={18}>
                            <Text>- Límite inferior</Text>
                          </Col>
                          <Col span={6}>{salary.lower_limit}</Col>
                          <Col span={18}>
                            <span>= Excedente del límite inferior</span>
                          </Col>
                          <Col span={6}>{salary.surplus}</Col>
                          <Col span={18}>
                            <span>× % sobre excedente del límite inferior</span>
                          </Col>
                          <Col span={6}>
                            {salary.percentage_exceeding_lower_limit}
                          </Col>
                          <Col span={18}>
                            <span>= Impuesto marginal</span>
                          </Col>
                          <Col span={6}>{salary.marginal_tax}</Col>
                          <Col span={18}>
                            <span>+ Cuota fija del impuesto</span>
                          </Col>
                          <Col span={6}>{salary.fixed_fee}</Col>
                          <Col span={18}>
                            <span>I.S.R. a cargo</span>
                          </Col>
                          <Col span={6}>{salary.charge_isr}</Col>
                          {allowance && (
                            <>
                              <Col span={18}>
                                <span>Retención IMSS</span>
                              </Col>
                              <Col span={6}>{salary.retention_imss}</Col>
                              <Col span={18}>
                                <span>
                                  {" "}
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
                              <Col span={6}>{salary.perception_employee}</Col>
                              <Col span={18}>
                                <span>IMSS/INFONAVIT</span>
                              </Col>
                              <Col span={6}>
                                {salary["imss/infonavit/afore"]}
                              </Col>
                            </>
                          )}
                        </Row>
                        {!allowance && (
                          <Row className="table-grid-footer">
                            <Col span={18}>
                              <Text strong={type == 1 ? true : false}>
                                ASIMILADO NETO
                              </Text>
                            </Col>
                            <Col
                              span={6}
                              style={{ backgroundColor: type == 2 && "yellow" }}
                              className="border-results"
                            >
                              <Text>
                                $23432
                                {/* $ {salary.net_salary} */}
                              </Text>
                            </Col>
                          </Row>
                        )}
                      </div>
                    )}
                  </Spin>
                </Col>
                <Col md={12}></Col>
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
  };
};

export default connect(mapState)(assimilatedSalary);
