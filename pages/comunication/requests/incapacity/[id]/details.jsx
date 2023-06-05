import React, { useEffect } from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import MainRequets from '../../../../../components/comunication/MainRequets';
import InfoIncapacity from '../../../../../components/comunication/inpacity/InfoIncapacity';

const index = () => {

    const ExtraBread = [
        { name: 'Incapacidad', URL: '/comunication/requests/incapacity' },
        { name: 'Detalle'}
    ]

    return (
        <MainRequets
            pageKey={['incapacity']}
            extraBread={ExtraBread}
        >
            <InfoIncapacity/>
        </MainRequets>
    )
}

export default withAuthSync(index)