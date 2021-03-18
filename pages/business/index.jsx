import Head from "next/head";
import React, { useEffect } from "react";
import BusinessForm from "../../components/business/BusinessForm";
import { withAuthSync } from "../../libs/auth";

const Home = () => {
    return (
        <>
            <BusinessForm />
        </>
    );
};

export default withAuthSync(Home);
