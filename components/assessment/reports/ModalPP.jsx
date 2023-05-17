import React, { useMemo } from 'react';
import MyModal from '../../../common/MyModal';

const ModalPP = ({
    onClose = () =>{},
    visible = false,
    record = {}
}) => {

    const getCompatibility = ({compatibility}) => {
        if(typeof compatibility == 'string') return compatibility;
        return `${compatibility?.toFixed(2)}%`;
    }

    const list = useMemo(()=>{
        let item = record?.profiles?.at(-1)?.competences;
        if(item?.length <= 0 || !item) return [];
        const map_ = row => ({...row, compatibility: getCompatibility(row)});
        return item?.map(map_)?.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })
    },[record])

    const title = useMemo(()=>{
        if(Object.keys(record).length <= 0) return null;
        let name = record?.persons?.fullName;
        let profile = record?.profiles?.at(-1);
        let comp = getCompatibility(profile);
        return `${name} (${profile.name} - ${comp})`
    },[record])

    return (
        <MyModal
            mask={false}
            widthModal={800}
            visible={visible}
            close={onClose}
            title={title}
        >
            <div className='competence_list scroll-bar'>
                {list?.length > 0 && list?.map((item, idx) => (
                    <div key={idx} className='competence_content'>
                        <div className='competence_title'>
                            <p>{idx+1}.- {item.name}</p>
                            <p>{item.compatibility}</p>
                        </div>
                        <div className='competence_level'>
                            <div className='competence_level_type'>
                                Nivel persona ({item?.level_person})
                            </div>
                            <div className='competence_level_type'>
                                Nivel perfil ({item?.level_profile})
                            </div>
                        </div>
                        <div className='competence_level'>
                            <div className='competence_level_type'>
                                <p>{item?.description_person}</p>
                            </div>
                            <div className='competence_level_type'>
                                <p>{item?.description_profile}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </MyModal>
    )
}

export default ModalPP