import { NextResponse } from 'next/server';
import { getPermissions } from '../services';

const jobbank = async (req, jwt) =>{

    const { pathname } = req.nextUrl;
    const current = pathname.split('/')[2];
    
    // let response = await getPermissions('jobbank');
    // let permissions = response?.map(item => item.perm_code);

    // if(!permissions?.includes('share_vacant') && current == 'clients'){
    //     return NextResponse.redirect(new URL("/403", req.url));
    // }
    
    return NextResponse.next();
}

export default jobbank;