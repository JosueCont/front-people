import { NextResponse } from "next/server";

const userURLS = ['user'];

const user = (req) =>{
    const current = req.nextUrl.pathname.split('/')[1];
    if(userURLS.includes(current)) return NextResponse.next();
    return NextResponse.redirect(new URL("/403", req.url));
}

export default user;