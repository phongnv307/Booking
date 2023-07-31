import React from "react";

function review({ review }) {
  const titleCase = (str) => {
    var splitStr = str?.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }
  return (
    <div>
      {console.log(review)}
      {review?.map((item, idx) => (

        <div className="reviewUser">         
          <div className="userReview">
            <div className="userMark">
              <span>{item.rating}</span>
              <img
                className="imageStar"
                src="https://img.icons8.com/fluency/512/star.png"
                alt=""
              />
            </div>
            {/* <div className="reviewContent">
              <span>
                {item[1]}
              </span>
            </div> */}
          </div>
          <div className="userInfor">
            <div className="userName">{titleCase(item.userName)}</div>
            <div>
              {item.comment}
            </div>
          </div>
        </div>



      ))}
    </div>
  );
}

export default review;
