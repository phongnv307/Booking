import React from "react";
import { useState, useContext } from "react";
import "./famous.css";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext.js";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import SubTitle from "../../share/SubTitle/SubTitle";

function Famous() {
  const [destination, setDestination] = useState("");
  const imgArr = [
    "https://vietnam.travel/sites/default/files/styles/top_banner/public/2017-06/vietnam-travel-5.jpg?itok=XVnHP3ty",
    "https://i1-dulich.vnecdn.net/2022/06/01/CauVangDaNang-1654082224-7229-1654082320.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=MeVMb72UZA27ivcyB3s7Kg", 
    "https://ik.imagekit.io/tvlk/blog/2023/03/du-lich-vung-tau-update-2.jpg?tr=dpr-2,w-675",
  ];

  const { dispatch } = useContext(SearchContext);
  const navigate = useNavigate();
  const handleClick = (targetName) => {
    setDestination(targetName);
  };
  useEffect(() => {
    if (destination) {
      dispatch({ type: "NEW_SEARCH", payload: { destination } });
      navigate("/hotels", { state: { destination } });
      // setDestination('')
    }
  }, [destination]);
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  const titleArr = ["Ha Noi", "Da Nang", "Vung Tau"];
  const Arrdb = ["hanoi", "danang", "vungtau"];
  return (
    <div className="famous">
      <div className="famousTitle-container">
        <div className="famousTitle" data-aos="fade-up">
          <img
            src="https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/1555444/beach-umbrella-clipart-xl.png"
            alt=""
          />
          <span>Favorite </span>
          <span className="desText">Destination</span>
        </div>
        <div className="famousText" data-aos="fade-left">
          <span>The hottest place recommended by Booking</span>
        </div>
        <div className="textFamous-lastTitle">
          <span className="lastText">
            Traveling opens the door to creating  
             <SubTitle subTitle={' memories'}/>
          </span>

          <span className="lastTextt">
            Seamless Booking for Unforgettable Experiences.
          </span>
        </div>
      </div>
      <div className="famous-item">
        <div
          className="newFamous-item"
          onClick={() => {
            handleClick(Arrdb[0]);
          }}
        >
          <h2 className="itemTitle">{titleArr[0]}</h2>
          <img src={imgArr[0]} alt="" />
        </div>
        <div
          className="newFamous-item mt-3"
          onClick={() => {
            handleClick(Arrdb[1]);
          }}
        >
          <h2 className="itemTitle">{titleArr[1]}</h2>
          <img src={imgArr[1]} alt="" />
        </div>{" "}
        <div
          className="newFamous-item mt-5"
          onClick={() => {
            handleClick(Arrdb[2]);
          }}
        >
          <h2 className="itemTitle">{titleArr[2]}</h2>
          <img src={imgArr[2]} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Famous;
