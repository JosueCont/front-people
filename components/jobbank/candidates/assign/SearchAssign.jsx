import React, { useState, useMemo } from 'react';
import { Button, Row, Col, Form, Card, Tooltip } from 'antd';
import {
    SyncOutlined,
    SettingOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { createFiltersJB, deleteFiltersJb } from '../../../../utils/functions';
import TagFilters from '../../TagFilters';
import { useFitersAssign } from '../../hook/useFiltersAssign';
import FiltersAssign from './FiltersAssign';
import moment from 'moment';

const SearchAssign = ({
    allEvaluations = [],
    keepKeys = [],
    newFilters = {},
    infoCandidate = {}
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const { listKeys } = useFitersAssign();
    //Keys para las estadísticas
    const toAnswerKey = 'Por contestar';
    const answeredKey = 'Contestados';
    const progressKey = 'Progreso';
    const groupKey = 'Grupal';
    const personalKey = 'Personal';
    const initialNums = {
        [groupKey]: 0,
        [personalKey]: 0,
        [answeredKey]: 0,
        [toAnswerKey]: 0,
        [progressKey]: 0
    };

    const discardKeys = useMemo(() => {
        let keys = Object.keys(router.query);
        if (keys <= 0) return [];
        const filter_ = item => !keepKeys.includes(item);
        return keys.filter(filter_);
    }, [router.query])

    const statistics = useMemo(() => {
        if (allEvaluations?.length <= 0) return {};
        let percent = 100 / (allEvaluations.length * 100);
        let results = allEvaluations?.reduce((acc, current) => {
            let toAnswer = acc[toAnswerKey] ?? 0;
            let answered = acc[answeredKey] ?? 0;
            let grupal = acc[groupKey] ?? 0;
            let personal = acc[personalKey] ?? 0;
            const some_ = item => item == 'personal';
            let is_personal = current.origins?.some(some_);
            if (!current.applys[0]) return {
                ...acc,
                [toAnswerKey]: toAnswer + 1,
                [groupKey]: is_personal ? grupal : grupal + 1,
                [personalKey]: is_personal ? personal + 1 : personal
            };
            let progress = current.applys[0]?.progress;
            let finished = progress == 100 || current?.applys[0]?.status == 2;
            return {
                ...acc,
                [answeredKey]: finished ? answered + 1 : answered,
                [progressKey]: (acc[progressKey] ?? 0) + progress,
                [toAnswerKey]: !finished ? toAnswer + 1 : toAnswer,
                [groupKey]: is_personal ? grupal : grupal + 1,
                [personalKey]: is_personal ? personal + 1 : personal
            }
        }, initialNums)
        let total = results[progressKey];
        return { ...results, [progressKey]: `${(percent * total).toFixed(2)}%` }
    }, [allEvaluations])

    const showModal = () => {
        let filters = { ...router.query };
        filters.date_finish = router.query?.date_finish
            ? moment(router.query?.date_finish, 'DD-MM-YYYY') : null;
        formSearch.setFieldsValue(filters);
        setOpenModal(true)
    }

    const closeModal = () => {
        setOpenModal(false)
        formSearch.resetFields()
    }

    const setFilters = (filters = {}) => router.replace({
        pathname: '/jobbank/candidates/assign',
        query: filters
    }, undefined, { shallow: true });

    const onFinishSearch = (values) => {
        let filters = createFiltersJB(values);
        let params = deleteFiltersJb({ ...router.query }, keepKeys);
        setFilters({ ...params, ...filters });
    }

    const deleteFilter = () => {
        formSearch.resetFields();
        let params = deleteFiltersJb({ ...router.query }, keepKeys);
        setFilters(params)
    }

    return (
        <>
            <Card bodyStyle={{ padding: 12 }}>
                <Row gutter={[8, 8]}>
                    <Col span={24}>
                        <div span={24} className='title-action-content title-action-border'>
                            <p style={{ marginBottom: 0, fontSize: '1.25rem', fontWeight: 500 }}>
                                Evaluaciones {Object.keys(infoCandidate).length > 0 && (
                                    <>
                                        / <span style={{ color: 'rgba(0,0,0,0.5)' }}>
                                            {infoCandidate?.first_name} {infoCandidate?.flast_name} {infoCandidate?.mlast_name}
                                        </span>
                                    </>
                                )}
                            </p>
                            <div className='content-end' style={{ gap: 8 }}>
                                <Tooltip title='Configurar filtros'>
                                    <Button onClick={() => showModal()}>
                                        <SettingOutlined />
                                    </Button>
                                </Tooltip>
                                <Tooltip title='Limpiar filtros'>
                                    <Button onClick={() => deleteFilter()}>
                                        <SyncOutlined />
                                    </Button>
                                </Tooltip>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => router.push({
                                        pathname: router.query?.back
                                            ? `/jobbank/${router.query?.back}`
                                            : '/jobbank/candidates',
                                        query: newFilters
                                    })}
                                >
                                    Regresar
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <TagFilters
                            listKeys={listKeys}
                            discardKeys={discardKeys}
                            defaultFilters={statistics}
                        />
                    </Col>
                </Row>
            </Card>
            <FiltersAssign
                visible={openModal}
                close={closeModal}
                formSearch={formSearch}
                onFinish={onFinishSearch}
            />
        </>
    )
}

export default SearchAssign;