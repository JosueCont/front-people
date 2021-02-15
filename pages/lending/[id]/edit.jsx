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
import Axios from 'axios';
import {API_URL} from '../../../config/config'

const HolidaysNew = () => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;

  const { id } = route.query;
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [details, setDetails] = useState(null);
  const [message, setMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onCancel = () => {
    route.push("/lending");
  };

    const approve = async () => {
        let values = {
            "status": 2
        }
        try {
            let response = await Axios.patch(API_URL+`/payroll/loan/${id}/`, values);
            route.push("/lending");
            Modal.success({
                content: "Préstamo autorizado",
                okText: "Aceptar y notificar",
                onOk() {
                    console.log("OK");
                },
            });
        } catch (error) {
            console.log(error)
        }finally{
            setSending(false);
        }
    };

  const reject = async () => {
    console.log("Reject");
    let values = {
        "status": 3
    }
    try {
        let response = await Axios.patch(API_URL+`/payroll/loan/${id}/`, values);
        route.push('/lending');
        notification["success"]({
            message: "Aviso",
            description: "Solicitud rechazada.",
          });
          setMessage(null);
    } catch (error) {
        console.log(error)
    }finally{
        setSending(false);
    }
    
  };

  const onChangeMessage = (value) => {
    setMessage(value);
  };

  const ShowModal = () => {
    setModalVisible(true);
  };

  const onFinish = async (values) => {
      try {
        let response = await Axios.patch(API_URL+`/payroll/loan/${id}/`, values);
        route.push("/lending");
        notification["success"]({
            message: "Aviso",
            description: "Información actualizada correctamente.",
        });
    } catch (error) {
        console.log(error)
    }finally{
        setSending(false);
    }
  }

  const rejectCancel = () => {
    setModalVisible(false);
    setMessage(null);
  };

  const getConfig = async () => {
    try {
        let response = await Axios.get(API_URL+`/payroll/loan-config/`);
        setConfig(response.data.results[0])
        console.log(response.data.results[0])
    } catch (error) {
        console.log("error")
    }
} 

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(API_URL+`/payroll/loan/${id}`);
      let data = response.data;
      console.log("data", data);
      setDetails(data);
      /* setDepartureDate(data.departure_date);
      setReturnDate(data.return_date); */
    } catch (e) {
      console.log("error", e);
    }finally{
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
            { !loading ? <Lendingform details={details} edit={true} onApprove={approve} onReject={ShowModal} onFinish={onFinish} config={config} /> : null }
          </Col>
        </Row>
      </div>
      <Modal
        title="Rechazar solicitud de prestamo"
        visible={modalVisible}
        onOk={reject}
        onCancel={rejectCancel}
      >
        <Text>Comentarios</Text>
        <TextArea rows="4" onChange={onChangeMessage} />
      </Modal>
    </MainLayout>
  );
};
export default withAuthSync(HolidaysNew);
