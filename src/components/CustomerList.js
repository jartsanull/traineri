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



export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomer, setFilteredCustomer] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers')
            .then(response => response.json())
            .then(data => {
                setCustomers(data._embedded.customers);
                setFilteredCustomer(data._embedded.customers);
            });
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filterus = customers.filter((customer) =>
            Object.values(customer)
                .join(" ")
                .toLowerCase()
                .includes(value)
        );
        setFilteredCustomer(filterus);
    };

    const deleteCustomer = (link) => {
        fetch(link, { method: 'DELETE' })
            .then(() => fetchData())
            .catch(err => console.error(err));
    };

    const columns = [
        { field: 'firstname', headerName: 'First Name', sortable: true, filter: true },
        { field: 'lastname', headerName: 'Last Name', sortable: true, filter: true },
        { field: 'streetaddress', headerName: 'Street Address', sortable: true, filter: true },
        { field: 'postcode', headerName: 'Postcode', sortable: true, filter: true },
        { field: 'city', headerName: 'City', sortable: true, filter: true },
        { field: 'email', headerName: 'Email', sortable: true, filter: true },
        { field: 'phone', headerName: 'Phone', sortable: true, filter: true },
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
                    onClick={() => deleteCustomer(params.data._links.self.href)}
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
                    rowData={filteredCustomer}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>
        </div>
    );
}