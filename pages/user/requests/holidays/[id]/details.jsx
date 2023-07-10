import React, { useEffect } from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import MainRequets from '../../../../../components/comunication/MainRequets';
import InfoRequests from '../../../../../components/comunication/requets/InfoRequests';

const index = () => {

    const ExtraBread = [
        { name: 'Vacaciones', URL: '/user/requests/holidays' },
        { name: 'Detalle'}
    ]

    return (
        <MainRequets
            isAdmin={false}
            pageKey={['holidays']}
            extraBread={ExtraBread}
        >
            <InfoRequests isAdmin={false}/>
        </MainRequets>
    )
}

export default withAuthSync(index)