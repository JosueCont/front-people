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
  Form,
} from "antd";
import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  DownloadOutlined 
} from "@ant-design/icons";
import HeaderCustom from "../../components/Header";
import _ from "lodash";
import FormPerson from "../../components/person/FormPerson";

const { Content } = Layout;
import Link from "next/link";

const homeScreen = () => {
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(true);
  const [modal, setModal] = useState(false);
  const [formFilter] = Form.useForm();  
  let filters = {};

  const getPerson = (text) => {
    setLoading(true);
    if (text == undefined) {
      Axios.get("http://demo.localhost:8000/person/person/")
        .then((response) => {
          // console.log("RESPONSE-->> ", response);
          response.data.results.map((item) => {
            item["key"] = item.id;
            item["fullname"] =
              item.first_name + " " + item.flast_name + " " + item.mlast_name;
            item.timestamp = item.timestamp.substring(0, 10);
          });
          setPerson(response.data.results);
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      Axios.post("http://demo.localhost:8000/person/person/get_list_persons/",filters)
        .then((response) => {
          console.log("RESPONSE-->> ", response);
          response.data.map((item) => {
            item["key"] = item.id;
            item["fullname"] =
              item.first_name + " " + item.flast_name + " " + item.mlast_name;
            item.timestamp = item.timestamp.substring(0, 10);
          });
          setPerson(response.data);
          setLoading(false);
        })
        .catch((e) => {
          setPerson([]);
          setLoading(false);
          console.log(e);
        });
    }
  };

  const statusPeron = () => {
    console.log(status);
    setStatus(status ? false : true);
  };

  const filter = (value) => {
    console.log("LOS FILTROS", value)
   
    if(value.name !== undefined && value.name !== "")
    {     
        filters.first_name = value.name;      
    }
    if(value.gender !== undefined)
    {
      filters.gender = value.gender;
    }
    if(status !== undefined)
    {      
        filters.is_active = (status == false ? 0 : 1);      
    }   
    console.log(filters);
    getPerson("filter");
  }

  useEffect(() => {
    getPerson();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Fecha de registro",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "RFC",
      dataIndex: "rfc",
      key: "rfc",
    },
    {
      title: "IMSS",
      dataIndex: "imss",
      key: "imss",
    },
    {
      title: "Opciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <Link href={`/home/${item.id}`}>
                  <EditOutlined />
                </Link>
              </Col>
              <Col className="gutter-row" span={6}>
                <DeleteOutlined />
              </Col>
              <Col className="gutter-row" span={6}>
                <InfoCircleOutlined />
              </Col>
            </Row>
          </div>
        );
      },
    },
  ]; 

  const genders = [
    {
      label: "Maculino",
      value: 1,
    },
    {
      label: "Femenino",
      value: 2,
    },
    {
      label: "Otro",
      value: 3,
    },
  ];

  const getModal = (value) => {
    console.log("Open Modal-->> ", modal);
    setModal(value);
  };

  const downloadPersons = () => {
    setLoading(true);
    Axios.get("http://demo.localhost:8000/person/import-export-person/csv")
        .then((response) => {
          console.log("RESPONSE-->> ", response);
          const type = response.headers['content-type']
          const blob = new Blob([response.data], {type: type, encoding: 'UTF-8'})
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Personas.csv'
          link.click()
          setLoading(false);
        })
        .catch((e) => {         
          setLoading(false);
          console.log(e);
        });
  };


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
            <Breadcrumb.Item>Person</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: "1%", float: "right" }}>
            <Button
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
              onClick={() => getModal(true)}
            >
              <PlusOutlined />
              Agregar persona
            </Button>
          </div>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <div style={{ padding: 24 }}>
              <Form onFinish={filter} layout={"vertical"} form={formFilter}>
                <Row>
                  <Col span={18}>                 
                    <Form.Item
                      name="name"                                                    
                    >
                      <Input placeholder="Nombre..." />
                    </Form.Item>
                  </Col>
                  <Col span={5}>                 
                    <Form.Item
                      name="gender"                                                      
                    >
                        <Select
                        style={{ marginLeft: "10%", width: "100%" }}                      
                        options={genders}
                        placeholder="Género"
                      />
                    </Form.Item>
                  </Col>                              
                </Row>
                <Row style={{ marginTop: "2%" }}>
                  <Col span={4}>
                  <Form.Item
                      name="is_active"                                                      
                    >
                    <label>
                      <span style={{ fontWeight: "bold" }}>Activos:</span>
                    </label>
                    <Switch                  
                      style={{ marginLeft: "10%" }}
                      defaultChecked
                      onChange={statusPeron}
                    />
                    </Form.Item>
                  </Col>
                  <Col span={8}
                  style={{ float: "right"}}> 
                  
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Buscar
                              </Button>                     
                            </Form.Item>  
                      </Col> 
                </Row>
              </Form>             
              <div 
                style={{
                  float:'right'
                  }}>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  size={{size:'large'}}
                  onClick={() => downloadPersons()}>
                  Descargar resultados
                </Button>
              </div>
              </div>
            <Table
              size="small"
              columns={columns}
              dataSource={person}
              loading={loading}
            />
          </div>
        </Content>
        <FormPerson close={getModal} visible={modal} />
      </Layout>
    </>
  );
};
export default homeScreen;
