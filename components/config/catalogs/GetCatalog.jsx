import React from 'react';
import { useRouter } from 'next/router';
import TableDepartments from './departments/TableDepartments';
import TableJobs from './jobs/TableJobs';
import TablePersons from './persons/TablePersons';
import TableRelatives from './relatives/TableRelatives';
import TableDocuments from './documents/TableDocuments';
import TableAccounts from './accounts/TableAccounts';
import TableCenters from './centers/TableCenters';
import TableTags from './tags/TableTags';
import TableOffices from './offices/TableOffices';
import TabsInternal from './internal/TabsInternal';

const GetCatalog = ({...props}) => {

    const router = useRouter();
    const catalog = router.query?.catalog;

    const Catalogs = {
        departments: TableDepartments,
        jobs: TableJobs,
        persons: TablePersons,
        relatives: TableRelatives,
        documents: TableDocuments,
        accounts: TableAccounts,
        centers: TableCenters,
        tags: TableTags,
        offices: TableOffices,
        internal: TabsInternal,
        __default__: ()=><></>
    }

    const Selected = Catalogs[catalog] ?? Catalogs['__default__'];
    
    return <Selected {...props}/>
}

export default GetCatalog