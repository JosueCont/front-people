import {
  Button,
  Col,
  Input,
  Row,
  Typography,
  Form,
  message,
  Checkbox,
} from "antd";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import { API_URL } from "../../config/config";
import WebApi from "../../api/webApi";

const FormGeneralData = ({ person_id = null }) => {
  const { Title } = Typography;

  const [formGeneralData] = Form.useForm();
  const [idGeneralP, setIdGeneralP] = useState("");
  const [checkedTravel, setCheckedTravel] = useState(false);
  const [checkedResidence, setCheckedResidence] = useState(false);

  useEffect(() => {
    getGeneralData();
  }, [person_id]);

  /* functions CRUD */
  const getGeneralData = async () => {
    try {
      let response = await WebApi.getGeneralDataPerson(person_id);
      formGeneralData.setFieldsValue({
        place_birth: response.data.place_birth,
        nationality: response.data.nationality,
        other_nationality: response.data.other_nationality,
        availability_travel: response.data.availability_travel,
        availability_change_residence:
          response.data.availability_change_residence,
        allergies: response.data.allergies,
        blood_type: response.data.blood_type,
      });
      if (response.data.availability_travel)
        setCheckedTravel(response.data.availability_travel);
      if (response.data.availability_change_residence)
        setCheckedResidence(response.data.availability_change_residence);
      setIdGeneralP(response.data.id);
    } catch (error) {
      console.log(error);
    }
  };
  const saveGeneralData = async (data) => {
    try {
      let response = await WebApi.createGeneralDataPerson(data);
      setIdGeneralP(response.data.id);
      message.success({
        content: "Guardado correctamente.",
        className: "custom-class",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const updateGeneralData = async (data) => {
    try {
      let response = await WebApi.updateGeneralDataPerson(idGeneralP, data);
      message.success({
        content: "Actualizado correctamente.",
        className: "custom-class",
      });
    } catch (error) {
      console.log(error);
    }
  };

  /* Events */
  const checkTravel = () => {
    checkedTravel ? setCheckedTravel(false) : setCheckedTravel(true);
  };
  const checkResidence = () => {
    checkedResidence ? setCheckedResidence(false) : setCheckedResidence(true);
  };
  const formGeneralDataPerson = (value) => {
    if (idGeneralP != "" && idGeneralP != undefined) {
      value.availability_travel = checkedTravel;
      value.availability_change_residence = checkedResidence;
      updateGeneralData(value);
    } else {
      value.person = person_id;
      value.availability_travel = checkedTravel;
      value.availability_change_residence = checkedResidence;
      saveGeneralData(value);
    }
  };

  return (
    <>
      <Row>
        <Title style={{ fontSize: "20px" }}>Datos generales</Title>
      </Row>
      <Form
        layout={"vertical"}
        form={formGeneralData}
        onFinish={formGeneralDataPerson}
        className="form-details-person"
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="place_birth" label="Lugar de nacimiento">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="nationality" label="Nacionalidad">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="other_nationality" label="Otra nacionalidad">
              <Input />
            </Form.Item>
          </Col>

          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="allergies" label="Alergias">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="blood_type" label="Tipo de sangre">
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="availability_travel"
              label="Disponibilidad para viajar"
            >
              <Checkbox onClick={checkTravel} checked={checkedTravel} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item label="Cambio de residencia">
              <Checkbox onClick={checkResidence} checked={checkedResidence} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"end"}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default FormGeneralData;
