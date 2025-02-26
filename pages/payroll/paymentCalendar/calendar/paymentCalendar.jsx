import { Breadcrumb, Spin } from "antd";
import { useRouter } from "next/router";
import FormPaymentCalendar from "../../../../components/payroll/forms/FormPaymentCalendar";
import MainLayout from "../../../../layout/MainInter";
import { withAuthSync } from "../../../../libs/auth";
import { verifyMenuNewForTenant } from "../../../../utils/functions";

const PaymentCalendar = () => {
  const route = useRouter();
  return (
    <MainLayout currentKey={["paymentCalendar"]} defaultOpenKeys={["managementRH","payroll"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
        }
        <Breadcrumb.Item>Nómina</Breadcrumb.Item>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/payroll/paymentCalendar" })}
        >
          Calendarios de pago
        </Breadcrumb.Item>
        <Breadcrumb.Item>Calendario</Breadcrumb.Item>
      </Breadcrumb>
      <Spin tip="Cargando..." spinning={false}>
        <div
          className="container-border-radius"
          style={{ padding: 24, minHeight: 380, height: "100%" }}
        >
          <FormPaymentCalendar
            idPaymentCalendar={route.query?.calendar_id || null}
          />
        </div>
      </Spin>
    </MainLayout>
  );
};

export default withAuthSync(PaymentCalendar);
