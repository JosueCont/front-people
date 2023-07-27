import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainInter";
import { useRouter } from "next/router";
import { connect, useSelector } from "react-redux";
import { Breadcrumb, message } from "antd";
import { withAuthSync } from "../../../libs/auth";
import WebApiAssessment from "../../../api/WebApiAssessment";
import PersonsGroupSearch from "../../../components/person/groups/PersonsGroupSearch";
import PersonsTable from "../../../components/person/groups/PersonsTable";
import { verifyMenuNewForTenant } from "../../../utils/functions";
import {
    getListAssets,
    getGroupsAssessments,
    getCategories
} from "../../../redux/assessmentDuck";

const GroupsPeople = ({
    currentNode,
    getListAssets,
    getGroupsAssessments,
    getCategories
}) => {

    const router = useRouter();
    const [listGroups, setLisGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [numPage, setNumPage] = useState(1);

    useEffect(() => {
        if (currentNode?.id) {
            getListGroups(currentNode.id, "", "");
            getListAssets(currentNode?.id, '&is_active=true')
            getGroupsAssessments(currentNode?.id)
            getCategories(currentNode?.id)
        }
    }, [currentNode]);

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
        const data = { ...values, node: currentNode?.id };
        try {
            await WebApiAssessment.createGroupPersons(data);
            getListGroups(currentNode?.id, "", "");
            message.success("Grupo agregado");
        } catch (e) {
            setLoading(false);
            message.error("Grupo no agregado");
        }
    };

    const updateGroup = async (values, id) => {
        const data = { ...values, node: currentNode?.id };
        try {
            await WebApiAssessment.updateGroupPersons(data, id);
            getListGroups(currentNode?.id, "", "");
            message.success("Información actualizada");
        } catch (e) {
            setLoading(false);
            message.error("Información no actualizada");
        }
    };

    const deleteGroup = async (ids) => {
        try {
            await WebApiAssessment.deleteGroupPersons({ groups_id: ids });
            getListGroups(currentNode?.id, "", "");
            successMessages(ids);
        } catch (e) {
            setLoading(false);
            errorMessages(ids);
            console.log(e);
        }
    };

    const searchGroup = async (name) => {
        setLoading(true);
        getListGroups(currentNode?.id, name, "");
    };

    const onFinishAssign = async (values, ids) => {
        const body = { ...values, groups_person: ids, node: currentNode?.id };
        try {
            await WebApiAssessment.assignAssessmentsGroup(body);
            getListGroups(currentNode?.id, "", "");
            message.success("Evaluaciones asignadas");
        } catch (e) {
            setLoading(false);
            message.error("Evaluaciones no asignadas");
        }
    };

    return (
        <MainLayout currentKey={['groups_people']} defaultOpenKeys={["strategyPlaning", "people"]}>
            <Breadcrumb>
                <Breadcrumb.Item
                    className={"pointer"}
                    onClick={() => router.push({ pathname: "/home/groups/" })}
                >
                    Inicio
                </Breadcrumb.Item>
                {verifyMenuNewForTenant() &&
                    <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
                }
                <Breadcrumb.Item>Colaboradores</Breadcrumb.Item>
                <Breadcrumb.Item>Grupos de personas</Breadcrumb.Item>
            </Breadcrumb>
            <div className="container" style={{ width: "100%" }}>
                <PersonsGroupSearch
                    setLoading={setLoading}
                    createGroup={createGroup}
                    searchGroup={searchGroup}
                    setNumPage={setNumPage}
                />
                <PersonsTable
                    dataGroups={listGroups}
                    loading={loading}
                    setLoading={setLoading}
                    getListGroups={getListGroups}
                    updateGroup={updateGroup}
                    deteleGroup={deleteGroup}
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

export default connect(
    mapState, {
        getListAssets,
        getGroupsAssessments,
        getCategories
    }
)(withAuthSync(GroupsPeople));
