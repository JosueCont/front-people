import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import FormSearch from "../../../components/assessment/groups/FormSearch"
import TableGroups from "../../../components/assessment/groups/TableGroups";
import { useFilter } from "../../../components/assessment/useFilter";

const GroupsPeople = () =>{
    const router = useRouter();
    const [
        filterValues,
        filterActive,
        filterString,
        onFilterChange,
        onFilterActive,
        onFilterReset,
    ] = useFilter();
    const [listGroups, setLisGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getListGroups("")
    },[])

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

    const getListGroups = async (queryParam)=>{
        setLoading(true)
        try {
            let response = await WebApiAssessment.getGroupsPersons(queryParam);
            // console.log('response grupos personas', response)
            setLisGroups(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const createGroup = async (values) =>{
        try {
            await WebApiAssessment.createGroupPersons(values)
            getListGroups("")
            message.success("Grupo agregado")
        } catch (e) {
            setLoading(false)
            message.error("Grupo no agregado")
        }
    }

    const updateGroup = async (values, id) =>{
        try {
            await WebApiAssessment.updateGroupPersons(values, id);
            getListGroups("")
            message.success("Información actualizada")
        } catch (e) {
            setLoading(false)
            message.error("Información no actualizada")
            console.log(e)
        }
    }

    const deleteGroup= async (ids) =>{
        try {
            await WebApiAssessment.deleteGroupPersons({groups_id: ids})
            getListGroups("")
            successMessages(ids);
        } catch (e) {
            setLoading(false)
            errorMessages(ids)
            console.log(e)
        }
    }

    return(
        <MainLayout currentKey="groups_people">
            <Breadcrumb>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => router.push({ pathname: "/home/groups/" })}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Grupos</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                <FormSearch
                    onFilterActive={onFilterActive}
                    onFilterChange={onFilterChange}
                    onFilterReset={onFilterReset}
                    dataGroups={listGroups}
                    setLoading={setLoading}
                    createGroup={createGroup}
                    hiddenName={false}
                    hiddenMembers={false}
                />
                <TableGroups
                    filterValues={filterValues}
                    filterActive={filterActive}
                    dataGroups={listGroups}
                    loading={loading}
                    setLoading={setLoading}
                    getListGroups={getListGroups}
                    updateGroup={updateGroup}
                    deteleGroup={deleteGroup}
                    hiddenName={false}
                    hiddenMembers={false}
                />
            </div>
        </MainLayout>
    )
}

export default withAuthSync(GroupsPeople)