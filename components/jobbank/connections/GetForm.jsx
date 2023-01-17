import React from 'react';
import { useRouter } from 'next/router';
import FormFBIG from './FormFBIG';

const GetForm = ({...props}) => {

    const router = useRouter();
    const code = router.query?.code;

    const Components = {
        FB: FormFBIG,
        IG: FormFBIG,
        __default__: ()=> <></>
    }
    
    const Selected = Components[code] ?? Components['__default__'];
    return <Selected {...props}/>;
}

export default GetForm