
import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/reserve/Reserve";
import App_showRoom from "../../components/showRoom/App_showRoom.js";
import UserContext from "../../globalState.js";
import Modal2 from "../../components/modal/modal.jsx";
import Slider_Appp from "./Slider_App.jsx";
import Review from "./component/review.jsx";
import { List, Card, Modal, Button, Form, Input, notification, Radio, Rate, DatePicker, Row, Col } from 'antd';
import axios from "axios";
import MapComponent from "../../components/mapComponent/googleMap";
import moment from 'moment';
import queryString from "query-string";

const Hotel = () => {
  const { modal } = useContext(UserContext);
  const { dates, options } = useContext(SearchContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [roomId, setRoomsId] = useState(null);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('paymentId');
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  const { data, loading, error } = useFetch(
    `http://localhost:8800/api/hotels/find/${id}`
  );

  const rooms = data?.rooms || []; // Make sure 'rooms' is an array, even if it's empty
  const remainingQuantityByType = {};

  // Group rooms by typeRooms and calculate remaining quantity for each typeRooms
  rooms.forEach((room) => {
    const { typeRooms, roomQuantity, roomOrder } = room;
    const remainingQuantity = roomQuantity - roomOrder;

    if (remainingQuantityByType.hasOwnProperty(typeRooms)) {
      remainingQuantityByType[typeRooms] += remainingQuantity;
    } else {
      remainingQuantityByType[typeRooms] = remainingQuantity;
    }
  });
  console.log("remainingQuantityByType");

  console.log(remainingQuantityByType);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(dates);
  // console.log(data.review[0])
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0]?.endDate, dates[0]?.startDate);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 1 ? data.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === data.photos.length - 1 ? 1 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  const content =
  {
    "air-conditioner": "https://s3-ap-southeast-1.amazonaws.com/cntres-assets-ap-southeast-1-250226768838-cf675839782fd369/imageResource/2016/12/21/1482301285653-0a04df7d3f807b32484ceec10d9681c6.png",
    "swimming-pool": "https://s3-ap-southeast-1.amazonaws.com/cntres-assets-ap-southeast-1-250226768838-cf675839782fd369/imageResource/2017/06/07/1496833772013-929572dff57d1755878aa79dc46e6be5.png",
    "24-hour-front-desk": "https://s3-ap-southeast-1.amazonaws.com/cntres-assets-ap-southeast-1-250226768838-cf675839782fd369/imageResource/2016/12/21/1482301381776-c014a3111a6de5236d903c93b7647e4c.png",
    "parking": "https://s3-ap-southeast-1.amazonaws.com/cntres-assets-ap-southeast-1-250226768838-cf675839782fd369/imageResource/2017/06/07/1496833756238-56e24fb64a964d38b8f393bf093a77a9.png",
    "wifi": "https://s3-ap-southeast-1.amazonaws.com/cntres-assets-ap-southeast-1-250226768838-cf675839782fd369/imageResource/2017/06/07/1496833833458-7b6ab67bc5df6ef9f2caee150aae1f43.png",
    "elevator": "https://s3-ap-southeast-1.amazonaws.com/cntres-assets-ap-southeast-1-250226768838-cf675839782fd369/imageResource/2017/06/07/1496833714411-48c9b7565018d02dc32837738df1c917.png",
    "restaurant": "https://s3-ap-southeast-1.amazonaws.com/cntres-assets-ap-southeast-1-250226768838-cf675839782fd369/imageResource/2017/06/07/1496833794378-eb51eee62d46110b712e327108299ea6.png"
  };

  const [price, setPrice] = useState(0);
  const handleBooking = (room) => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (user === null) {
      return notification["success"]({
        message: `Thông báo`,
        description: 'Bạn phải đăng nhập trước khi thực hiện đặt phòng!',
      });
    } else {
      setRoomsId(room._id);
      localStorage.setItem("roomId", room._id);
      localStorage.setItem("price", room.price);
      setPrice(room.price);
      setModalVisible(true);
    }
  };

  const handleBooking2 = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      handleOkUser(values);
      setModalVisible(false);
    });
  };

  const handleOkUser = async (values) => {
    localStorage.setItem("description", values.bookingDetails);
    localStorage.setItem("checkInDate", values.checkInDate);
    localStorage.setItem("checkOutDate", values.checkOutDate);

    const local = localStorage.getItem("user");
    const currentUser = JSON.parse(local);

    if (!currentUser) {
      return notification["error"]({
        message: `Thông báo`,
        description: 'Bạn phải đăng nhập trước khi thực hiện đặt phòng!',
      });
    }
    if (values.paymentMethod === "paypal") {
      try {
        const approvalUrl = await handlePayment(values);
        console.log(approvalUrl);
        if (approvalUrl) {
          window.location.href = approvalUrl; // Chuyển hướng đến URL thanh toán PayPal
        } else {
          notification["error"]({
            message: `Thông báo`,
            description: 'Thanh toán thất bại',
          });
        }
      } catch (error) {
        console.error('Error:', error);
        notification["error"]({
          message: `Thông báo`,
          description: 'Thanh toán thất bại',
        });
      }
    } else {
      const local = localStorage.getItem("user");
      const currentUser = JSON.parse(local);
      try {
        const tourData = {
          roomId: roomId,
          bookingDetails: values.bookingDetails,
          userId: currentUser.details._id,
          billing: values.paymentMethod,
          checkInDate: values.checkInDate,
          checkOutDate: values.checkOutDate,
          total: totalCost
        };
        return axios.post("http://localhost:8800/api/rooms/book", tourData).then(response => {
          console.log(response);
          if (response.data.message === "Room is already booked for the selected dates") {
            return notification["error"]({
              message: `Thông báo`,
              description:
                'Đã kín phòng vào ngày bạn chọn, vui lòng chọn phòng khác',
            });
          } else
            if (response === undefined) {
              notification["error"]({
                message: `Thông báo`,
                description:
                  'Đặt phòng thất bại',
              });
            }
            else {
              notification["success"]({
                message: `Thông báo`,
                description:
                  'Bạn đã đặt phòng thành công, nhân viên sẽ sớm liên hệ với bạn để hoàn tất giao dịch',
              });

              setTotalCost(0);

            }
          setModalVisible(false);
        })
      } catch (error) {
        throw error;
      }
    }
  }

  const handlePayment = async (values) => {
    const local = localStorage.getItem("user");
    const currentUser = JSON.parse(local);
    try {
      const tourPayment = {
        price: "800",
        description: values.bookingDetails,
        return_url: "http://localhost:3005" + location.pathname,
        cancel_url: "http://localhost:3005" + location.pathname
      };
      const response = await axios.post("http://localhost:8800/api/payment/pay", tourPayment);
      if (response.data.approvalUrl) {
        localStorage.setItem("session_paypal", response.data.accessToken)
        return response.data.approvalUrl; // Trả về URL thanh toán
      } else {
        notification["error"]({
          message: `Thông báo`,
          description: 'Thanh toán thất bại',
        });
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  const handleModalConfirm = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const paymentId = queryParams.get('paymentId');
      // const token = queryParams.get('token');
      const PayerID = queryParams.get('PayerID');
      const token = localStorage.getItem("session_paypal");
      const description = localStorage.getItem("description");

      // Gọi API executePayment để thực hiện thanh toán
      const response = await axios.get('http://localhost:8800/api/payment/executePayment', {
        params: {
          paymentId,
          token,
          PayerID,
        },
      });

      if (response) {
        const local = localStorage.getItem("user");
        const currentUser = JSON.parse(local);
        try {
          const tourData = {
            roomId: localStorage.getItem("roomId"),
            bookingDetails: description,
            userId: currentUser.details._id,
            billing: "paypal",
            checkInDate: localStorage.getItem("checkInDate"),
            checkOutDate: localStorage.getItem("checkOutDate"),
            total: localStorage.getItem("totalCost"),
          };
          return axios.post("http://localhost:8800/api/rooms/book", tourData).then(response => {
            if (response === undefined) {
              notification["error"]({
                message: `Thông báo`,
                description:
                  'Booking rooms thất bại',
              });

              setShowModal(false);
            }
            else {
              // Ẩn modal confirm
              setShowModal(false);
              notification["success"]({
                message: `Thông báo`,
                description:
                  'Booking rooms thành công',
              });
            }
          })
        }
        catch (error) {
          console.error('Error executing payment:', error);
          // Xử lý lỗi
        }
        notification["success"]({
          message: `Thông báo`,
          description: 'Thanh toán thành công',
        });

        setShowModal(false);
        setTotalCost(0);

      } else {
        notification["error"]({
          message: `Thông báo`,
          description: 'Thanh toán thất bại',
        });
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error executing payment:', error);
      // Xử lý lỗi
    }
  }

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmitComment = async () => {
    const local = localStorage.getItem("user");
    const currentUser = JSON.parse(local);       
    const userName = currentUser.details.username;
    try {
      const response = await axios.post('http://localhost:8800/api/hotels/addCommentAndRating/' + id, {
        userName: userName,
        comment: newComment,
        rating: rating, // Set the rating value as needed
      });

      const updatedComments = response.data.review;
      setComments(updatedComments);
      setNewComment('');
      setRating(0);
      window.location.reload();

    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleAddressClick = () => {
    const query = queryString.stringify({ q: data.address });
    const addressUrl = `https://maps.google.com/maps?${query}`;

    window.open(addressUrl, "_blank");
  };

  const handleDateChange = () => {
    form.validateFields(['checkInDate', 'checkOutDate']).then((values) => {
      const { checkInDate, checkOutDate } = values;
      if (checkInDate && checkOutDate && moment(checkInDate).isValid() && moment(checkOutDate).isValid()) {
        const numDays = checkOutDate.diff(checkInDate, 'days');
        const cheapestPrice = price; 
        const totalPrice = cheapestPrice * numDays;
        setTotalCost(totalPrice);
        localStorage.setItem("totalCost", totalPrice);
      } else {
        console.log("Vui lòng chọn cả ngày check-in và check-out");
      }
    }).catch((error) => {
      console.error("Lỗi xử lý promise:", error);
      // Xử lý lỗi promise ở đây (nếu cần)
    });
  };

  useEffect(() => {
    if (paymentId) {
      setShowModal(true);
    }
  }, []);

  return (
    <div className="hotel-page" style={{ "overflow-x": "hidden" }}>
      <div className="listHeader">
        <Navbar type="list" />
      </div>
      {console.log(data)}
      <Header type="list" />
      {loading ? (
        "loading"
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <h1 className="hotelTitle">{data.title}</h1>
            <div className="hotelAddresContainer">
              <div className="hotelAddress">
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/location-travel-map/address-icon.png"
                  alt=""
                />
                <span onClick={handleAddressClick}>{data.address}</span>
              </div>
              <span className="freeChildren">Free of charge for children</span>
            </div>

            <span className="hotelDistance">
              Excellent location to visit 
            </span>
            <span className="hotelPriceHighlight">
              Book a stay over ${data.cheapestPrice} at this property and get a
              free airport taxi
            </span>

            <div className="hotelImages-container">
              <div className="hotelImages">
                <div className="hotelImages-demo">

                  <Slider_Appp />

                  <div className="utilities">
                    <div className="utilitiesTitle">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/5969/5969490.png"
                        alt=""
                      />

                      <span>Convenient</span>
                    </div>
                    <ul className="utilities-Content">
                      {data?.utilities?.map((item, index) => (
                        <li className="content-item">
                          <img src={content[item]} alt="" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: 35 }}>
                    <Row gutter={16}>
                      {Object.keys(remainingQuantityByType).map((type) => (
                        <Col span={6} key={type}>
                          <Card title={type} style={{ marginBottom: 16 }}>
                            <p>Quantity: {remainingQuantityByType[type]}</p>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <div style={{ marginTop: 40 }}>
                    <Card>
                      <List
                        dataSource={data.rooms}
                        renderItem={(room) => (
                          <List.Item>
                            <List.Item.Meta title={room.title} description={room.desc} />
                            <div className="listRooms">

                              <div>Price: {room.price}</div>
                              <div>Max people: {room.maxPeople}</div>
                            </div>
                            <div>
                              <Button type="primary" onClick={() => handleBooking(room)}>
                                Booking
                              </Button>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </div>
                  <div className="review">
                    <div className="reviewTop">
                      <h2>Rating ({data.review?.length} ratings) </h2>
                      <h2>Average total stars({data?.rating?.toFixed(1)}) </h2>
                      <span>Overall rating</span>
                    </div>
                    <div className="userInfor">
                      {/* Render the Rate component for rating selection */}
                      <Rate value={rating} onChange={handleRatingChange} />
                    </div>
                    <div className="userComment">
                      <input
                        type="text"
                        className="contentt"
                        placeholder="Write your comment" s
                        value={newComment}
                        onChange={handleCommentChange}
                      />
                      <button className="userComment-submit" onClick={handleSubmitComment}>
                        Submit
                      </button>
                    </div>
                    {/* Render the Review component passing the comments data */}
                    <Review review={data.review} />
                  </div>
                </div>
              </div>

              <div className="hotelBox">
                <div className="boxTop">
                  <div className="boxTop-left">
                    
                    <span className="price">{data.cheapestPrice} US$ <a>/ day</a></span>
                    
                  </div>
                  <div className="boxTop-right"></div>
                </div>
                <div className="boxMid">
                  <h3 style={{fontWeight: "bold"}}>Introduction of accommodation</h3>
                  <p style={{width: "331px"}} dangerouslySetInnerHTML={{ __html: data.desc }}/>
                </div>
              </div>
            </div>

          </div>
          <div style={{ margin: "15px 0" }}></div>

          <Footer />

        </div>
      )}

      <Modal
        title="Booking Rooms"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1000}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button onClick={handleBooking2} type="primary">
              Hoàn thành
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          name="eventCreate"
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="bookingDetails"
            label="Nội dung"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mô tả đặt tour!',
              },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input.TextArea placeholder="Nội dung" />
          </Form.Item>

          <Form.Item
            name="checkInDate"
            label="Ngày nhận phòng"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ngày nhận phòng!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const checkOutDate = getFieldValue('checkOutDate');
                  const now = moment().startOf('day'); // Use startOf('day') to include the current day
                  if (value && checkOutDate && value >= checkOutDate) {
                    return Promise.reject(new Error('Ngày nhận phòng không thể lớn hơn hoặc bằng ngày trả phòng'));
                  }
                  if (value && value < now) {
                    return Promise.reject(new Error('Ngày nhận phòng không thể nhỏ hơn ngày hiện tại'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            style={{ marginBottom: 10 }}
          >
            <DatePicker style={{ width: '100%' }} onChange={handleDateChange}/>
          </Form.Item>

          <Form.Item
            name="checkOutDate"
            label="Ngày trả phòng"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ngày trả phòng!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const checkInDate = getFieldValue('checkInDate');
                  const now = moment().startOf('day'); // Use startOf('day') to include the current day
                  if (value && checkInDate &&  value.isSame(checkInDate, 'day')) {
                    return Promise.reject(new Error('Ngày trả phòng không thể nhỏ hơn hoặc bằng ngày nhận phòng'));
                  }
                  if (value && value < now) {
                    return Promise.reject(new Error('Ngày trả phòng không thể nhỏ hơn ngày hiện tại'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            style={{ marginBottom: 10 }}
          >
            <DatePicker style={{ width: '100%' }} onChange={handleDateChange}/>
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="Phương thức thanh toán"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn phương thức thanh toán!',
              },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Radio.Group>
              <Radio value="cash">Tiền mặt</Radio>
              <Radio value="paypal">PayPal</Radio>
            </Radio.Group>

          </Form.Item>

          

          <p style={{ marginBottom: 10 }}>Tổng tiền: {totalCost} USD</p>
        </Form>
      </Modal>

      <Modal
        visible={showModal}
        onOk={handleModalConfirm}
        onCancel={() => setShowModal(false)}
      >
        <p>Bạn có chắc chắn muốn xác nhận thanh toán?</p>
      </Modal>

      {modal && <Modal />}
    </div>
  );
};

export default Hotel;
