import React, {
    useEffect,
    useState,
    useRef,
    useMemo
} from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
    Form,
    Spin,
    message
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import DetailsCustom from '../../DetailsCustom';
import { useRouter } from 'next/router';
import TabFollow from './TabFollow';
import TabCustomer from './TabCustomer';
import TabKHOR from './TabKHOR';

const DetailsSelection = ({
    newFilters = {}
}) => {

    const router = useRouter();

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/selection',
            query: newFilters
        })
    }

    const onChangeTab = (tab) =>{
        router.replace({
            pathname: '/jobbank/selection/edit',
            query: {...router.query, tab}
        }, undefined, {shallow: true})
    }

    const activeKey = useMemo(()=>{
        let tab = router.query?.tab;
        return tab ? tab : '1'
    }, [router.query?.tab])

    return (
        <DetailsCustom
            titleCard='Información del proceso'
            showOptions={false}
            childrenIsTabs={true}
            actionBack={actionBack}
        >
            <Tabs
                type='card'
                activeKey={activeKey}
                onChange={onChangeTab}
            >
                <Tabs.TabPane
                    tab='Seguimiento'
                    forceRender
                    key='1'
                >
                    <TabFollow/>
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab='Evaluaciones cliente'
                    forceRender
                    key='2'
                >
                    <TabCustomer/>
                </Tabs.TabPane>
                <Tabs.TabPane
                    tab='Evaluaciones KHOR+'
                    forceRender
                    key='3'
                >
                    <TabKHOR/>
                </Tabs.TabPane>
            </Tabs>
        </DetailsCustom>
    )
}

export default DetailsSelection