import React, { useState, useEffect } from 'react';
import "./orderRooms.css";
import {
    Col, Row, Typography, Spin, Button, PageHeader, Card, Badge, Empty, Input, Space,
    Form, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select, Table
} from 'antd';
import {
    AppstoreAddOutlined, QrcodeOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
    CalendarOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, ShoppingCartOutlined, FormOutlined, TagOutlined, EditOutlined
} from '@ant-design/icons';
import eventApi from "../../apis/eventApi";
import orderApi from "../../apis/orderApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../utils/dateTime";
import ProductList from '../ProductList/productList';
import axiosClient from '../../apis/axiosClient';
import axios from "axios";

const { Option } = Select;
const { confirm } = Modal;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";
const { Title } = Typography;

const OrderRooms = () => {

    const [order, setOrder] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [total, setTotalList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();
    const [userData, setUser] = useState([]);

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const titleCase = (str) => {
        var splitStr = str?.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": values.description,
                "slug": values.slug
            }
            await axiosClient.post("/category", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateOrder = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            const bookRooms = {
                "status": values.status
            }
            await axiosClient.put("/rooms/book/" + id, bookRooms).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thành công',
                    });
                    setOpenModalUpdate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }

        if(values.status == "approved")
         {
            try {
                const response = await orderApi.getDetailsBookingRoom(id);
                console.log(response);
                const alo = await axios.post('http://localhost:8801/api/booking-rooms/book', response);
            } catch (error) {
                throw error;
            }
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {
            const user = await localStorage.getItem("user");
            console.log(user); // check if the value is null or undefined
            const userParse = JSON.parse(user);
            setUser(userParse);
            if(userParse.role === "isCompany"){
                await orderApi.getListBookRoomsByCompany().then((res) => {
                    console.log(res);
                    setTotalList(res)
                    setOrder(res);
                    setLoading(false);
                });
            }else{
                await orderApi.getListBookRooms().then((res) => {
                    console.log(res);
                    setTotalList(res)
                    setOrder(res);
                    setLoading(false);
                });
            }
            
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await orderApi.deleteOrder(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa danh mục thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa danh mục thành công',

                    });
                    setCurrentPage(1);
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleDetailView = (id) => {
        history.push("/category-detail/" + id)
    }

    const handleEditOrder = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await orderApi.getDetailsBookingRoom(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    status: response.status,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await orderApi.searchOrder(name);
            setTotalList(res.totalDocs)
            setOrder(res.data.docs);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    function NoData() {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{titleCase(text.username)}</a>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text.phone}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text.email}</a>,
        },
        {
            title: 'Tên phòng',
            dataIndex: 'room',
            key: 'room',
            render: (text) => <a>{text?.title}</a>,
        },
        {
            title: 'Ngày nhận phòng',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (text) => <a>{new Date(text).toLocaleDateString()}</a>,
        },
        {
            title: 'Ngày trả phòng',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (text) => <a>{new Date(text).toLocaleDateString()}</a>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: 'billing',
            key: 'billing',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (slugs) => (
                <span >
                    {slugs === "rejected" ? <Tag style={{ width: 90, textAlign: "center" }} color="red">Đã hủy</Tag> : slugs === "approved" ? <Tag style={{ width: 90, textAlign: "center" }} color="green" key={slugs}>
                        Đã xác nhận
                    </Tag> : slugs === "final" ? <Tag color="green" style={{ width: 90, textAlign: "center" }}>Đã trả phòng</Tag> : <Tag color="blue" style={{ width: 90, textAlign: "center" }}>Đợi xác nhận</Tag>}
                </span>
            ),
        },
    ];

    const columns2 = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{titleCase(text.username)}</a>,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text?.phone}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text?.email}</a>,
        },
        {
            title: 'Tên phòng',
            dataIndex: 'room',
            key: 'room',
            render: (text) => <a>{text?.title}</a>,
        },
        {
            title: 'Ngày nhận phòng',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (text) => <a>{new Date(text).toLocaleDateString()}</a>,
        },
        {
            title: 'Ngày trả phòng',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (text) => <a>{new Date(text).toLocaleDateString()}</a>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: 'billing',
            key: 'billing',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (slugs) => (
                <span >
                    {slugs === "rejected" ? <Tag style={{ width: 90, textAlign: "center" }} color="red">Đã hủy</Tag> : slugs === "approved" ? <Tag style={{ width: 90, textAlign: "center" }} color="green" key={slugs}>
                       Đã xác nhận
                    </Tag> : slugs === "final" ? <Tag color="green" style={{ width: 90, textAlign: "center" }}>Đã trả phòng</Tag> : <Tag color="blue" style={{ width: 90, textAlign: "center" }}>Đợi xác nhận</Tag>}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditOrder(record._id)}
                        >{"Chỉnh sửa"}
                        </Button>
                    </Row>
                </div >
            ),
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                const user = await localStorage.getItem("user");
                console.log(user); // check if the value is null or undefined
                const userParse = JSON.parse(user);
                setUser(userParse);
                if(userParse.role === "isCompany"){
                    await orderApi.getListBookRoomsByCompany().then((res) => {
                        console.log(res);
                        setTotalList(res)
                        setOrder(res);
                        setLoading(false);
                    });
                }else{
                    await orderApi.getListBookRooms().then((res) => {
                        console.log(res);
                        setTotalList(res)
                        setOrder(res);
                        setLoading(false);
                    });
                }
                
                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingCartOutlined />
                                <span>Quản lý đặt phòng</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    {
                        userData.role === "isCompany" ?

                            <div style={{ marginTop: 30 }}>
                                <Table columns={columns2} pagination={{ position: ['bottomCenter'] }} dataSource={order} scroll={{ x: 1500 }} />
                            </div>
                            :
                            <div style={{ marginTop: 30 }}>
                                <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={order} scroll={{ x: 1500 }} />
                            </div>
                    }
                </div>

                <Modal
                    title="Tạo danh mục mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your subject!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>

                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your content!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Slug" />
                        </Form.Item>

                    </Form>
                </Modal>

                <Modal
                    title="Cập nhật trạng thái"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateOrder(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select >
                                <Option value="pending">Đợi xác nhận</Option>
                                <Option value="approved">Đã xác nhận</Option>
                                <Option value="rejected">Đã hủy</Option>
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>
            </Spin>
        </div >
    )
}

export default OrderRooms;