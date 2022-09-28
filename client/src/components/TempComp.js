import React, { useEffect, useState } from 'react'
import axios from 'axios'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ledOn from '../assets/ledOnWhite.png'
import ledOff from '../assets/ledOffWhite.png'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TempComp = (props) => {

  let name = props.name;

  const [temp, setTemp] = useState("-- ");
  const [labels, setLabels] = useState([]);
  const [chartdata, setChartData] = useState([]);
  const [ledValue, setLedValue] = useState("Loading...");
  const [ledState, setLedState] = useState();
  const [ledImage, setLedImage] = useState(ledOff);

    useEffect(() => {
      const interval = setInterval(() => {
        axios.get('http://localhost:80/api/getTemp/' + name)
        .then(res => {
        let labelArray = [];
        let dataArray = [];
 
        for(var i = 0; i < res.data.length; i++){
          labelArray.push(res.data[i].time.slice(11, 16));
          setLabels(labelArray);
          dataArray.push(res.data[i].temp);
          setChartData(dataArray);
        } 

      });

      axios.get('http://localhost:80/api/getLed/' + name)
        .then(res => {

        if(res.data.led === false){
          setLedValue("OFF")
          setLedImage(ledOff);
        } else {
          setLedValue("ON")
          setLedImage(ledOn);
        }

      });

      axios.get('http://localhost:80/api/getLastTemp/' + name)
        .then(res => {
        
        setTemp(res.data.temp);
        
      });


      }, 5000);

      
      return () => clearInterval(interval);
    }, []);

    const ledToggle = () => {
      let state = ledState;

      if(state !== true){
        setLedState(true)
        
        console.log("Led true");
     }else{
        state = false
        setLedImage(ledOff);
        setLedState(false)
        console.log("Led false");
     }
     console.log(ledState);
      let payload = {
        led: ledState
    }
      axios.patch('http://localhost:80/api/updateLed/' + name, payload)
        .then((res)=> {
         
           if(res){
            console.log('Led Updated');
           }
        })
        .catch(function (error) {
            console.log(error);
        });
      
      
    }


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: props.name + "'s Temperature",
        data: chartdata, 
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192)',
      }
    ],
  };


  return (
    <div>
        <div className='card'>
          <div className='card-left'>
            <h1>{props.name}</h1>
            <p>Week 3: Class Exercise</p>
            <p className='desc'>Build this weeks circuit and upload your code to start seeing data...</p>
          </div>
          <div className='card-right'>
            <h1>{temp}</h1>
            <h3>C</h3>
            <p>Latest Reading</p>
          </div>
          
          <Line options={options} data={data} />
          <div onClick={ledToggle} className='button'>Toggle LED</div>
          <div className='led'><img src={ledImage}></img></div>
        </div>
       
      
    </div>
  )
}

export default TempComp
