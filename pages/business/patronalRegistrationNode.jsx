import { Breadcrumb, Spin } from "antd";
import PatronalRegistration from "../../components/payroll/PatronalRegistration";
import MainLayout from "../../layout/MainInter";
import { withAuthSync } from "../../libs/auth";
import { useRouter } from "next/router";
import React from "react";
import { verifyMenuNewForTenant } from "../../utils/functions"

const PatronalRegistartionNode = () => {
  const router = useRouter();
  return (
    <MainLayout currentKey={["patronal"]} defaultOpenKeys={["strategyPlaning","company"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
        }
          <Breadcrumb.Item>Empresa</Breadcrumb.Item>
        <Breadcrumb.Item className={"pointer"}>
          Registros patronales
        </Breadcrumb.Item>
      </Breadcrumb>
      <Spin tip="Cargando..." spinning={false}>
        <div
          className="container-border-radius"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <PatronalRegistration />
        </div>
      </Spin>
    </MainLayout>
  );
};

export default withAuthSync(PatronalRegistartionNode);
