import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainInter";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import AssessmentsSearch from "../../../components/assessment/groups/AssessmentsSearch";
import AssessmentsTable from "../../../components/assessment/groups/AssessmentsTable";
import { getCategories, setErrorFormAdd, setModalGroup } from "../../../redux/assessmentDuck";
import {FormattedMessage} from "react-intl";
import { verifyMenuNewForTenant } from "../../../utils/functions"

const GroupsKuiz = ({ getCategories, assessmentStore, setErrorFormAdd, setModalGroup, ...props }) => {
  const router = useRouter();
  const currenNode = useSelector((state) => state.userStore.current_node);
  const [listGroups, setLisGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([])
  const [surveyList, setSurveyList] = useState([]);
  const [loadSurvey, setLoadSurvey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numPage, setNumPage] = useState(1);
  const [errorName, setErrorName] = useState(false)

  useEffect(() => {
    getCategories();
  }, []);


  useEffect(() => {
    if (currenNode?.id) {
      getListGroups(currenNode.id, "", "");
      // getSurveys(currenNode.id, "");
    }
  }, [currenNode]);

  const getSurveys = async (nodeId, queryParam) => {
    try {
      let response = await WebApiAssessment.getListSurveys(nodeId, queryParam);
      setSurveyList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const successMessages = (ids) => {
    if (ids.length > 1) {
      return message.success("Grupos eliminados");
    } else {
      return message.success("Grupo eliminado");
    }
  };

  const errorMessages = (ids) => {
    if (ids.length > 1) {
      return message.error("Grupos no eliminados");
    } else {
      return message.error("Grupo no eliminado");
    }
  };

  const getListGroups = async (nodeId, name = "") => {
    const data = {
      nodeId: nodeId,
    };
    setLoading(true);
    try {
      let response = await WebApiAssessment.getGroupsAssessments(data);
      setLisGroups(response.data);
      setAllGroups(response.data)
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const createGroup = async (values) => {
    setErrorFormAdd(false)
    const data = { ...values, node: currenNode?.id };
    try {
      await WebApiAssessment.createGroupAssessments(data);
      getListGroups(currenNode?.id, "", "");
      message.success("Grupo agregado");
      setModalGroup(false)
    } catch (e) {
      setLoading(false);
      if(e.response?.data?.message === "Este nombre de grupo ya existe"){
        setErrorFormAdd(e.response.data.message);
      }else{
        message.error("Grupo no agregado");
        setModalGroup(false)

      }
      
    }
  };

  const updateGroup = async (values, id) => {
    const data = { ...values, node: currenNode?.id };
    try {
      await WebApiAssessment.updateGroupAssessments(data, id);
      getListGroups(currenNode?.id, "", "");
      message.success("Información actualizada");
    } catch (e) {
      setLoading(false);
      message.error("Información no actualizada");
      console.log(e);
    }
  };

  const deleteGroup = async (ids) => {
    try {
      await WebApiAssessment.deleteGroupAssessments({ groups_id: ids });
      getListGroups(currenNode?.id, "", "");
      successMessages(ids);
    } catch (e) {
      setLoading(false);
      errorMessages(ids);
      console.log(e);
    }
  };

  const searchGroup = (name) => {
    /* console.log('name', name)
    let filtered = allGroups.filter(function (str) { return str.includes(name); }); */

    let list = allGroups.filter(item => item.name.toLowerCase() .includes(name.toLowerCase()))
    setLisGroups(list)

  };

  return (
    <MainLayout currentKey={["assessment_groups"]} defaultOpenKeys={["evaluationDiagnosis","kuiz"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        {verifyMenuNewForTenant() && 
          <Breadcrumb.Item>Evaluación y diagnóstico</Breadcrumb.Item>
        }
        <Breadcrumb.Item>Psicometría</Breadcrumb.Item>
        <Breadcrumb.Item>Grupos de evaluaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <AssessmentsSearch
          setLoading={setLoading}
          createGroup={createGroup}
          searchGroup={searchGroup}
          setNumPage={setNumPage}
          getListGroups={getListGroups}
        />
        <AssessmentsTable
          dataGroups={listGroups}
          loading={loading}
          setLoading={setLoading}
          getListGroups={getListGroups}
          updateGroup={updateGroup}
          deteleGroup={deleteGroup}
        />
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    assessmentStore: state.assessmentStore,
  };
};

export default connect(mapState, { getCategories, setErrorFormAdd, setModalGroup })(withAuthSync(GroupsKuiz));
