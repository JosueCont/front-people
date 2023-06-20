import React, { useEffect, useMemo, useState } from 'react';
import {
    ContentVertical,
    SectionTitle,
    FeaturesContent,
    FeaturesText,
    LoadText
} from '../SearchStyled';
import {
    optionsGenders,
    optionsTypeJob
} from '../../../../utils/constant';

const VacantFeatures = ({
    loading = false,
    infoVacant = {}
}) => {

    // const gender = useMemo(() => {
    //     const find_ = item => item.value == infoVacant?.gender;
    //     let result = optionsGenders.find(find_);
    //     return result?.label;
    // }, [infoVacant?.gender])

    const modality = useMemo(()=>{
        const find_ = item => item.value == infoVacant?.type_job;
        let result = optionsTypeJob.find(find_);
        return result?.label;
    },[infoVacant?.type_job])

    const Wait = (
        <LoadText
            active
            size='small'
        />
    )

    const Field = ({
        title = '',
        value = null
    }) => (
        <ContentVertical>
            <FeaturesText>{title}</FeaturesText>
            {!loading ? (
                <FeaturesText color='gray'>
                    {value || 'No disponible'}
                </FeaturesText>
            ) : Wait}
        </ContentVertical>
    )

    return (
        <ContentVertical>
            <SectionTitle>
                <p>Característcas de la vacante</p>
            </SectionTitle>
            <FeaturesContent responsive>
                <Field title='Modalidad' value={modality} />
                <Field title='Horario' value={infoVacant?.working_hours} />
                <Field title='Estado' value={infoVacant?.location?.name} />
                {/* <Field title='Género' value={gender} /> */}
                <Field title='Edad' value={infoVacant?.age_range?.length > 0
                    ? infoVacant?.age_range?.join(' - ')
                    : null
                } />
            </FeaturesContent>
        </ContentVertical>
    )
}

export default VacantFeatures