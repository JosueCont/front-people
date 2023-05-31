import React, { useEffect } from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import MainRequets from '../../../../../components/comunication/MainRequets';
import InfoPermission from '../../../../../components/comunication/permission/InfoPermission';

const index = () => {

    const ExtraBread = [
        { name: 'Permisos', URL: '/comunication/requests/permission' },
        { name: 'Detalle' }
    ]

    return (
        <MainRequets
            pageKey={['permission']}
            extraBread={ExtraBread}
        >
            <InfoPermission/>
        </MainRequets>
    )
}

export default withAuthSync(index)