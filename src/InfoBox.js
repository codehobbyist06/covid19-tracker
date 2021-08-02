import React from 'react';
import {Card, CardContent, Typography} from '@material-ui/core';
import './InfoBox.css';

function InfoBox({title, cases, total, active, isRed, ...props}) {
    // console.log(active);
    return (
        <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--isRed"}`}
            onClick={props.onClick}
        >
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                {/* Number of cases */}
                <h2 className={`infoBox__cases && ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/* Total */}
                <Typography color="textSecondary" className="infoBox__total">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
