import React from 'react';
import { useRouter } from 'next/router';
import MainLevels from './levels/MainLevels';
import MainNodes from './nodes/MainNodes';
import MainRanks from './ranks/MainRanks';
import MainJobs from './jobs/MainJobs';
import MainPlaces from './places/MainPlaces';

const GetCatalog = ({...props}) => {

    const router = useRouter();
    const catalog = router.query?.catalog;

    const Catalogs = {
        levels: MainLevels,
        nodes: MainNodes,
        ranks: MainRanks,
        jobs: MainJobs,
        places: MainPlaces,
        __default__: ()=><></>
    }

    const Selected = Catalogs[catalog] ?? Catalogs['__default__'];
    
    return <Selected {...props}/>
}

export default GetCatalog