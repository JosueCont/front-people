import React, { useEffect, useState } from 'react';
import esES from 'antd/lib/locale/es_ES';
import { withAuthSync } from '../../../libs/auth';
import MainLayout from '../../../layout/MainInter';
import { Breadcrumb, ConfigProvider } from 'antd';
import {
    verifyMenuNewForTenant,
    getFiltersJB
} from '../../../utils/functions';
import SearchPeople from '../../../components/people/SearchPeople';
import TablePeople from '../../../components/people/TablePeople';
import { connect } from 'react-redux';
import {
    getCollaborators
} from '../../../redux/UserDuck';
import {
    getListAssets,
    getCategories,
    getGroupsAssessments
} from '../../../redux/assessmentDuck';
import { useRouter } from 'next/router';
import {
    getPatronalRegistration,
    getPersonType
} from '../../../redux/catalogCompany';

const index = ({
    currentNode,
    getCollaborators,
    getCategories,
    getListAssets,
    getGroupsAssessments,
    getPersonType
}) => {

    const router = useRouter();

    useEffect(() => {
        if (!currentNode) return;
        let page = router.query.page ? parseInt(router.query.page) : 1;
        let size = router.query.size ? parseInt(router.query.size) : 10;
        let filters = getFiltersJB({...router.query});
        getCollaborators(currentNode.id, filters, page, size)
    }, [currentNode, router?.query])

    useEffect(() => {
        if (!currentNode) return;
        getListAssets(currentNode?.id, '&is_active=true')
        getGroupsAssessments(currentNode?.id)
        getCategories()
        getPatronalRegistration(currentNode?.id)
        getPersonType(currentNode?.id)
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
        getCollaborators,
        getCategories,
        getListAssets,
        getGroupsAssessments,
        getPersonType
    }
)(withAuthSync(index))