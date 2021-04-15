import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Input,
  Image,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import { set } from "js-cookie";
import { route } from "next/dist/next-server/server/router";
import SelectCollaborator from '../../components/selects/SelectCollaboratorItemForm'
import Axios from "axios";
import { API_URL } from "../../config/config";
import { withAuthSync } from "../../libs/auth";
import jsCookie from "js-cookie";

const Permissionform = (props) => {
  const { Title } = Typography;

  const [formPermission] = Form.useForm();

  const { Option } = Select;
  const { TextArea } = Input;
  const [loading, setLoading] = useState(props.loading ? props.loading : true);

  const [allPersons, setAllPersons] = useState(null);
  const [personList, setPersonList] = useState(null);
  const [urlPhoto, setUrlPhoto] = useState(null);
  const [permissions, setPermissions] = useState({});

  /* const [person, setPerson] = useState(null); */
  /* const [job, setJob] = useState(null); */
  /* const [dateOfAdmission, setDateOfAdmission] = useState(null); */
  /* const [antiquity, setAntiquity] = useState(null); */
  /* const [availableDays, setAvailableDays] = useState(null); */

  const changePerson = (value) => {
    if (value) {
      let index = allPersons.find((data) => data.id === value);
      if (index.job && index.job.length > 0) {
        formPermission.setFieldsValue({
          job: index.job[0].name,
        });
      }
      setUrlPhoto(index.photo ? index.photo : null);
    } else {
      formPermission.setFieldsValue({
        job: null,
      });
      setUrlPhoto(null);
    }
  };


  useEffect(() => {
    if (props.details) {
      formPermission.setFieldsValue({
        person: props.details.collaborator
          ? props.details.collaborator.id
          : null,
        requested_days: props.details.days_requested,
        departure_date: props.details.departure_date
          ? moment(props.details.departure_date, "YYYY-MM-DD")
          : null,
        return_date: props.details.return_date
          ? moment(props.details.return_date, "YYYY-MM-DD")
          : null,
        reason: props.details.reason,
        requested_days: props.details.requested_days,
      });
      if (props.details.collaborator && props.details.collaborator.job) {
        formPermission.setFieldsValue({
          job: props.details.collaborator.job[0].name,
        });
      }

      setUrlPhoto(
        props.details.collaborator && props.details.collaborator.photo
          ? props.details.collaborator.photo
          : null
      );
    }
  }, [allPersons]);

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    
  }, []);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.permit.can.view")) perms.view = true;
      if (a.includes("people.permit.can.create")) perms.create = true;
      if (a.includes("people.permit.can.edit")) perms.edit = true;
      if (a.includes("people.permit.can.delete")) perms.delete = true;
      if (a.includes("people.permit.function.approve_permit"))
        perms.approve = true;
      if (a.includes("people.permit.function.reject_permit"))
        perms.reject = true;
    });
    setPermissions(perms);
  };

  return (
    <Form
      form={formPermission}
      layout="horizontal"
      className={"formPermission"}
      onFinish={props.onFinish}
    >
      <Row>
        <Col span={20} offset={4}>
          <Title key="dats_gnrl" level={4}>
            Solicitud
          </Title>
        </Col>
        <Col span="4">
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

        <Col span="8">
            <SelectCollaborator
              label="Empleado"
              name="person"
              labelCol={{ span: 9 }}
              labelAlign={"left"}
              disabled={props.readOnly}
              onChange={changePerson}
              setAllPersons={setAllPersons}
            />
          <Form.Item
            label="Puesto"
            name="job"
            labelCol={{ span: 9 }}
            labelAlign={"left"}
            readOnly
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            name="requested_days"
            label="Días solicitados"
            labelCol={{ span: 9 }}
            labelAlign={"left"}
          >
            <InputNumber
              disabled={props.readOnly}
              /* defaultValue={props.daysRequested ? props.daysRequested : null } */ min={
                1
              }
              max={20}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span="8" offset={1}>
          <Form.Item
            name="departure_date"
            label="Fecha de salida"
            labelCol={{ span: 9 }}
            labelAlign={"left"}
          >
            <DatePicker
              disabled={props.readOnly}
              key="departure_date"
              style={{ width: "100%" }}
              onChange={props.onChangeDepartureDate}
            />
          </Form.Item>
          <Form.Item
            name="return_date"
            label="Fecha de regreso"
            labelCol={{ span: 9 }}
            labelAlign={"left"}
          >
            <DatePicker
              disabled={props.readOnly}
              key="return_date"
              style={{ width: "100%" }}
              onChange={props.onChangeReturnDate}
            />
          </Form.Item>
        </Col>
        <Col span={17} offset={4} style={{ textAlign: "right" }}>
          <Form.Item
            name="reason"
            label="Motivo"
            labelCol={{ span: 4 }}
            labelAlign={"left"}
          >
            <TextArea
              rows="4"
              style={{ marginLeft: 6 }}
              disabled={props.readOnly}
              showCount
              maxLength={200}
            />
          </Form.Item>
          <Button
            onClick={props.onCancel}
            key="cancel"
            style={{ padding: "0 50px" }}
          >
            Regresar
          </Button>
          {permissions.reject
            ? props.toApprove && (
                <Button
                  danger
                  onClick={props.onReject}
                  key="reject"
                  type="primary"
                  style={{ padding: "0 50px", marginLeft: 15 }}
                >
                  Rechazar
                </Button>
              )
            : null}
          {permissions.approve
            ? props.toApprove && (
                <Button
                  onClick={props.onApprove}
                  type="primary"
                  className={"btn-success"}
                  key="aprove"
                  style={{ padding: "0 50px", marginLeft: 15 }}
                >
                  Aprobar permiso
                </Button>
              )
            : null}
          {!props.toApprove ? (
            <Button
              key="save"
              htmlType="submit"
              style={{ padding: "0 50px", marginLeft: 15 }}
              type="primary"
            >
              {props.edit ? "Actualizar" : "Guardar"}
            </Button>
          ) : null}
        </Col>
      </Row>
    </Form>
  );
};

export default withAuthSync(Permissionform);
