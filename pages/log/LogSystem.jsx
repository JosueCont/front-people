import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainInter";
import {Row, Col, Table, Breadcrumb,Select, Space, message, Modal,Button, ConfigProvider, Typography, Pagination, Form, Input} from "antd";
import { useRouter } from "next/router";
import moment from 'moment'
import WebApi from '/api/webApi'
import {
  TYPE_LOGS
} from "../../utils/constant";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { withAuthSync } from "../../libs/auth";
import { verifyMenuNewForTenant } from "../../utils/functions";
import esES from "antd/lib/locale/es_ES";
const { Text, Link } = Typography;



const LogSystem = ({ ...props }) => {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [lenData, setLenData] = useState(0);
  const [dataTypesLog, setDataTypesLog] = useState([]);
  const [form] = Form.useForm();
  const [nextURL,setNextURL] = useState(null)
  const [prevURL,setPrevURL] = useState(null)


  const onFinish = (values) => {

    if(!values?.type){
      values.type=null;
    }

    getLog(values.type,1,values?.search)

  };


  useEffect(() => {
    setLoading(true);
    let _dataTypes = []
    for (const property in TYPE_LOGS) {
      _dataTypes.push({
        label:TYPE_LOGS[property],
        value: property
      })
    }
    setDataTypesLog(_dataTypes)
    getLog()
  }, []);

  const pagination = async (page, pageSize) => {
    setPage(page);
    getLog(null, page);
    setCurrentPage(page);
  };

  const goNextPrevPage=(isNext=false)=>{
    if(isNext){
      getLog(null,null,'',nextURL)
    }else{
      getLog(null,null,'',prevURL)
    }

  }

  const getLog=async(type, page, search,url)=>{
    setLoading(true)
    try{
      const res = await WebApi.getSystemLog(type,null,search,url);
      setLenData(res.data.count);
      setLog(res.data.results)
      setNextURL(null)
      setPrevURL(null)
      if(res?.data?.next){
        setNextURL(res?.data?.next)
      }

      if(res?.data?.previous){
        setPrevURL(res?.data?.previous)
      }
    }catch (e){
      setNextURL(null)
      setPrevURL(null)
      console.log(e)
      setLog([])

    }finally {
      setLoading(false)
    }
  }

  /* Columns */
  const columns = [
    {
      title: "Fecha",
      key: "timestamp",
      render: (row) => {
        return (
            <div>
              { row.timestamp && moment(row.timestamp).format('DD/MM/YYYY, h:mm:ss a') }
            </div>
        );
      },
    },
    {
      title: "Módulo",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Generado por",
      key: "person_name",
      render: (row) => {
        return (
          <div>
            {row.person_name ? row.person_name : 'Sistema' }
          </div>
        );
      },
    },
    {
      title: "Tipo",
      key: "type",
      render: (row) => {
        return (
          <div>
            {TYPE_LOGS[row.type]}
          </div>
        );
      },
    },
    {
      title: "Detalle de solicitud",
      key: "detailrequest",
      render: (row) => {
        return (
            <Text code>{row?.data && JSON.stringify(row.data)}</Text>
        );
      },
    },
    // {
    //   title: "Detalles",
    //   key: "actions",
    //   render: (row) => {
    //     return row.errors != "" ? (
    //       <EyeOutlined
    //         className="icon_actions"
    //         key={"goDetails_" + row.id}
    //         onClick={() => viewDetails(row.errors)}
    //       />
    //     ) : null;
    //   },
    // },
  ];

  return (
    <MainLayout currentKey={["systemLog"]} defaultOpenKeys={["utilities","uploads"]}>
      <Breadcrumb className={"mainBreadcrumb"}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Utilidades-Configuración</Breadcrumb.Item>
        }
        <Breadcrumb.Item>Log del sistema</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row>
          <Col span={24} style={{backgroundColor:'white',minHeight:150, marginBottom:20,borderRadius:10,padding:20}}>
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
              <Row gutter={16} >
                <Col md={6}>
                  <Form.Item
                      label="Tipo de log"
                      name="type"

                  >
                    <Select
                        style={{ width: '100%' }}
                        allowClear
                        placeholder={'Todos'}
                        options={dataTypesLog}
                    />
                  </Form.Item>
                </Col>
                {/*<Col md={6}>*/}
                {/*  <Form.Item*/}
                {/*      label="Buscar"*/}
                {/*      name="search"*/}
                {/*  >*/}
                {/*    <Input />*/}
                {/*  </Form.Item>*/}
                {/*</Col>*/}
              </Row>



              <Form.Item

              >
                <Button htmlType={'submit'}>Buscar</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Space wrap style={{marginBottom:10}}>
              <Button type="primary" disabled={!prevURL} onClick={()=> goNextPrevPage(false)}>
                <LeftOutlined />
              </Button>
              <Button disabled={!nextURL} onClick={()=> goNextPrevPage(true)}><RightOutlined /></Button>
            </Space>
          </Col>
          <Col span={24}>
            <ConfigProvider locale={esES}>
            <Table
              dataSource={log}
              key="tableDocumentLog"
              pagination={false}
              loading={loading}
              columns={columns}
              locale={{
                emptyText: loading
                  ? "Cargando..."
                  : "No se encontraron resultados.",
              }}
            ></Table>
            </ConfigProvider>
          </Col>
          {lenData > 0 && (
              <Col
                  span={24}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
              >
                {/*<Pagination*/}
                {/*    current={currentPage}*/}
                {/*    total={lenData}*/}
                {/*    onChange={pagination}*/}
                {/*    showSizeChanger={false}*/}
                {/*    defaultPageSize={10}*/}
                {/*/>*/}
              </Col>
          )}
        </Row>
      </div>
    </MainLayout>
  );
};

export default withAuthSync(LogSystem);
