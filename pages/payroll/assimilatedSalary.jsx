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
} from "antd";
import Avatar from "antd/lib/avatar/avatar";
import Meta from "antd/lib/card/Meta";
import { Content } from "antd/lib/layout/layout";
import axios from "axios";
import { set } from "js-cookie";
import { useState } from "react";
import { connect } from "react-redux";
import WebApi from "../../api/webApi";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import SelectPeriodicity from "../../components/selects/SelectPeriodicity";
import SelectYear from "../../components/selects/SelectYear";
import MainLayout from "../../layout/MainLayout";
import { ruleRequired } from "../../utils/constant";

const assimilatedSalary = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState(null);
  const [type, setType] = useState(0);

  const onFinish = (value) => {
    setSalary(null);
    setLoading(true);
    axios
      .post(
        "http://gape.localhost:8000/fiscal/assimilated_salary_calculation",
        value
      )
      .then((response) => {
        console.log("Respo-> ", response.data);
        setTimeout(() => {
          setSalary(response.data);
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.log("Error-> ", error);
        message.error("Ocurrio un error intente de nuevo");
        setSalary(null);
        setLoading(false);
      });
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
      console.log(form.getFieldValue("person_id"));
      if (form.getFieldValue("person_id"))
        console.log("Form-> ", form.getFieldsValue());
      else message.error("Seleccione un colaborador.");
      // let response = WebApi.getCfdi()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout currentKey="1">
      <Content className="site-layout">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item href="/home/">Inicio</Breadcrumb.Item>
          <Breadcrumb.Item>Nomina</Breadcrumb.Item>
          <Breadcrumb.Item>Nomina asimilados</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="container"
          style={{ width: "100%", backgroundColor: "white", padding: "2%" }}
        >
          <Row justify={"space-between"} className={"formFilter"}>
            <Col>
              <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row style={{ marginBottom: "20px" }} gutter={[24]}>
                  <Col span={12}>
                    <SelectCollaborator
                      placeholder="Colaboradores"
                      name="person_id"
                    />
                  </Col>
                </Row>
                <Row gutter={[10]}>
                  <Col>
                    <Form.Item label="Tipo de calculo" name="type">
                      <Select
                        options={types}
                        placeholder="Tipo de calculo"
                        onChange={(value) => {
                          setType(value), setSalary(null);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item label="Salario" name="salary">
                      <Input placeholder="Salario" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <SelectPeriodicity />
                  </Col>
                  <Col>
                    <SelectYear />
                  </Col>
                  <Col
                    className="button-filter-person"
                    style={{ display: "flex" }}
                  >
                    <Button className="btn-filter" htmlType="submit">
                      Calcular
                    </Button>
                  </Col>
                  <Col
                    className="button-filter-person"
                    style={{ display: "flex" }}
                  >
                    <Button
                      className="btn-filter"
                      onClick={() => generateCfdi()}
                    >
                      Generar cfdi
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <div style={{ padding: "5%" }}>
            <Spin tip="Cargando..." spinning={loading}>
              {salary && (
                <Row gutter={24}>
                  <Col
                    span={12}
                    style={{ textAlign: "left", border: "1px black solid" }}
                  >
                    <span style={{ fontWeight: type == 1 && "bold" }}>
                      ASIMILADO BRUTO
                    </span>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      border: "1px black solid",
                      backgroundColor: type == 1 && "yellow",
                    }}
                  >
                    {type == 1 ? salary.salary : salary.assimilated_salary}
                  </Col>
                  <Col span={12} style={{ border: "1px black solid" }}>
                    <span>- Límite inferior</span>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      border: "1px black solid",
                    }}
                  >
                    {salary.lower_limit}
                  </Col>
                  <Col span={12} style={{ border: "1px black solid" }}>
                    <span>= Excedente del límite inferior</span>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      border: "1px black solid",
                    }}
                  >
                    {salary.surplus}
                  </Col>
                  <Col span={12} style={{ border: "1px black solid" }}>
                    <span>× % sobre excedente del límite inferior</span>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      border: "1px black solid",
                    }}
                  >
                    {salary.percentage_exceeding_lower_limit}
                  </Col>
                  <Col span={12} style={{ border: "1px black solid" }}>
                    <span>= Impuesto marginal</span>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      border: "1px black solid",
                    }}
                  >
                    {salary.marginal_tax}
                  </Col>
                  <Col span={12} style={{ border: "1px black solid" }}>
                    <span>+ Cuota fija del impuesto</span>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      border: "1px black solid",
                    }}
                  >
                    {salary.fixed_fee}
                  </Col>

                  <Col span={12} style={{ border: "1px black solid" }}>
                    <span>I.S.R. a cargo</span>
                  </Col>
                  <Col span={4} style={{ border: "1px black solid" }}>
                    {salary.charge_isr}
                  </Col>
                  <Col span={12} style={{ border: "1px black solid" }}>
                    <span style={{ fontWeight: type == 2 && "bold" }}>
                      ASIMILADO NETO
                    </span>
                  </Col>
                  <Col
                    span={4}
                    style={{
                      border: "1px black solid",
                      backgroundColor: type == 2 && "yellow",
                    }}
                  >
                    $ {type == 1 ? salary.assimilated_salary : salary.salary}
                  </Col>
                </Row>
              )}
            </Spin>
          </div>
        </div>
      </Content>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore_current_node,
  };
};

export default connect(mapState)(assimilatedSalary);
