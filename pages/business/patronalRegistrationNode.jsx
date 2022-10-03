import { Breadcrumb, Spin } from "antd";
import PatronalRegistration from "../../components/payroll/PatronalRegistration";
import MainLayout from "../../layout/MainLayout";
import { withAuthSync } from "../../libs/auth";
import { useRouter } from "next/router";

const PatronalRegistartionNode = () => {
  const router = useRouter();
  return (
    <MainLayout currentKey={["patronal"]} defaultOpenKeys={["company"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
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
