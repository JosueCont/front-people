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
  Select,
  Form,
  Image,
  Input,
} from "antd";
import MainLayout from "../../../layout/MainLayout";
import { render } from "react-dom";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";
import Vacationform from "../../../components/forms/Vacationform";
import BreadcrumbHome from "../../../components/BreadcrumbHome";
import { withAuthSync } from "../../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../../config/config";

const HolidaysDetails = () => {
  const route = useRouter();
  const [formVacation] = Form.useForm();

  const { TabPane } = Tabs;
  const { Title } = Typography;
  const { Options } = Select;
  const [details, setDetails] = useState(null);
  const { id } = route.query;

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);

  const onCancel = () => {
    route.push("/holidays");
  };

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(API_URL + `/person/vacation/${id}/`);
      let data = response.data;
      console.log("respuesta:::",data)
      setDetails(data);
      setDepartureDate(data.departure_date);
      setReturnDate(data.return_date);

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const onChangeDepartureDate = (date, dateString) => {
    setDepartureDate(dateString);
  };

  const onChangeReturnDate = (date, dateString) => {
    setReturnDate(dateString);
  };

  const saveRequest = async (values) => {
    values["departure_date"] = departure_date;
    values["return_date"] = return_date;

    try {
      let response = await Axios.patch(
        API_URL + `/person/vacation/${id}/`,
        values
      );
      let data = response.data;
      notification["success"]({
        message: "Aviso",
        description: "Información enviada correctamente.",
      });
      route.push("/holidays");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
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
          onClick={() => route.push({ pathname: "/holidays" })}
        >
          Vacaciones
        </Breadcrumb.Item>
        <Breadcrumb.Item>Editar solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            {/* initialValues={{ 
                            'availableDays': collaborator ? collaborator.Available_days_vacation : null,
                            'khonnect_id' : collaborator ? collaborator.id : null
                             }} */}
            <Vacationform
              details={details}
              onFinish={saveRequest}
              loading={loading}
              edit={true}
              sending={sending}
              onChangeDepartureDate={onChangeDepartureDate}
              onChangeReturnDate={onChangeReturnDate}
              onCancel={onCancel}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};
export default withAuthSync(HolidaysDetails);
