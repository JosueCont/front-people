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
import Axios from 'axios';
import {API_URL} from '../../../config/config'


const PermissionDetails = () => {
  const route = useRouter();
  /* const [formVacation] = Form.useForm(); */

  const { TabPane } = Tabs;
  const { Title } = Typography;
  const { Options } = Select;
  const [details, setDetails] = useState(null);
  const { id } = route.query;
  const { TextArea } = Input;
  const { Text } = Typography;

  const { confirm } = Modal;

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
    console.log(date);
    console.log(dateString);
    setDepartureDate(dateString);
  };

  const onChangeReturnDate = (date, dateString) => {
    setReturnDate(dateString);
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(API_URL+`/person/permit/${id}/`);
      let data = response.data;
      setDetails(data);
      setDepartureDate(data.departure_date);
      setReturnDate(data.return_date);

      setLoading(false);
    } catch (e) {
      console.log("error", e);
      setLoading(false);
    }
  };

  const saveRequest = async (values) => {
    /* values["departure_date"] = departure_date;
        values["return_date"] = return_date;
        console.log(values);
        try {
            let response = await axiosApi.patch(`person/vacation/${id}/`, values);
            let data = response.data;
            notification["success"]({
              message: "Aviso",
              description: "Información enviada correctamente.",
            });
            route.push("/holidays");
            console.log("res", response.data);
          } catch (error) {
            console.log("error", error);
          } finally {
            setSending(false);
          } */
  };

  const rejectCancel = () => {
    setVisibleModalReject(false);
    setMessage(null);
  };

  const onChangeMessage = (value) => {
    setMessage(value);
  };

  const onReject = () => {
    /* changeStatus(3) */
    setVisibleModalReject(true)
  };

  const onApprove = () => {
    changeStatus(2)
  };

  const changeStatus = async (statusID) => {
    let values = {
        id: id,
        status: statusID
    }
    let msg = "Solicitud de permiso aprobada";
    if(statusID === 3){
        msg = "Solicitud de permiso rechazada";
    }
    try {
        let response = await Axios.post(API_URL+`/person/permit/change_status/`, values);

        confirm({
            title: msg,
            icon: <CheckCircleOutlined />,
            okText: "Aceptar y notificar",
            cancelText: "Cancelar",
            onOk() {
              /* console.log('OK'); */
              /* route.push('/holidays'); */
              route.push("/permission");
            },
            onCancel() {
              console.log("Cancel");
            },
          });

        console.log("res", response.data);
    } catch (error) {
            console.log("error", error);
    } finally {
            setSending(false);
    }
  }

  useEffect(() => {
        if (id) {
            getDetails();
        }
  }, [route]);

  return (
    <MainLayout currentKey="5">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <BreadcrumbHome />
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
              onFinish={saveRequest}
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
        onOk={() => changeStatus(3) }
        onCancel={rejectCancel}
      >
        <Text>Comentarios</Text>
        <TextArea rows="4"  onChange={onChangeMessage} />
      </Modal>
    </MainLayout>
  );
};
export default withAuthSync(PermissionDetails);
