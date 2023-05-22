import React from "react";
import { withAuthSync } from "../../../../../libs/auth";
import AddOrEditRequets from "../../../../../components/comunication/requets/AddOrEditRequets";

const HolidaysNew = () => {
    return (
        <AddOrEditRequets action="add" />
    )
}

export default withAuthSync(HolidaysNew)
