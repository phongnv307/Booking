import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState, useContext, useRef } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import { SearchContext } from "../../context/SearchContext.js";

import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const Header = ({ type, openDate, handleOpenDate }) => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  const [destination, setDestination] = useState("");
  const [dates, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [message, setMessage] = useState("Please enter your destination");

  const inputRef = useRef(null);
  const tipsRef = useRef(null);

  const isNameValid = (cityName) => {
    const citiesArr = [
      "angiang",
      "vungtau",
      "baclieu",
      "bacgiang",
      "backan",
      "bacninh",
      "bentre",
      "binhduong",
      "binhdinh",
      "binhphuoc",
      "binhthuan",
      "camau",
      "caobang",
      "cantho",
      "danang",
      "daklak",
      "daknong",
      "dienbien",
      "dongnai",
      "dongthap",
      "gialai",
      "hagiang",
      "hanam",
      "hanoi",
      "hatinh",
      "haiduong",
      "haiphong",
      "haugiang",
      "hoabinh",
      "hungyen",
      "khanhhoa",
      "kiengiang",
      "kontum",
      "laichau",
      "langson",
      "laocai",
      "lamdong",
      "longan",
      "namdinh",
      "nghean",
      "ninhbinh",
      "ninhthuan",
      "phutho",
      "phuyen",
      "quangbinh",
      "quangnam",
      "quangngai",
      "quangninh",
      "quangtri",
      "soctrang",
      "sonla",
      "tayninh",
      "thaibinh",
      "thainguyen",
      "thanhhoa",
      "hue",
      "tiengiang",
      "hochiminh",
      "travinh",
      "tuyenquang",
      "vinhlong",
      "vinhphuc",
      "yenbai",
    ];
    return citiesArr.includes(cityName);
  };

  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const { dispatch } = useContext(SearchContext);

  const handleSearch = () => {
    if (isNameValid(destination)) {
      dispatch({
        type: "NEW_SEARCH",
        payload: { destination, dates, options },
      });
      navigate("/hotels", { state: { destination, dates, options } });
    } else {
      inputRef.current.value !== ""
        ? setMessage(
            "we currently don't have that location available"
          )
        : setMessage("Please enter your destination");
      inputRef.current.value = "";
      inputRef.current.focus();
      tipsRef.current.click();

      setDestination("");
    }
  };

  return (
    <div
      className="header"
      style={
        type === "list"
          ? { backgroundColor: "#003580" }
          : { backgroundColor: "transparent" }
      }
    >
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList" data-aos="fade-down">

        </div>
        {type !== "list" && (
          <>
            <div className="headerSearch-subTitle">
              <h4 className="headerTitle" data-aos="fade-left">
                Discover, Book, and Go: Your Journey Starts Here!
              </h4>
              <h1 className="headerSave" data-aos="fade-left">
                {" "}
                Book Smarter, Explore Better!{" "}
              </h1>
              <p className="headerDesc" data-aos="fade-left">
                Let's tick one more destination off your wishlist
              </p>
            </div>
            <div className="headerSearch">
              <div className="headerSearchItem">
                <FontAwesomeIcon icon={faBed} className="headerIcon" />

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Where are you going?"
                  className="headerSearchInput"
                  onChange={(e) =>
                    setDestination(
                      e.target.value.split(" ").join("").toLowerCase()
                    )
                  }
                />
              </div>

              <div className="headerSearchItem headertb">
                <button
                  id="myButton"
                  className="headerBtn"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
              <Tippy
                content={message}
                trigger="click"
                className="search-tooltip"
                theme={"light"}
                animation={"shift-away"}
              >
                <span ref={tipsRef}></span>
              </Tippy>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
