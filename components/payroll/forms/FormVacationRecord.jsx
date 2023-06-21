import React, { useState, useEffect } from "react";
import {
  Spin,
  Button,
  Row,
  Col,
  Typography,
  Table,
  Form,
  Input,
  message,
  Divider,
  Tooltip,
} from "antd";
import { messageError } from "../../../utils/constant";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import WebApiPayroll from "../../../api/WebApiPayroll";
import { ruleRequired } from "../../../utils/rules";

const FormVacationRecord = ({ person, person_id = null, node }) => {
  const { Title } = Typography;
  const [formVacationsRecord] = Form.useForm();

  const [loadingForm, setLoadingForm] = useState(false);
  const [updateRegister, setUpdateRegister] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const [vacationsRecord, setVacationsRecord] = useState([]);
  const [editVacation, setEditVacation] = useState(false);
  const [editBonus, setEditBonus] = useState(false);

  const colVacations = [
    {
      title: "Periodo",
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
                <Tooltip title={item.is_active ? "Editar" : "Ver"}>
                  {/* Solo se muestra editar si el registro es activo y la prima vacacional
                   se paga al disfrute las vacaciones*/}
                  {item.is_active ? (
                    <EditOutlined
                      style={{ fontSize: "20px" }}
                      onClick={() => setUpdateRegister(item)}
                    />
                  ) : (
                    <EyeOutlined
                      style={{ fontSize: "20px" }}
                      onClick={() => setUpdateRegister(item)}
                    />
                  )}
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
      let data = response?.data?.results
      let arr = []
      if(data && data.length>0){
        arr = data.filter(item => item.is_active);
      }
      //   console.log("🚀 ~ getVacationsRecors ~ response", response);
      setVacationsRecord(arr);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    if (updateRegister) {
      formVacationsRecord.setFieldsValue({
        service_years: updateRegister.service_years,
        period: updateRegister.period,
        vacations_days: updateRegister.vacations_days,
        vacations_taken: updateRegister.vacations_taken,
        vacations_paid: updateRegister.vacations_paid,
        vacations_pending: updateRegister.vacations_pending,
        vacations_premium_days: updateRegister.vacations_premium_days,
        vacations_premium_pay: updateRegister.vacations_premium_pay,
        vacations_premium_pending: updateRegister.vacations_premium_pending,
      });
      setEditVacation(updateRegister.is_active);

      if (updateRegister.vacation_bonus_payment == 1) {
        setEditBonus(false);
      } else if (updateRegister.is_active) {
        setEditBonus(true);
      } else {
        setEditBonus(false);
      }
    }
  }, [updateRegister]);

  const resetForm = () => {
    formVacationsRecord.resetFields();
    setUpdateRegister(null);
  };

  const saveVacationRecord = (values) => {
    setLoadingTable(true);
    setLoadingForm(true);

    if (updateRegister && updateRegister.id) {
      WebApiPayroll.updateVacationsRecord(updateRegister.id, values)
        .then((response) => {
          message.success("Guardado exitosamente");
          setLoadingTable(false);
          setLoadingForm(false);
          getVacationsRecors();
          resetForm();
        })
        .catch(async (error) => {
          if (error?.response?.data?.message) {
            message.error(error?.response?.data?.message);
            setLoadingTable(false);
          } else message.error(messageError);
          setLoadingTable(false);
          setLoadingForm(false);
        });
    }
    // else {
    // WebApiPayroll.saveVacationsRecord(values)
    //   .then((response) => {
    //     message.success("Guardado exitosamente");
    //     setLoadingTable(false);
    //     getVacationsRecors();
    //   })
    //   .catch(async (error) => {
    //     if (error?.response?.data?.message) {
    //       message.error(error?.response?.data?.message);
    //       setLoadingTable(false);
    //     } else message.error(messageError);
    //     setLoadingTable(false);
    //   });
    // }
  };

  return (
    <>
      <Spin tip="Cargando..." spinning={loadingForm}>
        <Row>
          <Title style={{ fontSize: "20px" }}>
            Vacaciones corresponientes del periodo{" "}
            {updateRegister ? updateRegister.period : ""}
          </Title>
        </Row>
        {updateRegister && (
          <Form
            layout="vertical"
            form={formVacationsRecord}
            onFinish={saveVacationRecord}
            className="form-details-person"
          >
            <Row>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="service_years"
                  label="Años de servicio"
                  rules={[ruleRequired]}
                >
                  <Input maxLength={2} disabled={true} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item name="period" label="Periodo" rules={[ruleRequired]}>
                  <Input maxLength={4} disabled={true} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="vacations_days"
                  label="Vacaciones correspondientes"
                  rules={[ruleRequired]}
                >
                  <Input maxLength={4} disabled={true} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="vacations_taken"
                  label="Vacaciones disfrutadas"
                  rules={[ruleRequired]}
                >
                  <Input maxLength={4} disabled={true} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="vacations_paid"
                  label="Vacaciones pagadas"
                  rules={[ruleRequired]}
                >
                  <Input maxLength={4} disabled={true} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="vacations_pending"
                  label="Vacaciones pendientes"
                  rules={[ruleRequired]}
                >
                  <Input
                    type="number"
                    maxLength={11}
                    disabled={!editVacation}
                  />
                </Form.Item>
              </Col>

              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="vacations_premium_days"
                  label="Prima vacacional correspondiente"
                  rules={[ruleRequired]}
                >
                  <Input maxLength={2} disabled={true} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="vacations_premium_pay"
                  label="Prima vacacional pagada"
                  rules={[ruleRequired]}
                >
                  <Input maxLength={2} disabled={true} />
                </Form.Item>
              </Col>
              <Col lg={6} xs={22} offset={1}>
                <Form.Item
                  name="vacations_premium_pending"
                  label="Prima vacacional pendiente"
                  rules={[ruleRequired]}
                >
                  <Input
                    min={0}
                    type="number"
                    maxLength={2}
                    disabled={!editBonus}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"end"}>
              <Col>
                <Button
                  style={{ marginRight: 20 }}
                  loading={loadingForm}
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              </Col>
              {(editBonus || editVacation) && (
                <Form.Item>
                  <Button
                    loading={loadingForm}
                    type="primary"
                    htmlType="submit"
                  >
                    Guardar
                  </Button>
                </Form.Item>
              )}
            </Row>
          </Form>
        )}

        <Divider />

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
    </>
  );
};

export default FormVacationRecord;
