import React, { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { Tag } from 'antd';

const ListCatalogData=({catalogs_store,catalog,items=null,attrName='name', ...props})=>{
    return (
        <>
            {
                (catalogs_store && catalogs_store[catalog]) &&
                catalogs_store[catalog].map((ele)=>{
                        if(items){
                            return items.includes(ele.id) ? <Tag>{ele[attrName]}</Tag> : null
                        }else{
                            return <Tag>{ele[attrName]}</Tag>
                        }

                })
            }
        </>

    )
}

const mapState = (state) => {
    return {
        catalogs_store: state.catalogStore,
    };
};

export default connect(mapState)(ListCatalogData);