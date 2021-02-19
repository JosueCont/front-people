import {
  Input,
  Layout,
  Table,
  Breadcrumb,
  Button,
  Row,
  Col,
  Modal,
  message,
  Upload,
} from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import MainLayout from "../../layout/MainLayout";
const { Content } = Layout;
const { confirm } = Modal;
import Axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { withAuthSync } from "../../libs/auth";
import { API_URL } from "../../config/config";
import moment from "moment";

const { Dragger } = Upload;

const UploadPayroll = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  const getVouchers = async () => {
    setLoading(true);

    Axios.get(API_URL + `/payroll/payroll-voucher/`)
      .then((response) => {
        console.log("Reponse-->>> ", response.data);
        response.data.results.forEach((element, i) => {
          element.key = i;
          element.timestamp = moment(element.timestamp).format("DD-MM-YYYY");
        });
        let data = response.data.results;
        setLoading(false);
        setVouchers(data);
      })
      .catch((response) => {
        setLoading(false);
        setVouchers([]);
        message.error("Error al obtener, intente de nuevo");
      });
  };

  useEffect(() => {
    getVouchers();
  }, [router]);

  const columns = [
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
    },
    {
      title: "Fecha de creación",
      render: (item) => {
        return <div>{item.timestamp}</div>;
      },
    },
    {
      title: "Total percepciones",
      dataIndex: "total_perceptions",
      key: "total_perceptions",
    },
    {
      title: "Total deducciones",
      dataIndex: "total_deductions",
      key: "total_deductions",
    },
    {
      title: "Número de días pagados",
      dataIndex: "number_of_days_paid",
      key: "number_of_days_paid",
    },
    {
      title: "Acciones",
      key: "id",
      render: (text, record) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <a
                  onClick={() =>
                    router.push({
                      pathname: "/payrollvoucher/detail",
                      query: { type: "detail", id: record.id },
                    })
                  }
                >
                  <EyeOutlined />
                </a>
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <MainLayout currentKey="9">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item href="/home/">Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Recibos de nómina</Breadcrumb.Item>
      </Breadcrumb>

      <Content className="site-layout">
        <div style={{ padding: "1%", float: "right" }}>
          <Button
            style={{
              background: "#fa8c16",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={() => router.push("payrollvoucher/add")}
          >
            <PlusOutlined />
            Agregar
          </Button>
        </div>
        <div style={{ padding: 24, minHeight: 380, height: "100%" }}>
          <Table
            size="small"
            columns={columns}
            dataSource={vouchers}
            loading={loading}
          />
        </div>
      </Content>
    </MainLayout>
  );
};
export default withAuthSync(UploadPayroll);
