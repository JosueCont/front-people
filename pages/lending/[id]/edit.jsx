import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Table,
  Breadcrumb,
  Image,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  notification,
  Space,
  Switch,
  Modal,
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moduleName from "../../../components/forms/LendingForm";
import moment from "moment";
import Lendingform from "../../../components/forms/LendingForm";
import { withAuthSync } from "../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import cookie from "js-cookie";

const HolidaysNew = () => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;

  const { id } = route.query;
  let userToken = cookie.get("token") ? cookie.get("token") : null;
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [details, setDetails] = useState(null);
  const [message, setMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  let json = JSON.parse(userToken);

  const onCancel = () => {
    route.push("/lending");
  };

  const approve = async () => {
    let values = {
      id: id,
      khonnect_id: json.user_id,
    };
    setSending(true);
    try {
      let response = await Axios.post(
        API_URL + `/payroll/loan/approve_request/`,
        values
      );
      Modal.success({
        keyboard: false,
        maskClosable: false,
        content: "Préstamo autorizado",
        okText: "Aceptar y notificar",
        onOk() {
          route.push("/lending");
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const reject = async () => {
    console.log("Reject");
    console.log(message);
    let values = {
      id: id,
      khonnect_id: json.user_id,
      comment: message,
    };
    try {
      let response = await Axios.post(
        API_URL + `/payroll/loan/reject_request/`,
        values
      );
      setModalVisible(false);
      Modal.success({
        keyboard: false,
        maskClosable: false,
        content: "Préstamo rechazado",
        okText: "Aceptar",
        onOk() {
          route.push("/lending");
        },
      });
      setMessage(null);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const onChangeMessage = (e) => {
    console.log(e.target.value);
    setMessage(e.target.value);
  };

  const ShowModal = () => {
    setModalVisible(true);
  };

  const onFinish = async (values) => {
    setSending(true);
    if (values.periodicity_amount.toString().includes("."))
      values.periodicity_amount = values.periodicity_amount.toFixed(2);
    try {
      let response = await Axios.patch(
        API_URL + `/payroll/loan/${id}/`,
        values
      );
      route.push("/lending");
      notification["success"]({
        message: "Aviso",
        description: "Información actualizada correctamente.",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const rejectCancel = () => {
    setModalVisible(false);
    setMessage(null);
  };

  const getConfig = async () => {
    try {
      let response = await Axios.get(API_URL + `/payroll/loan-config/`);
      setConfig(response.data.results[0]);
      console.log(response.data.results[0]);
    } catch (error) {
      console.log("error");
    }
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(API_URL + `/payroll/loan/${id}`);
      let data = response.data;
      console.log("data", data);
      setDetails(data);
      /* setDepartureDate(data.departure_date);
      setReturnDate(data.return_date); */
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDetails();
      getConfig();
    }
  }, [route]);

  return (
    <MainLayout currentKey="7.1">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item href="/lending">Prestamos</Breadcrumb.Item>
        <Breadcrumb.Item>Editar Solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            {!loading ? (
              <Lendingform
                sending={sending}
                details={details}
                edit={true}
                onApprove={approve}
                onReject={ShowModal}
                onFinish={onFinish}
                config={config}
              />
            ) : null}
          </Col>
        </Row>
      </div>
      <Modal
        title="Rechazar solicitud de préstamo"
        visible={modalVisible}
        onOk={reject}
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
            onClick={reject}
            style={{ padding: "0 50px", marginLeft: 15 }}
          >
            Aceptar
          </Button>,
        ]}
      >
        <Text>Comentarios</Text>
        <TextArea rows="4" onChange={onChangeMessage} />
      </Modal>
    </MainLayout>
  );
};
export default withAuthSync(HolidaysNew);
