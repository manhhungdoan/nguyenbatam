import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';
import {ConfigProvider} from "antd";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider locale={locale}>
            <App/>
        </ConfigProvider>
    </React.StrictMode>,
)
