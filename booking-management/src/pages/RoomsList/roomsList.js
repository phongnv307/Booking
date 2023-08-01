import React, { useState, useEffect } from 'react';
import "./roomsList.css";
import {
    Col, Row, Typography, Spin, Button, PageHeader, Card, Drawer, Empty, Input, Space,
    Form, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select, Table
} from 'antd';
import {
    AppstoreAddOutlined, QrcodeOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
    CalendarOutlined, UserOutlined, TeamOutlined, HomeOutlined, HistoryOutlined, FormOutlined, TagOutlined, EditOutlined
} from '@ant-design/icons';
import QRCode from 'qrcode.react';
import eventApi from "../../apis/eventApi";
import productApi from "../../apis/productsApi";
import { useHistory } from 'react-router-dom';
import { DateTime } from "../../utils/dateTime";
import axiosClient from '../../apis/axiosClient';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditor from 'suneditor-react';

const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const RoomList = () => {
    const [product, setProduct] = useState([]);
    const [category, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [image, setImage] = useState();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [totalEvent, setTotalEvent] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [description, setDescription] = useState();
    const [total, setTotalList] = useState(false);
    const [id, setId] = useState();
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState([]);

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const roomData = {
                title: values.title,
                price: values.price,
                maxPeople: values.maxPeople,
                desc: values.desc,
                typeRooms: values.typeRooms,
                roomQuantity: values.roomQuantity
            };
            return axiosClient.post("/rooms", roomData).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo phòng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo phòng thành công',
                    });
                    setOpenModalCreate(false);
                    handleProductList();
                }
            })

            setLoading(false);
        } catch (error) {
            throw error;
        }
    }

    const handleUpdateProduct = async (values) => {
        setLoading(true);
        try {
            const roomsList = {
                title: values.title,
                price: values.price,
                maxPeople: values.maxPeople,
                desc: values.desc,
                typeRooms: values.typeRooms,
                roomQuantity: values.roomQuantity
            }
            return axiosClient.put("/rooms/" + id, roomsList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa phòng thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa phòng thành công',
                    });
                    setOpenModalUpdate(false);
                    handleProductList();
                    setLoading(false);
                }
            })
        } catch (error) {
            throw error;
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

    const handleProductList = async () => {
        try {
            const user = localStorage.getItem("user");
            console.log(user); // check if the value is null or undefined
            const userParse = JSON.parse(user);
            setUser(userParse);
            if (userParse.role === "isCompany") {
                await productApi.getListRoomsByCompany().then((res) => {
                    console.log(res);
                    setProduct(res);
                    setLoading(false);
                });
            } else {
                await productApi.getListRooms().then((res) => {
                    console.log(res);
                    setProduct(res);
                    setLoading(false);
                });
            }

            await productApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                console.log(res);
                setCategoryList(res.data.docs);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    };

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await productApi.deleteRooms(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa phòng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa phòng thành công',

                    });
                    setCurrentPage(1);
                    handleProductList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleDetailView = (id) => {
        history.push("/product-detail/" + id)
    }

    const handleChangeImage = (event) => {
        setImage(event.target.files[0]);
    }

    const handleProductEdit = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await productApi.getDetailRooms(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    title: response.title,
                    price: response.price,
                    maxPeople: response.maxPeople,
                    desc: response.desc,
                    typeRooms: response.typeRooms
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
            const user = localStorage.getItem("user");
            console.log(user); // check if the value is null or undefined
            const userParse = JSON.parse(user);
            if (userParse.role === "isCompany") {
                const res = await productApi.searchRooms(name);
                setTotalList(res)
                setProduct(res);
            } else {
                const res = await productApi.searchRoomsByAdmin(name);
                setTotalList(res)
                setProduct(res);
            }
        } catch (error) {
            console.log('search to fetch tours list:' + error);
        }
    }

    const handleApprovalRooms = async (id, visible) => {
        setLoading(true);
        try {
            await productApi.approvalRooms(id, visible).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật phòng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật phòng thành công',

                    });
                    setCurrentPage(1);
                    handleProductList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên phòng',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Số người ở tối đa',
            dataIndex: 'maxPeople',
            key: 'maxPeople',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Giá gốc',
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: 'Mô tả',
            key: 'desc',
            dataIndex: 'desc',
            render: (desc) => <div>{desc}</div>,
        },
        {
            title: 'Loại phòng',
            key: 'typeRooms',
            dataIndex: 'typeRooms',
            render: (desc) => <div>{desc}</div>,
        },
        {
            title: 'Số lượng phòng',
            key: 'roomQuantity',
            dataIndex: 'roomQuantity',
            render: (desc) => <div>{desc}</div>,
        },
        {
            title: 'Phê duyệt',
            dataIndex: 'visible',
            key: 'visible',
            render: (res) => (
                <span>
                    {res ? <Tag color="blue">Có</Tag> : <Tag color="magenta">Không</Tag>}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div className='groupButton'>
                            <div>
                                <div
                                    style={{ marginTop: 5 }}>
                                    <Popconfirm
                                        title="Bạn có chắc chắn phê duyệt phòng này?"
                                        onConfirm={() => handleApprovalRooms(record._id, true)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            size="small"
                                            icon={<AppstoreAddOutlined />}
                                            style={{ width: 160, borderRadius: 15, height: 30 }}
                                        >{"Phê duyệt"}
                                        </Button>
                                    </Popconfirm>
                                </div>
                                <div
                                    style={{ marginTop: 5 }}>
                                    <Popconfirm
                                        title="Bạn có chắc chắn không phê duyệt phòng này?"
                                        onConfirm={() => handleApprovalRooms(record._id, false)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            style={{ width: 160, borderRadius: 15, height: 30 }}
                                        >{"Không phê duyệt"}
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </div>
                    </Row>
                </div >
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
            title: 'Tên phòng',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Số người ở tối đa',
            dataIndex: 'maxPeople',
            key: 'maxPeople',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Giá gốc',
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: 'Mô tả',
            key: 'desc',
            dataIndex: 'desc',
            render: (desc) => <div>{desc}</div>,
        },
        {
            title: 'Loại phòng',
            key: 'typeRooms',
            dataIndex: 'typeRooms',
            render: (desc) => <div>{desc}</div>,
        },
        {
            title: 'Số lượng phòng',
            key: 'roomQuantity',
            dataIndex: 'roomQuantity',
            render: (desc) => <div>{desc}</div>,
        },
        {
            title: 'Phê duyệt',
            dataIndex: 'visible',
            key: 'visible',
            render: (res) => (
                <span>
                    {res ? <Tag color="blue">Có</Tag> : <Tag color="magenta">Không</Tag>}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div className='groupButton'>
                            <Button
                                size="small"
                                icon={<EyeOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                            >{"Xem chi tiết"}
                            </Button>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30, marginTop: 5 }}
                                onClick={() => handleProductEdit(record._id)}
                            >{"Chỉnh sửa"}
                            </Button>
                            <div
                                style={{ marginTop: 5 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa sản phẩm này?"
                                    onConfirm={() => handleDeleteCategory(record._id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                    >{"Xóa"}
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </Row>
                </div >
            ),
        },
    ];


    const handleOpen = () => {
        setVisible(true);
    };

    const handleClose = () => {
        form.resetFields();
        setVisible(false);
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            form.resetFields();
            handleOkUser(values);
            setVisible(false);
        });
    };


    useEffect(() => {
        (async () => {
            try {
                const user = localStorage.getItem("user");
                console.log(user); // check if the value is null or undefined
                const userParse = JSON.parse(user);
                setUser(userParse);
                if (userParse.role === "isCompany") {
                    await productApi.getRoomsByAllCompany().then((res) => {
                        console.log(res);
                        setProduct(res);
                        setLoading(false);
                    });
                } else {
                    await productApi.getListRooms().then((res) => {
                        console.log(res);
                        setProduct(res);
                        setLoading(false);
                    });
                }

                await productApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setCategoryList(res.data.docs);
                    setLoading(false);
                });
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
                                <FormOutlined />
                                <span>Danh sách phòng</span>
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
                                                <>
                                                    {user.role === "isCompany" ?
                                                        <Button onClick={handleOpen} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo phòng</Button>
                                                        : ""}
                                                </>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>
                    <>
                        {
                            user.role === "isCompany" ? <div style={{ marginTop: 30 }}>
                                <Table columns={columns2} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                            </div> : <div style={{ marginTop: 30 }}>
                                <Table columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                            </div>
                        }
                    </>
                </div>

                <Drawer
                    title="Tạo phòng mới"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    width={1000}
                    footer={
                        <div style={{ textAlign: 'right' }}>
                            <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit} type="primary">
                                Hoàn thành
                            </Button>
                        </div>
                    }
                >
                    <Form form={form} layout="vertical" initialValues={{}} scrollToFirstError>
                        <Form.Item
                            name="title"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá!',
                                },
                            ]}
                        >
                            <Input placeholder="Giá" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="maxPeople"
                            label="Số người tối đa"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số người tối đa!',
                                },
                            ]}
                        >
                            <Input placeholder="Số người tối đa" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="desc"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Mô tả" rows={4} />
                        </Form.Item>

                        <Form.Item
                            name="roomQuantity"
                            label="Số lượng phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng phòng!',
                                },
                            ]}
                        >
                            <Input placeholder="Số lượng phòng" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="typeRooms"
                            label="Loại phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại phòng!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại phòng">
                                <Option value="single">Phòng đơn</Option>
                                <Option value="double">Phòng đôi</Option>
                                <Option value="suite">Suite</Option>
                                <Option value="twin">Phòng đôi (2 giường đơn)</Option>
                                <Option value="deluxe">Phòng cao cấp</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Drawer>



                <Drawer
                    title="Chỉnh sửa phòng"
                    visible={openModalUpdate}
                    onClose={() => handleCancel("update")}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => {
                                form2
                                    .validateFields()
                                    .then((values) => {
                                        form2.resetFields();
                                        handleUpdateProduct(values);
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }} type="primary" style={{ marginRight: 8 }}>
                                Hoàn thành
                            </Button>
                            <Button onClick={() => handleCancel("update")}>
                                Hủy
                            </Button>
                        </div>
                    }
                >
                    <Form form={form2} layout="vertical" scrollToFirstError>
                        <Form.Item
                            name="title"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá!',
                                },
                            ]}
                        >
                            <Input placeholder="Giá" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="maxPeople"
                            label="Số người tối đa"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số người tối đa!',
                                },
                            ]}
                        >
                            <Input placeholder="Số người tối đa" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="roomQuantity"
                            label="Số lượng phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng phòng!',
                                },
                            ]}
                        >
                            <Input placeholder="Số lượng phòng" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="desc"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                        >
                            <Input.TextArea placeholder="Mô tả" rows={4} />
                        </Form.Item>

                        <Form.Item
                            name="typeRooms"
                            label="Loại phòng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại phòng!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại phòng">
                                <Option value="single">Phòng đơn</Option>
                                <Option value="double">Phòng đôi</Option>
                                <Option value="suite">Suite</Option>
                                <Option value="twin">Phòng đôi (2 giường đơn)</Option>
                                <Option value="deluxe">Phòng cao cấp</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Drawer>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default RoomList;