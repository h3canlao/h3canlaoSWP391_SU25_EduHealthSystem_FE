import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';


ReactDOM.createRoot(document.getElementById('root')).render(
        <BrowserRouter >   
            <Layout />
        </BrowserRouter>
);
