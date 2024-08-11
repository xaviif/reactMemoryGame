import { useState, useEffect } from 'react'
import './App.css'
function getLuminance(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function getTextColor(hex) {
  const luminance = getLuminance(hex);
  return luminance > 0.5 ? '#000000' : '#FFFFFF'; // Return black for bright backgrounds, white for dark backgrounds
}

const shuffleArray = (a) => a.sort(() => Math.random()-0.5)

function getRandomGreenColor() {
  const shadesOfGreen = [
    '#006400', '#008000', '#228B22', '#32CD32', '#00FF00',
    '#7FFF00', '#7CFC00', '#ADFF2F', '#98FB98', '#90EE90',
  ];
  return shadesOfGreen[Math.floor(Math.random() * shadesOfGreen.length)];
}

function Counter({currentNumber}){
  const numb = currentNumber.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  return (
    <span className={`counterCont`}> 
      <p>
        {numb[0]}
      </p>
      <p>
        {numb[1]}
      </p>
    </span>
  )
}
let isNew = true;
let hadGameEnded = false;
function PresentColors({colors, onClickHandle, order}){
  return (
    < >
      {
      order.map((colorName) => (
        <div 
          key={colorName} 
          className={`colorCard ${isNew ? 'fade-in' : ''} ${hadGameEnded ? '' : 'mouseHover'}`}
          
          style={{ 
            backgroundColor: (colors[colorName]), 
            color: (colors[colorName]!=="#000" )? getTextColor(colors[colorName]) : "#000",
            '--color': colors[colorName],  // Set CSS variable for animation
            '--textColor': getTextColor(colors[colorName]),
          }}
          onClick={
            () => hadGameEnded ? false : onClickHandle(colorName)
          }
        >
          <p>{colorName}</p>
        </div>
      ))
      }
    </ >
  )
}

const possibleColors = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
};
const truecolors = {}
Object.assign(truecolors, possibleColors)
console.log(truecolors)
function WinScreen({ onReset }) {
  return (
    <div className="winScreenOverlay" style={{
      opacity: hadGameEnded ? 1: 0,
      pointerEvents: hadGameEnded ? "all" : "none",
      transitionDelay: hadGameEnded ? '1250ms' : '0ms',
    }}>
      <div className="winScreenContent">
        <h1>game over.</h1>
        <button onClick={onReset}>Play Again</button>
      </div>
    </div>
  );
}

function App() {
  const [memory, setMemory] = useState({}); 
  const [highScore, setHighScore] = useState(0); 
  const [order, setOrder] = useState(Object.keys(possibleColors));
  const [gameWon, setGameWon] = useState(false);
  function endGame(){
    let i = 0;
    for(let [key, value] of Object.entries(memory).reverse()){
      setTimeout(() => {
        let r = (Math.random() > 0.5) ? 255 - (i*1.05) : 260 - (i * Math.sin(i) * 1.05) - Math.random() * 1.05;
        let g = (Math.random() > 0.5) ? 255 - (i*2.5) : 260 - (i * Math.sin(i) * 5) - Math.random() * 10;
        let b = (Math.random() > 0.5) ? 255 - (i*2.5) : 260 - (i * Math.sin(i) * 5) - Math.random() * 10;
        
        possibleColors[key] = `rgb(${r}, ${g}, ${b}) `;
        setOrder(shuffleArray(Object.keys(possibleColors)));

      }, i * 350);
      i++;
    }

    setTimeout(() => {
      hadGameEnded = true;
      const currentScore = Object.entries(memory).length
      if(currentScore > highScore) setHighScore(currentScore)
      setGameWon(true);
    }, 350 * i);
  }

  function wonGame() {
    let i = 0;
    for(let [key, value] of Object.entries(memory).reverse()){
      setTimeout(() => {
        let r = (Math.random() > 0.5) ? 255 - (i*2.5) : 260 - (i * Math.sin(i) * 5) - Math.random() * 10;
        let g = (Math.random() > 0.5) ? 255 - (i*2.5) : 260 - (i * Math.sin(i) * 5) - Math.random() * 10;
        let b = (Math.random() > 0.5) ? 255 - (i*2.5) : 260 - (i * Math.sin(i) * 5) - Math.random() * 10;
        
        possibleColors[key] = `rgb(${r}, ${g}, ${b}) `;
        setOrder([...Object.keys(possibleColors)]);

      }, 350 * i); // Delay each row update by 1 second (1000 milliseconds)
      i++;
    }
    setTimeout(() => {
      setHighScore(Object.values(memory).length + 1);
      hadGameEnded = true;
      setGameWon(true);
    }, 350 * i);
  }
  function handleColorClick(color){
    isNew = false;
    if(memory[color]) return endGame()
    setMemory(prevMemory => ({
      ...prevMemory,
      [color]: possibleColors[color]
    }));
    if(Object.values(memory).length >= 8) return wonGame()
    setOrder(shuffleArray(Object.keys(possibleColors)));

  };
  
  function resetGame() {
    Object.assign(possibleColors, truecolors)
    setMemory({});
    setOrder(Object.keys(possibleColors));
    setGameWon(false);
    hadGameEnded = false;
    isNew = true;
  }
  return (
    
    <>
    <section>
      <div className='uiCont'>
        <span>
          <p className='highScore'>High Score</p>
          <Counter currentNumber={highScore} highScore={true}/>
        </span>

        <span>
          <p>current score</p>
          <Counter currentNumber={Object.values(memory).length}/>

        </span>
      </div>
      <div className='cardCardContainer'>
        <PresentColors 
          colors={possibleColors}
          onClickHandle={handleColorClick}
          order={order}
        />
      </div>
      {true && <WinScreen onReset={resetGame} />}
      
    </section>

    </>
  )
}

export default App
