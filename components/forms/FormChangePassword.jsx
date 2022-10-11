import { Form, Input, Button, message, Row, Typography } from "antd";
import Axios from "axios";
import { LOGIN_URL, APP_ID } from "../../config/config";

const FormChangePassword = ({ khonnectId }) => {
  const { Title } = Typography;
  const [formPassword] = Form.useForm();
  const ruleRequired = { required: true, message: "Este campo es requerido" };

  const changePassword = (value) => {
    if (value.new_password == value.newPassword) {
      value.user_id = khonnectId;
      delete value["newPassword"];
      const headers = {
        "client-id": APP_ID,
        "Content-Type": "application/json",
      };
      Axios.post(LOGIN_URL + "/password/change/direct/", value, {
        headers: headers,
      })
        .then((response) => {
          message.success("Actualizado correctamente!!");
          formPassword.resetFields();
        })
        .catch((error) => {
          message.error("Error al actualizar, intente de nuevo");
          formPassword.resetFields();
        });
    } else {
      message.error("Las contraseñas no coinciden.");
    }
  };

  const rulePassword = ({ getFieldValue }) => ({
    validator() {
      if (getFieldValue("newPassword") == getFieldValue("new_password")) {
        return Promise.resolve();
      } else {
        return Promise.reject("Las contraseñas no coinciden");
      }
    },
  });

  return (
    <>
      <Row>
        <Title style={{ fontSize: "20px" }}>Cambiar contraseña</Title>
      </Row>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        form={formPassword}
        onFinish={changePassword}
      >
        <Form.Item
          name="old_password"
          label="Contraseña actual"
          rules={[ruleRequired]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Nueva contraseña"
          rules={[ruleRequired]}
        >
          <Input.Password type="password" />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="Confirmar contraseña"
          rules={[ruleRequired, rulePassword]}
        >
          <Input.Password type="password" />
        </Form.Item>
        <Row justify={"end"}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cambiar contraseña
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default FormChangePassword;
