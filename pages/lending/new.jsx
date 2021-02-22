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
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../libs/axiosApi";
import moduleName from "../../components/forms/LendingForm";
import moment from "moment";
import Lendingform from "../../components/forms/LendingForm";
import { withAuthSync } from "../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../config/config";

const HolidaysNew = () => {
  const route = useRouter();
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState(null);

  const onCancel = () => {
    route.push("/lending");
  };

  const saveRequest = async (values) => {
    if (values.periodicity_amount.toString().includes("."))
      values.periodicity_amount = values.periodicity_amount.toFixed(2);
    setSending(true);
    console.log(values);
    try {
      let response = await Axios.post(API_URL + `/payroll/loan/`, values);
      route.push("/lending");
      notification["success"]({
        message: "Aviso",
        description: "Información enviada correctamente.",
      });
    } catch (error) {
      console.log("error");
    } finally {
      setSending(false);
    }
  };

  const getConfig = async () => {
    setReady(false);
    try {
      let response = await Axios.get(API_URL + `/payroll/loan-config/`);
      setConfig(response.data.results[0]);
      console.log(response.data.results[0]);
    } catch (error) {
      console.log("error");
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    console.log(config);
  }, [config]);

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
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Spin tip="Loading..." spinning={!ready}>
          <Row justify={"center"}>
            <Col span={23}>
              <Lendingform
                sending={sending}
                details={null}
                edit={false}
                onFinish={saveRequest}
                config={config}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(HolidaysNew);
