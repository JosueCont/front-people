import React, { useMemo } from 'react';
import {
    ContentVertical,
    SectionTitle,
    FeaturesContent,
    FeaturesText,
    ContentHTML,
    LoadText
} from '../SearchStyled';
import {
    optionsPaymentPeriod,
    optionsEconomicBenefits
} from '../../../../utils/constant';
import { Skeleton } from 'antd';

const VacantBenefits = ({
    loading = false,
    infoVacant = {}
}) => {

    const keyObj = 'salary_and_benefits';
    const noValid = [undefined, null, "", " ", "<p></p>"];

    const benefits = useMemo(() => {
        if (!infoVacant[keyObj]) return {};
        return infoVacant[keyObj];
    }, [infoVacant])

    const formatNum = (value = "0") => parseFloat(value).toLocaleString('es-Mx', { maximumFractionDigits: 4 });

    const periodName = useMemo(() => {
        const find_ = item => item.value == benefits?.payment_period;
        let result = optionsPaymentPeriod.find(find_);
        return result?.label;
    }, [benefits])

    const economic = useMemo(() => {
        const find_ = item => item.value == benefits?.economic_benefits;
        let result = optionsEconomicBenefits.find(find_);
        return result?.label;
    }, [benefits])

    const Wait = (
        <LoadText
            active
            size='small'
        />
    )

    const fetching = (
        <Skeleton
            title={false}
            paragraph={{ rows: 2 }}
            active
        />
    )

    const Field = ({
        title = '',
        value = null,
        ...props
    }) => (
        <ContentVertical {...props}>
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
                <p>Compensaciones</p>
            </SectionTitle>
            <FeaturesContent responsive>
                <Field title='Sueldo mensual bruto' value={benefits?.gross_salary
                    ? `$${formatNum(benefits?.gross_salary)} MXN`
                    : null
                } />

                <Field title='Periodo de pago' value={periodName} />
                <Field
                    title='Prestaciones'
                    value={economic}
                    className={benefits?.economic_benefits ? 'needRow' : ''}
                />
                {!noValid.includes(benefits?.economic_benefits_description) && (
                    <ContentVertical className='needRow'>
                        <FeaturesText>Descripción de prestaciones</FeaturesText>
                        {!loading ? (
                            <ContentHTML dangerouslySetInnerHTML={{__html: benefits?.economic_benefits_description}}/>
                        ) : fetching}
                    </ContentVertical>
                )}
            </FeaturesContent>
        </ContentVertical>
    )
}

export default VacantBenefits