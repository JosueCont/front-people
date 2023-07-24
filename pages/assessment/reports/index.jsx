import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainInter";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { Breadcrumb, Tabs } from "antd";
import { withAuthSync } from "../../../libs/auth";
import { getProfiles } from "../../../redux/assessmentDuck";
import { verifyMenuNewForTenant } from "../../../utils/functions"
import TabsReport from "../../../components/assessment/reports/TabsReport";

const Index = ({
    currentNode,
    getProfiles
}) => {

    const router = useRouter();
    const [currentKey, setCurrentKey] = useState("p");
    const { TabPane } = Tabs;

    useEffect(() => {
        if (currentNode) {
            getProfiles(currentNode.id, '')
        }
    }, [currentNode])

    return (
        <MainLayout
            currentKey={["assessment_reports"]}
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
                <Breadcrumb.Item>Reportes de competencias</Breadcrumb.Item>
            </Breadcrumb>
            <TabsReport />
        </MainLayout>
    );
};

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    };
};

export default connect(
    mapState, {
    getProfiles
}
)(withAuthSync(Index));