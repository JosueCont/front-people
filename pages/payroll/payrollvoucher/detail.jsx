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
  Card,
  Spin,
} from "antd";
import { PlusOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
const { Content } = Layout;
const { confirm } = Modal;
import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, React } from "react";
import { userCompanyName, withAuthSync } from "../../libs/auth";
import { API_URL } from "../../config/config";

const { Dragger } = Upload;

const AddUploadPayroll = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef(null);
  /* Payrol Person data */
  const [id, setId] = useState(0);
  // const [disabledImport, setDisabledImport] = useState(false);
  const [numEmployee, setNumEmployee] = useState("");
  const [namePerson, setNamePerson] = useState("");
  const [curp, setCurp] = useState("");
  const [rfc, setRfc] = useState("");
  const [imss, setImss] = useState("");
  const [department, setDepartment] = useState("");
  const [job, setJob] = useState("");
  const [payment_start_date, setPayment_start_date] = useState("");
  const [payment_end_date, setPayment_end_date] = useState("");
  const [payment_date, setPayment_date] = useState("");
  const [total_perceptions, setTotal_perceptions] = useState("");
  const [total_deductions, setTotal_deductions] = useState("");
  const [amount, setAmount] = useState("");
  const [number_of_days_paid, setNumber_of_days_paid] = useState("");
  const [movement, setMovement] = useState([]);
  const [detailMov, setDetailMov] = useState([]);
  const [nameUnit, setNameUnit] = useState("");
  const [total_other_payment, setTotal_other_paymen] = useState("");
  const [concept_other_payment, setConcept_other_paymen] = useState("");
  const [code_other_payment, setCode_other_payment] = useState("");

  useEffect(() => {
    setLoading(true);
    Axios.get(
      API_URL + `/payroll/payroll-voucher/${router.query.id}/detail_movements`
    )
      .then((response) => {
        setNamePerson(
          response.data.person.first_name +
            " " +
            response.data.person.flast_name
        );
        setId(response.data.payroll_voucher.id);
        setNameUnit(userCompanyName());
        setNumEmployee(response.data.person.code);
        setCurp(response.data.person.curp);
        setRfc(response.data.person.rfc);
        setImss(response.data.person.imss);
        setDepartment(response.data.person.department.name);
        setJob(response.data.person.job.name);
        setPayment_start_date(response.data.payroll_voucher.payment_start_date);
        setPayment_end_date(response.data.payroll_voucher.payment_end_date);
        setPayment_date(response.data.payroll_voucher.payment_date);
        setTotal_perceptions(response.data.payroll_voucher.total_perceptions);
        setTotal_deductions(response.data.payroll_voucher.total_deductions);
        setAmount(response.data.payroll_voucher.amount);
        setNumber_of_days_paid(
          response.data.payroll_voucher.number_of_days_paid
        );
        setMovement(response.data.payroll_movements);
        setDetailMov(response.data.detail_payroll_movements);
        response.data.payroll_movements.forEach((element) => {
          if (element.movement_type === 3) {
            setTotal_other_paymen(element.amount);
            setConcept_other_paymen(element.concept);
            setCode_other_payment(element.code);
          }
        });
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

  const importPDF = async (e) => {
    let extension = getFileExtension(e.target.files[0].name);
    if (extension == "pdf") {
      let formData = new FormData();
      formData.append("pdf", e.target.files[0]);
      formData.append("id", id);
      setLoading(true);
      Axios.post(
        API_URL + `/payroll/payroll-voucher/import_pdf_voucher/`,
        formData
      )
        .then((response) => {
          // setDisabledImport(true);
          setLoading(false);
          message.success("PDF importado correctamente.");
        })
        .catch((e) => {
          setLoading(false);
          message.error("Error al importar.");
          console.log(e);
        });
    } else {
      message.error("Formato incorrecto, suba un archivo .pdf");
    }
  };
  const getFileExtension = (filename) => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
  };

  const Movements = () => {
    if (movement.length > 0) {
      return (
        <>
          <Card title={nameUnit}>
            <Row>
              <Col xl={12} md={12} sm={12} xs={24}>
                <p>
                  <strong>No. Trabajador:</strong> {numEmployee}
                </p>
                <p>
                  <strong>Nombre:</strong> {namePerson}
                </p>
                <p>
                  <strong>CURP:</strong>
                  {curp}
                </p>
                <p>
                  <strong>RFC:</strong>
                  {rfc}
                </p>
                <p>
                  <strong>IMSS:</strong>
                  {imss}
                </p>
              </Col>
              <Col xl={12} md={12} sm={12} xs={24}>
                <p>
                  <strong>Departamento:</strong> {department}
                </p>
                <p>
                  <strong>Puesto:</strong> {job}
                </p>
                <p>
                  <strong>Perido:</strong> {payment_start_date} -{" "}
                  {payment_end_date}
                </p>
                <p>
                  <strong>Dias trabajados:</strong> {number_of_days_paid}
                </p>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ marginTop: "10px" }}>
                <Row>
                  <Col xl={12} md={12} sm={24} xs={20}>
                    <div
                      style={{
                        backgroundColor: "#3d78b9",
                        textAlign: "center",
                        color: "#fff",
                        marginBottom: "10px",
                      }}
                    >
                      Percepciones
                    </div>
                    {detailMov.map((det, i) => (
                      <Row>
                        {det.movement_type === 1 && (
                          <Col span={24}>
                            <Row>
                              <Col xl={5} md={5} xs={4}>
                                {det.key_code}
                              </Col>
                              <Col xl={10} md={14} xs={16}>
                                {det.concept}
                              </Col>
                              <Col xl={5} md={5} xs={4}>
                                ${det.taxed_amount}
                              </Col>
                            </Row>
                          </Col>
                        )}
                      </Row>
                    ))}
                  </Col>
                  <Col xl={12} md={12} sm={24} xs={20}>
                    <div
                      style={{
                        backgroundColor: "#3d78b9",
                        textAlign: "center",
                        color: "#fff",
                        marginBottom: "10px",
                      }}
                    >
                      Deducciones
                    </div>
                    {detailMov.map((det, i) => (
                      <Row>
                        {det.movement_type === 2 && (
                          <Col span={24}>
                            <Row>
                              <Col xl={5} md={5} xs={4}>
                                {det.key_code}
                              </Col>
                              <Col xl={10} md={14} xs={16}>
                                {det.concept}
                              </Col>
                              <Col xl={5} md={5} xs={4}>
                                ${det.amount}
                              </Col>
                            </Row>
                          </Col>
                        )}
                      </Row>
                    ))}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#3d78b9",
                    textAlign: "center",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  Otros Pagos
                </div>

                <Row>
                  <Col span={24}>
                    <Row>
                      <Col xl={5} md={5} xs={4}>
                        {code_other_payment}
                      </Col>
                      <Col xl={10} md={14} xs={16}>
                        {concept_other_payment}
                      </Col>
                      <Col xl={5} md={5} xs={4}>
                        ${total_other_payment}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col
                span={24}
                style={{
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#3d78b9",
                    textAlign: "center",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  Totales
                </div>
                <Row>
                  <Col xl={12} md={12} xs={24}>
                    <Row>
                      <Col span={12}>
                        <strong>Total decucciones:</strong>
                      </Col>
                      <Col span={12}>
                        <strong>{total_deductions}</strong>
                      </Col>
                    </Row>
                  </Col>
                  <Col xl={12} md={12} xs={24}>
                    <Row>
                      <Col span={12}>
                        <strong>Total Percepciones:</strong>
                      </Col>
                      <Col span={12}>
                        <strong>{total_perceptions}</strong>
                      </Col>
                    </Row>
                  </Col>

                  <Col xl={12} md={12} xs={24}>
                    <Row>
                      <Col span={12}>
                        <strong>Total pagado:</strong>
                      </Col>
                      <Col span={12}>
                        <strong>{amount}</strong>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <MainLayout currentKey="9">
      <Spin tip="Cargando..." spinning={loading}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Recibos de nómina</Breadcrumb.Item>
          <Breadcrumb.Item>Detalle de recibos de nómina</Breadcrumb.Item>
        </Breadcrumb>
        <Row></Row>

        <Content className="site-layout">
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 380,
              height: "100%",
            }}
          >
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  style={{ marginRight: "5px", marginBottom: 10 }}
                  onClick={() => router.push({ pathname: "/payrollvoucher" })}
                >
                  Regresar
                </Button>
                <Button
                  type="primary"
                  className={"ml-20"}
                  icon={<UploadOutlined />}
                  onClick={() => {
                    inputFileRef.current.click();
                  }}
                  // disabled={disabledImport}
                >
                  Importar PDF
                </Button>
                <input
                  ref={inputFileRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => importPDF(e)}
                />
              </Col>
              <Col span={24}>
                {movement.length > 0 ? rendermovements() : null}
              </Col>
            </Row>
          </div>
        </Content>
      </Spin>
    </MainLayout>
  );
};
export default withAuthSync(AddUploadPayroll);
