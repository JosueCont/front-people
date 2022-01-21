import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  Spin,
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
  message,
} from "antd";
import { useRouter } from "next/router";
import Lendingform from "../../components/forms/LendingForm";
import { withAuthSync } from "../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../config/config";

const HolidaysNew = () => {
  const route = useRouter();
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = async () => {
    setReady(false);
    try {
      let response = await Axios.get(API_URL + `/payroll/loan-config/`);
      if (response.data.results.length > 0) setConfig(response.data.results[0]);
      else openModal();
    } catch (error) {
      message.error("Ocurrio un error, intente de nuevo.");
    } finally {
      setReady(true);
    }
  };

  const openModal = () => {
    modal ? setModal(false) : setModal(true);
  };

  const saveRequest = async (values) => {
    if (values.periodicity_amount.toString().includes("."))
      values.periodicity_amount = values.periodicity_amount.toFixed(2);
    setSending(true);
    try {
      let response = await Axios.post(API_URL + `/payroll/loan/`, values);
      route.push("/lending");
      notification["success"]({
        message: "Aviso",
        description: "Información enviada correctamente.",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const returnConfig = () => {
    openModal();
    route.push("/lending/config");
  };

  return (
    <MainLayout currentKey="7.1">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="./">Préstamos</Breadcrumb.Item>
        <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
      </Breadcrumb>
      <div className="top-container-border-radius">
        <Spin tip="Cargando..." spinning={!ready}>
          {/* <Row justify={"center"}>
            <Col span={24}> */}
          <Lendingform
            sending={sending}
            details={null}
            edit={false}
            onFinish={saveRequest}
            config={config}
          />
          {/* </Col>
          </Row> */}
        </Spin>
      </div>
      <Modal
        visible={modal}
        title="Importante"
        style={{ top: "30%" }}
        footer={[
          <Button type="primary" onClick={returnConfig}>
            Ok, Configurar
          </Button>,
        ]}
      >
        <p>
          Para poder generar préstamos debe configurar los montos y plazos
          máximos y mínimos.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default withAuthSync(HolidaysNew);
