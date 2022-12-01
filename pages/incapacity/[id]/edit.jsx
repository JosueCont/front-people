import { React, useEffect, useState } from "react";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col, Breadcrumb, notification } from "antd";
import { useRouter } from "next/router";
import Incapacityform from "../../../components/forms/IncapacityForm";
import { withAuthSync } from "../../../libs/auth";
import WebApiPeople from "../../../api/WebApiPeople";

const IncapacityEdit = () => {
  const route = useRouter();
  const { id } = route.query;
  const [details, setDetails] = useState(null);
  const [sending, setSending] = useState(false);
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);
  const [file, setFile] = useState(null);
  const [payrollApplyDate, setPayrollApplyDate] = useState(null);

  const getDetails = async () => {
    setSending(true);
    WebApiPeople.geDisabilitiesRequest(id)
      .then(function (response) {
        let data = response.data;
        setDetails(data);
        setDepartureDate(data.departure_date);
        setReturnDate(data.return_date);
        setPayrollApplyDate(data.payroll_apply_date);
        setSending(false);
      })
      .catch(function (error) {
        setSending(false);
        console.log(error);
      });
  };

  const saveRequest = async (values) => {
    setSending(true);

    let data = new FormData();
    data.append("incapacity_type", values.incapacity_type);
    data.append("imss_classification", values.imss_classification);
    data.append("category", values.category);
    data.append("subcategory", values.subcategory);
    data.append("requested_days", values.requested_days);
    data.append("departure_date", departure_date);
    data.append("return_date", return_date);
    data.append("payroll_apply_date", payrollApplyDate);
    data.append("person", values.person);
    if (file) {
      data.append("document", file["originFileObj"]);
    }

    WebApiPeople.updateDisabilitiesRequest(id, data)
      .then(function (response) {
        route.push("/incapacity");
        notification["success"]({
          message: "Aviso",
          description: "Información enviada correctamente.",
        });
      })
      .catch(function (error) {
        setSending(false);
        console.log(error);
      });
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

  const onChangePayrollApplyDate = (date, dateString) => {
    setPayrollApplyDate(dateString);
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
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/incapacity" })}
        >
          Incapacidad
        </Breadcrumb.Item>
        <Breadcrumb.Item>Editar solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <Incapacityform
              details={details}
              file={file}
              edit={true}
              setFile={setFile}
              onFinish={saveRequest}
              sending={sending}
              onChangeDepartureDate={onChangeDepartureDate}
              onChangeReturnDate={onChangeReturnDate}
              onChangePayrollApplyDate={onChangePayrollApplyDate}
              onCancel={onCancel}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(IncapacityEdit);
