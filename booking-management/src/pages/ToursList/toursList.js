import React, { useState, useEffect } from 'react';
import "./toursList.css";
import {
    Col, Row, Typography, Spin, Button, PageHeader, Card, Drawer, message, Input, Space,
    Form, Upload, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select, Table
} from 'antd';
import {
    AppstoreAddOutlined, UploadOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
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

const ProductList = () => {
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
    const [images, setImages] = useState([]);
    const [tours, setTours] = useState("");

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const tourData = {
                title: values.title,
                photos: [values.photos],
                price: values.price,
                address: values.address,
                rating: values.rating,
                desc: values.desc,
                text: values.text,
                schedule: values.schedule,
                hightlight: values.hightlight,
                trip: values.trip,
                time: values.time,
                departure: values.departure,
                destination: values.destination,
                vehicles: values.vehicles,
                photos: images
            };
            return axiosClient.post("/tours", tourData).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo tours thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo tours thành công',
                    });
                    setImages([]);
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
            const tourData = {
                title: values.title,
                photos: [values.photos],
                price: values.price,
                address: values.address,
                rating: values.rating,
                desc: values.desc,
                text: values.text,
                schedule: values.schedule,
                hightlight: values.hightlight,
                trip: values.trip,
                time: values.time,
                departure: values.departure,
                destination: values.destination,
                vehicles: values.vehicles,
                photos: images // Sử dụng state 'images' chứa các URL hình ảnh
            };

            // Gọi API cập nhật tour với dữ liệu mới
            return axiosClient.put(`/tours/` + id, tourData).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: 'Thông báo',
                        description: 'Cập nhật tour thất bại',
                    });
                } else {
                    notification["success"]({
                        message: 'Thông báo',
                        description: 'Cập nhật tour thành công',
                    });
                    setImages([]); // Xóa danh sách hình ảnh sau khi cập nhật thành công
                    setOpenModalUpdate(false);
                    handleProductList(); // Cập nhật lại danh sách tour sau khi cập nhật thành công
                }
            });
            setLoading(false);
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
                await productApi.getToursListByCompany().then((res) => {
                    console.log(res);
                    setProduct(res);
                    setLoading(false);
                });
            } else {
                await productApi.getToursList().then((res) => {
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
            await productApi.deleteTours(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tours thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa tours thành công',

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
                const response = await productApi.getDetailTour(id);
                console.log(response);
                setId(id);
                setTours(response);
                form2.setFieldsValue({
                    title: response.title,
                    price: response.price,
                    address: response.address,
                    desc: response.desc,
                    text: response.text,
                    schedule: response.schedule,
                    hightlight: response.hightlight,
                    trip: response.trip,
                    time: response.time,
                    departure: response.departure,
                    destination: response.destination,
                    vehicles: response.vehicles,
                    images: response.images
                });
                console.log(form2);
                setDescription(response.description);
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
                const res = await productApi.searchTour(name);
                setTotalList(res)
                setProduct(res);
            } else {
                const res = await productApi.searchTourByAdmin(name);
                setTotalList(res)
                setProduct(res);
            }
        } catch (error) {
            console.log('search to fetch tours list:' + error);
        }
    }

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
    }

    const handleApprovalTour = async (id, visible) => {
        setLoading(true);
        try {
            await productApi.approvalTours(id, visible).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật tour thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật tour thành công',

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
            title: 'Số ảnh',
            dataIndex: 'photos',
            key: 'photos',
            render: (image) => <div>{image.length}</div>,
            width: '10%'
        },
        {
            title: 'Tên tour',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Điểm đi',
            key: 'departure',
            dataIndex: 'departure',
            render: (departure) => <div>{departure}</div>,
        },
        {
            title: 'Điểm đến',
            key: 'destination',
            dataIndex: 'destination',
            render: (destination) => <div>{destination}</div>,
        },
        {
            title: 'Giá gốc',
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: 'Thành phố',
            dataIndex: 'destination',
            key: 'destination',
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (res) => (
                <span>
                    {res ? <Tag color="blue">{res}</Tag> : <Tag color="blue">Chưa có đánh giá</Tag>}
                </span>
            ),
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

    const columns2 = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Số ảnh',
            dataIndex: 'photos',
            key: 'photos',
            render: (image) => <div>{image.length}</div>,
            width: '10%'
        },
        {
            title: 'Tên tour',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Điểm đi',
            key: 'trip',
            dataIndex: 'trip',
            render: (rooms) => <div>{rooms[0]}</div>,
        },
        {
            title: 'Điểm đến',
            key: 'trip',
            dataIndex: 'trip',
            render: (rooms) => <div>{rooms[1]}</div>,
        },
        {
            title: 'Giá gốc',
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: 'Thành phố',
            dataIndex: 'destination',
            key: 'destination',
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
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
                                        title="Bạn có chắc chắn phê duyệt tour này?"
                                        onConfirm={() => handleApprovalTour(record._id, true)}
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
                                        title="Bạn có chắc chắn không phê duyệt tour này?"
                                        onConfirm={() => handleApprovalTour(record._id, false)}
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

    const handleImageUpload = async (info) => {
        const image = info.file;
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axiosClient.post('/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                const imageUrl = response.image_url;
                console.log(imageUrl);
                // Lưu trữ URL hình ảnh trong trạng thái của thành phần
                setImages(prevImages => [...prevImages, imageUrl]);

                console.log(images);
                message.success(`${info.file.name} đã được tải lên thành công!`);
            });
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        (async () => {
            try {
                const user = localStorage.getItem("user");
                console.log(user); // check if the value is null or undefined
                const userParse = JSON.parse(user);
                setUser(userParse);
                if (userParse.role === "isCompany") {
                    await productApi.getToursListByCompany().then((res) => {
                        console.log(res);
                        setProduct(res);
                        setLoading(false);
                    });
                } else {
                    await productApi.getToursList().then((res) => {
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
                                <span>Danh sách tour</span>
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
                                            {user.role === "isCompany" ?
                                                <Button onClick={handleOpen} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo Tour</Button>
                                                : ""}
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
                                <Table columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                            </div> : <div style={{ marginTop: 30 }}>
                                <Table columns={columns2} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                            </div>
                        }
                    </>

                </div>

                <Drawer
                    title="Tạo tour mới"
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
                            name="title"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
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
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa chỉ" />
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
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>

                        <Form.Item
                            name="text"
                            label="Nội dung"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nội dung!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Nội dung" />
                        </Form.Item>

                        <Form.Item
                            name="schedule"
                            label="Lịch trình"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lịch trình!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Form.List name="schedule">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                key={field.key}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    noStyle
                                                >
                                                    <Input placeholder="Lịch trình" />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="danger"
                                                        onClick={() => remove(field.name)}
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </Form.Item>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                        >
                                            Thêm lịch trình
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>

                        <Form.Item
                            name="hightlight"
                            label="Điểm nổi bật"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập điểm nổi bật!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Form.List name="hightlight">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                key={field.key}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    noStyle
                                                >
                                                    <Input placeholder="Điểm nổi bật" />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="danger"
                                                        onClick={() => remove(field.name)}
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </Form.Item>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                        >
                                            Thêm điểm nổi bật
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>

                        <Form.Item
                            name="trip"
                            label="Hành trình"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập hành trình!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Form.List name="trip">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                key={field.key}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    noStyle
                                                >
                                                    <Input placeholder="Hành trình" />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="danger"
                                                        onClick={() => remove(field.name)}
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </Form.Item>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                        >
                                            Thêm hành trình
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>

                        <Form.Item
                            name="time"
                            label="Thời gian"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thời gian!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Thời gian" />
                        </Form.Item>

                        <Form.Item
                            name="departure"
                            label="Nơi khởi hành"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nơi khởi hành!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nơi khởi hành" />
                        </Form.Item>

                        <Form.Item
                            name="destination"
                            label="Điểm đến"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập điểm đến!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Điểm đến" />
                        </Form.Item>

                        <Form.Item
                            name="vehicles"
                            label="Phương tiện"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập phương tiện!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Phương tiện" />
                        </Form.Item>

                        <Form.Item
                            name="images"
                            label="Hình ảnh"
                            style={{ marginBottom: 10 }}
                        >
                            <Upload
                                name="images"
                                listType="picture-card"
                                showUploadList={true}
                                beforeUpload={() => false}
                                onChange={handleImageUpload}
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>Tải lên</Button>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Drawer>



                <Drawer
                    title="Chỉnh sửa tour"
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
                            name="title"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
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
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa chỉ" />
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
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>

                        <Form.Item
                            name="text"
                            label="Nội dung"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nội dung!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea placeholder="Nội dung" />
                        </Form.Item>

                        <Form.Item
                            name="schedule"
                            label="Lịch trình"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lịch trình!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Form.List name="schedule">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                key={field.key}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    noStyle
                                                >
                                                    <Input placeholder="Lịch trình" />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="danger"
                                                        onClick={() => remove(field.name)}
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </Form.Item>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                        >
                                            Thêm lịch trình
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>

                        <Form.Item
                            name="hightlight"
                            label="Điểm nổi bật"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập điểm nổi bật!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Form.List name="hightlight">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                key={field.key}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    noStyle
                                                >
                                                    <Input placeholder="Điểm nổi bật" />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="danger"
                                                        onClick={() => remove(field.name)}
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </Form.Item>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                        >
                                            Thêm điểm nổi bật
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>

                        <Form.Item
                            name="trip"
                            label="Hành trình"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập hành trình!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Form.List name="trip">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item
                                                key={field.key}
                                                style={{ marginBottom: 10 }}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    noStyle
                                                >
                                                    <Input placeholder="Hành trình" />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="danger"
                                                        onClick={() => remove(field.name)}
                                                        style={{ marginTop: 8 }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </Form.Item>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                        >
                                            Thêm hành trình
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>

                        <Form.Item
                            name="time"
                            label="Thời gian"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thời gian!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Thời gian" />
                        </Form.Item>

                        <Form.Item
                            name="departure"
                            label="Nơi khởi hành"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nơi khởi hành!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nơi khởi hành" />
                        </Form.Item>

                        <Form.Item
                            name="destination"
                            label="Điểm đến"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập điểm đến!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Điểm đến" />
                        </Form.Item>

                        <Form.Item
                            name="vehicles"
                            label="Phương tiện"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập phương tiện!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Phương tiện" />
                        </Form.Item>

                        <Form.Item
                            name="images"
                            label="Hình ảnh"
                            style={{ marginBottom: 10 }}
                        >
                            <Upload
                                name="images"
                                listType="picture-card"
                                showUploadList={true}
                                beforeUpload={() => false}
                                onChange={handleImageUpload}
                                multiple
                            >
                                <Button icon={<UploadOutlined />}>Tải lên</Button>
                            </Upload>
                        </Form.Item>

                    </Form>
                </Drawer>



                {/* <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={totalEvent} onChange={handlePage}></Pagination> */}
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ProductList;