import { React, useEffect, useState } from "react";
import MainLayout from "../../../../../layout/MainInter";
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
import Incapacityform from "../../../../../components/forms/IncapacityForm";
import { withAuthSync } from "../../../../../libs/auth";
import cookie from "js-cookie";
import WebApiPeople from "../../../../../api/WebApiPeople";
import { verifyMenuNewForTenant } from "../../../../../utils/functions";

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
          route.push("/comunication/requests/incapacity");
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
          route.push("/comunication/requests/incapacity");
        })
        .catch(function (error) {
          setSending(false);
          console.log(error);
        });
    }
  };

  const onCancel = () => {
    route.push("/comunication/requests/incapacity");
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
    <MainLayout currentKey={["incapacity"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <>
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
            <Breadcrumb.Item>Concierge</Breadcrumb.Item>
          </>
        }
          <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => {
            route.push("/comunication/requests/incapacity");
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
              sending={sending}
              view={true}
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
