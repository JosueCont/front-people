import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import MainRequets from '../../../../../components/comunication/MainRequets';
import InfoRequests from '../../../../../components/comunication/requets/InfoRequests';
import { useRouter } from 'next/router';
import { deleteFiltersJb } from '../../../../../utils/functions';

const index = () => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id'];

    useEffect(() => {
        if (Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    }, [router.query])

    const ExtraBread = [
        { name: 'Vacaciones', URL: '/user/requests/holidays' },
        { name: 'Detalle'}
    ]

    return (
        <MainRequets
            isAdmin={false}
            pageKey={['holidays']}
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <InfoRequests
                isAdmin={false}
                newFilters={newFilters}
            />
        </MainRequets>
    )
}

export default withAuthSync(index)