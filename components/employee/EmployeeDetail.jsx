import {
    Layout,
    Breadcrumb,
    Tabs, Form, Input, Modal,
    Row, Col, Spin
} from "antd";
import HeaderCustom from "../../components/Header";
import Axios from "axios";
import {API_URL} from "../../config/config";
import {useEffect, useState} from "react";
const { Content } = Layout;
const { TabPane } = Tabs;
import { useRouter } from "next/router";

const userDetailForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [formUser] = Form.useForm();
    useEffect(() => {
        getUserDetail().then((response) => {
                console.log("RESPONSE-->> ", response);
                setUser(response.data.results);
                formUser.setFieldsValue({
                    idExPedient: response.data.results[0].id,
                    idBirthDay: response.data.results[0].birth_date,
                    noEmployee: response.data.results[0].id,
                    RFC: response.data.results[0].rfc,
                    CURP: response.data.results[0].curp,
                    name: response.data.results[0].name,
                    lastname1: response.data.results[0].flast_name,
                    lastname2: response.data.results[0].mlast_name,
                    email: "",
                    cellphone: "",
                });
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    }, [router.query.id]);
    const getUserDetail = async () => {
        return await Axios.get(API_URL + "/person/person/?id=" + router.query.id)
    };
  return (
      <>
        <Layout>
          <HeaderCustom />
          <Content
              className="site-layout"
              style={{ padding: "0 50px", marginTop: 64 }}
          >
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Recursos Humanos</Breadcrumb.Item>
              <Breadcrumb.Item>Expediente de empleados</Breadcrumb.Item>
            </Breadcrumb>
            <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 380, height: "100%" }}
            >
                <Spin tip="Loading..." spinning={loading}></Spin>
                <Tabs type="card" defaultActiveKey="1">
                    <TabPane tab="Personales" key="1">
                        <Form
                            id="addBusinessForm"
                            name="normal_login"
                            layout={'vertical'}
                            form={formUser}
                        >
                            <Row>
                                <Col span={6}  offset={2}>
                                    <Form.Item
                                        name="idExPedient"
                                        label="ID. Expediente"
                                        rules={[{message: 'Ingresa un expediente'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={4}>
                                    <Form.Item
                                        name="idBirthDay"
                                        label="Fecha de nacimiento"
                                        rules={[{message: 'Ingresa una fecha de nacimiento'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}  offset={2}>
                                    <Form.Item
                                        name="noEmployee"
                                        label="No, Empleado"
                                        rules={[{ message: 'Ingresa un no. empleado'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={4}>
                                    <Form.Item
                                        name="RFC"
                                        label="RFC"
                                        rules={[{message: 'Ingresa un RFC'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}  offset={2}>
                                    <Form.Item
                                        name="name"
                                        label="Nombre(s)"
                                        rules={[{message: 'Ingresa un nombre'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={4}>
                                    <Form.Item
                                        name="CURP"
                                        label="CURP"
                                        rules={[{message: 'Ingresa una CURP'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6} offset={2}>
                                    <Form.Item
                                        name="lastname1"
                                        label="Apellido Paterno"
                                        rules={[{message: 'Ingresa un apellido paterno'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={4}>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={6} offset={2}>
                                    <Form.Item
                                        name="lastname2"
                                        label="Apellido Materno"
                                        rules={[{message: 'Ingresa un apellido materno'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={4}>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={6} offset={2}>
                                    <Form.Item
                                        name="email"
                                        label="Correo eletrónico"
                                        rules={[{message: 'Ingresa un correo eletrónico'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={4}>

                                </Col>
                            </Row>
                            <Row>
                                <Col span={6} offset={2}>
                                    <Form.Item
                                        name="cellphone"
                                        label="Num. de celular"
                                        rules={[{message: 'Ingresa un num. de celular'}]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={4}>

                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane disabled tab="Contratación" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane disabled tab="Civil" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
          </Content>
        </Layout>
      </>
  );
};
export default userDetailForm;
