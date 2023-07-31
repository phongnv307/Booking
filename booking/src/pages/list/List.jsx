import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import MultiRangeSlider from "../../components/multiRangeSlider/multiRangeSlider.jsx";
import Footer from "../../components/footer/Footer.jsx";
import useFetch from "../../hooks/useFetch";
import PaginatedItems from "../../components/paginnation/Paginate.jsx";

import UserContext from "../../globalState.js";
import Modal from "../../components/modal/modal.jsx";
import { SearchContext } from "../../context/SearchContext.js";
import GoToTop from "../../utils/Gototop.js";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

const List = () => {
  const { modal } = useContext(UserContext);
  const { dates } = useContext(SearchContext);
  const location = useLocation();
  const [destination, setDestination] = useState(
    location.state.destination || ""
  );
  const [date, setDate] = useState(
    location.state.dates || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );
  const [options, setOptions] = useState(
    location.state.options || {
      adult: 1,
      children: 0,
      room: 1,
    }
  );
  // if(city ==='city'){

  // }

  //const [url, setUrl] = useState('')

  const [type, setType] = useState(location.state.acType || "");
  const [openDate, setOpenDate] = useState(false);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [message, setMessage] = useState("");
  let url = useRef();
  const tipsRef = useRef();
  const visible = true;
  const people = options.adult + options.children;
  if (!destination && type && visible) {
    url = `http://localhost:8800/api/hotels?visible=${visible}&type=${type}&min=${min || 0}&max=${
      max || 200000000
    }`;
  } else if (destination && !type && visible) {
    url = `http://localhost:8800/api/hotels?visible=${visible}&city=${destination}&min=${
      min || 0
    }&max=${max || 200000000}`;
  } else if (destination && type && visible) {
    url = `http://localhost:8800/api/hotels?visible=${visible}&city=${destination}&type=${type}&min=${
      min || 0
    }&max=${max || 200000000}`;
  }

  const { data, loading, error, reFetch } = useFetch(url);

  const { dispatch } = useContext(SearchContext);

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
  console.log(destination);
  const handleSearch = () => {
    if (isNameValid(destination)) {
      dispatch({
        type: "NEW_SEARCH",
        payload: { destination, dates: date, options },
      });

      reFetch();
    } else {
      return alert(
        "we currently don't have that location available"
      );

      // inputRef.current.value ="";
      // inputRef.current.focus();
      // tipsRef.current.click();
    }
  };

  const turnOffDate = () => {
    setOpenDate(!openDate);
  };

  return (
    <div className="list-page" onClick={openDate ? turnOffDate : undefined}>
      <div className="listHeader">
        <Navbar type="list" className="navList" />
        <Header type="list" />
      </div>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearchContainer">
            <div className="listSearch">
              <h1 className="lsTitle">Search</h1>

              <div className="lsItem">
                <label>Destination</label>
                <input
                  placeholder={destination}
                  type="text"
                  onChange={(e) => {
                    setDestination(
                      e.target.value.split(" ").join("").toLowerCase()
                    );
                  }}
                />
              </div>
              <div className="list_room-type">
                <label for="room-type" style={{ fontSize: "12px" }}>
                  Type:{" "}
                </label>
                <select
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                >
                  <option value="">All</option>
                  <option value="hotel">Hotel</option>           
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="resort">Resort</option>
                  <option value="homestay">Homestay</option>
                </select>
              </div>
              {/* <Tippy content={message} trigger= "click" className="search-tooltip" theme={'light'} animation={'shift-away'} > 
              
              <span ref={tipsRef} ></span>
            </Tippy> */}
              {/* <div className="lsItem">
                <label>Check-in Date</label>
                <span onClick={() => setOpenDate(!openDate)}>{`${format(
                  date[0]?.startDate,
                  "dd/MM/yyyy"
                )} to ${format(date[0]?.endDate, "dd/MM/yyyy")}`}</span>
                {openDate && (
                  <DateRange
                    onChange={(item) => setDate([item.selection])}
                    minDate={new Date()}
                    ranges={date}
                  />
                )}
              </div> */}

              <div className="lsItem">
                <label>Options</label>
                <div className="lsOptions">
                  <label>Price:</label>
                  <MultiRangeSlider
                    min={0}
                    max={999}
                    onChange={({ min, max }) => {
                      setMin(min);
                      setMax(max);
                    }}
                  />
                  {/* <div className="lsOptionItem">
                    <span className="lsOptionText">Adult</span>
                    <input
                      type="number"
                      min={1}
                      className="lsOptionInput"
                      placeholder={options.adult}
                    />
                  </div>
                  <div className="lsOptionItem">
                    <span className="lsOptionText">Children</span>
                    <input
                      type="number"
                      min={0}
                      className="lsOptionInput"
                      placeholder={options.children}
                    />
                  </div>
                  <div className="lsOptionItem">
                    <span className="lsOptionText">Room</span>
                    <input
                      type="number"
                      min={1}
                      className="lsOptionInput"
                      placeholder={options.room}
                    />
                  </div> */}
                </div>
              </div>
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
          <div className="listResult">
            <h2>{`${destination}: ${data.length} properties found`} </h2>
            <br />
            {loading ? (
              "loading"
            ) : (
              <PaginatedItems itemsPerPage={4} data={data} />
            )}
          </div>
        </div>
      </div>
      <div className="spacer">
      </div>
      <div style={{ "margin-top": "15px" }}></div>
      <div style={{ "margin-top": "20px" }}>
        {/* <Footer /> */}
      </div>
      {modal && <Modal />}
      <GoToTop />
    </div>
  );
};
export default List;
