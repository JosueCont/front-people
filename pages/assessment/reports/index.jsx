import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { connect, useDispatch } from "react-redux";
import { Breadcrumb, message, Tabs } from "antd";
import { withAuthSync } from "../../../libs/auth";
import { getCompetences } from "../../../redux/assessmentDuck";
import { getPersonsCompany } from "../../../redux/UserDuck";
import ReportsCompetences from "../../../components/assessment/reports/ReportsCompetences";
import ReportsProfiles from "../../../components/assessment/reports/ReportsProfiles";

const Index = ({
  currentNode,
  getCompetences,
  getPersonsCompany,
  ...props
}) => {

  const router = useRouter();
  const { TabPane } = Tabs;

  useEffect(()=>{
    if(currentNode){
        getPersonsCompany(currentNode.id)
        getCompetences()
    }
  },[currentNode])
  
  return (
    <MainLayout currentKey="reports_kuiz" defaultOpenKeys={["kuiss"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Reportes</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Competencias" key="1">
                <ReportsCompetences/>
            </TabPane>
            <TabPane tab="Perfil" key="2">
                <ReportsProfiles/>
            </TabPane>
        </Tabs>
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(
  mapState, {
    getCompetences,
    getPersonsCompany
  }
)(withAuthSync(Index));