import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import CustomerList from './CustomerList';


export default function TrainingList() {
    const [train, setTrain] = useState([]);
    const [filteredTrain, setFilteredTrain] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings')
            .then(response => response.json())
            .then(data => {
                const trainingsWithCusts = data._embedded.trainings.map(async (training) => {
                    const customerResponse = await fetch(training._links.customer.href);
                    const customerData = await customerResponse.json();
                    return { ...training, customer: customerData };
            });

            Promise.all(trainingsWithCusts)
            .then((trainings) => {
                setTrain(trainings);
                setFilteredTrain(trainings);
            })
            .catch((error) => {
                console.error("Error fetching customer data:", error);
            });
    });
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtteri = train.filter((train) =>
            Object.values(train)
                .join(" ")
                .toLowerCase()
                .includes(value)
        );
        setFilteredTrain(filtteri);
    };

    const deleteTrain = (link) => {
        fetch(link, { method: 'DELETE' })
            .then(() => fetchData())
            .catch(err => console.error(err));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const columns = [
        { field: 'activity', headerName: 'Activity', sortable: true, filter: true },
        {
            field: 'date',
            headerName: 'Date',
            sortable: true,
            filter: true,
            valueGetter: (params) => formatDate(params.data.date),
        },
        { field: 'duration', headerName: 'Duration', sortable: true, filter: true },
        {
            headerName: 'Customer',
            valueGetter: (params) => {
                const customer = params.data.customer; 
                return `${customer.firstname} ${customer.lastname}`;
            },
            sortable: true,
            filter: true,
        },
        {
            headerName: 'Actions',
            cellRenderer: (params) => (
                <button
                    style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => deleteTrain(params.data._links.self.href)}
                >
                    Delete
                </button>
            ),
        },
    ];

    return (
        <div>
            <input
                type="text"
                placeholder="Search..."
                style={{
                    marginLeft: '1250px',
                    padding: '5px',
                    fontSize: '14px',
                    width: '15%',
                    display: 'block',
                    margin: '0 auto',
                    marginBottom: '10px',
                    marginTop: '10px'
                }}
                value={search}
                onChange={handleSearch}
            />
            <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
                <AgGridReact
                    rowData={filteredTrain}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
        </div>
    );
}