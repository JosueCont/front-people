import React from 'react';
import { useRouter } from 'next/router';
import MainLevels from './levels/MainLevels';
import MainNodes from './nodes/MainNodes';

const GetCatalog = ({...props}) => {

    const router = useRouter();
    const catalog = router.query?.catalog;

    const Catalogs = {
        levels: MainLevels,
        nodes: MainNodes,
        __default__: ()=><></>
    }

    const Selected = Catalogs[catalog] ?? Catalogs['__default__'];
    
    return <Selected {...props}/>
}

export default GetCatalog