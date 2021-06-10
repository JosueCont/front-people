import React, { useEffect, useState } from "react";
import {
  Tabs,
  Radio,
  Row,
  Col,
  Breadcrumb,
  Typography,
  notification,
  Button,
  Modal,
  Select,
  Form,
  Image,
  Input,
} from "antd";
import MainLayout from "../../../layout/MainLayout";
import { render } from "react-dom";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";
import PermissionForm from "../../../components/forms/PermissionForm";
import BreadcrumbHome from "../../../components/BreadcrumbHome";
import { withAuthSync } from "../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import cookie from "js-cookie";

const PermissionDetails = () => {
  const route = useRouter();
  let userToken = cookie.get("token") ? cookie.get("token") : null;
  let json = JSON.parse(userToken);
  /* const [formVacation] = Form.useForm(); */

  const { TabPane } = Tabs;
  const { Title } = Typography;
  const { Options } = Select;
  const [details, setDetails] = useState(null);
  const { id } = route.query;
  const { TextArea } = Input;
  const { Text } = Typography;

  const { confirm } = Modal;

  const [userId, setUserId] = useState(null);
  const [visibleModalReject, setVisibleModalReject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);
  const [message, setMessage] = useState(null);

  const onCancel = () => {
    route.push("/permission");
  };

  const onChangeDepartureDate = (date, dateString) => {
    setDepartureDate(dateString);
  };

  const onChangeReturnDate = (date, dateString) => {
    setReturnDate(dateString);
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(API_URL + `/person/permit/${id}/`);
      let data = response.data;
      setDetails(data);
      setDepartureDate(data.departure_date);
      setReturnDate(data.return_date);

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const rejectCancel = () => {
    setVisibleModalReject(false);
    setMessage(null);
  };

  const onChangeMessage = (value) => {
    setMessage(value.target.value);
  };

  const onReject = () => {
    /* changeStatus(3) */
    setVisibleModalReject(true);
  };

  const onApprove = () => {
    confirm({
      title: "¿Está seguro de aprobar la siguiente solicitud de permisos?",
      icon: <ExclamationCircleOutlined />,
      okText: "Aceptar y notificar",
      cancelText: "Cancelar",
      onOk() {
        changeStatus(2);
      },
    });
  };

  const changeStatus = async (statusID) => {
    let values = {
      id: id,
      status: statusID,
      khonnect_id: userId,
    };
    if (statusID === 3) {
      if (message){
        values.comment = message? message:"";
      }
    }
    let msg = "Solicitud de permiso aprobada";
    if (statusID === 3) {
      msg = "Solicitud de permiso rechazada";
    }
    try {
      let response = await Axios.post(
        API_URL + `/person/permit/change_status/`,
        values
      );
      setVisibleModalReject(false);
      Modal.success({
        keyboard: false,
        maskClosable: false,
        content: msg,
        okText: "Aceptar",
        onOk() {
          route.push("/permission");
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, [route]);
  useEffect(() => {
    if (json) {
      setUserId(json.user_id);
    }
  }, []);

  return (
    <MainLayout currentKey="5">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/permission">Permisos</Breadcrumb.Item>
        <Breadcrumb.Item>Editar solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <PermissionForm
              readOnly={true}
              toApprove={true}
              details={details}
              onReject={onReject}
              onApprove={onApprove}
              onFinish={null}
              loading={loading}
              sending={sending}
              onChangeDepartureDate={onChangeDepartureDate}
              onChangeReturnDate={onChangeReturnDate}
              onCancel={onCancel}
            />
          </Col>
        </Row>
      </div>
      <Modal
        title="Rechazar solicitud de permisos"
        visible={visibleModalReject}
        onCancel={rejectCancel}
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
            onClick={() => changeStatus(3)}
            style={{ padding: "0 50px", marginLeft: 15 }}
          >
            Aceptar y notificar
          </Button>,
        ]}
      >
        <Text>Comentarios</Text>
        <TextArea rows="4" onChange={onChangeMessage} />
      </Modal>
    </MainLayout>
  );
};
export default withAuthSync(PermissionDetails);
