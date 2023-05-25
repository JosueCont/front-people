import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainInter";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import AssessmentsSearch from "../../../components/assessment/groups/AssessmentsSearch";
import AssessmentsTable from "../../../components/assessment/groups/AssessmentsTable";
import {
    getCategories,
    getListAssets
} from "../../../redux/assessmentDuck";
import { verifyMenuNewForTenant } from "../../../utils/functions"
import { valueToFilter } from "../../../utils/functions";

const GroupsKuiz = ({
    getCategories,
    currentNode,
    getListAssets,
}) => {

    const router = useRouter();

    const [listGroups, setLisGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([])    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (currentNode?.id) {
            getListGroups(currentNode.id);
            getListAssets(currentNode.id, "&is_active=true");
        }
    }, [currentNode]);

    const getListGroups = async (node, query = "") => {
        try {
            setLoading(true);
            let response = await WebApiAssessment.getGroupsAssessments(node, query);
            setLisGroups(response.data);
            setAllGroups(response.data)
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    const onFinish = ({name}) =>{
        setLoading(true)
        const filert_ = item => valueToFilter(item.name).includes(valueToFilter(name));
        let results = name ? allGroups.filter(filert_) : allGroups;
        setTimeout(()=>{
            setLoading(false)
            setLisGroups(results)
        },1000)
    }


    return (
        <MainLayout
            currentKey={["assessment_groups"]}
            defaultOpenKeys={["evaluationDiagnosis", "kuiz"]}
        >
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
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24
            }}>
                <AssessmentsSearch
                    onFinish={onFinish}
                    getListGroups={getListGroups}
                />
                <AssessmentsTable
                    listGroups={listGroups}
                    loading={loading}
                    getListGroups={getListGroups}
                />
            </div>
        </MainLayout>
    );
};

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    };
};

export default connect(
    mapState, {
        getCategories,
        getListAssets
    }
)(withAuthSync(GroupsKuiz));
