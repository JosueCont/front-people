import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const SettingsJobbank = () => {

    const router = useRouter();
    const [listOptions, setListOptions] = useState([]);

    useEffect(()=>{
        let list = [];
        list.push({name: 'Catálogos', is_active: true})
        list.push({name: 'Conexiones', is_active: true})
        // for (let i = 0; i < 10; i++) {
        //     list.push({ name: `Example ${i+1}`, is_active: false })
        // }
        setListOptions(list)
    },[])

    return (
        <div className='card-settings'>
            {listOptions.map((item, idx) => {
                let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                return(
                    <div
                        key={idx+""}
                        className='card-catalog'
                        style={{
                            cursor: item.is_active ? 'pointer' : 'not-allowed',
                            border: `2px solid var(--primaryColor)`,
                            filter: item.is_active ? 'none' : 'grayscale(100%)'
                        }}
                        onClick={()=> router.push('/jobbank/settings/catalogs')}
                    >
                        {item.name}
                    </div>
                )
            })}
        </div>
    )
}

export default SettingsJobbank