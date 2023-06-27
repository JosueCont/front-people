import React from 'react';
import {
    ContentVertical,
    SectionTitle,
    FeaturesContent,
    FeaturesText,
    SectionVoid,
    FeaturesList,
    ContentHTML
} from '../SearchStyled';
import { Skeleton } from 'antd';

const VacantDescription = ({
    loading = false,
    description = null,
    title = ''
}) => {

    const noValid = [undefined, null, "", " ", "<p></p>"];

    const fetching = (
        <Skeleton
            title={false}
            paragraph={{ rows: 4 }}
            active
        />
    )

    const Empty = (
        <SectionVoid>
            <p>Ningún resultado encontrado</p>
        </SectionVoid>
    )

    const DescriptionInfo = () => {
        return !noValid.includes(description) ? (
            <ContentHTML dangerouslySetInnerHTML={{__html: description}}/>
        ) : Empty;
    }

    return (
        <ContentVertical>
            <SectionTitle>
                <p>{title}</p>
            </SectionTitle>
            <FeaturesContent>
                {!loading ? (
                    <DescriptionInfo />
                ) : fetching}
            </FeaturesContent>
        </ContentVertical>
    )
}

export default VacantDescription