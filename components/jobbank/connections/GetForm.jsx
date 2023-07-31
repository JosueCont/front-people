import React from 'react';
import { useRouter } from 'next/router';
//FORMS
import FormFBIG from './forms/FormFBIG';
import FormWP from './forms/FormWP';
import FormGC from './forms/FormGC';
import FormLK from './forms/FormLK';

const GetForm = ({...props}) => {

    const router = useRouter();
    const code = router.query?.code;

    const Components = {
        FB: FormFBIG,
        IG: FormFBIG,
        WP: FormWP,
        GC: FormGC,
        LK: FormLK,
        __default__: ()=> <></>
    }
    
    const Selected = Components[code] ?? Components['__default__'];
    return <Selected {...props}/>;
}

export default GetForm