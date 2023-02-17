import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Row, Col, Card, Typography, Form, Input, Select, DatePicker, Spin } from 'antd';
import {
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import MainLayout from '../../../layout/MainLayout_user';
import { Content } from 'antd/lib/layout/layout';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import { civilStatus, genders } from '../../../utils/constant';
import SelectPersonType from '../../../components/selects/SelectPersonType';
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from "moment";

const index = ({userStore, ...props}) => {
    const router = useRouter();
    const { Title } = Typography;
    const [formInformation] = Form.useForm();
    const [photoUser, setPhotoUser] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [name, setName] = useState("");

    useEffect(() => {
        if (userStore) {
            getData(userStore)
            let nameUser = userStore.first_name + " " + userStore.flast_name + " " + userStore.mlast_name
            setName(nameUser)
            setPhotoUser(userStore.photo != null ? userStore.photo : "/images/profile-sq.jpg")   
        }   
    }, [userStore]);

    const getData = (userStore) =>{
        formInformation.setFieldsValue({
            code : userStore.code,
            person_type: userStore.person_type,
            first_name: userStore.first_name,
            flast_name: userStore.flast_name,
            mlast_name: userStore.mlast_name,
            email: userStore.email,
            civil_status: userStore.civil_status,
            gender: userStore.gender,
            curp: userStore.curp,
            rfc: userStore.rfc,
        })
        if(userStore.timestamp){
            formInformation.setFieldsValue({
                date_of_admission: moment(userStore.timestamp)
            })
        }
        if(userStore.birth_date){
            formInformation.setFieldsValue({
                birth_date: moment(userStore.birth_date)
            })
        }
        setLoadingData(false)
    }


  return (
    <>
        <MainLayout currentKey={'jb_settings'} defaultOpenKeys={["recruitmentSelection",'job_bank']}>
            <Content className="site-layout">
                <Spin tip="Cargando..." spinning={loadingData}>
                    <Row>
                        <Title level={3}>Información Personal</Title>
                        <Card bordered={true} style={{width:"100%"}}>
                            <Row>
                                <Col span={12}>
                                    <Title level={4} style={{ marginTop: 0 }}>{name}</Title>
                                </Col>
                                <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/user")} >
                                    Regresar
                                    </Button>
                                </Col>
                            </Row>
                            <Form layout={"vertical"} form={formInformation}>
                                <Row>
                                    <Col span={24}>
                                        <Row gutter={20} style={{marginBottom:"16px"}} >
                                            <Col lg={8} xs={12}>
                                                <img
                                                    className="img"
                                                    src={photoUser}
                                                    alt="avatar"
                                                    preview={false}
                                                    style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    borderRadius: "11px",
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row gutter={20}>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Número de empleado" name="code">
                                                    <Input type="text" placeholder="Núm. empleado" readOnly />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} xs={12}>
                                                <SelectPersonType isDisabled={true} label="Tipo de persona" />
                                            </Col>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Fecha de ingreso a la plataforma" name="date_of_admission">
                                                    <DatePicker
                                                        locale={locale}
                                                        style={{ width: "100%" }}
                                                        format={"DD-MM-YYYY"}
                                                        placeholder="Fecha de ingreso a la plataforma"
                                                        disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={20}>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Nombres" name="first_name">
                                                    <Input type="text" placeholder="Nombres" readOnly />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Apellido paterno" name="flast_name">
                                                    <Input type="text" placeholder="Apellido paterno" readOnly />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} xs={12}>
                                            <Form.Item label="Apellido materno" name="mlast_name">
                                                    <Input type="text" placeholder="Apellido materno" readOnly />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={20}>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Correo electrónico" name="email">
                                                    <Input type="text" placeholder="Correo electrónico" readOnly />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Fecha de nacimiento" name="birth_date">
                                                    <DatePicker
                                                        locale={locale}
                                                        style={{ width: "100%" }}
                                                        format={"DD-MM-YYYY"}
                                                        placeholder="Fecha de nacimiento"
                                                        disabled={true}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Estado civil" name="civil_status">
                                                    <Select
                                                        placeholder="Estado civil"
                                                        options={civilStatus}
                                                        disabled
                                                        notFoundContent={"No se encontraron resultados."}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={20}>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="Género" name="gender">
                                                    <Select
                                                        placeholder="Género"
                                                        options={genders}
                                                        disabled
                                                        notFoundContent={"No se encontraron resultados."}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="CURP" name="curp">
                                                    <Input type="text" placeholder="CURP" readOnly />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={8} xs={12}>
                                                <Form.Item label="RFC" name="rfc">
                                                    <Input type="text" placeholder="RFC" readOnly />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Row>
                </Spin>
            </Content>
        </MainLayout>
    </>
  )
}

const mapState = (state) =>{
    return{
        userStore: state.userStore.user,
    }
}

export default connect(mapState)(withAuthSync(index));