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
  Modal, Form
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
import Router from "next/router";

const { Content } = Layout;

const businessForm = () => {
  const [business, setBusiness] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = values => {
    console.log('Received values of form: ', values);
    addBusiness(values.name, values.description)
  };
  const addBusiness = async (name, description) => {
      const data = {
          'name': name,
          'description':description
      }
      Axios.post(API_URL + '/business/node/',data, )
          .then(function (response) {
              console.log(response.data);
              if(response.status === 200){
                  Router.push("/business/business");
              }
              getBusiness();
              setIsModalVisible(false);
              setLoading(false);
          })
          .catch(function (error) {
              setLoading(false);
              console.log(error);
          });
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
                  onClick={showModal}
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
            <Modal
                title="Agregar empresa"
                visible={isModalVisible}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Regresar
                    </Button>,
                  <Button form="addBusinessForm" type="primary" key="submit" htmlType="submit">
                    Agregar
                  </Button>
                ]}
            >
              <Form
                  id="addBusinessForm"
                  name="normal_login"
                  onFinish={onFinish}
              >
                <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[{ required: true, message: 'Ingresa un nombre' }]}
                >
                  <Input  placeholder="Nombre de la empresa" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Descripción"
                    rules={[{ required: true, message: 'Ingresa una descripción' }]}
                >
                  <Input  placeholder="Descripción de la empresa" />
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </>
  );
};
export default businessForm;
