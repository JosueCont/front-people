import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainInter";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import AssessmentsSearch from "../../../components/assessment/groups/AssessmentsSearchCopy";
import AssessmentsTable from "../../../components/assessment/groups/AssessmentsTableCopy";
import {
    getCategories,
    setErrorFormAdd,
    setModalGroup,
    setModalGroupEdit,
    assessmentLoadAction
} from "../../../redux/assessmentDuck";
import { verifyMenuNewForTenant } from "../../../utils/functions"

const GroupsKuiz = ({
    getCategories,
    currentNode,
    setErrorFormAdd,
    setModalGroup,
    setModalGroupEdit,
    assessmentLoadAction,
    ...props
}) => {

    const router = useRouter();

    const [listGroups, setLisGroups] = useState([]);
    const [allGroups, setAllGroups] = useState([])
    
    const [listSurveys, setListSurveys] = useState([]);
    const [loadSurveys, setLoadSurveys] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [numPage, setNumPage] = useState(1);
    const [errorName, setErrorName] = useState(false)

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        if (currentNode?.id) {
            getListGroups(currentNode.id);
            assessmentLoadAction(currentNode.id, "&is_active=true");
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
    };


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
                flexDirection: 'column'
            }}>
                {/* <AssessmentsSearch
                setLoading={setLoading}
                createGroup={createGroup}
                searchGroup={searchGroup}
                setNumPage={setNumPage}
                getListGroups={getListGroups}
                /> */}
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
        setErrorFormAdd,
        setModalGroup,
        setModalGroupEdit,
        assessmentLoadAction
    }
)(withAuthSync(GroupsKuiz));
