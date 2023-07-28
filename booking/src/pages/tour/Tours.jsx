import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./tours.css";
import Slider_Appp from "./Slider_App_Tour";
import Highlight from "../../share/Highlight/Highlight";
import Schedule from "../../share/Highlight/Schedule";
import adventure from "../../assets/adventure.png";
import departureImg from "../../assets/departure.png";
import destinationImg from "../../assets/destination.png";
import backintime from "../../assets/back-in-time.png";
import carImg from "../../assets/car.png";
import includeImg from "../../assets/right-arrow.png";
import Review from "../../share/Review/Review";
import cursor from "../../assets/cursor.png";
import { Modal, Button, Form, Input, notification, Radio } from 'antd';
import axios from "axios";

const Tours = () => {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('paymentId');
  const id = location.pathname.split("/")[2];
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState({});
  const [form] = Form.useForm();

  const { data, loading, error } = useFetch(
    `http://localhost:8800/api/tours/${id}`
  );
  console.log(data);

  const includeData = [
    { text: "Tickets to visit the points in the program" },
    {
      text: "Enthusiastic and attentive tour guide, narrating throughout the route",
    },
    { text: "Package insurance 50,000,000 VND/case" },
    { text: "Eating meals program" },
    { text: " Mineral water 01 bottle/person/day" },
  ];

  const handleBooking = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      handleOkUser(values);
      setModalVisible(false);
    });
  };

  const handleOkUser = async (values) => {
    if (values.paymentMethod === "paypal") {
      localStorage.setItem("description", values.bookingDetails);
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
          tourId: id,
          bookingDetails: values.bookingDetails,
          userId: currentUser.details._id,
          billing: values.paymentMethod
        };
        return axios.post("http://localhost:8800/api/tours/book", tourData).then(response => {
          if (response === undefined) {
            notification["error"]({
              message: `Thông báo`,
              description:
                'Booking tours thất bại',
            });
          }
          else {
            notification["success"]({
              message: `Thông báo`,
              description:
                'Booking tours thành công',
            });
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
            tourId: id,
            bookingDetails: description,
            userId: currentUser.details._id,
            billing: "paypal"
          };
          return axios.post("http://localhost:8800/api/tours/book", tourData).then(response => {
            if (response === undefined) {
              notification["error"]({
                message: `Thông báo`,
                description:
                  'Booking tours thất bại',
              });
              
              setShowModal(false);
            }
            else {
              // Ẩn modal confirm
              setShowModal(false);
              notification["success"]({
                message: `Thông báo`,
                description:
                  'Booking tours thành công',
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

  useEffect(() => {
    if (paymentId) {
      setShowModal(true);
    }
  }, []);

  return (
    <>
      <div className="listHeader">
        <Navbar type="list" />
      </div>
      <Header type="list" />
      <div className="tours">
        <div className="tours-container d-flex mt-3">
          <div className="toursPhoto">
            <Slider_Appp />
            <div className="toursPhoto-item d-flex">
              <div className="tourDestination">
                <div className="tourDeparture">
                  <h6 className="d-flex align-items-center gap-2">
                    <img
                      className="tourDeparture-img"
                      src={departureImg}
                      alt=""
                    />
                    Departure:{" "}
                  </h6>
                  <h5>{data.departure}</h5>
                </div>
                <div className="tourDeparture">
                  <h6 className="d-flex align-items-center gap-2">
                    <img
                      className="tourDeparture-img"
                      src={destinationImg}
                      alt=""
                    />
                    Destination:
                  </h6>
                  <h5>{data.destination}</h5>
                </div>
              </div>
              <div className="tourDestination">
                <div className="tourDeparture">
                  <h6 className="d-flex align-items-center gap-2">
                    <img
                      className="tourDeparture-img"
                      src={backintime}
                      alt=""
                    />
                    Time:{" "}
                  </h6>
                  <h5>{data.time}</h5>
                </div>
                <div className="tourDeparture">
                  <h6 className="d-flex align-items-center gap-2">
                    <img className="tourDeparture-img" src={carImg} alt="" />
                    Vehicles:{" "}
                  </h6>
                  <h5>{data.vehicles}</h5>
                </div>
              </div>
            </div>
            <div className="tourPrice mt-3 ">
              <h6 className="d-flex align-items-base-line gap-2 ">
                Price:
                <h5 className="d-flex mb-0">{data.price?.toLocaleString('vi', { style: 'currency', currency: 'USD' })}</h5>{" "}
              </h6>
            </div>
            <div className="tourIncludes">
              <h6>
                The price of {data.title} on {data.time} includes:
              </h6>
              <ul>
                {includeData.map((item) => (
                  <li className="tourInclude-item">
                    <img
                      src={includeImg}
                      className="tourDeparture-img"
                      alt=""
                    />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="toursInfo">
            <div className="toursTitle">
              <h2>{data.title}</h2>
            </div>
            <div className="toursDescription mt-3 mb-5">
              <h6>{data.desc}</h6>
              <span>Book your tour now to get the best deals!!!</span>
              <button className="tourBtn-book" onClick={() => setModalVisible(true)}>Book Now</button>
            </div>

            <div className="toursHighlights mt-3">
              <div className="subTitle-container">
                <h3 className="subTitle">Highlight</h3>
              </div>
              <Highlight highlight={data.hightlight} />
            </div>

            <div className="tourSchedule">
              <div className="tourSchedule-title">
                <h6>
                  Booking's travel programs are well researched and thoughtfully
                  planned from the resort, dining and entertainment stages,
                  ensuring that you have a truly fun and meaningful trip!
                </h6>
              </div>
              <div className="subTitle-container">
                <h3 className="subTitle">Schedule</h3>
              </div>
              <Schedule schedule={data.schedule} />
            </div>
          </div>
        </div>
        {/* <Review /> */}
      </div>

      <MailList />
      <Footer />

      <Modal
        title="Booking Tour"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1000}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button onClick={handleBooking} type="primary">
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

        </Form>
      </Modal>
      <Modal
        visible={showModal}
        onOk={handleModalConfirm}
        onCancel={() => setShowModal(false)}
      >
        <p>Bạn có chắc chắn muốn xác nhận thanh toán?</p>
      </Modal>
    </>
  );
};

export default Tours;
