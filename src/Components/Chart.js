import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function Chart() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(1); // Initialize with the default value
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async (cryptoName, days) => {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoName}/market_chart`, {
                    params: {
                        vs_currency: 'inr',
                        days: days,
                    },
                });

                setChartData(response.data.prices);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData(id, days);
    }, [id, days]);  // Include 'name' and 'days' as dependencies for useEffect

    const myData = {
        labels: chartData.map((value, index) => {
            const date = new Date(value[0]);
            const time = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
            if (days === 365 ) {
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            } else if (days === 30) {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            return time;
        }),
        datasets: [
            {
                label: 'Price',
                data: chartData.map((value) => value[1]),
                borderColor: 'rgba(50, 100, 250, 1)',
                backgroundColor: '#a1a7bb',
                fill: false,
                borderWidth: 1.5,
            },
        ],
    };

    return (
        <div style={{ border: '2px solid aqua', padding: '10px' }}>
            {
                loading ?
                    <div>
                        <h3 style={{ margin: "200px 380px", color: "#fff" }}>loading</h3>
                    </div> :
                    <div>
                        <div>
                            <Line data={myData} options={{
                                elements: {
                                    point: {
                                        radius: 1,
                                    }
                                },
                                scales: {
                                    x: {
                                        display: true,
                                        grid: {
                                            color: 'rgba(255, 255, 255, 0.1)', // White color for x-axis grid
                                        },
                                        ticks: {
                                            color: 'white', // White color for x-axis labels
                                        },
                                        title: {
                                            display: true,
                                            text: 'Time',
                                            color: '#a1a7bb', // White color for x-axis title
                                        },
                                        color: 'red', // Aqua color for x-axis line
                                        lineWidth: 2, // 2px width for x-axis line
                                    },
                                    y: {
                                        display: true,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.1)',
                                        },
                                        ticks: {
                                            color: 'white',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Price',
                                            color: '#a1a7bb', // Color for y-axis title
                                        },
                                        color: 'red', // Aqua color for y-axis line
                                        lineWidth: 2, // 2px width for y-axis line
                                    },
                                },
                            }} />

                            <div className='time_btn' >
                                <button onClick={() => setDays(1)}>24 hours</button>
                                <button onClick={() => setDays(30)}>1 Month</button>
                                <button onClick={() => setDays(365)}>1 Year</button>
                            </div>
                        </div>
                    </div>
            }

        </div>
    );
}
