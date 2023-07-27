import React, { useState, useEffect } from 'react';
import "./productList.css";
import {
    Col, Row, Typography, Spin, Button, PageHeader, Card, Drawer, Empty, Input, Space,
    Form, Pagination, Modal, Popconfirm, notification, BackTop, Tag, Breadcrumb, Select, Table, message, Upload
} from 'antd';
import {
    AppstoreAddOutlined, QrcodeOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ExclamationCircleOutlined, SearchOutlined,
    CalendarOutlined, UserOutlined, TeamOutlined, HomeOutlined, UploadOutlined, FormOutlined, TagOutlined, EditOutlined
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

const citiesArr = [
    { name: "Hà Nội", value: "hanoi" },
    { name: "Đà Nẵng", value: "danang" },
    { name: "Đà Lạt", value: "dalat" },
    { name: "Vũng Tàu", value: "vungtau" },
    { name: "Hồ Chí Minh", value: "hochiminh" },
];

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
    const [roomsList, setRoomsList] = useState([]);

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": user.username,
                "type": "hotel",
                "city": values.city,
                "address": values.address,
                "title": values.title,
                "desc": description,
                "cheapestPrice": values.cheapestPrice,
                "featured": true,
                "photos": images,
                "visible": false,
                "rooms": values.rooms,
                "utilities": values.utilities
            }
            return axiosClient.post("/hotels", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khách sạn thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khách sạn thành công',
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
            const categoryList = {
                "name": user.username,
                "type": "hotel",
                "city": values.city,
                "address": values.address,
                "title": values.title,
                "desc": description,
                "cheapestPrice": values.cheapestPrice,
                "featured": true,
                "photos": images,
                "rooms": values.rooms,
                "utilities": values.utilities
            }
            return axiosClient.put("/hotels/" + id, categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khách sạn thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khách sạn thành công',
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
            const user = await localStorage.getItem("user");
            console.log(user); // check if the value is null or undefined
            const userParse = JSON.parse(user);
            setUser(userParse);
            if (userParse.role === "isCompany") {
                await productApi.getListHotelsByCompany().then((res) => {
                    setProduct(res);
                    setLoading(false);
                });
            } else {
                await productApi.getListHotels().then((res) => {
                    setProduct(res);
                    setLoading(false);
                });

            }
            await productApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
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
            await productApi.deleteProduct(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khách sạn thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khách sạn thành công',

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

    const handleApprovalHotel = async (id, visible) => {
        setLoading(true);
        try {
            await productApi.approvalHotel(id, visible).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật khách sạn thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật khách sạn thành công',

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

    const handleProductEdit = async (id) => {
        setOpenModalUpdate(true);
        try {
            const response = await productApi.getDetailHotels(id);
            console.log(response);
            setId(id);
            const roomsInResponse = response.rooms.map(room => room._id.toString());

            form2.setFieldsValue({
                city: response.city,
                address: response.address,
                title: response.title,
                cheapestPrice: response.cheapestPrice,
                type: response.type,
                photos: response.photos,
                rooms: roomsInResponse,
                utilities: response.utilities
            });
            console.log(form2);
            setDescription(response.desc);
            setLoading(false);
        } catch (error) {
            throw error;
        };
    }

    const handleFilter = async (name) => {
        try {
            const user = localStorage.getItem("user");
            console.log(user); // check if the value is null or undefined
            const userParse = JSON.parse(user);
            if (userParse.role === "isCompany") {
                const res = await productApi.searchHotels(name);
                setTotalList(res)
                setProduct(res);
            } else {
                const res = await productApi.searchHotelsByAdmin(name);
                setTotalList(res)
                setProduct(res);
            }
        } catch (error) {
            console.log('search to fetch tours list:' + error);
        }
    }

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

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
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
            title: 'Tên công ty',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tên khách sạn',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Giá gốc',
            key: 'cheapestPrice',
            dataIndex: 'cheapestPrice',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Số phòng',
            key: 'rooms',
            dataIndex: 'rooms',
            render: (rooms) => <div>{rooms?.length}</div>,
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
            key: 'city',
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
                                    title="Bạn có chắc chắn xóa khách sạn này?"
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
                    </Row >
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
            render: (image) => <div>{image?.length}</div>,
            width: '10%'
        },
        {
            title: 'Tên công ty',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Tên khách sạn',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Giá gốc',
            key: 'cheapestPrice',
            dataIndex: 'cheapestPrice',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Số phòng',
            key: 'rooms',
            dataIndex: 'rooms',
            render: (rooms) => <div>{rooms?.length}</div>,
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
            key: 'city',
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
                                        title="Bạn có chắc chắn duyệt hotel này?"
                                        onConfirm={() => handleApprovalHotel(record._id, true)}
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
                                        title="Bạn có chắc chắn hủy duyệt sản phẩm này?"
                                        onConfirm={() => handleApprovalHotel(record._id, false)}
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


    useEffect(() => {
        (async () => {
            try {
                const user = await localStorage.getItem("user");
                console.log(user); // check if the value is null or undefined
                const userParse = JSON.parse(user);
                setUser(userParse);
                if (userParse.role === "isCompany") {
                    await productApi.getListHotelsByCompany().then((res) => {
                        setProduct(res);
                        setLoading(false);
                    });

                    await productApi.getListRoomsByCompany().then((res) => {
                        console.log(res);
                        setRoomsList(res);
                        setLoading(false);
                    });
                } else {
                    await productApi.getListHotels().then((res) => {
                        setProduct(res);
                        setLoading(false);
                    });
                }

                await productApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
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
                                <span>Danh sách khách sạn</span>
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
                                                    <Button onClick={handleOpen} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo khách sạn</Button>
                                                    : ""}
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>
                    {
                        user.role === "isCompany" ?
                            <div style={{ marginTop: 30 }}>
                                <Table columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                            </div> :
                            <div style={{ marginTop: 30 }}>
                                <Table columns={columns2} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                            </div>
                    }

                </div>

                <Drawer
                    title="Tạo khách sạn mới"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
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
                            label="Tiêu đề"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiêu đề!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>

                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thành phố!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn thành phố">
                                {citiesArr.map((city) => (
                                    <Select.Option key={city.value} value={city.value}>
                                        {city.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label="Loại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại">
                                <Option value="hotel">Khách sạn</Option>
                                <Option value="apartment">Căn hộ</Option>
                                <Option value="resort">Khu nghỉ mát</Option>
                                <Option value="villa">Biệt thự</Option>
                            </Select>
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
                            name="cheapestPrice"
                            label="Giá trung bình"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trung bình!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá trung bình" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="rooms"
                            label="Danh sách phòng"
                            style={{ marginBottom: 10 }}
                        >
                            <Select mode="multiple" placeholder="Chọn phòng">
                                {roomsList
                                    .filter((room) => room.booked === false)
                                    .map((room) => (
                                        <Select.Option key={room._id} value={room._id}>
                                            {room.title}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="utilities"
                            label="Tiện ích"
                            style={{ marginBottom: 10 }}
                        >
                            <Select mode="multiple" placeholder="Chọn tiện ích">
                                <Option value="24-hour-front-desk">Lễ tân</Option>
                                <Option value="air-conditioner">Máy lạnh</Option>
                                <Option value="elevator">Thang mái</Option>
                                <Option value="parking">Giữ xe</Option>
                                <Option value="restaurant">Nhà hàng</Option>
                                <Option value="swimming-pool">Hồ bơi</Option>
                                <Option value="wifi">Wifi</Option>
                            </Select>
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

                            <SunEditor
                                lang="en"
                                placeholder="Content"
                                onChange={handleChange}
                                setOptions={{
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize"],
                                        // ['paragraphStyle', 'blockquote'],
                                        [
                                            "bold",
                                            "underline",
                                            "italic",
                                            "strike",
                                            "subscript",
                                            "superscript"
                                        ],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list", "lineHeight"],
                                        ["outdent", "indent"],

                                        ["table", "horizontalRule", "link", "image", "video"],
                                        // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                                        // ["fullScreen", "showBlocks", "codeView"],
                                        ["preview", "print"],
                                        ["removeFormat"]

                                        // ['save', 'template'],
                                        // '/', Line break
                                    ],
                                    fontSize: [
                                        8, 10, 14, 18, 24,
                                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                    defaultTag: "div",
                                    minHeight: "500px",
                                    showPathLabel: false,
                                    attributesWhitelist: {
                                        all: "style",
                                        table: "cellpadding|width|cellspacing|height|style",
                                        tr: "valign|style",
                                        td: "styleinsert|height|style",
                                        img: "title|alt|src|style"
                                    }
                                }}
                            />
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
                    title="Chỉnh sửa khách sạn"
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
                            label="Tiêu đề"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiêu đề!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>

                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thành phố!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn thành phố">
                                {citiesArr.map((city) => (
                                    <Select.Option key={city.value} value={city.value}>
                                        {city.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label="Loại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại">
                                <Option value="hotel">Khách sạn</Option>
                                <Option value="apartment">Căn hộ</Option>
                                <Option value="resort">Khu nghỉ mát</Option>
                                <Option value="villa">Biệt thự</Option>
                            </Select>
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
                            name="cheapestPrice"
                            label="Giá trung bình"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trung bình!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Giá trung bình" type="number" />
                        </Form.Item>

                        <Form.Item
                            name="rooms"
                            label="Danh sách phòng"
                            style={{ marginBottom: 10 }}
                        >
                            <Select mode="multiple" placeholder="Chọn phòng">
                                {roomsList
                                    .filter((room) => room.booked === false)
                                    .map((room) => (
                                        <Select.Option key={room._id} value={room._id}>
                                            {room.title}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="utilities"
                            label="Tiện ích"
                            style={{ marginBottom: 10 }}
                        >
                            <Select mode="multiple" placeholder="Chọn tiện ích">
                                <Option value="24-hour-front-desk">Lễ tân</Option>
                                <Option value="air-conditioner">Máy lạnh</Option>
                                <Option value="elevator">Thang mái</Option>
                                <Option value="parking">Giữ xe</Option>
                                <Option value="restaurant">Nhà hàng</Option>
                                <Option value="swimming-pool">Hồ bơi</Option>
                                <Option value="wifi">Wifi</Option>
                            </Select>
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

                            <SunEditor
                                lang="en"
                                placeholder="Content"
                                onChange={handleChange}
                                setContents={description}
                                setOptions={{
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize"],
                                        // ['paragraphStyle', 'blockquote'],
                                        [
                                            "bold",
                                            "underline",
                                            "italic",
                                            "strike",
                                            "subscript",
                                            "superscript"
                                        ],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list", "lineHeight"],
                                        ["outdent", "indent"],

                                        ["table", "horizontalRule", "link", "image", "video"],
                                        // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                                        // ["fullScreen", "showBlocks", "codeView"],
                                        ["preview", "print"],
                                        ["removeFormat"]

                                        // ['save', 'template'],
                                        // '/', Line break
                                    ],
                                    fontSize: [
                                        8, 10, 14, 18, 24,
                                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                    defaultTag: "div",
                                    minHeight: "500px",
                                    showPathLabel: false,
                                    attributesWhitelist: {
                                        all: "style",
                                        table: "cellpadding|width|cellspacing|height|style",
                                        tr: "valign|style",
                                        td: "styleinsert|height|style",
                                        img: "title|alt|src|style"
                                    }
                                }}
                            />
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