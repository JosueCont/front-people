import { React, useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Button,
  Input,
  Modal,
  notification,
} from "antd";

import { useRouter } from "next/router";
import Incapacityform from "../../../components/forms/IncapacityForm";
import { withAuthSync } from "../../../libs/auth";
// import Axios from "axios";
// import { API_URL } from "../../../config/config";
import cookie from "js-cookie";
import WebApiPeople from "../../../api/WebApiPeople";

const IncapacityDetails = () => {
  let userToken = cookie.get("token") ? cookie.get("token") : null;
  let json = JSON.parse(userToken);
  const route = useRouter();
  const { Text } = Typography;
  const { TextArea } = Input;
  const [visibleModalReject, setVisibleModalReject] = useState(false);
  const [details, setDetails] = useState(null);
  const { id } = route.query;
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);
  const [file, setFile] = useState(null);

  const getDetails = async () => {
    WebApiPeople.geDisabilitiesRequest(id)
      .then(function (response) {
        let data = response.data;
        setDetails(data);
        setDepartureDate(data.departure_date);
        setReturnDate(data.return_date);
        setSending(false);
      })
      .catch(function (error) {
        setSending(false);
        console.log(error);
      });
  };

  const rejectRequest = async () => {
    if (json) {
      let values = {
        khonnect_id: json.user_id,
        id: id,
        comment: message,
      };
      WebApiPeople.rejectDisabilitiesRequest(values)
        .then(function (response) {
          setVisibleModalReject(false);
          setMessage(null);
          notification["success"]({
            message: "Aviso",
            description: "Incapacidad rechazada.",
          });
          route.push("/incapacity");
        })
        .catch(function (error) {
          setSending(false);
          console.log(error);
        });
    }
  };

  const approveRequest = async () => {
    if (json) {
      setSending(true);
      let values = {
        khonnect_id: json.user_id,
        id: id,
      };

      WebApiPeople.approveDisabilitiesRequest(values)
        .then(function (response) {
          setVisibleModalReject(false);
          setMessage(null);
          notification["success"]({
            message: "Aviso",
            description: "Solicitud de incapacidad aprobada",
          });
          route.push("/incapacity");
        })
        .catch(function (error) {
          setSending(false);
          console.log(error);
        });
    }
  };

  const onCancel = () => {
    route.push("/incapacity");
  };

  const onChangeDepartureDate = (date, dateString) => {
    setDepartureDate(dateString);
  };

  const onChangeReturnDate = (date, dateString) => {
    setReturnDate(dateString);
  };

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const rejectCancel = () => {
    setVisibleModalReject(false);
    setMessage(null);
  };

  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, [route]);

  return (
    <MainLayout currentKey="5">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => {
            route.push("/incapacity");
          }}
        >
          Incapacidad
        </Breadcrumb.Item>
        <Breadcrumb.Item>Detalles de solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <Incapacityform
              onReject={() => setVisibleModalReject(true)}
              onApprove={approveRequest}
              toApprove={true}
              readOnly={true}
              details={details}
              file={file}
              setFile={setFile}
              // onFinish={saveRequest}
              sending={sending}
              onChangeDepartureDate={onChangeDepartureDate}
              onChangeReturnDate={onChangeReturnDate}
              onCancel={onCancel}
            />
          </Col>
        </Row>
      </div>
      <Modal
        title="Rechazar solicitud de incapacidad"
        visible={visibleModalReject}
        onOk={rejectRequest}
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
            onClick={rejectRequest}
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

export default withAuthSync(IncapacityDetails);
