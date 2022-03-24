import { React, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Row, Col, Breadcrumb, notification } from "antd";
import { useRouter } from "next/router";
import Incapacityform from "../../components/forms/IncapacityForm";
import { withAuthSync } from "../../libs/auth";
import WebApiPeople from "../../api/WebApiPeople";

const IncapacityNew = () => {
  const route = useRouter();
  const [sending, setSending] = useState(false);

  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);
  const [file, setFile] = useState(null);

  const saveRequest = async (values) => {
    setSending(true);

    let data = new FormData();
    data.append("departure_date", departure_date);
    data.append("return_date", return_date);
    data.append("person", values.person);
    data.append("document", file ? file["originFileObj"] : null);

    WebApiPeople.saveDisabilitiesRequest(data)
      .then(function (response) {
        route.push("/incapacity");
        notification["success"]({
          message: "Aviso",
          description: "Información enviada correctamente.",
        });
      })
      .catch(function (error) {
        setLoading(false);
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
