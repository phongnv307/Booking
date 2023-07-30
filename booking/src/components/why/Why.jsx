import React from "react";
import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

import "./why.css";
const Why = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  const data = [
    {
      img: "https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407528373-a0e2c450b5cfac244d687d6fa8f5dd98.png?tr=h-150,q-75,w-150",
      title: "Cheap prices every day with special app-specific offers",
      text: "",
    },
    {
      img: "https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407536280-ddcb70cab4907fa78468540ba722d25b.png?tr=h-150,q-75,w-150",
      title: "Safe and flexible payment methods",
      text: "",
    },
    {
      img: "https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407541562-61b4438f5439c253d872e70dd7633791.png?tr=h-150,q-75,w-150",
      title: "24/7 customer support",
      text: "",
    },
    {
      img: "https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407562736-ea624be44aec195feffac615d37ab492.png?tr=h-150,q-75,w-150",
      title: "Real guests, real reviews",
      text: "",
    },
  ];
  return (
    <div className="whyContainer">
      <div className="why">
        <div className="whyTitle" data-aos= "fade-down">
          <h1>Why book with Hoteloka?</h1>
        </div>
        <div className="whyContent">
          {data.map((item) => (
            <div className="whyBox" >
              <img src={item.img} alt=""  data-aos= "fade-down"/>

              <div className="titleWhy" data-aos= "fade-up">
                <h4>{item.title}</h4>
              </div>
              <div data-aos= "fade-up">
                <h4 className="text">{item.text}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Why;
