import React from 'react';
import './App_slide.css';


import Slideshow from './component/slideshow';

let img1 = "https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-tree-covered-hill-41537-large.mp4";


const collection = [
  { src: img1 },

  
];

export default class App_slide extends React.Component {
  render() {
    return (
        
      <div className="App">
        
    

        <Slideshow
          input={collection}
          ratio={`16:3`}
          mode={`automatic`}
          timeout={`6000`}
        /> 
        
       

      </div>
    );
  }
}