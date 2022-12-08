import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import PersonsGroupSearch from "../../../components/person/groups/PersonsGroupSearch";
import PersonsTable from "../../../components/person/groups/PersonsTable";

const GroupsPeople = () => {
  const router = useRouter();
  const currenNode = useSelector((state) => state.userStore.current_node);
  const [listGroups, setLisGroups] = useState([]);
  const [personList, setPersonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numPage, setNumPage] = useState(1);

  useEffect(() => {
    if (currenNode?.id) {
      getListGroups(currenNode.id, "", "");
      getPersons(currenNode.id);
    }
  }, [currenNode]);

  const getPersons = async (nodeId) => {
    try {
      let response = await WebApiAssessment.getListPersons({ node: nodeId });
      setPersonList(response.data);
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
      let response = await WebApiAssessment.getGroupsPersons(data);
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
      await WebApiAssessment.createGroupPersons(data);
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
      await WebApiAssessment.updateGroupPersons(data, id);
      getListGroups(currenNode?.id, "", "");
      message.success("Información actualizada");
    } catch (e) {
      setLoading(false);
      message.error("Información no actualizada");
    }
  };

  const deleteGroup = async (ids) => {
    try {
      await WebApiAssessment.deleteGroupPersons({ groups_id: ids });
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

  const onFinishAssign = async (values, ids) => {
    const body = { ...values, groups_person: ids, node: currenNode?.id };
    try {
      await WebApiAssessment.assignAssessmentsGroup(body);
      getListGroups(currenNode?.id, "", "");
      message.success("Evaluaciones asignadas");
    } catch (e) {
      setLoading(false);
      message.error("Evaluaciones no asignadas");
    }
  };

  return (
    <MainLayout currentKey={['groups_people']} defaultOpenKeys={["strategyPlaning","people"]}>
      <Breadcrumb>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/home/groups/" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
        <Breadcrumb.Item>Colaboradores</Breadcrumb.Item>
        <Breadcrumb.Item>Grupos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <PersonsGroupSearch
          setLoading={setLoading}
          createGroup={createGroup}
          searchGroup={searchGroup}
          personList={personList}
          setNumPage={setNumPage}
        />
        <PersonsTable
          dataGroups={listGroups}
          loading={loading}
          setLoading={setLoading}
          getListGroups={getListGroups}
          updateGroup={updateGroup}
          deteleGroup={deleteGroup}
          personList={personList}
          onFinishAssign={onFinishAssign}
          setNumPage={setNumPage}
          numPage={numPage}
        />
      </div>
    </MainLayout>
  );
};

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
    config: state.userStore.general_config,
  };
};

export default connect(mapState)(withAuthSync(GroupsPeople));
