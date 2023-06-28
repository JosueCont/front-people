import React, { useEffect, useState } from 'react';
import {
    VacantName,
    VacantTitle,
    ButtonPrimary,
    SearchBtn,
    VacantOptions,
    VacantCards,
    VacantHeader
} from '../SearchStyled';
import {
    CheckCircleFilled,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { deleteFiltersJb } from '../../../../utils/functions';
import VacantFeatures from './VacantFeatures';
import VacantDescription from './VacantDescription';
import VacantEducation from './VacantEducation';
import VacantBenefits from './VacantBenefits';
import VacantHead from './VacantHead';

const VacantDetails = ({
    loading = false,
    infoVacant = {}
}) => {

    const router = useRouter();
    const [filters, setFilters] = useState({});
    const noValid = [undefined, null, "", " ", "<p></p>"];

    useEffect(() => {
        if (Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb({ ...router.query }, ['vacant']);
        setFilters(filters);
    }, [router.query])

    const actions = (
        <>
            <SearchBtn disabled={loading} onClick={() => router.push({
                pathname: '/jobbank/search',
                query: filters
            })}>
                <ArrowLeftOutlined />
                <span>Regresar</span>
            </SearchBtn>
            <ButtonPrimary disabled={loading} onClick={() => router.push({
                pathname: '/jobbank/autoregister/candidate',
                query: { ...router.query, back: 'details' }
            })}>
                <CheckCircleFilled />
                <span>Aplicar</span>
            </ButtonPrimary>
        </>
    )

    return (
        <>
            <VacantHead loading={loading} title={<>
                {infoVacant?.job_position || 'Vacante'}
                {infoVacant?.show_customer_name && ` (${infoVacant?.customer?.name})`}
            </>} actions={actions}/>
            <VacantCards>
                <VacantFeatures
                    loading={loading}
                    infoVacant={infoVacant}
                />
                <VacantEducation
                    loading={loading}
                    infoVacant={infoVacant}
                />
                <VacantBenefits
                    loading={loading}
                    infoVacant={infoVacant}
                />
                {!noValid.includes(infoVacant?.description) && (
                    <VacantDescription
                        loading={loading}
                        title='Descripción de la vacante'
                        description={infoVacant?.description}
                    />
                )}
                {!noValid.includes(infoVacant?.education_and_competence?.knowledge) && (
                    <VacantDescription
                        loading={loading}
                        title='Conocimientos requeridos'
                        description={infoVacant?.education_and_competence?.knowledge}
                    />
                )}
                {!noValid.includes(infoVacant?.education_and_competence?.experience ) && (
                    <VacantDescription
                        loading={loading}
                        title='Experiencia requerida'
                        description={infoVacant?.education_and_competence?.experience}
                    />
                )}
                {infoVacant?.education_and_competence?.technical_skills?.length > 0 &&
                !noValid.includes(infoVacant?.education_and_competence?.technical_skills?.at(-1)) && (
                    <VacantDescription
                        loading={loading}
                        title='Habilidades técnicas'
                        description={infoVacant?.education_and_competence?.technical_skills?.at(-1)}
                    />
                )}
            </VacantCards>
        </>
    )
}

export default VacantDetails