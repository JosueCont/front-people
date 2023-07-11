import React, { useEffect, useState } from 'react';
import esES from 'antd/lib/locale/es_ES';
import { withAuthSync } from '../../../libs/auth';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb, ConfigProvider } from 'antd';
import { verifyMenuNewForTenant } from '../../../utils/functions';
import SearchPeople from '../../../components/people/SearchPeople';
import TablePeople from '../../../components/people/TablePeople';
import { PeopleProvider } from '../../../components/people/PeopleContext';
import { connect } from 'react-redux';
import {
    getPersonsCompany,
    getListPersons,
} from '../../../redux/UserDuck';
import {
    getListAssets,
    getCategories,
    getGroupsAssessments
} from '../../../redux/assessmentDuck';
import { useRouter } from 'next/router';
import {
    getPatronalRegistration
} from '../../../redux/catalogCompany';

const index = ({
    currentNode,
    getPersonsCompany,
    getListPersons,
    getCategories,
    getListAssets,
    getGroupsAssessments
}) => {

    const router = useRouter();
    // const [filtersObj, setFiltersObj] = useState({});
    // const [filtersStr, setFiltersStr] = useState("");

    useEffect(() => {
        if (!currentNode) return;
        let filters = { ...router.query };
        // setFiltersObj(filters)
        getListPersons(currentNode?.id, filters)
    }, [currentNode, router?.query])

    useEffect(() => {
        if (!currentNode) return;
        getPersonsCompany(currentNode?.id)
        getListAssets(currentNode?.id, '&is_active=true')
        getGroupsAssessments(currentNode?.id)
        getCategories()
        getPatronalRegistration()
    }, [currentNode])

    return (
        <MainLayout
            currentKey={["persons"]}
            defaultOpenKeys={["strategyPlaning", "people"]}
        >
            <Breadcrumb>
                <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                {verifyMenuNewForTenant() &&
                    <Breadcrumb.Item>Estrategia y planeación</Breadcrumb.Item>
                }
                <Breadcrumb.Item>Colaboradores</Breadcrumb.Item>
                <Breadcrumb.Item>Personas</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24
            }}>
                <ConfigProvider locale={esES}>
                    <SearchPeople />
                    <TablePeople />
                </ConfigProvider>
            </div>
        </MainLayout>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
        generalConfig: state.userStore.general_config,
        permissions: state.userStore.permissions,
    }
}

export default connect(
    mapState, {
    getPersonsCompany,
    getListPersons,
    getCategories,
    getListAssets,
    getGroupsAssessments
}
)(withAuthSync(index))