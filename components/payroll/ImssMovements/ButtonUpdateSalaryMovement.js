import { connect } from "react-redux";
import { CalendarOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Alert,
  message,
  Spin,
  Switch,
  Row,
  Col,
} from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { downLoadFileBlob, getDomain } from "../../../utils/functions";
import { API_URL_TENANT } from "../../../config/config";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fourDecimal,
  onlyNumeric,
  ruleRequired,
  twoDecimal,
} from "../../../utils/rules";
import locale from "antd/lib/date-picker/locale/es_ES";
import moment from "moment";
import WebApiPayroll from "../../../api/WebApiPayroll";

const ButtonUpdateSalaryMovement = ({
  person,
  node,
  payrollPerson = null,
  onRefresh,
  perceptionCode,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.userStore.user);
  const [generateMovement, setGenerateMovement] = useState(false);
  const [changeSdi, setChangeSdi] = useState(false);

  const onFinish = (values) => {
    let req = { ...values };
    req.modified_by = user.id;
    req.update_date = moment(values.date_updated).format("YYYY-MM-DD");
    req.payroll_person_id = payrollPerson.id;
    req.generate_movement = generateMovement;
    changeSalary(req);
  };

  const changeSalary = async (req) => {
    setLoading(true);
    try {
      const res = await WebApiPayroll.setSalaryModification(req);
      if (generateMovement)
        message.success(
          "Actualizado correctamente, revise la sección de Movimientos IMSS"
        );
      else message.success("Actualizado correctamente");

      setShowModal(false);
      onRefresh();
    } catch (e) {
      console.log(e.response);
      if (e?.response?.data?.message) {
        message.error(
          `No se pudo realizar la acción: ${e?.response?.data?.message}`
        );
      } else {
        message.error(
          "Hubo un error, favor de revisar la información o vuelve a intentarlo mas tarde"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (payrollPerson?.daily_salary) {
      form.setFieldsValue({
        new_salary: payrollPerson?.daily_salary,
        new_sdi: payrollPerson?.integrated_daily_salary,
        date_updated: moment(),
      });
    }
  }, [payrollPerson]);

  // const disabledDate = (current) => {
  //   // Can not select days before today and today
  //   return current && current <= moment().endOf("day");
  // };

  const onchageSdi = () => {
    if (!changeSdi == false) {
      form.setFieldsValue({
        new_sdi: payrollPerson?.integrated_daily_salary,
      });
    }
    setChangeSdi(!changeSdi);
  };

  const openModal = () => {
    setShowModal(true);
    form.setFieldsValue({
      change_sdi: false,
      generate_movement: false,
    });

    setGenerateMovement(false);
    setChangeSdi(false);
  };

  return (
    <>
      <Button
        style={{ marginBottom: "10px", marginRight: 20 }}
        loading={loading}
        icon={<CalendarOutlined />}
        type="link"
        onClick={openModal}
      >
        Programar actualización de salario diario
      </Button>

      <Modal
        title="Programar actualización de salario diario"
        visible={showModal}
        onOk={() => form.submit()}
        onCancel={() => setShowModal(false)}
        okText="Aceptar"
        cancelText="Cancelar"
      >
        <Spin spinning={loading}>
          <Form
            layout={"vertical"}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            {perceptionCode && perceptionCode == "001" ? (
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="generate_movement"
                    label="Generar movimiento IMSS?"
                    initialValue={false}
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      onChange={() => setGenerateMovement(!generateMovement)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="change_sdi"
                    label="¿Modificar SDI?"
                    initialValue={false}
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      onChange={onchageSdi}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}

            <Form.Item
              name="new_salary"
              label="Nuevo salario diario"
              rules={[
                ruleRequired,
                fourDecimal,
                // {
                //   message: "Este monto debe ser diferente al salario actual",
                //   validator: (_, value) => {
                //     // if (value!==payrollPerson?.daily_salary && value>=payrollPerson?.daily_salary) {
                //     if (value !== payrollPerson?.daily_salary) {
                //       return Promise.resolve();
                //     } else {
                //       return Promise.reject();
                //     }
                //   },
                // },
              ]}
            >
              <Input />
            </Form.Item>

            {perceptionCode && perceptionCode == "001" ? (
              <Form.Item
                name="new_sdi"
                label="Salario diario Integrado"
                rules={[
                  ruleRequired,
                  twoDecimal,
                  // {
                  //   message: "Este monto debe ser diferente al salario actual",
                  //   validator: (_, value) => {
                  //     // if (value!==payrollPerson?.daily_salary && value>=payrollPerson?.daily_salary) {
                  //     if (value !== payrollPerson?.new_sdi) {
                  //       return Promise.resolve();
                  //     } else {
                  //       return Promise.reject();
                  //     }
                  //   },
                  // },
                ]}
              >
                <Input disabled={!changeSdi} />
              </Form.Item>
            ) : null}

            <Form.Item
              name="date_updated"
              label="Fecha de actualización"
              rules={[ruleRequired]}
            >
              <DatePicker
                // disabledDate={disabledDate}
                locale={locale}
                defaultValue={moment().add(2, "d")}
                style={{ width: "100%" }}
                //onChange={onChangeBDFamily}
                showNow={true}
                format={"DD/MM/YYYY"}
              />
            </Form.Item>
          </Form>
        </Spin>
        {generateMovement && (
          <Alert
            type="info"
            description={
              "Al cambiar el salario se aplicará en la fecha programada,\n" +
              '                    si requieres enviar este movimiento ante el IMSS puedes consultarlo desde la opción "Movimientos IMSS"\n' +
              "                    ubicada en el menú lateral."
            }
          />
        )}
        {!generateMovement && (
          <Alert
            type="info"
            description={
              "Este cambio no genera ningún movimiento ante el IMSS, solo corrige el salario diario y el salario diario integrado"
            }
          />
        )}
      </Modal>
    </>
  );
};

export default ButtonUpdateSalaryMovement;
