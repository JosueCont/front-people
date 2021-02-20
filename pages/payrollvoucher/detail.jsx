import {
    Input,
    Layout,
    Breadcrumb,
    Button,
    Row,
    Col,
    Modal,
    message,
    Upload,
    Descriptions,
    Badge,
} from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
const { Content } = Layout;
const { confirm } = Modal;
import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, React } from "react";
import { withAuthSync } from "../../libs/auth";
import { API_URL } from "../../config/config";

const { Dragger } = Upload;

const AddUploadPayroll = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [namePerson, setNamePerson] = useState("");
    const [rfc, setRfc] = useState("");
    const [payment_start_date, setPayment_start_date] = useState("");
    const [payment_end_date, setPayment_end_date] = useState("");
    const [payment_date, setPayment_date] = useState("");
    const [total_perceptions, setTotal_perceptions] = useState("");
    const [total_deductions, setTotal_deductions] = useState("");
    const [amount, setAmount] = useState("");
    const [number_of_days_paid, setNumber_of_days_paid] = useState("");
    const [movement, setMovement] = useState([]);
    const [detailMov, setDetailMov] = useState([]);

    useEffect(() => {
        Axios.get(
            API_URL + `/payroll/payroll-voucher/${router.query.id}/detail_movements`
        )
            .then((response) => {
                console.log("Person-->> ", response.data.person);
                setNamePerson(
                    response.data.person.first_name +
                    " " +
                    response.data.person.flast_name
                );
                setRfc(response.data.person.rfc);
                setPayment_start_date(response.data.payroll_voucher.rfc);
                setPayment_end_date(response.data.payroll_voucher.payment_start_date);
                setPayment_date(response.data.payroll_voucher.payment_end_date);
                setTotal_perceptions(response.data.payroll_voucher.total_perceptions);
                setTotal_deductions(response.data.payroll_voucher.total_deductions);
                setAmount(response.data.payroll_voucher.amount);
                setNumber_of_days_paid(
                    response.data.payroll_voucher.number_of_days_paid
                );
                setMovement(response.data.payroll_movements);
                setDetailMov(response.data.detail_payroll_movements);
                console.log("res", response.data);
                setLoading(false);
            })
            .catch((response) => {
                setLoading(false);
                message.error("Error al obtener, intente de nuevo");
            });
    }, [router]);

    const rendermovements = () => {
        if (movement.length > 0 && detailMov.length > 0) {
            return Movements();
        }
    };

    const Movements = () => {
        console.log("movimientos", movement);
        if (movement.length > 0) {
            return (
                <>
                    <Descriptions title="Recibo de nómina" layout="vertical" bordered>
                        <Descriptions.Item label="Colaborador:">
                            {namePerson}
                        </Descriptions.Item>
                        <Descriptions.Item label="RFC:"> {rfc}</Descriptions.Item>
                        <Descriptions.Item label="Numero de días pagados:">
                            {number_of_days_paid}
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha inicial de pago:">
                            {payment_start_date}
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha final de pago:">
                            {payment_end_date}
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha de pago:">
                            {payment_date}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total percepciones:">
                            ${total_perceptions}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total deducciones:">
                            ${total_deductions}
                        </Descriptions.Item>
                        <Descriptions.Item label="Importe:">${amount}</Descriptions.Item>

                        <Descriptions.Item label="Percepciones:" span={3}>
                            {movement.map((mov, i) => (
                                <div span={3}>
                                    {mov.movement_type === 1 && (
                                        <div>
                                            <Row>
                                                <Col xl={8} md={12} xs={24}>
                                                    Total de pago: ${mov.total_salaries}
                                                </Col>
                                                <Col xl={8} md={12} xs={24}>
                                                    Total gravada: ${mov.total_taxed}
                                                </Col>
                                                <Col xl={8} md={12} xs={24}>
                                                    Total exento: ${mov.total_exent}
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Detalle de percepción:" span={3}>
                            {detailMov.map((det, i) => (
                                <div>
                                    {det.movement_type === 1 && (
                                        <Row>
                                            <Col span={24}>
                                                <Row>
                                                    <Col xl={8} md={8} xs={24}>
                                                        Tipo de percepción: {det.perception_type}
                                                    </Col>
                                                    <Col xl={8} md={8} xs={24}>
                                                        Concepto: {det.concept}
                                                    </Col>
                                                    <Col xl={8} md={8} xs={24}>
                                                        Clave: {det.key_code}
                                                    </Col>
                                                    <Col xl={8} md={8} xs={24}>
                                                        Importe gravado: ${det.taxed_amount}
                                                    </Col>
                                                    <Col xl={8} md={8} xs={24}>
                                                        Importe exento: ${det.amount_exent}
                                                    </Col>
                                                </Row>
                                                <br />
                                            </Col>
                                        </Row>
                                    )}
                                </div>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Deducciones totales:" span={3}>
                            {movement.map((mov, i) => (
                                <div span={3}>
                                    {mov.movement_type === 2 && (
                                        <div>
                                            <Row>
                                                <Col xl={12} md={12} xs={24}>
                                                    Total de pago: {mov.total_other_deductions}
                                                </Col>
                                                <Col xl={12} md={12} xs={24}>
                                                    Total gravada: {mov.total_taxes_withheld}
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Detalle de deducciones:" span={3}>
                            {detailMov.map((det, i) => (
                                <div>
                                    {det.movement_type === 2 && (
                                        <Row>
                                            <Col span={24}>
                                                <Row>
                                                    <Col xl={6} md={6} xs={24}>
                                                        Tipo de deducción: {det.deduction_type}
                                                    </Col>
                                                    <Col xl={6} md={6} xs={24}>
                                                        Concepto: {det.concept}
                                                    </Col>
                                                    <Col xl={6} md={6} xs={24}>
                                                        Clave: {det.key_code}
                                                    </Col>
                                                    <Col xl={6} md={6} xs={24}>
                                                        Cantidad: ${det.amount}
                                                    </Col>
                                                </Row>
                                                <br />
                                            </Col>
                                        </Row>
                                    )}
                                </div>
                            ))}
                        </Descriptions.Item>
                    </Descriptions>
                </>
            );
        } else {
            return null;
        }
    };

    return (
        <MainLayout currentKey="9">
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item className={'pointer'} onClick={() => route.push({ pathname: "/home" })}>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item>Recibos de nómina</Breadcrumb.Item>
                <Breadcrumb.Item>Detalle de recibos de nómina</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="site-layout">
                <div style={{ padding: "1%", float: "right" }}>
                    <Button
                        style={{ marginRight: "5px" }}
                        onClick={() => router.push({ pathname: "/payrollvoucher" })}
                    >
                        Regresar
          </Button>
                </div>
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 380,
                        height: "100%",
                    }}
                >
                    <Row>
                        <Col span={24}>
                            {movement.length > 0 ? rendermovements() : null}
                        </Col>
                    </Row>
                </div>
            </Content>
        </MainLayout>
    );
};
export default withAuthSync(AddUploadPayroll);
