import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Breadcrumb } from "antd";

export default function BreadcrumbHome() {

    const route = useRouter();

    return (
        <Breadcrumb.Item className="pointer" onClick={() => route.push('/home') }>Inicio</Breadcrumb.Item>
    );
}
