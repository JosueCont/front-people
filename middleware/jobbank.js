import { NextResponse } from "next/server";

const jobbank = async (req, jwt) =>{

    const { pathname } = req.nextUrl;
    
    return NextResponse.next();
}

export default jobbank;