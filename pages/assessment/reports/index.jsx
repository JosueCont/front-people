import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { connect, useDispatch } from "react-redux";
import { Breadcrumb, message, Tabs } from "antd";
import { withAuthSync } from "../../../libs/auth";
import { getCompetences, getProfiles } from "../../../redux/assessmentDuck";
import { getPersonsCompany } from "../../../redux/UserDuck";
import ReportsCompetences from "../../../components/assessment/reports/ReportsCompetences";
import {FormattedMessage} from "react-intl";

const Index = ({
  currentNode,
  getProfiles,
  getCompetences,
  getPersonsCompany,
  ...props
}) => {

  const router = useRouter();
  const [currentKey, setCurrentKey] = useState("p");
  const { TabPane } = Tabs;

  useEffect(()=>{
    if(currentNode){
        getPersonsCompany(currentNode.id)
        getProfiles(currentNode.id, '')
        // getCompetences()
    }
  },[currentNode])
  
  return (
    <MainLayout currentKey={["assessment_reports"]} defaultOpenKeys={["kuiz"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
          <Breadcrumb.Item>Psicometría</Breadcrumb.Item>
        <Breadcrumb.Item>Reportes de competencias</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Tabs activeKey={currentKey} onChange={(key) => setCurrentKey(key)} type="card">
            <TabPane tab="Persona" key="p">
              <ReportsCompetences currentKey={currentKey}/>
            </TabPane>
            <TabPane tab="Persona-Perfil" key="pp">
              <ReportsCompetences currentKey={currentKey}/>
            </TabPane>
            <TabPane tab="Personas-Perfil" key="psp">
              <ReportsCompetences currentKey={currentKey}/>
            </TabPane>
            <TabPane tab="Persona-Perfiles" key="pps">
              <ReportsCompetences currentKey={currentKey}/>
            </TabPane>
            <TabPane tab="Personas-Competencias" key="psc">
              <ReportsCompetences currentKey={currentKey}/>
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
    getPersonsCompany,
    getProfiles
  }
)(withAuthSync(Index));