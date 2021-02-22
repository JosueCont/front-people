import { React, useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
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
import axiosApi from "../../libs/axiosApi";
import moment from "moment";
import Incapacityform from "../../components/forms/IncapacityForm";
import { withAuthSync } from "../../libs/auth";
import Axios from "axios";
import { API_URL } from "../../config/config";

const IncapacityNew = () => {
  const route = useRouter();
  const [form] = Form.useForm();
  const { Title } = Typography;
  const [sending, setSending] = useState(false);
  const { Option } = Select;

  /* Dates */
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);

  /* Selects */
  const [allPersons, setAllPersons] = useState(null);

  /* file */
  const [file, setFile] = useState(null);

  const onCancel = () => {
    route.push("/incapacity");
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
    setSending(true);
    values["departure_date"] = departure_date;
    values["return_date"] = return_date;
    file ? console.log(file["originFileObj"]) : null;
    console.log(values);

    let data = new FormData();
    data.append("departure_date", departure_date);
    data.append("return_date", return_date);
    data.append("khonnect_id", values.khonnect_id);
    data.append("document", file["originFileObj"]);
    try {
      let response = await Axios.post(API_URL + `/person/incapacity/`, data);
      let resData = response.data;
      route.push("/incapacity");
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
        <Breadcrumb.Item href="./">Incapacidad</Breadcrumb.Item>
        <Breadcrumb.Item>Nueva solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <Incapacityform
              details={null}
              file={file}
              setFile={setFile}
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

export default withAuthSync(IncapacityNew);
