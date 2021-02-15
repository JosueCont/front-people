import { useEffect } from "react";
import { withAuthSync } from "../../../libs/auth";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Tabs, Form, Row, Col, Layout } from "antd";

const { Content } = Layout;

const configBusiness = () => {
  const { TabPane } = Tabs;
  useEffect(() => {}, []);

  return (
    <>
      <MainLayout currentKey="3.2">
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item href="/home/">Inicio</Breadcrumb.Item>
          <Breadcrumb.Item>Configuración general</Breadcrumb.Item>
        </Breadcrumb>
        <Content className="site-layout">
          <div style={{ padding: "1%", float: "right" }}></div>
        </Content>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <Tabs tabPosition={"left"}>
            <TabPane tab="Datos generales" key="tab_1">
              <Form layout={"vertical"}>
                <Row>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="place_birth" label="Lugar de nacimiento">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="nationality" label="Nacionalidad">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="other_nationality"
                      label="Otra nacionalidad"
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="allergies" label="Alergias">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item name="blood_type" label="Tipo de sangre">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                      name="availability_travel"
                      label="Disponibilidad para viajar"
                    >
                      <Checkbox />
                    </Form.Item>
                  </Col>
                  <Col lg={6} xs={22} offset={1}>
                    <Form.Item label="Cambio de residencia">
                      <Checkbox />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"end"}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Guardar
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </MainLayout>
    </>
  );
};

export default withAuthSync(configBusiness);
