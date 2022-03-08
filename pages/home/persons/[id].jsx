import React, { useEffect, useState } from "react";
import DetailPerson from "../../../components/person/DetailPerson";
import { withAuthSync } from "../../../libs/auth";
import { useRouter } from "next/router";
import { Breadcrumb, Spin } from "antd";
import WebApiPeople from "../../../api/WebApiPeople";
import MainLayout from "../../../layout/MainLayout";
import { Content } from "antd/lib/layout/layout";
import { connect } from "react-redux";
import { Global, css } from "@emotion/core";

const EmployeeDetailPage = (...props) => {
  const router = useRouter();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.id) getPerson(router.query.id);
  }, [router.query]);

  const getPerson = async (data) => {
    try {
      let response = await WebApiPeople.getPerson(data);
      setPerson(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Global
        styles={css`
          .inputs_form_responsive .ant-col {
            display: flex;
          }

          .inputs_form_responsive .ant-col .ant-form-item {
            margin-top: auto;
            width: 100%;
          }
        `}
      />
      <MainLayout currentKey="1">
        <Content className="site-layout">
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item href="/home/persons/">Inicio</Breadcrumb.Item>
            <Breadcrumb.Item href="/home/persons/">Personas</Breadcrumb.Item>
            <Breadcrumb.Item>Expediente de empleado</Breadcrumb.Item>
          </Breadcrumb>
          {person ? (
            <DetailPerson
              config={props[0].config}
              person={person}
              setLoading={setLoading}
            />
          ) : (
            <div className="center-content" style={{ padding: "20%" }}>
              <Spin tip="Cargando..." spinning={true} />
            </div>
          )}
        </Content>
      </MainLayout>
    </>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
  };
};

export default connect(mapState)(withAuthSync(EmployeeDetailPage));
