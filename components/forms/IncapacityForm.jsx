import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Button,
  Form,
  Row,
  Col,
  Upload,
  Input,
  Image,
  Select,
  DatePicker,
  Modal,
} from "antd";
import moment from "moment";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import jsCookie from "js-cookie";
import SelectCollaborator from "../../components/selects/SelectCollaborator";
import { withAuthSync } from "../../libs/auth";

const Incapacityform = (props) => {
  const { Title } = Typography;

  const [form] = Form.useForm();

  const { Option } = Select;
  const { TextArea } = Input;

  const [fileList, setFileList] = useState([]);
  const [allPersons, setAllPersons] = useState(null);
  const [urlPhoto, setUrlPhoto] = useState(null);
  const [permissions, setPermissions] = useState({});

  /* For input file */
  const inputFileRef = useRef(null);
  const [file, setFile] = useState();
  const [fileName, setfileName] = useState("");

  /* const [person, setPerson] = useState(null); */
  /* const [job, setJob] = useState(null); */
  /* const [dateOfAdmission, setDateOfAdmission] = useState(null); */
  /* const [antiquity, setAntiquity] = useState(null); */
  /* const [availableDays, setAvailableDays] = useState(null); */

  const changePerson = (value) => {
    if (value) {
      let index = allPersons.find((data) => data.id === value);
      if (index && index.job) {
        form.setFieldsValue({
          job: index.job.name,
        });
      } else {
        form.setFieldsValue({
          job: null,
        });
      }
      setUrlPhoto(index.photo ? index.photo : null);
    } else {
      form.setFieldsValue({
        job: null,
      });
      setUrlPhoto(null);
    }
  };

  const onchangeFile = (file) => {
    setFileList(file.fileList);
    props.setFile(file.file);
  };

  const showMoalapprove = () => {
    /* props.onApprove */
    Modal.confirm({
      title: "¿Está seguro de aprobar la siguiente solicitud de incapacidad?",
      icon: <ExclamationCircleOutlined />,
      okText: "Aceptar y notificar",
      cancelText: "Cancelar",
      onOk() {
        props.onApprove();
      },
    });
  };

  useEffect(() => {
    if (props.details) {
      form.setFieldsValue({
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
        job:
          props.details.collaborator &&
          props.details.collaborator.job &&
          props.details.collaborator.job
            ? props.details.collaborator.job.name
            : null,
      });
      /* if (
                            props.details.collaborator &&
                            props.details.collaborator.job_department.job
                        ) {
                            form.setFieldsValue({
                                job: props.details.collaborator.job_department.job.name,
                            });
                        } */

      setUrlPhoto(
        props.details.collaborator && props.details.collaborator.photo
          ? props.details.collaborator.photo
          : null
      );
      /* File */
      if (props.details.document) {
        let fileDefault = [
          {
            uid: "-1",
            name: "Documento Actual",
            status: "done.png",
            url: props.details.document,
          },
        ];
        setFileList(fileDefault);
      }
    }
  }, [allPersons]);

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
  }, []);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.incapacity.can.view")) perms.view = true;
      if (a.includes("people.incapacity.can.create")) perms.create = true;
      if (a.includes("people.incapacity.can.edit")) perms.edit = true;
      if (a.includes("people.incapacity.can.delete")) perms.delete = true;
      if (a.includes("people.incapacity.function.approve_incapacity"))
        perms.approve = true;
      if (a.includes("people.incapacity.function.reject_incapacity"))
        perms.reject = true;
    });
    setPermissions(perms);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className={"formPermission"}
      onFinish={props.onFinish}
    >
      <Col span={24} style={{ padding: "20px" }}>
        <Row>
          <Col span={20} offset={4}>
            <Title key="dats_gnrl" level={4}>
              Solicitud
            </Title>
          </Col>
          <Col lg={4} md={4} sm={24} xs={24} style={{ textAlign: "center" }}>
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
          <Col lg={20} md={20} sm={24} xs={24}>
            <Row gutter={24}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <SelectCollaborator
                  label="Empleado"
                  name="person"
                  disabled={props.readOnly || props.sending}
                  onChange={changePerson}
                  setAllPersons={setAllPersons}
                />

                <Form.Item label="Puesto" name="job" readOnly>
                  <Input readOnly />
                </Form.Item>
                <Form.Item label="Documentación" name="document">
                  <Upload
                    disabled={props.readOnly || props.sending}
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onchangeFile}
                    maxCount={1}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item name="departure_date" label="Fecha de salida">
                  <DatePicker
                    disabled={props.readOnly || props.sending}
                    key="departure_date"
                    style={{ width: "100%" }}
                    onChange={props.onChangeDepartureDate}
                  />
                </Form.Item>
                <Form.Item name="return_date" label="Fecha de regreso">
                  <DatePicker
                    disabled={props.readOnly || props.sending}
                    key="return_date"
                    style={{ width: "100%" }}
                    onChange={props.onChangeReturnDate}
                  />
                </Form.Item>
              </Col>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  onClick={props.onCancel}
                  key="cancel"
                  style={{ padding: "0 50px", marginBottom: "10px" }}
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
                        style={{
                          padding: "0 50px",
                          marginLeft: 15,
                          marginBottom: "10px",
                        }}
                      >
                        Rechazar
                      </Button>
                    )
                  : null}
                {permissions.approve
                  ? props.toApprove && (
                      <Button
                        onClick={showMoalapprove}
                        type="primary"
                        key="aprove"
                        className={"btn-success"}
                        style={{
                          padding: "0 50px",
                          marginLeft: 15,
                          marginBottom: "10px",
                        }}
                      >
                        Aprobar permiso
                      </Button>
                    )
                  : null}
                {!props.toApprove ? (
                  <Button
                    key="save"
                    htmlType="submit"
                    type="primary"
                    style={{
                      padding: "0 50px",
                      marginLeft: 15,
                      marginBottom: "10px",
                    }}
                    loading={props.sending}
                  >
                    {props.edit ? "Actualizar" : "Guardar"}
                  </Button>
                ) : null}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Form>
  );
};

export default withAuthSync(Incapacityform);
