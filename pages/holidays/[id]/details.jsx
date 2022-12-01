import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Tabs,
  Row,
  Col,
  Breadcrumb,
  Button,
  Image,
  Typography,
  Form,
  Input,
  Modal,
} from "antd";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import cookie from "js-cookie";
import { withAuthSync } from "../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import { connect } from "react-redux";
import WebApiPeople from "../../../api/WebApiPeople";

const HolidaysDetails = (props) => {
  let userToken = cookie.get("token") ? cookie.get("token") : null;

  const route = useRouter();
  const { id } = route.query;
  const { TextArea } = Input;
  const { Text, Title } = Typography;
  const { confirm } = Modal;

  const [visibleModalReject, setVisibleModalReject] = useState(false);
  const [daysRequested, setDaysRequested] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [availableDays, setAvailableDays] = useState(null);
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [firstName, setFisrtName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [urlPhoto, setUrlPhoto] = useState(null);
  const [permissions, setPermissions] = useState({});

  useLayoutEffect(() => {
    setPermissions(props.permissions);
    setTimeout(() => {
      permissions;
    }, 5000);
  }, [props.permissions]);

  let json = JSON.parse(userToken);

  const rejectCancel = () => {
    setVisibleModalReject(false);
    setMessage(null);
  };

  const onChangeMessage = (value) => {
    setMessage(value.target.value);
  };

  const getDetails = async () => {
    WebApiPeople.geVacationRequest(id)
      .then(function (response) {
        let data = response.data;
        setDaysRequested(data.days_requested);
        setDepartureDate(moment(data.departure_date).format("DD/MM/YYYY"));
        setReturnDate(moment(data.return_date).format("DD/MM/YYYY"));
        setAvailableDays(data.collaborator.Available_days_vacation);

        if (data.collaborator && data.collaborator.first_name) {
          setFisrtName(data.collaborator.first_name);
        }
        if (data.collaborator && data.collaborator.flast_name) {
          setLastName(data.collaborator.flast_name);
        }

        if (data.collaborator && data.collaborator.flast_name) {
          setUrlPhoto(data.collaborator.photo);
        }
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const rejectRequest = async () => {
    if (json) {
      let values = {
        khonnect_id: json.user_id,
        id: id,
        comment: message,
      };
      WebApiPeople.vacationRejectRequest(values)
        .then(function (response) {
          setVisibleModalReject(false);
          Modal.success({
            keyboard: false,
            maskClosable: false,
            content: "Vacaciones rechazadas",
            okText: "Aceptar",
            onOk() {
              route.push("/holidays");
            },
          });
          setMessage(null);
        })
        .catch(function (error) {
          console.log(e);
        });
    }
  };

  const showMoalapprove = () => {
    confirm({
      title: "¿Está seguro de aprobar la siguiente solicitud de vacaciones?",
      icon: <ExclamationCircleOutlined />,
      okText: "Aceptar y notificar",
      cancelText: "Cancelar",
      onOk() {
        approveRequest();
      },
    });
  };

  const approveRequest = async () => {
    if (json) {
      setSending(true);
      let values = {
        khonnect_id: json.user_id,
        id: id,
      };

      WebApiPeople.vacationApproveRequest(values)
        .then(function (response) {
          setVisibleModalReject(false);
          Modal.success({
            keyboard: false,
            maskClosable: false,
            content: "Vacaciones autorizadas",
            okText: "Aceptar",
            onOk() {
              route.push("/holidays");
            },
          });
          setSending(false);
        })
        .catch(function (error) {
          setSending(false);
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getDetails();
  }, [route]);

  return (
    <MainLayout currentKey={["holiday"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item className={"pointer"}
                         onClick={() => route.push({ pathname: "/holidays" })}>Vacaciones</Breadcrumb.Item>
        <Breadcrumb.Item>Detalles</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container-border-radius">
        <Row justify={"center"}>
          <Col span={24} style={{ padding: "20px 0px" }}>
            <Row>
              <Col span={24}>
                <Title>Detalle de la solicitud</Title>
              </Col>
              <Col xs={24} md={4} lg={4} style={{ textAlign: "center" }}>
                {urlPhoto ? (
                  <Image src={urlPhoto} />
                ) : (
                  <Image
                    src={"error"}
                    fallback="data:image/png;base64,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"
                  />
                )}
                <p style={{ padding: "0 10px" }}>
                  <b>
                    {firstName}
                    <br />
                    {lastName}
                  </b>
                </p>
              </Col>
              <Col xs={24} md={18} lg={18} offset={1}>
                <Form layout={"vertical"}>
                  <Form.Item label="Días solicitados">
                    <Input value={daysRequested} readOnly />
                  </Form.Item>
                  <Form.Item label="Días disponibles">
                    <Input value={availableDays} readOnly />
                  </Form.Item>
                  <Form.Item label="Fecha de salida">
                    <Input value={departureDate} readOnly />
                  </Form.Item>
                  <Form.Item label="Fecha de regreso">
                    <Input value={returnDate} readOnly />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <Button
                  key="cancel"
                  onClick={() => route.push({ pathname: "/holidays" })}
                  style={{ padding: "0 50px", margin: "10px" }}
                >
                  Regresar
                </Button>
                {permissions.reject_vacation && (
                  <Button
                    key="reject"
                    type="primary"
                    danger
                    onClick={() => setVisibleModalReject(true)}
                    style={{ padding: "0 50px", margin: "10px" }}
                  >
                    Rechazar
                  </Button>
                )}
                {permissions.approve_vacation && (
                  <Button
                    className={"btn-success"}
                    key="save"
                    onClick={showMoalapprove}
                    type="primary"
                    style={{ padding: "0 50px", margin: "10px" }}
                    loading={sending}
                  >
                    Aprobar
                  </Button>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Modal
        title="Rechazar solicitud de vacaciones"
        visible={visibleModalReject}
        footer={[
          <Button
            key="back"
            onClick={rejectCancel}
            style={{ padding: "0 50px", marginLeft: 15 }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit_modal"
            type="primary"
            loading={sending}
            onClick={rejectRequest}
            style={{ padding: "0 50px", marginLeft: 15 }}
          >
            Aceptar y notificar
          </Button>,
        ]}
        onOk={rejectRequest}
        onCancel={rejectCancel}
      >
        <Text>Comentarios</Text>
        <TextArea rows="4" onChange={onChangeMessage} />
      </Modal>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    permissions: state.userStore.permissions.vacation,
  };
};

export default connect(mapState)(withAuthSync(HolidaysDetails));
