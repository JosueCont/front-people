import { React, useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Button,
  Form,
  Input,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import BankAccountsForm from "../../../components/forms/BankAccountsForm";
import { withAuthSync } from "../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import cookie from "js-cookie";
import jsCookie from "js-cookie";

const BankAccountsDetails = () => {
  let userToken = cookie.get("token") ? cookie.get("token") : null;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title, Text } = Typography;
  const { TextArea } = Input;
  const { confirm, success } = Modal;

  let json = JSON.parse(userToken);
  const [visibleModalReject, setVisibleModalReject] = useState(false);

  const [update, setUpdate] = useState(false);
  const [currentDetails, setCurrentDetails] = useState(null);
  const [newDetails, setNewDetails] = useState(null);

  const { id } = route.query;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [permissions, setPermissions] = useState({});

  const onCancel = () => {
    route.push("/incapacity");
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(
        API_URL + `/person/bank-account-request/${id}/`
      );
      let data = response.data;
      if (data.person.mlast_name == null || data.person.mlast_name == undefined)
        data.person.mlast_name = "";
      setNewDetails({
        employee:
          data.person.first_name +
          " " +
          data.person.flast_name +
          " " +
          data.person.mlast_name,
        card_number: data.new_card_number,
        account_number: data.new_account_number,
        interbank_key: data.new_interbank_key,
        bank: data.new_bank.name,
        expiration_month: data.new_expiration_month,
        expiration_year: data.new_expiration_year,
      });

      if (data.previous_account_number) {
        setUpdate(true);
        setCurrentDetails({
          employee:
            data.person.first_name +
            " " +
            data.person.flast_name +
            " " +
            data.person.mlast_name,
          account_number: data.previous_account_number,
          interbank_key: data.previous_interbank_key,
          bank: data.previous_bank,
          expiration_month: data.previous_expiration_month,
          expiration_year: data.previous_expiration_year,
          card_number: data.previous_card_number,
        });
      }

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

  const rejectRequest = async () => {
    setLoading(true);
    try {
      let data = {
        id: id,
        status: 3,
        comment: message,
      };
      let response = await Axios.post(
        API_URL + `/person/bank-account-request/change_request_status/`,
        data
      );
      let res = response.data;
      success({
        keyboard: false,
        maskClosable: false,
        content: update
          ? "Actualización de cuenta bancaria rechazada"
          : "Cuenta bancaria rechazada",
        okText: "Aceptar",
        onOk() {
          route.push("/bank_accounts");
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setVisibleModalReject(false);
    }
  };

  const modalAprobe = () => {
    confirm({
      title: update
        ? "¿Está seguro de aprobar la siguiente solicitud de actualización?"
        : "¿Está seguro de aprobar la siguiente cuenta bancaria?",
      icon: <ExclamationCircleOutlined />,
      confirmLoading: loading,
      onOk() {
        setLoading(true);
        approveRequest();
      },
      okText: "Aprobar",
      okType: "primary",
      cancelText: "Cancelar",
    });
  };

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const approveRequest = async () => {
    setLoading(false);
    try {
      let data = {
        id: id,
        status: 2,
      };
      let response = await Axios.post(
        API_URL + `/person/bank-account-request/change_request_status/`,
        data
      );
      let res = response.data;
      success({
        keyboard: false,
        maskClosable: false,
        content: update
          ? "Cuenta bancaria Actualizada"
          : "Su solicitud de cuenta bancaria ha sido aceptada",
        okText: "Aceptar",
        onOk() {
          route.push("/bank_accounts");
        },
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const jwt = JSON.parse(jsCookie.get("token"));
    searchPermissions(jwt.perms);
    if (id) {
      getDetails();
    }
  }, [route]);

  const searchPermissions = (data) => {
    const perms = {};
    data.map((a) => {
      if (a.includes("people.requestaccount.function.reject_account"))
        perms.reject = true;
      if (a.includes("people.requestaccount.function.approve_account"))
        perms.approve = true;
    });
    setPermissions(perms);
  };

  return (
    <MainLayout currentKey={["bank_accounts"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => {
            route.push("/bank_accounts");
          }}
        >
          Cuentas bancarias
        </Breadcrumb.Item>
        <Breadcrumb.Item>Detalles de solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Col span={24} style={{ padding: 20 }}>
          <Row>
            {/* <Col span={23}>
                        <Title key="dats_gnrl" level={4}>
                            Solicitud de revisión
                        </Title>
                    </Col> */}
            <Col span={24}>
              {/* className={"formPermission"} */}
              <Form layout="vertical">
                <Row gutter={24}>
                  {update ? (
                    <Col lg={12} md={12} sm={24}>
                      <Title level={5}> Datos actuales </Title>

                      <BankAccountsForm data={currentDetails} />
                    </Col>
                  ) : null}
                  <Col lg={12} md={12} sm={24}>
                    <Title level={5}> Nuevos datos </Title>

                    <BankAccountsForm data={newDetails} />
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button
                key="cancel"
                style={{ padding: "0 50px", marginBottom: "10px" }}
                onClick={() => route.push("/bank_accounts")}
              >
                Regresar
              </Button>

              {permissions.reject && (
                <Button
                  danger
                  key="reject"
                  type="primary"
                  onClick={() => setVisibleModalReject(true)}
                  style={{
                    padding: "0 50px",
                    marginLeft: 15,
                    marginBottom: "10px",
                  }}
                >
                  Rechazar
                </Button>
              )}

              {permissions.approve && (
                <Button
                  key="save"
                  onClick={modalAprobe}
                  type="primary"
                  style={{
                    padding: "0 50px",
                    marginLeft: 15,
                    marginBottom: "10px",
                  }}
                >
                  {update ? "Actualizar" : "Aprobar"}
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </div>
      <Modal
        title={
          update
            ? "Rechazar solicitud de actualización de cuenta bancaria"
            : "Rechazar solicitud de cuenta bancaria"
        }
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
          <>
            {permissions.reject && (
              <Button
                key="submit_modal"
                type="primary"
                loading={loading}
                onClick={rejectRequest}
                style={{ padding: "0 50px", marginLeft: 15 }}
              >
                Rechazar
              </Button>
            )}
          </>,
        ]}
      >
        <Text>Comentarios</Text>
        <TextArea rows="4" onChange={onChangeMessage} />
      </Modal>
    </MainLayout>
  );
};

export default withAuthSync(BankAccountsDetails);
