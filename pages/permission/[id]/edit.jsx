import React, { useEffect, useState } from "react";
import { Row, Col, Breadcrumb, notification } from "antd";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import PermissionForm from "../../../components/forms/PermissionForm";
import { withAuthSync } from "../../../libs/auth";
import WebApiPeople from "../../../api/WebApiPeople";

const PermissionEdit = () => {
  const route = useRouter();
  const [details, setDetails] = useState(null);
  const { id } = route.query;

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);

  const onCancel = () => {
    route.push("/permission");
  };

  const onChangeDepartureDate = (date, dateString) => {
    setDepartureDate(dateString);
  };

  const onChangeReturnDate = (date, dateString) => {
    setReturnDate(dateString);
  };

  const getDetails = async () => {
    setLoading(true);
    WebApiPeople.gePermitsRequest(id)
      .then(function (response) {
        let data = response.data;
        setDetails(data);
        setDepartureDate(data.departure_date);
        setReturnDate(data.return_date);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const saveRequest = async (values) => {
    values["departure_date"] = departure_date;
    values["return_date"] = return_date;
    WebApiPeople.updatePermitsRequest(id, values)
      .then(function (response) {
        route.push("/permission");
        notification["success"]({
          message: "Aviso",
          description: "Información actualizada correctamente.",
        });
        setSending(false);
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
    <MainLayout currentKey={["permission"]} defaultOpenKeys={["requests"]}>
      <Breadcrumb key="Breadcrumb" className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/permission">Permisos</Breadcrumb.Item>
        <Breadcrumb.Item>Editar solicitud</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="container back-white"
        style={{ width: "100%", padding: "20px 0" }}
      >
        <Row justify={"center"}>
          <Col span={23}>
            <PermissionForm
              details={details}
              onFinish={saveRequest}
              edit={true}
              loading={loading}
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

export default withAuthSync(PermissionEdit);
