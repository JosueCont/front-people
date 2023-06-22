import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainInter";
import {
  Breadcrumb,
  Row,
  Col,
  Typography,
  Button,
  Divider,
  Card,
  Dropdown,
  Menu,
  Drawer,
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  TeamOutlined,
  HomeOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { css, Global } from "@emotion/core";
import DragAndDrop from "../components/DragAndDrop";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

import ChartBars from "../components/dashboards-cards/ChartBars";
import Info from "../components/dashboards-cards/Info";
import ChartDoughnut from "../components/dashboards-cards/ChartDoughnut";
import WeekCard from "../components/dashboards-cards/WeekCard";
import { withAuthSync } from "../libs/auth";

const index = () => {
  const { Title, Text } = Typography;
  const [contents, setContents] = useState([]);
  const [originalPositions, setOriginalPositions] = useState([]);

  const list = [
    {
      id: 1,
      title: "Titulo 1",
      position: 0,
    },
    {
      id: 2,
      title: "Titulo 2",
      position: 1,
    },
    {
      id: 3,
      title: "Titulo 3",
      position: 2,
    },
    {
      id: 4,
      title: "Titulo 4",
      position: 3,
    },
    {
      id: 5,
      title: "Titulo 5",
      position: 4,
    },
    {
      id: 6,
      title: "Titulo 6",
      position: 5,
    },
    {
      id: 7,
      title: "Titulo 6",
      position: 5,
    },
    {
      id: 8,
      title: "Titulo 6",
      position: 5,
    },
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: null,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const labels = ["JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [10, 20, 10, 20, 10, 20, 10],
        backgroundColor: "#7f4df1",
        maxBarThickness: 8,
        borderRadius: 10,
      },
    ],
  };

  const reorder = (from, to) => {
    let array = [...originalPositions];
    array.splice(to, 0, array.splice(from, 1)[0]);
    let newOrder = array.map((item, idx) => {
      item["position"] = idx;
      return item;
    });
    setContents(newOrder);
  };

  const dragEnd = () => {
    setOriginalPositions([...contents]);
  };

  const MenuDropDown = (position) => (
    <Menu>
      <Menu.Item onClick={() => deleteItemCard(position)}>
        <DeleteOutlined />
        Eliminar
      </Menu.Item>
    </Menu>
  );

  const CardTools = ({ position }) => (
    <Dropdown overlay={MenuDropDown(position)} placement="bottomRight" arrow>
      <MoreOutlined style={{ cursor: "pointer" }} />
    </Dropdown>
  );

  useEffect(() => {
    setContents(list);
    setOriginalPositions(list);
  }, []);

  return (
    <>
      <Global
        styles={css`
                .div-main-layout{
                    padding-left: 30px !important;
                    padding-right: 0px !important;
                    padding-top: 0px !important;
                }
                .button_add_card{
                    display:flex;
                }
                .button_add_card .anticon{
                    font-size: 25px;
                }
                .title_card_dashboard{
                    height: 40px;
                    margin-bottom:5px;
                }
                /* .title_card_dashboard_info{
                    margin-bottom:5px;
                } */

                .title_card_dashboard > .ant-typography{
                        display: flex;
                }

                .card_element_icon{
                    padding:0px;
                    border-radius: 5px;
                    background: #9d9d9d;
                    display: inline-block;
                    margin-right: 15px;
                }
                .card_element_icon .anticon{
                    font-size: 20px;
                    margin: 7px;
                }

                .title_card_dashboard > .ant-typography .card_element_text{
                    margin-top: auto;
                    margin-bottom: auto;
                }

                .btn_hide{
                    margin-left:auto;
                    margin-bottom: auto;
                    margin-top:10px; 
                    border-radius:3px;
                    border:none;
                    background-color:gray !important;
                }
                .btn_ok{
                    position: absolute;
                    bottom: 10px;
                    right: 15px;
                    border-radius:3px;
                    border:none;
                    background-color:gray !important;
                }
            `}
      />
      <MainLayout currentKey={["dashboard"]}>
        <Row justify={"space-between"}>
          <Col span={24} style={{ paddingRight: "30px !important" }}>
            <Row
              justify={"space-between"}
              gutter={[10, 20]}
              style={{ marginTop: 20 }}
            >
              <Col>
                <Title level={3}>Irvin, te damos la bienvenida a nómina</Title>
              </Col>
              <Col>
                <Button
                  type={"primary"}
                  size="large"
                  className="button_add_card"
                  style={{ display: "flex" }}
                >
                  <PlusCircleOutlined />
                  Agregar indicador
                </Button>
              </Col>
              {/* <Col span={24}>
                            <img src="https://menaiortho.com.au/wp-content/uploads/2015/03/banner-placeholder.jpg" style={{width:'100%'}} />
                        </Col> */}
            </Row>
            <DragAndDrop columns={3} reorder={reorder} dragEnd={dragEnd}>
              {contents.map((item, idx) => (
                <div position={item.position} key={idx}>
                  {item.id === 1 || item.id === 6 ? (
                    <ChartBars
                      title={"Total de colaboradores"}
                      icon={<TeamOutlined />}
                      data={data}
                    />
                  ) : item.id === 2 ||
                    item.id === 4 ||
                    item.id === 5 ||
                    item.id === 7 ? (
                    <Info
                      title={"Total de empresas"}
                      count={5}
                      onOk={() => {}}
                      okText={"Ver empresas"}
                      icon={<HomeOutlined />}
                    />
                  ) : item.id === 3 || item.id === 8 ? (
                    <ChartDoughnut
                      title={"Total de colaboradores"}
                      icon={<TeamOutlined />}
                    />
                  ) : (
                    <img
                      src="https://menaiortho.com.au/wp-content/uploads/2015/03/banner-placeholder.jpg"
                      style={{ width: "100%" }}
                    />
                  )}
                </div>
              ))}
            </DragAndDrop>
          </Col>
        </Row>
      </MainLayout>
    </>
  );
};

export default withAuthSync(index);
