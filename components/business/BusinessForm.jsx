import {
  Layout,
  Breadcrumb,
  Table,
  Row,
  Col,
  Input,
  Select,
  Switch,
  Button,
} from "antd";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import HeaderCustom from "../../components/Header";
import { API_URL } from '../../config/config'

const { Content } = Layout;

const businessForm = () => {
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBusiness = () => {
    setLoading(true);
    Axios.get(API_URL + "/business/node/")
        .then((response) => {
          console.log("RESPONSE-->> ", response);
          let business = [];
          response.data.results.forEach(function(item){

            business.push({'key': item.id, 'name': item.name, 'code': item.code, 'status': (item.active) ? 'Activo': 'Desactivado'})
          });
          console.log("SET BUSINESS-->> ", business);
          setBusiness(business);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });

  };

  useEffect(() => {
    getBusiness();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Estatus",
      dataIndex: "status",
      key: "status",
    }
  ];

  return (
      <>
        <Layout>
          <HeaderCustom />
          <Content
              className="site-layout"
              style={{ padding: "0 50px", marginTop: 64 }}
          >
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Empresa</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: "1%", float: "right" }}>
              <Button
                  style={{
                    background: "#fa8c16",
                    fontWeight: "bold",
                    color: "white",
                  }}
              >
                <PlusOutlined />
                Agregar empresa
              </Button>
            </div>
            <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 380, height: "100%" }}
            >
              <Table
                  size="small"
                  columns={columns}
                  dataSource={business}
                  loading={loading}
              />
            </div>
          </Content>
        </Layout>
      </>
  );
};
export default businessForm;
