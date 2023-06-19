import React from 'react';
import {
    ContentVertical,
    SectionTitle,
    FeaturesContent,
    FeaturesText,
    SectionVoid,
    FeaturesList
} from '../SearchStyled';
import { Skeleton } from 'antd';

const VacantDescription = ({
    loading = false,
    description = null,
    title = '',
    isList = false
}) => {

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
        return description ? (
            <>
                {Array.isArray(description) ? (
                    <FeaturesList>
                        <>{description.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}</>
                    </FeaturesList>
                ) : (
                    <FeaturesText color='gray'>
                        {description}
                    </FeaturesText>
                )}
            </>
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