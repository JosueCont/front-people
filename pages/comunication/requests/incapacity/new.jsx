import { React, useState } from "react";
import MainLayout from "../../../../layout/MainInter";
import { Row, Col, Breadcrumb, notification } from "antd";
import { useRouter } from "next/router";
import Incapacityform from "../../../../components/forms/IncapacityForm";
import { withAuthSync } from "../../../../libs/auth";
import WebApiPeople from "../../../../api/WebApiPeople";
import { verifyMenuNewForTenant } from "../../../../utils/functions";

const IncapacityNew = () => {
  const route = useRouter();
  const [sending, setSending] = useState(false);

  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);
  const [payrollApplyDate, setPayrollApplyDate] = useState(null);
  const [file, setFile] = useState(null);

  const saveRequest = async (values) => {
    setSending(true);
    let data = new FormData();
    data.append("invoice", values.invoice);
    data.append("incapacity_type", values.incapacity_type);
    data.append("imss_classification", values.imss_classification);
    data.append("category", values.category);
    data.append("subcategory", values.subcategory);
    data.append("requested_days", values.requested_days);
    data.append("departure_date", departure_date);
    data.append("return_date", return_date);
    data.append("payroll_apply_date", payrollApplyDate);
    data.append("person", values.person);
    data.append("document", file ? file["originFileObj"] : null);

    WebApiPeople.saveDisabilitiesRequest(data)
      .then(function (response) {
        route.push("/comunication/requests/incapacity");
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
    route.push("/comunication/requests/incapacity");
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

  return (
    <MainLayout currentKey={["incapacity"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
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
                         onClick={() => route.push({ pathname: "/comunication/requests/incapacity" })}>Incapacidad</Breadcrumb.Item>
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
              onChangePayrollApplyDate={onChangePayrollApplyDate}
              onCancel={onCancel}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(IncapacityNew);
