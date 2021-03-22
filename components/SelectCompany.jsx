import React, { useEffect, useState } from 'react'
import { Selec } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";


export default function FooterCustom() {
    return (
        <>
            <Footer
                style={{
                    textAlign: "center",
                    zIndex: 1,
                    bottom: 0,
                    width: "100%",
                }}
            >
                Created by{" Human"}
                <DingtalkOutlined />
            </Footer>
        </>
    );
}
