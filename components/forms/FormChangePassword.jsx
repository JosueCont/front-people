import { Form, Input, Button, message, Row, Typography } from "antd";
import Axios from "axios";
import { LOGIN_URL, APP_ID } from "../../config/config";
import { useEffect, useState } from "react";
import SelectGroup from "../../components/selects/SelectGroup";
import WebApiPeople from "../../api/WebApiPeople";

const FormChangePassword = ({ khonnectId, person_user }) => {
  const { Title } = Typography;
  const [formPassword] = Form.useForm();
  const ruleRequired = { required: true, message: "Este campo es requerido" };
  const [isRegister, setIsRegister] = useState(true)

  useEffect(() => {
    console.log("//////////////////")
    console.log(person_user)
    if (person_user?.khonnect_id && person_user.khonnect_id !== ""){
      setIsRegister(false)
    }else{
      setIsRegister(true)
    }
  }, [person_user]);

  const savePersonKhonnect = async (data) =>{
    let save_person_khonnect = await WebApiPeople.khonnectSavePerson(data)
    if (save_person_khonnect.status == 200){
      message.success("Actualizado correctamente!!");
      formPassword.resetFields();
    }else{
      message.error("Error al actualizar, intente de nuevo");
      formPassword.resetFields();
    }
  }

  const changePassword = (value) => {
    if (value.new_password == value.newPassword) {
      if (isRegister){
        let new_data = {
          person_id: person_user.id,
          email: value.email_person_userd,
          password: value.new_password,
          groups: !(person_user?.jwt_data?.groups?.length > 0)?[value.groups]:[person_user?.jwt_data?.groups[0].id]
        }
        console.log("-------------------------")
        
        console.log(new_data)
        savePersonKhonnect(new_data)
      }else{value.user_id = khonnectId;
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
      }
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
        <Title style={{ fontSize: "20px" }}>Usuario</Title>
      </Row>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 10 }}
        layout="horizontal"
        form={formPassword}
        onFinish={changePassword}
        autoComplete="off"
      >

        {!isRegister && <Form.Item
          name="old_password"
          label="Contraseña actual"
          rules={[ruleRequired]}
        >
          <Input type="password" />
        </Form.Item>}
        {isRegister && <Form.Item
          name="email_person_userd"
          label="Dirección de e-mail"
          rules={[ruleRequired]}
        >
          <Input
          defaultValue={person_user?.email?person_user.email:null}
          autoComplete="off"
          disabled={person_user?.email?true:false}
          />
        </Form.Item>}
        {isRegister && !(person_user?.jwt_data?.groups?.length > 0) && <SelectGroup viewLabel={true} required={false} />}
        <Form.Item
          name="newPassword"
          label={isRegister?"Contraseña":"Nueva contraseña"}
          rules={[ruleRequired]}
        >
          <Input.Password type="password" autoComplete="off"/>
        </Form.Item>
        <Form.Item
          name="new_password"
          label="Confirmar contraseña"
          rules={[ruleRequired, rulePassword]}
        >
          <Input.Password type="password" autoComplete="off"/>
        </Form.Item>
        <Row justify={"end"}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isRegister?"Registrar usuario":"Cambiar contraseña"}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default FormChangePassword;
