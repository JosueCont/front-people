import React, {
    useMemo
} from 'react';
import {
    CardItem,
    CardTitle,
    CardDescription,
    ButtonPrimary,
    ContentEnd,
    ContentVertical,
    FeaturesText
} from './SearchStyled';
import { useRouter } from 'next/router';
import {
    optionsPaymentPeriod,
    optionsEconomicBenefits
} from '../../../utils/constant';

const SearchCard = ({
    item = {}
}) => {

    const router = useRouter();

    const Field = ({
        title = '',
        value = null
    }) => (
        <ContentVertical direction='row' gap='4px'>
            <FeaturesText>{title}</FeaturesText>
            <FeaturesText color='gray'>
                {value || 'No disponible'}
            </FeaturesText>
        </ContentVertical>
    )

    const formatNum = (value = "0") => parseFloat(value).toLocaleString('es-Mx', { maximumFractionDigits: 4 });

    const periodName = useMemo(() => {
        const find_ = record => record.value == item?.salary_and_benefits?.payment_period;
        let result = optionsPaymentPeriod.find(find_);
        return result?.label;
    }, [item])

    const economic = useMemo(() => {
        const find_ = record => record.value == item?.salary_and_benefits?.economic_benefits;
        let result = optionsEconomicBenefits.find(find_);
        return result?.label;
    }, [item])

    return (
        <CardItem>
            <CardTitle>
                <span />
                <p>{item?.job_position}</p>
            </CardTitle>
            <CardDescription className='scroll-bar'>
                {item.show_customer_name && item?.customer?.name && (
                    <FeaturesText weight='bold'>
                        {item?.customer?.name}
                    </FeaturesText>
                )}
                <Field title='Estado:' value={item?.location?.name} />
                <Field title='Categoría:' value={item?.education_and_competence?.main_category?.name} />
                <Field title='Sueldo mensual bruto:' value={item?.salary_and_benefits?.gross_salary
                    ? `$${formatNum(item?.salary_and_benefits?.gross_salary)} MXN`
                    : null
                } />
                <Field title='Periodo de pago:' value={periodName} />
                <Field title='Prestaciones:' value={economic} />
            </CardDescription>
            <ContentEnd>
                <ButtonPrimary
                    onClick={() => router.push({
                        pathname: '/jobbank/search/details/',
                        query: { ...router.query, vacant: item.id }
                    })}
                >
                    Ver detalle
                </ButtonPrimary>
            </ContentEnd>
        </CardItem>
    )
}

export default SearchCard