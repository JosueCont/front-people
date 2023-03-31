import React, { useState } from "react";
import MainLayout from "../../../../../layout/MainInter";
import { Row, Col, Breadcrumb, notification } from "antd";
import { useRouter } from "next/router";
import Vacationform from "../../../../../components/forms/Vacationform";
import { withAuthSync } from "../../../../../libs/auth";
import WebApiPeople from "../../../../../api/WebApiPeople";
import { verifyMenuNewForTenant } from "../../../../../utils/functions";

const HolidaysNew = () => {
  const route = useRouter();
  const [sending, setSending] = useState(false);
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);

  const onCancel = () => {
    route.push("/comunication/requests/holidays");
  };

  const saveRequest = async (values) => {
    values["departure_date"] = departure_date;
    values["return_date"] = return_date;
    values["created_from"] = 2;// 2 es que se hizo desde la web
    setSending(true);
    WebApiPeople.saveVacationRequest(values)
      .then(function (response) {
        setSending(false);
        notification["success"]({
          message: "Aviso",
          description: "Información enviada correctamente.",
        });
        route.push("/comunication/requests/holidays");
      })
      .catch(function (error) {
        console.log(error);
        setSending(false);
      });
  };

  const onChangeDepartureDate = (date, dateString) => {
    setDepartureDate(dateString);
  };

  const onChangeReturnDate = (date, dateString) => {
    setReturnDate(dateString);
  };

  return (
    <MainLayout currentKey={["holidays"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
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
                         onClick={() => route.push({ pathname: "/comunication/requests/holidays" })}>Vacaciones</Breadcrumb.Item>
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
