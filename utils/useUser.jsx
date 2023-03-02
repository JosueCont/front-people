import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { getFullName } from './functions';

export const useUser = () => {

    const user_profile = useSelector(state => state.userStore.user);
    const [user, setUser] = useState({});

    useEffect(()=>{
        if(user_profile){
            setUser({
                fullName: getFullName(user_profile),
                photo: user_profile?.photo,
                email: user_profile.email
                    ?? user_profile.jwt_data
                        ? user_profile.jwt_data.email
                        : 'N/A',
                birth: user_profile.birth_date
                    ?? 'N/A',
                job: user_profile.work_title
                    ? user_profile.work_title.job.name
                    : 'N/A',
                company: user_profile.node_user.name,
                gender: user_profile.gender == 1
                    ? 'Masculino'
                    : user_profile.gender == 2
                        ? 'Femenino'
                        : 'Otro',
                token: user_profile.jwt_data.metadata.at(-1).token
            })
        }
    },[user_profile])

    return { user };
    
}