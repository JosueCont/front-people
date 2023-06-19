import React, { useEffect, useState } from 'react';
import {
    VacantName,
    VacantTitle,
    ButtonPrimary,
    SearchBtn,
    VacantOptions,
    VacantCards,
    VacantHeader,
    ContentVertical,
    SearchLogo
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
import { Image } from 'antd';

const VacantDetails = ({
    loading = false,
    infoVacant = {}
}) => {

    const router = useRouter();
    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb({ ...router.query }, ['vacant']);
        setFilters(filters);
    }, [router.query])

    return (
        <ContentVertical gap='16px'>
            <SearchLogo>
                <Image
                    src='/images/portadaHex.png'
                    preview={false}
                />
            </SearchLogo>
            <VacantHeader>
                <VacantTitle>
                    <span />
                    <VacantName>
                        <p>
                            {infoVacant?.job_position || 'Vacante'}
                            {infoVacant?.show_customer_name && ` (${infoVacant?.customer?.name})`}
                        </p>
                    </VacantName>
                </VacantTitle>
                <VacantOptions>
                    <SearchBtn onClick={() => router.push({
                        pathname: '/jobbank/search',
                        query: filters
                    })}>
                        <ArrowLeftOutlined />
                        <span>Regresar</span>
                    </SearchBtn>
                    <ButtonPrimary onClick={() => router.push({
                        pathname: '/jobbank/autoregister/candidate',
                        query: { ...router.query, back: 'details' }
                    })}>
                        <CheckCircleFilled />
                        <span>Aplicar</span>
                    </ButtonPrimary>
                </VacantOptions>
            </VacantHeader>
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
                {infoVacant?.description && (
                    <VacantDescription
                        loading={loading}
                        title='Descripción de la vacante'
                        description={infoVacant?.description?.split('\n')}
                    />
                )}
                {infoVacant?.education_and_competence?.knowledge && (
                    <VacantDescription
                        loading={loading}
                        title='Conocimientos requeridos'
                        description={infoVacant?.education_and_competence?.knowledge}
                    />
                )}
                {infoVacant?.education_and_competence?.experience && (
                    <VacantDescription
                        loading={loading}
                        title='Experiencia requerida'
                        description={infoVacant?.education_and_competence?.experience?.split(',')}
                    />
                )}
                {infoVacant?.education_and_competence?.technical_skills?.length > 0 && (
                    <VacantDescription
                        loading={loading}
                        title='Habilidades técnicas'
                        description={infoVacant?.education_and_competence?.technical_skills}
                    />
                )}
            </VacantCards>
        </ContentVertical>
    )
}

export default VacantDetails