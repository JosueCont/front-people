import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import AssessmentsSearch from "../../../components/assessment/groups/AssessmentsSearch";
import AssessmentsTable from "../../../components/assessment/groups/AssessmentsTable";

const GroupsKuiz = () =>{
    const router = useRouter();
    const currenNode = useSelector(state => state.userStore.current_node)
    const [listGroups, setLisGroups] = useState({});
    const [surveyList, setSurveyList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(currenNode?.id){
            getListGroups(currenNode.id, "", "")
            getSurveys(currenNode.id);
        }
    },[currenNode])

    const getSurveys = async (nodeId) => {
        try {
          let response = await WebApiAssessment.getListSurveys(nodeId);
          setSurveyList(response.data);
        } catch (error) {
          console.log(error);
        }
    }

    const successMessages = (ids) =>{
        if(ids.length > 1){
          return message.success("Grupos eliminados")
        }else{
          return message.success("Grupo eliminado")
        }
      }
    
    const errorMessages = (ids) =>{
        if(ids.length > 1){
            return message.error("Grupos no eliminados")
        }else{
            return message.error("Grupo no eliminado")
        }
    }

    const getListGroups = async (nodeId, name, queryParam)=>{
        const data = {
            nodeId: nodeId,
            name: name,
            queryParam: queryParam
        }
        setLoading(true)
        try {
            let response = await WebApiAssessment.getGroupsAssessments(data);
            setLisGroups(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const createGroup = async (values) =>{
        const data = {...values, node: currenNode?.id}
        try {
            await WebApiAssessment.createGroupAssessments(data)
            getListGroups(currenNode?.id,"","")
            message.success("Grupo agregado")
        } catch (e) {
            setLoading(false)
            message.error("Grupo no agregado")
        }
    }

    const updateGroup = async (values, id) =>{
        const data = {...values, node: currenNode?.id}
        try {
          await WebApiAssessment.updateGroupAssessments(data, id);
          getListGroups(currenNode?.id, "","")
          message.success("Información actualizada")
        } catch (e) {
          setLoading(false)
          message.error("Información no actualizada")
          console.log(e)
        }
    }

    const deleteGroup = async (ids) =>{
        try {
          await WebApiAssessment.deleteGroupAssessments({groups_id: ids})
          getListGroups(currenNode?.id,"", "")
          successMessages(ids);
        } catch (e) {
          setLoading(false)
          errorMessages(ids)
          console.log(e)
        }
    }

    const searchGroup = async (name) =>{
        setLoading(true)
        getListGroups(currenNode?.id, name, "")
    }

    return(
        <MainLayout currentKey="groups_kuiz">
            <Breadcrumb>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => router.push({ pathname: "/assessments/groups" })}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Grupos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                <AssessmentsSearch
                    setLoading={setLoading}
                    createGroup={createGroup}
                    searchGroup={searchGroup}
                    surveyList={surveyList}
                />
                <AssessmentsTable
                    dataGroups={listGroups}
                    loading={loading}
                    setLoading={setLoading}
                    getListGroups={getListGroups}
                    updateGroup={updateGroup}
                    deteleGroup={deleteGroup}
                    surveyList={surveyList}
                />
            </div>
        </MainLayout>
    )
}

export default withAuthSync(GroupsKuiz)