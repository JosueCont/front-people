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
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";
import Vacationform from "../../../components/forms/Vacationform";
import { withAuthSync } from "../../../libs/auth";
import { API_URL } from "../../../config/config";
import Axios from "axios";

const HolidaysNew = () => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [sending, setSending] = useState(false);
  const { Option } = Select;
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);
  const [job, setJob] = useState(null);
  const [dateOfAdmission, setDateOfAdmission] = useState(null);
  const [availableDays, setAvailableDays] = useState(null);
  const [personList, setPersonList] = useState(null);
  const [allPersons, setAllPersons] = useState(null);
  const [antiquity, setAntiquity] = useState(null);

  const onCancel = () => {
    route.push("/holidays");
  };

  const changePerson = (value) => {
    console.log(value);
    let index = allPersons.find((data) => data.khonnect_id === value);
    console.log(index);
    setDateOfAdmission(moment(index.date_of_admission).format("DD/MM/YYYY"));
    if (index.job_department.job) {
      setJob(index.job_department.job.name);
      setAvailableDays(index.Available_days_vacation);
      setAntiquity(index.antiquity);
    }
  };

  const saveRequest = async (values) => {
    values["departure_date"] = departure_date;
    values["return_date"] = return_date;
    setSending(true);
    try {
      let response = await Axios.post(API_URL + `/person/vacation/`, values);
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

  const onChangeDepartureDate = (date, dateString) => {
    setDepartureDate(dateString);
  };

  const onChangeReturnDate = (date, dateString) => {
    setReturnDate(dateString);
  };

  return (
    <MainLayout currentKey="5">
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="./">Vacaciones</Breadcrumb.Item>
        <Breadcrumb.Item>Nueva solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <Vacationform
              details={null}
              onFinish={saveRequest}
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
export default withAuthSync(HolidaysNew);
