import React, { useEffect } from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import MainRequets from '../../../../../components/comunication/MainRequets';
import InfoRequests from '../../../../../components/comunication/requets/InfoRequests';

const index = () => {

    const ExtraBread = [
        { name: 'Vacaciones', URL: '/comunication/requests/holidays' },
        { name: 'Detalle'}
    ]

    return (
        <MainRequets
            pageKey={['holidays']}
            extraBread={ExtraBread}
        >
            <InfoRequests/>
        </MainRequets>
    )
}

export default withAuthSync(index)