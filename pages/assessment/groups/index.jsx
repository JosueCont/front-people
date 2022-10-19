import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import AssessmentsSearch from "../../../components/assessment/groups/AssessmentsSearch";
import AssessmentsTable from "../../../components/assessment/groups/AssessmentsTable";
import { getCategories } from "../../../redux/assessmentDuck";
import {FormattedMessage} from "react-intl";

const GroupsKuiz = ({ getCategories, assessmentStore, ...props }) => {
  const router = useRouter();
  const currenNode = useSelector((state) => state.userStore.current_node);
  const [listGroups, setLisGroups] = useState({});
  const [surveyList, setSurveyList] = useState([]);
  const [loadSurvey, setLoadSurvey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numPage, setNumPage] = useState(1);

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

  const getListGroups = async (nodeId, name, queryParam) => {
    const data = {
      nodeId: nodeId,
      name: name,
      queryParam: queryParam,
    };
    setLoading(true);
    try {
      let response = await WebApiAssessment.getGroupsAssessments(data);
      setLisGroups(response.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const createGroup = async (values) => {
    const data = { ...values, node: currenNode?.id };
    try {
      await WebApiAssessment.createGroupAssessments(data);
      getListGroups(currenNode?.id, "", "");
      message.success("Grupo agregado");
    } catch (e) {
      setLoading(false);
      message.error("Grupo no agregado");
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

  const searchGroup = async (name) => {
    setLoading(true);
    getListGroups(currenNode?.id, name, "");
  };

  return (
    <MainLayout currentKey={["assessment_groups"]} defaultOpenKeys={["kuiz"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/persons/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Psicometría</Breadcrumb.Item>
        <Breadcrumb.Item>Grupos de evaluaciones</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <AssessmentsSearch
          setLoading={setLoading}
          createGroup={createGroup}
          searchGroup={searchGroup}
          setNumPage={setNumPage}
        />
        <AssessmentsTable
          dataGroups={listGroups}
          loading={loading}
          setLoading={setLoading}
          getListGroups={getListGroups}
          updateGroup={updateGroup}
          deteleGroup={deleteGroup}
          setNumPage={setNumPage}
          numPage={numPage}
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

export default connect(mapState, { getCategories })(withAuthSync(GroupsKuiz));
