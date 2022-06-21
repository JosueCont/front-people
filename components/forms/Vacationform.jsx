import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Input,
  Image,
  InputNumber,
  DatePicker,
} from "antd";
import moment from "moment";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import WebApiPeople from "../../api/WebApiPeople";
import { ruleRequired } from "../../utils/rules";
import { getDifferenceDays } from "../../utils/functions";

const Vacationform = (props) => {
  const { Title } = Typography;

  const [formVacation] = Form.useForm();
  const [urlPhoto, setUrlPhoto] = useState(null);
  const [availableDays, setAvailableDays] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState();

  const changePerson = async (value) => {
    if (value) {
      let index = await getCollaborator(value);
      if (index) {
        setAvailableDays(index.Available_days_vacation);
        formVacation.setFieldsValue({
          antiquity: index.antiquity,
          availableDays: index.Available_days_vacation,
          dateOfAdmission: index.date_of_admission
            ? moment(index.date_of_admission).format("DD-MM-YYYY")
            : null,
        });
        formVacation.setFieldsValue({
          job: index.work_title ? index.work_title.job.name : null,
        });

        setUrlPhoto(index.photo ? index.photo : null);
      }
    } else {
      formVacation.setFieldsValue({
        antiquity: null,
        availableDays: null,
        dateOfAdmission: null,
        job: null,
      });
      setUrlPhoto(null);
    }
  };

  const getCollaborator = async (id) => {
    let collaborator = {};
    let response = await WebApiPeople.getPerson(id);

    if (response.status == 200) {
      collaborator = response.data;
    }
    return collaborator;
  };

  useEffect(() => {
    if (props.details) {
      changePerson(props.details.collaborator.id);
      setStartDate(props.details.departure_date);
      setEndDate(props.details.return_date);
      setAvailableDays(props.details.collaborator.Available_days_vacation);
      formVacation.setFieldsValue({
        person: props.details.collaborator
          ? props.details.collaborator.id
          : null,
        khonnect_id: props.details.collaborator
          ? props.details.collaborator.khonnect_id
          : null,
        days_requested: props.details.days_requested,
        antiquity: props.details.collaborator
          ? props.details.collaborator.antiquity
          : null,
        availableDays: props.details.collaborator
          ? props.details.collaborator.Available_days_vacation
          : null,
        dateOfAdmission: props.details.collaborator
          ? moment(props.details.collaborator.date_of_admission).format(
              "DD-MM-YYYY"
            )
          : null,
        departure_date: props.details.departure_date
          ? moment(props.details.departure_date, "YYYY-MM-DD")
          : null,
        return_date: props.details.return_date
          ? moment(props.details.return_date, "YYYY-MM-DD")
          : null,
        job:
          props.details && props.details.work_title
            ? props.details.collaborator.job.name
            : null,
      });

      setUrlPhoto(
        props.details.collaborator && props.details.collaborator.photo
          ? props.details.collaborator.photo
          : null
      );
    }
  }, [props.details]);

  const changeDepartureDate = (date, dateString) => {
    setStartDate(dateString);
    props.onChangeDepartureDate(date, dateString);
  };
  const changeEndDate = (date, dateString) => {
    setEndDate(dateString);
    props.onChangeReturnDate(date, dateString);
  };

  const sumDays = (days) => {
    if (days && availableDays > 0 && startDate && days <= availableDays) {
      let date = new Date(startDate);
      date.setDate(date.getDate() + (days - 1));
      let end_date = date.toISOString().substring(0, 10);
      changeEndDate(end_date, end_date.toString());

      formVacation.setFieldsValue({
        return_date: moment(end_date, "YYYY-MM-DD"),
      });
    } else {
      formVacation.setFieldsValue({
        return_date: null,
      });
    }
  };

  return (
    <Form form={formVacation} layout="vertical" onFinish={props.onFinish}>
      <Row>
        <Col span={20} offset={4}>
          <Title key="dats_gnrl" level={4}>
            Solicitud
          </Title>
        </Col>
        <Col span={4}>
          {urlPhoto ? (
            <Image style={{ width: "80%" }} src={urlPhoto} />
          ) : (
            <Image
              style={{ width: "80%" }}
              src={"error"}
              fallback="data:image/png;base64,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"
            />
          )}
        </Col>
        <Col span={20} style={{ padding: 20 }}>
          <Row gutter={24}>
            <Col sm={24} md={12} lg={12}>
              <Form.Item rules={[ruleRequired]}>
                <SelectCollaborator
                  label="Empleado"
                  name="person"
                  onChange={changePerson}
                  // setAllPersons={setAllPersons}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                label="Puesto"
                name="job"
                readOnly
                rules={[ruleRequired]}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                name="departure_date"
                label="Fecha inicio"
                rules={[ruleRequired]}
              >
                <DatePicker
                  key="departure_date"
                  style={{ width: "100%" }}
                  onChange={changeDepartureDate}
                  disabled={availableDays > 0 ? false : true}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                name="return_date"
                label="Fecha fin"
                rules={[ruleRequired]}
              >
                <DatePicker
                  key="return_date"
                  style={{ width: "100%" }}
                  disabled={true}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item
                name="days_requested"
                label="Días solicitados"
                rules={[ruleRequired]}
              >
                <InputNumber
                  min={1}
                  max={availableDays}
                  style={{ width: "100%" }}
                  onChange={sumDays}
                  disabled={availableDays > 0 ? false : true}
                />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item name="availableDays" label="Días disponibles">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={20} offset={4}>
              <Title key="dats_gnrl" level={4} style={{ marginTop: 10 }}>
                Información
              </Title>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item label="Fecha de ingreso" name="dateOfAdmission">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col sm={24} md={12} lg={12}>
              <Form.Item label="Antigüedad" name="antiquity">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button
                key="cancel"
                onClick={props.onCancel}
                disabled={props.sending}
                style={{ padding: "0 50px", margin: "0 10px" }}
              >
                Cancelar
              </Button>
              <Button
                key="save"
                htmlType="submit"
                loading={props.sending}
                type="primary"
                style={{ padding: "0 50px", margin: "0 0 0 10px" }}
              >
                {props.edit ? "Actualizar" : "Guardar"}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default Vacationform;
