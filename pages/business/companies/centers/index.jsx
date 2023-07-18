import React from 'react';
import MainBusiness from '../../../../components/business/centers/MainBusiness';

const index = () => {

    const ExtraBread = [
        {name: 'Empresas', URL: '/business/companies'},
        {name: 'Centros de trabajo'}
    ]

    return (
        <MainBusiness
            pageKey={["business"]}
            extraBread={ExtraBread}
        >

        </MainBusiness>
    )
}

export default index