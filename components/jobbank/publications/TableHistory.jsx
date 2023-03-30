import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Tag } from 'antd';
import { redirectTo } from '../../../utils/constant';
import moment from 'moment';

const TableHistory = ({
    loading = false,
    infoHistory = []
}) => {

    const {
        list_connections_options,
        load_connections_options
    } = useSelector(state => state.jobBankStore);

    const getAccount = (item) =>{
        if(!item.code_post) return null;
        const find_ = record => record.code == item.code_post;
        let result = list_connections_options.find(find_);
        if(!result) return null;
        return result.name;
    }

    const columns = [
        {
            title: 'Cuenta',
            render: (item) =>{
                return(
                    <span>{getAccount(item)}</span>
                )
            }
        },
        {
            title: 'Fecha',
            render: (item) =>{
                let format = 'DD-MM-YYYY hh:mm a';
                return(
                    <span>{moment(item.timestamp).format(format)}</span>
                )
            }
        },
        {
            title: 'Estatus',
            render: (item) =>{
                return(
                    <Tag color={item.status_code == '200' ? '#87d068' : '#f50'}>
                        {item.status_code == '200' ? 'Exitoso' : 'Fallido'}
                    </Tag>
                )
            }
        },
        {
            title: 'Publicación',
            render: (item) =>{
                return item.post_url ? (
                    <a
                        style={{color: '#1890ff'}}
                        onClick={()=> redirectTo(item.post_url, true)}
                    >
                        Ir a publicación
                    </a>
                ) : <></>;
            }
        }
    ]

    return (
        <Table
            size='small'
            rowKey='id'
            columns={columns}
            loading={loading}
            dataSource={infoHistory}
            locale={{ emptyText: loading
                ? 'Cargando...'
                : 'No se encontraron resultados'
            }}
            pagination={{
                total: infoHistory?.length ?? 0,
                hideOnSinglePage: true,
                showSizeChanger: false,
            }}
        />
    )
}

export default TableHistory