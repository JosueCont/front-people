import { NextResponse } from 'next/server';
import { getPermissions } from '../services';

const payroll = async (req) =>{
    
    const { pathname } = req.nextUrl;
    const current = pathname.split('/')[2];
    
    // let response = await getPermissions('payroll');
    // let permissions = response?.map(item => item.perm_code);

    // if(!permissions?.includes('view_calendar') && current == 'paymentCalendar'){
    //     return NextResponse.redirect(new URL("/403", req.url));
    // }

    return NextResponse.next();
}

export default payroll;