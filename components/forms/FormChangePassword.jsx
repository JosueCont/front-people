import { Form, Input, Button, message, Row, Typography } from "antd";
import Axios from "axios";
import { LOGIN_URL, APP_ID } from "../../config/config";
import { useEffect, useState } from "react";
import SelectGroup from "../../components/selects/SelectGroup";
import WebApiPeople from "../../api/WebApiPeople";
import { ruleWhiteSpace, ruleMinPassword, validateSpaces } from "../../utils/rules";

const FormChangePassword = ({ khonnectId, person_user }) => {
  const { Title } = Typography;
  const [formPassword] = Form.useForm();
  const ruleRequired = { required: true, message: "Este campo es requerido" };
  const [isRegister, setIsRegister] = useState(true)
  const [isLoading, setIsLoading] = useState(false);

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
    try{
      let save_person_khonnect = await WebApiPeople.khonnectSavePerson(data)
      if (save_person_khonnect.status == 200){
        message.success("Actualizado correctamente!!");
        formPassword.resetFields();
        setIsLoading(false)
      }else{
        message.error("Error al actualizar, intente de nuevo");
        formPassword.resetFields();
        setIsLoading(false)
      }
    }catch (e){
      if(e?.response?.data?.message){
        message.error(e?.response?.data?.message);
      }else{
        message.error("Error al actualizar, intente de nuevo");
      }

    }finally {
      setIsLoading(false)
    }

  }
  
  const resetPassword = async (data) =>{
    try {
      let response = await WebApiPeople.validateChangePassword(data);
      if(response.status == 200){
        setTimeout(() => {
          message.success("Cambio de contraseña exitoso");
          setIsLoading(false)
          formPassword.resetFields();
        }, 2000);
      }
    } catch (e) {
      message.error("Ocurrio un error intenta nuevamente");
      formPassword.resetFields();
      setIsLoading(false)
      console.log(e)
    }finally {
      setIsLoading(false)
    }
  }

  const changePassword = (value) => {
    if (value.new_password == value.newPassword) {
      setIsLoading(true)
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
      }else{
        let dataToSend = {
          khonnect_id: khonnectId,
          password: value.new_password,
        }
        resetPassword(dataToSend);
      }
    } else {
      message.error("Las contraseñas no coinciden.");
      setIsLoading(false)
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
        className="form-details-person"
      >

        {isRegister && <Form.Item
          name="email_person_userd"
          label="Dirección de e-mail"
        >
          <Input
          defaultValue={person_user?.email?person_user.email:null}
          autoComplete="off"
          //disabled={person_user?.email?true:false}
          />
        </Form.Item>}
        {isRegister && !(person_user?.jwt_data?.groups?.length > 0) && <SelectGroup viewLabel={true} required={true} />}
        <Form.Item
          name="newPassword"
          label={isRegister?"Contraseña":"Nueva contraseña"}
          rules={[ruleRequired, ruleWhiteSpace, validateSpaces, ruleMinPassword(6)]}
        >
          <Input.Password type="password" autoComplete="off"/>
        </Form.Item>
        <Form.Item
          name="new_password"
          label="Confirmar contraseña"
          rules={[ruleRequired, ruleWhiteSpace, validateSpaces, ruleMinPassword(6), rulePassword]}
        >
          <Input.Password type="password" autoComplete="off"/>
        </Form.Item>
        <Row justify={"end"}>
          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit">
              {isRegister?"Registrar usuario":"Cambiar contraseña"}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default FormChangePassword;
