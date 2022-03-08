import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import FormSearch from "../../../components/assessment/groups/FormSearch";
import TableGroups from "../../../components/assessment/groups/TableGroups";
import { useFilter } from "../../../components/assessment/useFilter";

const GroupsKuiz = () =>{
    const router = useRouter();
    const [
        filterValues,
        filterActive,
        filterString,
        onFilterChange,
        onFilterActive,
        onFilterReset,
    ] = useFilter();
    const currenNode = useSelector(state => state.userStore.current_node)
    const [listGroups, setLisGroups] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(currenNode?.id){
            getListGroups(currenNode.id, "", "")
        }
    },[currenNode])

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
            // console.log('response grupos kuiz', response)
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
          let response = await WebApiAssessment.updateGroupAssessments(data, id);
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
                <FormSearch
                    setLoading={setLoading}
                    createGroup={createGroup}
                    hiddenName={false}
                    hiddenSurveys={false}
                    searchGroup={searchGroup}
                />
                <TableGroups
                    dataGroups={listGroups}
                    loading={loading}
                    setLoading={setLoading}
                    getListGroups={getListGroups}
                    updateGroup={updateGroup}
                    deteleGroup={deleteGroup}
                    hiddenName={false}
                    hiddenSurveys={false}
                />
            </div>
        </MainLayout>
    )
}

export default withAuthSync(GroupsKuiz)