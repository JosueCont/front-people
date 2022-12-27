import React from 'react';
import { useRouter } from 'next/router';
import FormFBIG from './FormFBIG';

const GetForm = () => {

    const router = useRouter();
    const code = router.query?.code;

    const Components = {
        'FB': FormFBIG,
        'IG': FormFBIG,
        __default_: <></>
    }
    
    const Selected = Components[code] ?? Components['__default_'];
    return <Selected/>;
}

export default GetForm