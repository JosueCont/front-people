import React, { useEffect, useState } from "react";
import MainLayout from "../../../../layout/MainInter";
import { Spin, Breadcrumb, Button, notification, Modal, message } from "antd";
import { useRouter } from "next/router";
import Lendingform from "../../../../components/forms/LendingForm";
import { withAuthSync } from "../../../../libs/auth";
import WebApiPayroll from "../../../../api/WebApiPayroll";
import { verifyMenuNewForTenant } from "../../../../utils/functions";

const LendingNew = () => {
  const route = useRouter();
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState(null);
  const [modal, setModal] = useState(false);
  const [dateApplyDiscount, setDateApplyDiscount] = useState(null);
  const [discountStartDate, setDiscountStartDate] = useState(null);
  const [loanGratingDate, setLoanGratingDate] = useState(null);

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = async () => {
    setReady(false);
    WebApiPayroll.getConfigLoan()
      .then(function (response) {
        if (response.data.results.length > 0)
          setConfig(response.data.results[0]);
        else openModal();
        setReady(true);
      })
      .catch(function (eror) {
        message.error("Ocurrio un error, intente de nuevo.");
        setReady(true);
      });
  };

  const openModal = () => {
    modal ? setModal(false) : setModal(true);
  };

  const changeDateApplyDiscount = (date, dateString) => {
    setDateApplyDiscount(dateString);
  };
  const changeDiscountStartDate = (date, dateString) => {
    setDiscountStartDate(dateString);
  };
  const changeLoanGratingDate = (date, dateString) => {
    setLoanGratingDate(dateString);
  };

  const saveRequest = async (values) => {
    if (values.periodicity_amount.toString().includes("."))
      values.periodicity_amount = values.periodicity_amount.toFixed(2);
    values["date_apply_discount"] = dateApplyDiscount;
    values["discount_start_date"] = discountStartDate;
    values["loan_granting_date"] = loanGratingDate;
    setSending(true);
    WebApiPayroll.saveLoanRequest(values)
      .then(function (response) {
        route.push("/comunication/requests/lending");
        notification["success"]({
          message: "Aviso",
          description: "Información enviada correctamente.",
        });
      })
      .catch(function (error) {
        console.log(error);
        setSending(false);
      });
  };

  const returnConfig = () => {
    openModal();
    route.push("/comunication/requests/lending/config");
  };

  return (
    <MainLayout currentKey={["lending"]} defaultOpenKeys={["managementRH","concierge","requests"]}>
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
                         onClick={() => route.push({ pathname: "/comunication/requests/lending/" })}>Préstamos</Breadcrumb.Item>
        <Breadcrumb.Item>Nuevo</Breadcrumb.Item>
      </Breadcrumb>
      <div className="top-container-border-radius">
        <Spin tip="Cargando..." spinning={!ready}>
          <Lendingform
            sending={sending}
            details={null}
            edit={false}
            onFinish={saveRequest}
            config={config}
            changeDateApplyDiscount={changeDateApplyDiscount}
            changeDiscountStartDate={changeDiscountStartDate}
            changeLoanGratingDate={changeLoanGratingDate}
          />
        </Spin>
      </div>
      <Modal
        visible={modal}
        title="Importante"
        style={{ top: "30%" }}
        footer={[
          <Button type="primary" onClick={returnConfig}>
            Ok, Configurar
          </Button>,
        ]}
      >
        <p>
          Para poder generar préstamos debe configurar los montos y plazos
          máximos y mínimos.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default withAuthSync(LendingNew);
