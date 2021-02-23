import React, { useEffect, useState } from "react";
import {
  Tabs,
  Radio,
  Row,
  Col,
  Breadcrumb,
  Button,
  Image,
  Typography,
  Form,
  Input,
  Modal,
  notification,
  Divider,
  Space,
} from "antd";
import MainLayout from "../../../layout/MainLayout";
import { render } from "react-dom";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import BreadcrumbHome from "../../../components/BreadcrumbHome";

import cookie from "js-cookie";
import { withAuthSync } from "../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../config/config";

const HolidaysDetails = () => {
  let userToken = cookie.get("token") ? cookie.get("token") : null;

  const route = useRouter();

  const { TabPane } = Tabs;
  const { TextArea } = Input;
  const { Text } = Typography;
  const [details, setDetails] = useState(null);
  const { id } = route.query;
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

  let json = JSON.parse(userToken);

  const rejectCancel = () => {
    setVisibleModalReject(false);
    setMessage(null);
  };

  const onChangeMessage = (value) => {
    setMessage(value);
  };

  const getDetails = async () => {
    try {
      let response = await Axios.get(API_URL + `/person/vacation/${id}/`);
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

      /* setNameCollaborator(nameCollaborator); */

      /* setLoading(false); */
      //setList(data.results)
    } catch (e) {
      console.log(e);
      /* setLoading(false); */
    }
  };

  const rejectRequest = async () => {
    if (json) {
      console.log(json);
      try {
        let values = {
          khonnect_id: json.user_id,
          id: id,
          comment: 1212231,
        };
        console.log(values);
        let response = await Axios.post(
          API_URL + `/person/vacation/reject_request/`,
          values
        );
        if (response.status == 200) {
          notification["success"]({
            message: "Aviso",
            description: "Solicitud rechazada.",
          });
          setMessage(null);
          route.push("/holidays");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const approveRequest = async () => {
    if (json) {
      console.log(json);
      setSending(true);
      try {
        let values = {
          khonnect_id: json.user_id,
          id: id,
        };
        let response = await Axios.post(
          API_URL + `/person/vacation/approve_request/`,
          values
        );
        if (response.status == 200) {
          confirm({
            title: "Su solicitud de vacaciones anuales ha sido aceptada",
            icon: <CheckCircleOutlined />,
            okText: "Aceptar y notificar",
            cancelText: "Cancelar",
            onOk() {
              /* console.log('OK'); */
              /* route.push('/holidays'); */
              route.push("/holidays");
            },
            onCancel() {
              console.log("Cancel");
            },
          });

          /* notification["success"]({
                                  message: "Notification Title",
                                  description: "Solicitud aprobada.",
                              });
                              route.push('/holidays') */
        }
      } catch (e) {
        console.log(e);
      } finally {
        setSending(false);
      }
    }
  };

  useEffect(() => {
    getDetails();
  }, [route]);

  return (
    <MainLayout currentKey="5">
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/holidays">Vacaciones</Breadcrumb.Item>
        <Breadcrumb.Item>Detalles</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Tabs type="card">
          <TabPane tab="Detalle de la solicitud" key="1">
            <Row justify={"center"}>
              <Col span={23} style={{ margin: "30px 0" }}>
                <Row>
                  <Col span={4}>
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
                  <Col span={8} offset={1}>
                    <Form>
                      <Form.Item
                        label="Días solicitados"
                        labelCol={{ span: 9 }}
                        labelAlign={"left"}
                      >
                        <Input value={daysRequested} readOnly />
                      </Form.Item>
                      <Form.Item
                        label="Días disponibles"
                        labelCol={{ span: 9 }}
                        labelAlign={"left"}
                      >
                        <Input value={availableDays} readOnly />
                      </Form.Item>
                      <Form.Item
                        label="Fecha de salida"
                        labelCol={{ span: 9 }}
                        labelAlign={"left"}
                      >
                        <Input value={departureDate} readOnly />
                      </Form.Item>
                      <Form.Item
                        label="Fecha de regreso"
                        labelCol={{ span: 9 }}
                        labelAlign={"left"}
                      >
                        <Input value={returnDate} readOnly />
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col  span={24} style={{ textAlign: 'center' }}>
                    <Button
                        key="cancel"
                        onClick={() => route.push({ pathname: '/holidays' })}
                        style={{ padding: "0 50px", margin: "0 10px" }}
                        >
                        Regresar
                    </Button>
                    <Button
                      key="reject"
                      type="primary"
                      danger
                      onClick={() => setVisibleModalReject(true)}
                      style={{ padding: "0 50px", margin: "0 10px" }}
                    >
                      Rechazar
                    </Button>
                    <Button
                    className={'btn-success'}
                      key="save"
                      onClick={approveRequest}
                      type="primary"
                      style={{ padding: "0 50px", margin: "0 10px" }}
                      loading={sending}
                    >
                      Aprobar
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
      <Modal
        title="Rechazar solicitud de vacaciones"
        visible={visibleModalReject}
        onOk={rejectRequest}
        onCancel={rejectCancel}
      >
        <Text>Comentarios</Text>
        <TextArea rows="4" onChange={onChangeMessage} />
      </Modal>
    </MainLayout>
  );
};

export default withAuthSync(HolidaysDetails);
