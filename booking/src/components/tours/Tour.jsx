import React from "react";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./tour.css";
import { Link,useNavigate } from "react-router-dom";

const Tour = () => {
 const navigate = useNavigate();
  const oid= "64259b828c4146ae7c15d6cf"
  const { data } = useFetch(`http://localhost:8800/api/tours/`);
  const filteredData = data.filter(item => item.visible === true);
  
  console.log(filteredData)


  const gotoTour=(id)=>{
    navigate(`/tours/${id}`)
    window.location.reload();
    //`/hotels/${item._id}`
   }
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="tourContainer">
      <div className="tour">
        <div className="tourTitle" data-aos="fade-up">
          <img
            src="https://www.andamandreamdestination.com/images/logo/Andaman-Dream-Destination.png"
            alt=""
          />
          <span>
            Hot <span className="tourText">TOUR</span>
          </span>
        </div>
        <div className="tourDes" data-aos="fade-left">
          
        </div>
        <Slider {...settings}>
          {filteredData.map((item, idx) => (
            
            <div
              className="tourContent"
              data-aos="fade-up"
              key={idx}
              onClick={() => {}}
            >
              <div className="tourBox">
                <img src={item.photos[0]} alt="" className="image" />
                <div className="content">
                  <div className="title">
                    <h2>{item.title}</h2>
                    {console.log(item._id)}
                  </div>
                  <div className="address">
                    <img
                      src="https://freepngimg.com/thumb/map/62873-map-computer-location-icon-icons-free-transparent-image-hd.png"
                      alt=""
                    />
                    <span>{item.address}</span>
                  </div>
                  <div className="reward">
                    <div className="mark">
                      <img
                        src="https://cdn.iconscout.com/icon/free/png-256/umbrella-2156238-1816112.png"
                        alt=""
                      />
                      <span>{item.rating}</span>
                    </div>
                    <div className="text">{item.text}</div>
                  </div>
                  <div className="price">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/5579/5579187.png"
                      alt=""
                    />
                    <span>{item.price?.toLocaleString('vi', { style: 'currency', currency: 'USD' })}</span>
                  </div>
                  <div className="detail">
                   
                      <button   onClick={()=>{gotoTour(item._id)}}>Detail</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Tour;
