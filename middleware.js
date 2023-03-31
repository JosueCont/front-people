import { NextResponse } from 'next/server';
import { ignoreURLS, mapURLS } from './middleware/listurls';
import { apiMiddleware } from "./middleware/apiMiddleware";

const isAdmin = async (req, jwt) =>{
    try {
        const WebApi = apiMiddleware(req);
        let response = await WebApi.personForKhonnectId({id: jwt.user_id});
        let have_rol = Object.keys(response.data?.administrator_profile ?? {}).length > 0;
        return response.data?.is_admin && have_rol ? "admin" : "user";
    } catch (e) {
        console.log(e)
        return null;
    }
}

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    //Se ignoran estas urls porque no se necesita validar
    if(ignoreURLS.includes(pathname)) return NextResponse.next();

    /**
     * Se valida que exista una sesión iniciada
     * Se omite por el momnento,  ya que actualmente se esta utlizando
     * la función de withAuthSync
     */
    
    const token = req.cookies.get('token');
    const jwt = token ? JSON.parse(token) : {};
    // if(Object.keys(jwt).length <= 0) return NextResponse.redirect(new URL("/", req.url));
    // if(Object.keys(jwt).length <= 0){
    //     const url = req.nextUrl.clone();
    //     url.pathname = "/";
    //     url.search = `p=${pathname}`;
    //     return NextResponse.redirect(url)
    // }

    //Se obtienen el rol de la persona
    const rol = await isAdmin(req, jwt);
    if(rol == "user") return mapURLS.user(req);
    if(rol == null) return NextResponse.redirect(new URL("/", req.url));

    //Validaciones de los móudulos
    const current = pathname.split("/")[1];
    return mapURLS[current]
        ? mapURLS[current](req, jwt)
        : NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}