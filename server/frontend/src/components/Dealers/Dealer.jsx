import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';

const Dealer = () => {
  

  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)
  const [isLoading, setIsLoading] = useState(true);

  const curr_url = window.location.href;
  const root_url = curr_url.substring(0,curr_url.indexOf("dealer"));
  const params = useParams();
  const id =params.id;
  const dealer_url = root_url+`djangoapp/dealer/${id}`;
  const reviews_url = root_url+`djangoapp/reviews/dealer/${id}`;
  const post_review = root_url+`postreview/${id}`;
  
  const get_dealer = async () => {
    try {
      const response = await fetch(dealer_url);
      const data = await response.json();
        if (data.status === 200 && data.dealer) {
  setDealer(data.dealer);
      } else {
        setDealer(null);
      }
    } catch (error) {
        setUnreviewed(true);
    }
  };


  const get_reviews = async () => {
    try {
      const response = await fetch(reviews_url);
      const data = await response.json();
      if (data.status === 200) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
        setUnreviewed(true);
    }
  };

  const senti_icon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return positive_icon;
      case 'negative':
        return negative_icon;
      default:
        return neutral_icon;
    }
  };

  useEffect(() => {
    const loadData = async () => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
        setPostReview(<a href={post_review}><img src={review_icon} style={{width:'10%',marginLeft:'10px',marginTop:'10px'}} alt='Post Review'/></a>)}
  
    setIsLoading(false);
};
loadData();
}, [id]);


return(
  <div>
      <Header/>
      <div style={{margin:"20px", marginTop:"10px"}}>
      <h1 style={{color:"grey"}}>{dealer.full_name}{postReview}</h1>
      <h4  style={{color:"grey"}}>{dealer['city']},{dealer['address']}, Zip - {dealer['zip']}, {dealer['state']} </h4>
      </div>
      <div class="reviews_panel">
      {reviews.length === 0 ? (
                <p className="no-reviews-message">No reviews yet!</p>
              ) : unreviewed === true? <div>Loading Reviews... </div> : (
      reviews.map(review => (
        <div className='review_panel'>
          <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment'/>
          <div className='review'>{review.review}</div>
          <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
        </div>)
      ))}
    </div>  
  </div>
)
}

export default Dealer