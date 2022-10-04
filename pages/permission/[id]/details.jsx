import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Typography,
  Button,
  Modal,
  Input,
  notification,
} from "antd";
import MainLayout from "../../../layout/MainLayout";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import PermissionForm from "../../../components/forms/PermissionForm";
import { withAuthSync } from "../../../libs/auth";
import cookie from "js-cookie";
import WebApiPeople from "../../../api/WebApiPeople";

const PermissionDetails = () => {
  const route = useRouter();
  let userToken = cookie.get("token") ? cookie.get("token") : null;
  let json = JSON.parse(userToken);
  const [details, setDetails] = useState(null);
  const { id } = route.query;
  const { TextArea } = Input;
  const { Text } = Typography;

  const { confirm } = Modal;

  const [userId, setUserId] = useState(null);
  const [visibleModalReject, setVisibleModalReject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState(null);

  const onCancel = () => {
    route.push("/permission");
  };

  const getDetails = async () => {
    setLoading(true);
    WebApiPeople.gePermitsRequest(id)
      .then(function (response) {
        let data = response.data;
        setDetails(data);
        setDepartureDate(data.departure_date);
        setReturnDate(data.return_date);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
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
    setLoading(true);
    let values = {
      id: id,
      status: statusID,
      khonnect_id: userId,
    };
    if (statusID === 3) {
      if (message) {
        values.comment = message ? message : "";
      }
    }
    let msg = "Solicitud de permiso aprobada";
    if (statusID === 3) {
      msg = "Solicitud de permiso rechazada";
    }
    WebApiPeople.changeStatusPermitsRequest(values)
      .then(function (response) {
        setVisibleModalReject(false);
        setLoading(false);
        route.push("/permission");
        notification["success"]({
          message: "Aviso",
          description: msg,
        });
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
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
    <MainLayout currentKey={["permission"]} defaultOpenKeys={["requests"]}>
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
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
