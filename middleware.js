import { NextResponse } from 'next/server';
import { ignoreURLS, mapURLS } from './middleware/listurls';
import { apiMiddleware } from './middleware/apiMiddleware';
import { getRole } from './middleware/services';

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
    /*
        if(Object.keys(jwt).length <= 0) return NextResponse.redirect(new URL("/", req.url));
        if(Object.keys(jwt).length <= 0){
            const url = req.nextUrl.clone();
            url.pathname = "/";
            url.search = `p=${pathname}`;
            return NextResponse.redirect(url)
        }
    */

    /**
     * Se modifca la instancia del axiosApi
     * Se agrega el fetchAdapter y se recupera
     * el tenant actual
    */
    apiMiddleware(req);
    
    //Se obtienen el rol de la persona
    const rol = await getRole(jwt);
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