import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";

import TableAssignments from "../../../components/assignments/TableAssignments";
import FormSearch from "../../../components/assessment/groups/FormSearch"

const Assignments = () =>{

    const router = useRouter();
    const currenNode = useSelector(state => state.userStore.current_node)
    const [loading, setLoading] = useState(false);
    const [listAssign, setListAssign] = useState(autoData());


    function autoData(){
        return {
            count: 0,
            results: []
        }
    }

    useEffect(()=>{
        if(currenNode?.id){
            getListAssign(currenNode.id, "")
        }
    },[currenNode])
    
    const getListAssign = async (nodeId, queryParam) =>{
        setLoading(true)
        try {
            let response = await WebApiAssessment.getAssignments(nodeId, queryParam)
            setListAssign(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const createAssign = async (values) =>{
        const data = {
            id_assessment: values.assessments,
            person: values.persons,
            node: currenNode?.id
        }
        console.log('estos valores vienen----->', data)
        try {
            await WebApiAssessment.assignOneTest(data)
            getListAssign(currenNode?.id,"")
            message.success("Evaluación asignada")
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error("Evaluacion no asignada")
        }
    }

    const searchAssign = (name) =>{
        console.log('se filtra----->', name)
    }


    return(
        <MainLayout defaultOpenKeys="kuis" currentKey="assignments">
            <Breadcrumb>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => router.push({ pathname: "/home/assignments" })}
                >
                    Inicio
                </Breadcrumb.Item>
                <Breadcrumb.Item>Asignaciones</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                <FormSearch
                    setLoading={setLoading}
                    createGroup={createAssign}
                    hiddenMembers={false}
                    hiddenSurveys={false}
                    searchGroup={searchAssign}
                    textSearch={'Nombre de la asignación'}
                    textButton={'Agregar asignación'}
                    multipleMembers={false}
                    multipleSurveys={false}
                />
                <TableAssignments
                    dataAssign={listAssign}
                    loading={loading}
                    getList={getListAssign}
                />
            </div>
        </MainLayout>
    )
}

export default withAuthSync(Assignments)