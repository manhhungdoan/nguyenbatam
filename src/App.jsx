import {useEffect, useState} from 'react'
import './App.scss'
import {Button, Card, Col, Divider, Input, message, Pagination, Popconfirm, Row, Space, Table} from "antd";
import {actionDeleteUsers, actionGetListUsers} from "./action.js";
import ModalAddNewUsers from "./ModalAddNewUsers.jsx";
import {DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {ACTION_TYPE} from "./utils/const/const.js";

function App() {
    const [processing, setProcessing] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [isOpenModal, setOpenModal] = useState(false);
    const [user, setUser] = useState();
    const [actionType, setActionType] = useState();
    const [params, setParams] = useState({
        page: 0,
        pageSize: 10,
        keyword: ""
    });

    useEffect(() => {
        fetchListUsers();
    }, [params])

    const fetchListUsers = async () => {
        setProcessing(true);
        try {
            let res = await actionGetListUsers(params);
            if (+res?.status === 200) {
                let data = res?.data?.data || [];
                if (data?.length > 0) {
                    data?.forEach((item, index) => {
                        item.stt = (params.page * params.pageSize) + index + 1;
                    })
                }
                setDataSource(data);
                setTotalElements(res?.data?.page?.total_elements || 0);
            }
        } catch (e) {
            message.error(e?.data?.status?.message || "Lỗi hệ thống");
        }
        setProcessing(false);
    }

    const handleChangePage = (page, size) => {
        setParams({
            ...params,
            page: page - 1,
            pageSize: size
        })
    }

    const handleDelete = async (record) => {
        try {
            let res = await actionDeleteUsers(record?.customerId);
            if (+res?.status === 200) {
                message.success("Xoá thành công");
                fetchListUsers();
            }
        } catch (e) {
            message.error(e?.data?.status?.message || "Lỗi hệ thống");
        }
    }

    const handleAddOrViewOrUpdate = (record, action) => {
        setActionType(action);
        setUser(record);
        setOpenModal(true);
    }
    const columns = [
        {
            title: "#",
            key: "stt",
            dataIndex: "stt",
            width: 80,
            align: 'center'
        },
        // {
        //     title: "Mã người dùng",
        //     key: "customerId",
        //     dataIndex: "customerId",
        // },
        {
            title: "Tên",
            key: "name",
            dataIndex: "name",
            width: 200
        },
        {
            title: "Số điện thoại",
            key: "phone",
            dataIndex: "phone",
            width: 180,
        },
        {
            title: "Email",
            key: "email",
            dataIndex: "email",
            width: 240
        },
        {
            title: "Mật khẩu",
            key: "password",
            dataIndex: "password",
            width: 100,
        },
        {
            title: "Ngày sinh",
            key: "dob",
            dataIndex: "dob",
            width: 120,
            render: (_, record) => dayjs.unix(record.dob).format("DD/MM/YYYY")
        },
        {
            title: "Địa chỉ",
            key: "address",
            dataIndex: "address",
            width: 200,
        },
        {
            title: "Hành động",
            key: "action",
            dataIndex: "action",
            fixed: 'right',
            align: 'center',
            width: 220,
            render: (_, record) => (
                <Space split={<Divider type='vertical'/>}>
                    <Button
                        type={'link'}
                        icon={<EyeOutlined/>}
                        onClick={() => handleAddOrViewOrUpdate(record, ACTION_TYPE.VIEW)}
                    ></Button>
                    <Button
                        onClick={() => handleAddOrViewOrUpdate(record, ACTION_TYPE.UPDATE)}
                        type={'link'}
                        icon={<EditOutlined/>}
                    ></Button>
                    <Popconfirm
                        placement='topRight'
                        title="Chắc chắn xoá"
                        okText="Đồng ý"
                        cancelText="Huỷ bỏ"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button
                            danger
                            type={'link'}
                            icon={<DeleteOutlined/>}
                        ></Button>
                    </Popconfirm>
                </Space>
            )
        },
    ]

    return (
        <div className="container">
            <Row className='content'>
                <Col span={24} className='lb-header'>
                    Danh sách người dùng
                </Col>
                <Col span={24} className='lb-action mt-12'>
                    <Input.Search
                        allowClear
                        placeholder="Tìm kiếm"
                        style={{width: '200px'}}
                        onSearch={(e) => setParams({...params, keyword: e})}
                        bordered={true}
                        loading={processing}
                    />
                    <Button
                        type='primary'
                        onClick={() => handleAddOrViewOrUpdate(null, ACTION_TYPE.ADD)}
                    >
                        Thêm người dùng
                    </Button>
                </Col>
                <Col span={24} className='mt-8'>
                    <Table
                        bordered={true}
                        columns={columns}
                        scroll={{
                            x: 1200
                        }}
                        dataSource={dataSource}
                        rowKey={(e) => e.customerId}
                        loading={processing}
                        pagination={false}
                    />
                    {
                        totalElements > 0 &&
                        <Pagination
                            className='mt-8 text-center'
                            total={totalElements}
                            current={params.page + 1}
                            pageSize={params.pageSize}
                            showSizeChanger={true}
                            size='small'
                            onChange={handleChangePage}
                        />
                    }
                </Col>
            </Row>
            {
                isOpenModal &&
                <ModalAddNewUsers
                    onCancel={() => setOpenModal(false)}
                    onSuccess={() => {
                        setOpenModal(false)
                        fetchListUsers();
                    }}
                    user={user}
                    actionType={actionType}
                />
            }
        </div>
    )
}

export default App
