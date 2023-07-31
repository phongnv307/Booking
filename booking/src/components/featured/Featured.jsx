import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useFetch from "../../hooks/useFetch";
import { useNavigate } from 'react-router-dom';
import './featured.css';
// import { dataDigitalBestSeller } from './data';

import imgGirl from './assets/images/defaultImage.jpg';
import { useContext } from 'react';
import { SearchContext } from '../../context/SearchContext.js';
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

function Featured() {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  const [defaultImage, setDefaultImage] = useState({});
  const [destination, setDestination] = useState('');
  // const [dates, setDate] = useState();
  // const [options, setOptions] = useState({
  //   adult: 1,
  //   children: 0,
  //   room: 1,
  // });
  const {data} = useFetch('http://localhost:8800/api/hotels/countByCity?cities=hanoi,hochiminh,vungtau,danang,nhatrang,hue,haiphong')
  const imgArr =[
    "https://cdn3.ivivu.com/2022/07/h%E1%BB%93-g%C6%B0%C6%A1m-du-l%E1%BB%8Bch-H%C3%A0-N%E1%BB%99i-ivivu.jpg",
    "https://img.meta.com.vn/Data/image/2021/07/09/dan-so-thanh-pho-ho-chi-minh-3.jpg",
    "https://cdn3.ivivu.com/2022/09/T%E1%BB%95ng-quan-du-l%E1%BB%8Bch-V%C5%A9ng-T%C3%A0u-ivivu.jpg",
    "https://vcdn1-dulich.vnecdn.net/2022/06/03/cauvang-1654247842-9403-1654247849.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=Swd6JjpStebEzT6WARcoOA",
    "https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/dataimages/202202/original/images5492543_NR1.jpg",
    "https://giaonuocnhanh.com/wp-content/uploads/2021/12/hue.jpg",
    "https://cdnimg.vietnamplus.vn/uploaded/xpcwvovt/2022_09_02/hai_phong.jpg"
  ]
  const cities = ["Ha Noi","Ho Chi Minh","Vung Tau","Da Nang","Nha Trang","Hue","Hai Phong"]  

  const navigate = useNavigate()
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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
  
  const handleErrorImage = (data) => {
    setDefaultImage((prev) => ({
      ...prev,
      [data.target.alt]: data.target.alt,
      linkDefault: imgGirl,
    }));
  };
  const {dispatch} = useContext(SearchContext)
  const handleClick=(idx)=>{
    setDestination(data[idx].city)
    
  }
  useEffect(()=>{
    if(destination){
      dispatch({ type: "NEW_SEARCH", payload: { destination}});
      navigate("/hotels",{state:{destination}})
      // setDestination('')
    }

    

  },[destination])
  
  return (
    <div className="featured-1">
      <Slider {...settings}>
        {imgArr.map((img,idx) => (
          <div data-aos= "fade-up" key={idx} onClick={()=>handleClick(idx)} className="card-1">
            <div className="card-top-1">
              <img
                src={
                  defaultImage[cities[idx]] === cities[idx]
                    ? defaultImage.linkDefault
                    : img
                }
                alt={cities[idx]}
                onError={handleErrorImage}
              />
              <h1>{cities[idx]}</h1>
            </div>
            <div className="card-bottom-1">
              <h3>{data[idx]?.counted} properties</h3>
              {/* <span className="category-1">{item.category}</span> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Featured;
