import { Link, useNavigate } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  console.log(item);
  const navigate = useNavigate();
  const gotoHotel = (id) => {
    navigate(`/hotels/${id}`)
    window.location.reload();
    //`/hotels/${item._id}`
  }
  return (
    <div className="searchItem">
      <img src={item.photos[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item?.title}</h1>
        <span className="siDistance">{item.address}</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        {item.rating && <div className="siRating">
          <span>Excellent</span>
          <button style={{display: 'flex'}}>
            <h4 style={{marginRight: '10px'}}>{item.rating?.toFixed(1)} </h4>
            <img
                  style={{width: '2.5vw'}}
                  src="https://img.icons8.com/fluency/512/star.png"
                  alt=""
                />
          </button>
        </div>}
        <div className="siDetailTexts">
          <span className="siPrice">${item.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button onClick={() => { gotoHotel(item._id) }} className="siCheckButton">See availability</button>
          {/* <Link to={`/hotels/${item._id}`}>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
