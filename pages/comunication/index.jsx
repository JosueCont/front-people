import Head from "next/head";
import React, { useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Typography,
  notification,
  Card,
  Layout,
  Menu,
  Breadcrumb,
} from "antd";
import BusinessForm from "../../components/business/BusinessForm";
import MainLayout from "../../layout/MainLayout";
import { withAuthSync } from "../../libs/auth";

const List = (props) => {
  const router = props;
  const { Title } = Typography;

  return (
    <MainLayout>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Empresa</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">
        <Title>Hola mundo</Title>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(List);
