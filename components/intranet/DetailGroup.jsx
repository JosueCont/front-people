import {Col, Divider, Button, Layout, Modal, Row, Typography} from "antd";
import React from "react";

const {Title, Text} = Typography;
const DetailGroup = (props) => {


    return (
        <>
            <Layout>
                <Modal
                    maskClosable={false}
                    title={"Detalle del grupo"}
                    centered
                    visible={props.visible}
                    onCancel={() => props.close(false)}
                    width={"50%"}
                    footer={[
                        <Button key="back" onClick={() => props.close(false)}>
                            Cerrar
                        </Button>,
                    ]}
                >
                    <Row>
                        <Col span={17}>
                            <Row>
                                <Col lg={10} xs={24} offset={1}>
                                    <Title level={5}>Nombre:</Title>
                                </Col>
                                <Col lg={8} xs={24} offset={1}>
                                    <Text level={5}>{props.group.name}</Text>
                                </Col>
                            </Row>
                        </Col>
                        {
                            props.group.description &&
                            <>
                                <Divider dashed/>
                                <Col span={17}>
                                    <Row>
                                        <Col lg={10} xs={24} offset={1}>
                                            <Title level={5}>Descripción:</Title>
                                        </Col>
                                        <Col lg={8} xs={24} offset={1}>
                                            <Text level={5}>{props.group.description}</Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </>
                        }
                        {
                            props.group.image &&
                            <>
                                <Divider dashed/>
                                <Col span={17}>
                                    <Row>
                                        <Col lg={10} xs={24} offset={1}>
                                            <Title level={5}>Imagen:</Title>
                                        </Col>
                                        <Col lg={8} xs={24} offset={1}>
                                            <img
                                                className="img"
                                                src={props.group.image}
                                                alt="avatar"
                                                preview={false}
                                                style={{width:100}}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </>
                        }

                    </Row>

                </Modal>
            </Layout>
        </>)
}
export default DetailGroup;