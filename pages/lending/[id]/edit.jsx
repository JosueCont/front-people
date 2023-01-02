import React, { useEffect, useState } from "react";
import MainLayout from "../../../layout/MainInter";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  notification,
  Modal,
} from "antd";
import { useRouter } from "next/router";
import Lendingform from "../../../components/forms/LendingForm";
import { withAuthSync } from "../../../libs/auth";
import WebApiPayroll from "../../../api/WebApiPayroll";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import cookie from "js-cookie";
import { verifyMenuNewForTenant } from "../../../utils/functions";

const HolidaysNew = () => {
  const route = useRouter();
  const { Text } = Typography;
  const { TextArea } = Input;

  const { id } = route.query;
  let userToken = cookie.get("token") ? cookie.get("token") : null;
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [details, setDetails] = useState(null);
  const [message, setMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateApplyDiscount, setDateApplyDiscount] = useState(null);
  const [discountStartDate, setDiscountStartDate] = useState(null);
  const [loanGratingDate, setLoanGratingDate] = useState(null);

  let json = JSON.parse(userToken);

  const approve = async () => {
    let values = {
      id: id,
      khonnect_id: json.user_id,
    };
    setSending(true);
    WebApiPayroll.approveLoanRequest(values)
      .then(function (response) {
        Modal.success({
          keyboard: false,
          maskClosable: false,
          content: "Préstamo autorizado",
          okText: "Aceptar",
          onOk() {
            route.push("/lending");
          },
        });
      })
      .catch(function (error) {
        console.log(error);
        setSending(false);
      });
  };

  const reject = async () => {
    let values = {
      id: id,
      khonnect_id: json.user_id,
      comment: message,
    };
    WebApiPayroll.rejectLoanRequest(values)
      .then(function (response) {
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
      })
      .catch(function (error) {
        console.log(error);
        setSending(false);
      });
  };

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const ShowModal = () => {
    setModalVisible(true);
  };

  const changeDateApplyDiscount = (date, dateString) => {
    setDateApplyDiscount(dateString);
  };
  const changeDiscountStartDate = (date, dateString) => {
    setDiscountStartDate(dateString);
  };
  const changeLoanGratingDate = (date, dateString) => {
    setLoanGratingDate(dateString);
  };

  const onFinish = async (values) => {
    setSending(true);
    if (values.periodicity_amount.toString().includes("."))
      values.periodicity_amount = values.periodicity_amount.toFixed(2);

    values["date_apply_discount"] = dateApplyDiscount;
    values["discount_start_date"] = discountStartDate;
    values["loan_granting_date"] = loanGratingDate;
    WebApiPayroll.updateLoanRequest(id, values)
      .then(function (response) {
        route.push("/lending");
        notification["success"]({
          message: "Aviso",
          description: "Información actualizada correctamente.",
        });
      })
      .catch(function (error) {
        console.log(error);
        setSending(false);
      });
  };

  const rejectCancel = () => {
    setModalVisible(false);
    setMessage(null);
  };

  const getConfig = async () => {
    WebApiPayroll.getConfigLoan()
      .then(function (response) {
        setConfig(response.data.results[0]);
      })
      .catch(function (eror) {
        message.error("Ocurrio un error, intente de nuevo.");
      });
  };

  const getDetails = async () => {
    setLoading(true);
    WebApiPayroll.getLoanRequest(id)
      .then(function (response) {
        let data = response.data;
        setDetails(data);
        setDateApplyDiscount(data.date_apply_discount);
        setDiscountStartDate(data.discount_start_date);
        setLoanGratingDate(data.loan_granting_date);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (id) {
      getConfig();
      getDetails();
    }
  }, [route]);

  return (
    <MainLayout currentKey={["lending"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
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
        <Breadcrumb.Item className={"pointer"}
                         onClick={() => route.push({ pathname: "/lending" })}>Préstamos</Breadcrumb.Item>
        <Breadcrumb.Item>Editar solicitud</Breadcrumb.Item>
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
                changeDateApplyDiscount={changeDateApplyDiscount}
                changeDiscountStartDate={changeDiscountStartDate}
                changeLoanGratingDate={changeLoanGratingDate}
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
export default withAuthSync(HolidaysNew);
