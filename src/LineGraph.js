import React,{useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';


const options = {
    legends: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio : false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            }
        }
    },
    scales: {
        xAxes: [
            {
                type:"item",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                }
            }
        ],
        yAxes: {
            gridLines: {
                display: false,
            },
            ticks: {
                callback: function(value,index,values){
                    return numeral(value).format("0a");
                },
            },
        }
    },
}

function LineGraph({casesType, ...props}) {
    const [data, setData] = useState([]);

    const buildChartData = (data) => {
        let chartData = [];
        let lastDataPoint;
        for(let date in data[casesType]){
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        console.log(chartData)
        return chartData;
    };

    useEffect(() => {
        const getData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                const Chartdata = buildChartData(data);
                setData(Chartdata);
            })
        }
        getData();
    },[casesType]);
    return (
        <div className={props.className}>
            <Line data={
                {
                    datasets: [{
                        label:"Covid Data",
                        backgroundColor: 'rgba(204,16,52,0.7)',
                        borderColor: '#CC1034',
                        fill: true,
                        data:data,
                        tension: 1,
                    }]
                }
            } options={options} />
        </div>
    )
}

export default LineGraph
