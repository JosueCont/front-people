import {
    Layout,
    Breadcrumb,
    Tabs, Form, Input, Modal,
    Row, Col, Spin, Card, Typography
} from "antd";
import HeaderCustom from "../../components/Header";
import Axios from "axios";
import {API_URL} from "../../config/config";
import {useEffect, useState} from "react";

const {Content} = Layout;
const {TabPane} = Tabs;
import {useRouter} from "next/router";

const userDetailForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [formUser] = Form.useForm();
    const { Title } = Typography;
    const [personFullName, setPersonFullName] = useState("");
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
                lastname: response.data.results[0].flast_name,
                lastname1: response.data.results[0].mlast_name,
                email: "",
                cellphone: "",
                status: (response.data.results[0].is_active)? "Activo": "Inactivo",
                profile: response.data.results[0].job.name,
                unit: response.data.results[0].job.unit[0].name,
                treatment: response.data.results[0].treatment.name,
                vacancy: (response.data.results[0].vacancy.length > 0)? response.data.results[0].vacancy[0].job.name: "",

            });
            setLoading(false);
            setPersonFullName(response.data.results[0].name + " " + response.data.results[0].flast_name + " " + response.data.results[0].mlast_name)
        })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    }, [router.query.id]);
    const getUserDetail = async () => {
        return await Axios.get(API_URL + "/person/person/?id=" + router.query.id)
    };
    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 10 },
    };
    return (
        <>
            <Layout>
                <HeaderCustom/>
                <Content
                    className="site-layout"
                    style={{padding: "0 50px", marginTop: 64}}
                >
                    <Breadcrumb style={{margin: "16px 0"}}>
                        <Breadcrumb.Item>Recursos Humanos</Breadcrumb.Item>
                        <Breadcrumb.Item>Expediente de empleados</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        className="site-layout-background"
                        style={{padding: 24, minHeight: 380, height: "100%"}}
                    >
                        <Title level={3}>Información Personal</Title>
                        <Title level={4} style={{marginTop: 0}}>{personFullName}</Title>
                        <Spin tip="Loading..." spinning={loading}></Spin>
                        <Form
                            id="addBusinessForm"
                            name="normal_login"
                            layout={'vertical'}
                            form={formUser}
                        >
                            <Card bordered={true}>
                                <Row>
                                    <Col span={6} offset={2}>
                                        <Form.Item
                                            name="treatment"
                                            label="Tratamiento"
                                            rules={[{message: 'Seleccione un tratamiento'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} offset={10}>
                                        <Form.Item
                                            name="status"
                                            label="Estado"
                                            rules={[{message: 'Seleccione un estatus'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={6} offset={2}>
                                        <Form.Item
                                            name="lastname"
                                            label="Apellido Paterno"
                                            rules={[{message: 'Ingresa un apellido paterno'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <Form.Item
                                            name="lastname1"
                                            label="Apellido Materno"
                                            rules={[{message: 'Ingresa un apellido paterno'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <Form.Item
                                            name="name"
                                            label="Nombre(s)"
                                            rules={[{message: 'Ingresa un nombre'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                            <Card bordered={true}   style={{marginTop: "20px"}}>
                                <Row>
                                    <Col span={6} offset={2}>
                                        <Form.Item
                                            name="profile"
                                            label="Perfil base"
                                            rules={[{message: 'Seleccione un perfil'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} offset={2}>
                                        <Form.Item
                                            name="unit"
                                            label="Unidad estratégica "
                                            rules={[{message: 'Seleccione un unidad'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                            <Card bordered={true} style={{marginTop: "20px"}}>
                                <Row>
                                    <Col span={6} offset={2}>
                                        <Form.Item
                                            name="vacancy"
                                            label="Plaza (Activa)"
                                            rules={[{message: 'Seleccione una plaza'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Form >
                            <Tabs type="card" defaultActiveKey="1"   style={{marginTop: "40px"}}>
                                <TabPane tab="Generales" key="1">
                                    <Form  id="addBusinessForm"
                                           name="normal_login"  {...layout}>
                                        <Form.Item
                                            name="email"
                                            label="Dirección de E-Mail"
                                            rules={[{message: 'Ingresa un expediente'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="idBirthDay"
                                            label="Fecha de nacimiento"
                                            rules={[{message: 'Ingresa una fecha de nacimiento'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="civilStatus"
                                            label="Estado Civil"
                                            rules={[{message: 'Selecciona un estado civil'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="gender"
                                            label="Género"
                                            rules={[{message: 'Selecciona un genero'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="placeBirth"
                                            label="Lugar de nacimiento"
                                            rules={[{message: 'Selecciona un lugar de nacimiento'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="nationality"
                                            label="Nacionalidad"
                                            rules={[{message: 'Selecciona una nacionalidad'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="otherNationality"
                                            label="Otra Nacionalidad"
                                            rules={[{message: 'Introduce otra nacionalidad'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="nationalityType"
                                            label="Tipo de Nacionalidad"
                                            rules={[{message: 'Seleccione tipo de nacionalidad'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="CURP"
                                            label="CURP"
                                            rules={[{message: 'Ingresa una CURP'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="RFC"
                                            label="RFC"
                                            rules={[{message: 'Ingresa un RFC'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>


                                        <Form.Item
                                            name="IMSS"
                                            label="IMSS"
                                            rules={[{message: 'Ingresa tú número de IMSS'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="functionalityArea"
                                            label="Área Funcional"
                                            rules={[{message: 'Seleccione una área funcional'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="referencedBy"
                                            label="Referenciado por"
                                            rules={[{message: 'Seleccione un referenciado'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="economicExpectation"
                                            label="Expectativa economica"
                                            rules={[{message: 'Introduce una expectativa economica'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="availabilityTravel"
                                            label="Disponibilidad para viajar regularmente"
                                            rules={[{message: 'Seleccione una opción'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="availabilityChangeHome"
                                            label="Disponibilidad para cambiar de residencia"
                                            rules={[{message: 'Seleccione una opción'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            name="useHands"
                                            label="Uso de las manos"
                                            rules={[{message: 'Seleccione uso de las manos'}]}
                                        >
                                            <Input disabled/>
                                        </Form.Item>

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
