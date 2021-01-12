import {
    Layout,
    Breadcrumb,
    Tabs, Form, Input, Modal, InputNumber,
    Row, Col, Spin, Card, Typography, Select, DatePicker, Button
} from "antd";
import HeaderCustom from "../../components/Header";
import Axios from "axios";
import {API_URL} from "../../config/config";
import {useEffect, useState} from "react";

const {Content} = Layout;
const {TabPane} = Tabs;
import {useRouter} from "next/router";
const { Option } = Select;

const userDetailForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [formUser] = Form.useForm();
    const [formGeneralTab] = Form.useForm();
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
        getGeneralTab().then((response) => {
            console.log("RESPONSE GENERAL TAB-->> ", response);
            formGeneralTab.setFieldsValue({
                email: "",
                birthDay: "",
                civilStatus: "",
                gender: response.data.results[0].person.gender.toString(),
                placeBirth: response.data.results[0].place_birth,
                nationality: response.data.results[0].nationality,
                otherNationality: response.data.results[0].otherNationality,
                nationalityType: "",
                CURP: response.data.results[0].person.curp,
                RFC: response.data.results[0].person.rfc,
                IMSS: response.data.results[0].person.imss,
                functionalityArea: "",
                availabilityChangeHome: (response.data.results[0].availability_change_residence)? "true": "false",
                referencedBy: "",
                economicExpectation: "",
                availabilityTravel: (response.data.results[0].availability_travel)? "true": "false",
                useHands: "",
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
    const getGeneralTab = async () => {
        return await Axios.get(API_URL + "/person/general-person/?person=" + router.query.id)
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
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/home/">Person</Breadcrumb.Item>
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
                                    <Form  id="FormGeneralTab"
                                           form={formGeneralTab}
                                           name="normal_login"  {...layout}>
                                        <Form.Item
                                            name="email"
                                            label="Dirección de E-Mail"
                                            rules={[{message: 'Ingresa un email'}]}
                                        >
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item
                                            name="birthDay"
                                            label="Fecha de nacimiento"
                                        >
                                            <DatePicker style={{ width: 540 }} />
                                        </Form.Item>

                                        <Form.Item
                                            name="civilStatus"
                                            label="Estado Civil"
                                            rules={[{message: 'Selecciona un estado civil'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                                <Option value="1">Casado</Option>
                                                <Option value="2">Soltero</Option>
                                                <Option value="3">Viudo</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="gender"
                                            label="Género"
                                            rules={[{message: 'Selecciona un genero'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                                <Option value="1">Masculino</Option>
                                                <Option value="2">Femenino</Option>
                                                <Option value="3">Otro</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="placeBirth"
                                            label="Lugar de nacimiento"
                                            rules={[{message: 'Selecciona un lugar de nacimiento'}]}
                                        >
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item
                                            name="nationality"
                                            label="Nacionalidad"
                                            rules={[{message: 'Selecciona una nacionalidad'}]}
                                        >
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item
                                            name="otherNationality"
                                            label="Otra Nacionalidad"
                                            rules={[{message: 'Introduce otra nacionalidad'}]}
                                        >
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item
                                            name="nationalityType"
                                            label="Tipo de Nacionalidad"
                                            rules={[{message: 'Seleccione tipo de nacionalidad'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="CURP"
                                            label="CURP"
                                            rules={[{message: 'Ingresa una CURP'}]}
                                        >
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item
                                            name="RFC"
                                            label="RFC"
                                            rules={[{message: 'Ingresa un RFC'}]}
                                        >
                                            <Input/>
                                        </Form.Item>


                                        <Form.Item
                                            name="IMSS"
                                            label="IMSS"
                                            rules={[{message: 'Ingresa tú número de IMSS'}]}
                                        >
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item
                                            name="functionalityArea"
                                            label="Área Funcional"
                                            rules={[{message: 'Seleccione una área funcional'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="referencedBy"
                                            label="Referenciado por"
                                            rules={[{message: 'Seleccione un referenciado'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="economicExpectation"
                                            label="Expectativa economica"
                                        >
                                            <InputNumber style={{ width: 540 }}/>
                                        </Form.Item>

                                        <Form.Item
                                            name="availabilityTravel"
                                            label="Disponibilidad para viajar regularmente"
                                            rules={[{message: 'Seleccione una opción'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                                <Option value="true">SI</Option>
                                                <Option value="false">NO</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="availabilityChangeHome"
                                            label="Disponibilidad para cambiar de residencia"
                                            rules={[{message: 'Seleccione una opción'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                                <Option value="true">SI</Option>
                                                <Option value="false">NO</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="useHands"
                                            label="Uso de las manos"
                                            rules={[{message: 'Seleccione uso de las manos'}]}
                                        >
                                            <Select defaultValue="">
                                                <Option value="">-------</Option>
                                                <Option value="true">Diestro</Option>
                                                <Option value="false">Derecho</Option>
                                                <Option value="false">Zurdo</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Aceptar
                                            </Button>
                                            <Button htmlType="button">
                                                Regresar
                                            </Button>
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
