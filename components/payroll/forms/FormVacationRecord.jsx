import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Divider,
  Tooltip,
  Space,
} from "antd";
import locale from "antd/lib/date-picker/locale/es_ES";
import {
  typeEmployee,
  typeSalary,
  reduceDays,
  FACTOR_SDI,
  InfonavitDiscountType,
} from "../../../utils/constant";
import SelectFamilyMedicalUnit from "../../selects/SelectFamilyMedicalUnit";
import { EditOutlined, SyncOutlined } from "@ant-design/icons";
import SelectMedicineUnity from "../../selects/SelectMedicineUnity";
import WebApiPayroll from "../../../api/WebApiPayroll";
import moment from "moment";
import {
  fourDecimal,
  minLengthNumber,
  onlyNumeric,
  ruleRequired,
} from "../../../utils/rules";

const FormVacationRecord = ({ person, person_id = null, node }) => {
  const { Title } = Typography;
  const [formVacationsRecord] = Form.useForm();

  const [loadingForm, setLoadingForm] = useState(false);
  const [updateRegister, setUpdateRegister] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const [vacationsRecord, setVacationsRecord] = useState([]);

  const colVacations = [
    {
      title: "periodo",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Días de vacaciones",
      dataIndex: "vacations_days",
      key: "vacations_days",
    },
    {
      title: "Vacaciones pendientes",
      dataIndex: "vacations_pending",
      key: "type",
    },
    {
      title: "Prima vacacional",
      dataIndex: "vacations_premium_days",
      key: "vacations_premium_days",
    },
    {
      title: "Prima vacacional pendiente",
      dataIndex: "vacations_premium_pending",
      key: "vacations_premium_pending",
    },
    {
      title: "Opciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col
                className="gutter-row"
                offset={1}
                style={{ padding: "0px 20px" }}
              >
                <Tooltip title="Editar">
                  <EditOutlined
                    style={{ fontSize: "20px" }}
                    onClick={() => setUpdateRegister(item)}
                  />
                </Tooltip>
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getVacationsRecors();
  }, [person_id]);

  const getVacationsRecors = async () => {
    setLoadingTable(true);
    try {
      let response = await WebApiPayroll.getVacationsRecord(person_id);
      //   console.log("🚀 ~ getVacationsRecors ~ response", response);
      setVacationsRecord(response.data.results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const saveVacationRecord = (values) => {
    setLoadingTable(true);

    if (updateRegister && updateRegister.id) {
    } else {
      WebApiPayroll.saveVacationsRecord(values)
        .then((response) => {
          message.success("Guardado exitosamente");
          setLoadingTable(false);
          getVacationsRecors();
        })
        .catch(async (error) => {
          if (error?.response?.data?.message) {
            message.error(error?.response?.data?.message);
            setLoadingTable(false);
          } else message.error(messageError);
          setLoadingTable(false);
        });
    }
  };

  return (
    <>
      <Spin tip="Cargando..." spinning={loadingForm}>
        <Row>
          <Title style={{ fontSize: "20px" }}>IMSS</Title>
        </Row>
        <Form
          layout="vertical"
          form={formVacationsRecord}
          onFinish={saveVacationRecord}
        >
          <Row>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="service_years"
                label="Años de servicio"
                rules={[ruleRequired]}
              >
                <Input maxLength={2} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="period" label="Periodo" rules={[ruleRequired]}>
                <Input maxLength={4} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="vacations_days"
                label="Vacaciones correspondientes"
                rules={[ruleRequired]}
              >
                <Input maxLength={4} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="vacations_taken"
                label="Vacaciones disfrutadas"
                rules={[ruleRequired]}
              >
                <Input maxLength={4} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="vacations_paid"
                label="Vacaciones pagadas"
                rules={[ruleRequired]}
              >
                <Input maxLength={4} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="vacations_pending"
                label="Vacaciones pendientes"
                rules={[ruleRequired]}
              >
                <Input maxLength={11} />
              </Form.Item>
            </Col>

            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="vacations_premium_days"
                label="Prima vacacional correspondiente"
                rules={[ruleRequired]}
              >
                <Input maxLength={2} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="vacations_premium_pay"
                label="Prima vacacional pagada"
                rules={[ruleRequired]}
              >
                <Input maxLength={2} />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item
                name="vacations_premium_pending"
                label="Prima vacacional pendiente"
                rules={[ruleRequired]}
              >
                <Input maxLength={2} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Form.Item>
              <Button
                loading={loadingForm}
                style={{ marginRight: 20 }}
                type="primary"
                htmlType="submit"
              >
                Guardar
              </Button>
            </Form.Item>
          </Row>
        </Form>

        <Divider />

        {/* <Row justify="space-between">
          <Title style={{ fontSize: "20px", marginBottom: 20 }}>
            INFONAVIT
          </Title>
          <div>
            <Space>
              <Button
                type="primary"
                loading={loadingTable}
                onClick={() => setModalVisible(true)}
              >
                Nuevo
              </Button>
              {nss && (
                <Tooltip title="Obtener datos infonavit">
                  <Button onClick={() => userCredit()} loading={loadingTable}>
                    <SyncOutlined style={{ fontSize: "20px" }} />
                  </Button>
                </Tooltip>
              )}
            </Space>
          </div>
        </Row> */}

        <Spin tip="Cargando..." spinning={loadingTable}>
          <Table
            columns={colVacations}
            scroll={{
              x: true,
            }}
            rowKey="id"
            dataSource={vacationsRecord}
            locale={{
              emptyText: loadingTable
                ? "Cargando..."
                : "No se encontraron resultados.",
            }}
          />
        </Spin>
      </Spin>
      {/* <Modal
        title="INFONAVIT manual"
        visible={modalVisible}
        onCancel={() => onModalCancel()}
        footer={[]}
      >
        <Form
          layout="vertical"
          form={formInfonavitManual}
          onFinish={newInfonavit}
        >
          <Row>
            <Col span={11}>
              <Form.Item
                label="Fecha de inicio"
                name="start_date"
                rules={[ruleRequired]}
              >
                <DatePicker
                  locale={locale}
                  format="DD-MM-YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item
                label="Número"
                name="number"
                rules={[ruleRequired, onlyNumeric]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Tipo de crédito"
                name="type"
                rules={[ruleRequired]}
              >
                <Select allowClear>
                  <Select.Option
                    value="Crédito Tradicional"
                    key="Crédito Tradicional"
                  >
                    Crédito Tradicional
                  </Select.Option>
                  <Select.Option
                    value="Crédito Apoyo INFONAVIT"
                    key="Crédito Apoyo INFONAVIT"
                  >
                    Crédito Apoyo INFONAVIT
                  </Select.Option>
                  <Select.Option
                    value="Credito Cofinanciado 08"
                    key="Credito Cofinanciado 08"
                  >
                    Credito Cofinanciado 08
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item label="Estatus" name="status" rules={[ruleRequired]}>
                <Select allowClear>
                  <Select.Option value={"Vigente"} key={"Vigente"}>
                    Vigente
                  </Select.Option>
                  <Select.Option value={"Sin crédito"} key={"Sin crédito"}>
                    Sin crédito
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item
                label="Tipo de descuento"
                name="discount_type"
                rules={[ruleRequired]}
              >
                <Select allowClear options={InfonavitDiscountType}></Select>
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item
                label="Valor de descuento"
                name="discount_value"
                rules={[ruleRequired]}
              >
                <Input type="number" maxLength={10} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 30 }}>
            <Col>
              <Button
                key="back"
                onClick={() => {
                  onModalCancel();
                }}
                style={{ padding: "0 10px", marginLeft: 15 }}
              >
                Cancelar
              </Button>
            </Col>
            <Col>
              <Form.Item>
                <Button
                  key="submit_modal"
                  type="primary"
                  htmlType="submit"
                  style={{ padding: "0 10px", marginLeft: 15 }}
                  loading={loadingModal}
                >
                  {(updateInfonavit && "Editar") || "Registrar"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal> */}
    </>
  );
};

export default FormVacationRecord;
