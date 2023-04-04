import WebApiPeople from "../api/WebApiPeople";

export const getRole = async (jwt) =>{
    try {
        let response = await WebApiPeople.personForKhonnectId({id: jwt.user_id});
        let have_rol = Object.keys(response.data?.administrator_profile ?? {}).length > 0;
        return response.data?.is_admin && have_rol ? "admin" : "user";
    } catch (e) {
        console.log(e)
        return null;
    }
}

export const getPermissions = async (code) =>{
    try {
        let param = `?paginate=0&khorplus_module__code=${code}`;
        let response = await WebApiPeople.getPermissionsModules(param);
        return response.data;
    } catch (e) {
        console.log(e)
        return null;
    }
}