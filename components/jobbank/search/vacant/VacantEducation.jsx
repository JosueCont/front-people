import React, { useMemo } from 'react';
import {
    ContentVertical,
    SectionTitle,
    FeaturesContent,
    FeaturesText,
    LoadText
} from '../SearchStyled';
import { useSelector } from 'react-redux';
import {
    optionsStatusAcademic,
    optionsLangVacant,
    optionsDomainLang
} from '../../../../utils/constant';

const VacantEducation = ({
    loading = false,
    infoVacant = {}
}) => {

    const {
        list_scholarship,
        load_scholarship
    } = useSelector(state => state.jobBankStore);
    const keyEdu = 'education_and_competence';

    const education = useMemo(() => {
        if (!infoVacant[keyEdu]) return {};
        return infoVacant[keyEdu];
    }, [infoVacant])

    const studyLevel = useMemo(() => {
        const find_ = item => item.id == education?.study_level;
        let result = list_scholarship.find(find_);
        return result?.name;
    }, [list_scholarship, education])

    const studyStatus = useMemo(() => {
        const find_ = item => item.value == education?.status_level_study;
        let result = optionsStatusAcademic.find(find_);
        return result?.label;
    }, [education])

    const getLang = (value) => {
        const find_ = item => item.value == value;
        let result = optionsLangVacant.find(find_);
        return result?.label;
    }

    const getDomain = (value) => {
        const find_ = item => item.value == value;
        let result = optionsDomainLang.find(find_);
        return result?.label;
    }

    const languages = useMemo(() => {
        let list = education?.languages?.length > 0
            ? education?.languages : [];
        const map_ = ({ lang, domain }) => (`${getLang(lang)} (${getDomain(domain)})`);
        let results = list.map(map_);
        if (results?.length <= 0) return null;
        return results?.join(', ');
    }, [education])

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
                <p>Educación</p>
            </SectionTitle>
            <FeaturesContent responsive>
                <Field title='Categoría' value={education?.main_category?.name} />
                <Field title='Subcategoría' value={education?.sub_category?.name} />
                <Field title='Grado académico' value={studyLevel} />
                <Field title='Estatus académico' value={studyStatus} />
                <Field title='Carrera' value={education?.academics_degree?.at(-1)?.name} />
                <Field title='Idiomas' value={languages} />
            </FeaturesContent>
        </ContentVertical>
    )
}

export default VacantEducation