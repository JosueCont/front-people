import { useEffect } from "react";
import { useRouter } from "next/router";
import FormPerson from "../../../components/person/FormPerson";
import FormPersonDetail from "../../../components/person/FormPersonDetail";
import MainLayout from "../../../layout/MainLayout";
import { Breadcrumb, Spin } from "antd";
import { useState } from "react";

const userRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visibleForm, setVisibleForm] = useState(true);
  useEffect(() => {
    console.log("Router-->> ", router.query.uid);
  }, [router.query.uid]);
  return (
    <>
      <Spin spinning={loading}>
        {visibleForm ? (
          <MainLayout
            logoNode={
              "https://khorplus.s3.amazonaws.com/demo/people/person/images/photo-profile/12220210623/staff_1-1.png"
            }
            companyName={"Demos"}
            hideMenu={true}
            hideProfile={false}
          >
            <Breadcrumb className={"mainBreadcrumb"}>
              <Breadcrumb.Item>Registro</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%", padding: 20 }}>
              <FormPerson
                visible={visibleForm}
                hideProfileSecurity={false}
                intranetAccess={false}
                close={(value) => setVisibleForm(value)}
              />
            </div>
          </MainLayout>
        ) : (
          <FormPersonDetail />
        )}
      </Spin>
    </>
  );
};

export default userRegister;
