import React from 'react';
import MainKuiz from '../../../components/kuiz/MainKuiz';
import SearchGroups from '../../../components/kuiz/groups/SearchGroups';
import TableGroups from '../../../components/kuiz/groups/TableGroups';

const index = () => {
    return (
        <MainKuiz
            pageKey='kuiz_groups'
            extraBread={[{ name: 'Grupos' }]}
        >
            <SearchGroups/>
            <TableGroups/>
        </MainKuiz>
    )
}

export default index