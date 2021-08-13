import React, { useEffect, useState } from "react";
import DetailPerson from "../../components/person/DetailPerson";
import { withAuthSync } from "../../libs/auth";
import { useRouter } from "next/router";
import { Breadcrumb, Spin } from "antd";
import WebApi from "../../api/webApi";
import MainLayout from "../../layout/MainLayout";
import { Content } from "antd/lib/layout/layout";

const EmployeeDetailPage = () => {
  const router = useRouter();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.id) getPerson(router.query.id);
  }, [router.query]);

  const getPerson = async (data) => {
    try {
      let response = await WebApi.getPerson(data);
      setPerson(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <MainLayout currentKey="1">
        <Content className="site-layout">
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item href="/home/">Inicio</Breadcrumb.Item>
            <Breadcrumb.Item href="/home/">Personas</Breadcrumb.Item>
            <Breadcrumb.Item>Expediente de empleado</Breadcrumb.Item>
          </Breadcrumb>
          {person ? (
            <DetailPerson person={person} setLoading={setLoading} />
          ) : (
            <div className="center-content" style={{ padding: "20%" }}>
              <Spin spinning={true} />
            </div>
          )}
        </Content>
      </MainLayout>
    </>
  );
};

export default withAuthSync(EmployeeDetailPage);
