import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { connect, useDispatch } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import { getCompetences, getProfiles } from "../../../redux/assessmentDuck";
import ProfilesSearch from "../../../components/assessment/profiles/ProfilesSearch";
import ProfilesTable from "../../../components/assessment/profiles/ProfilesTable";
import {FormattedMessage} from "react-intl";

const Index = ({
  currentNode,
  getCompetences,
  getProfiles,
  ...props
}) => {

  const router = useRouter();

  useEffect(()=>{
    if(currentNode){
      getProfiles(currentNode.id,'')
      getCompetences(currentNode.id)
    }
  },[currentNode])
  
  return (
    <MainLayout currentKey={["assessment_profiles"]}defaultOpenKeys={["evaluationDiagnosis","kuiz"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Psicometría</Breadcrumb.Item>
        <Breadcrumb.Item>Perfiles de competencias</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <ProfilesSearch/>
        <ProfilesTable/>
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
    getProfiles
  }
)(withAuthSync(Index));
