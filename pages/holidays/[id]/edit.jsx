import React, { useEffect, useState } from "react";
import { Row, Col, Breadcrumb, notification } from "antd";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import Vacationform from "../../../components/forms/Vacationform";
import { withAuthSync } from "../../../libs/auth";
import WebApiPeople from "../../../api/WebApiPeople";

const HolidaysDetails = () => {
  const route = useRouter();
  const { id } = route.query;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);

  const onCancel = () => {
    route.push("/holidays");
  };

  const getDetails = async () => {
    setLoading(true);
    WebApiPeople.geVacationRequest(id)
      .then(function (response) {
        let data = response.data;
        setDetails(data);
        setDepartureDate(data.departure_date);
        setReturnDate(data.return_date);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
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

    WebApiPeople.updateVacationRequest(id, values)
      .then(function (response) {
        setSending(false);
        notification["success"]({
          message: "Aviso",
          description: "Información enviada correctamente.",
        });
        route.push("/holidays");
      })
      .catch(function (error) {
        console.log(error);
        setSending(false);
      });
  };

  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, [route]);

  return (
    <MainLayout currentKey={["holiday"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
        <Breadcrumb.Item>Concierge</Breadcrumb.Item>
        <Breadcrumb.Item>Solicitudes</Breadcrumb.Item>
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
