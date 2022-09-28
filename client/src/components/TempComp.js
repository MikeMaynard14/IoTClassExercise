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
import faker from 'faker';

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

  const [temp, setTemp] = useState("Loading... ");
  const [labels, setLabels] = useState([]);
  const [chartdata, setChartData] = useState([]);
  const [ledValue, setLedValue] = useState("Loading...");
  const [ledState, setLedState] = useState();

    useEffect(() => {
      const interval = setInterval(() => {
        axios.get('http://localhost:80/api/getTemp/' + name)
        .then(res => {
        let labelArray = [];
        let dataArray = [];

        if(res.data.reverse()[0].led === false){
          setLedValue("OFF")
        } else {
          setLedValue("ON")
        }
  
        for(var i = 0; i < res.data.length; i++){
          setTemp(res.data[i].temp + "C");
          labelArray.push(res.data[i].time.slice(11, 16));
          setLabels(labelArray);
          dataArray.push(res.data[i].temp);
          setChartData(dataArray);
        } 

      });
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    const ledToggle = () => {
      let state = ledState;

      if(state != true){
         setLedState(true)
      }else{
         state = false
         setLedState(false)
      }
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
    labels: labels.reverse(),
    datasets: [
      {
        label: props.name + "'s Temperature",
        data: chartdata.reverse(), 
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgb(75, 192, 192)',
      }
    ],
  };


  return (
    <div>
        <div className='card'>
          <h1>{props.name}</h1>
          <p>Latest Reading: {temp}</p>
          <p>LED Status: {ledValue}</p>
          <Line options={options} data={data} />
          <div onClick={ledToggle} className='button'>Toggle LED</div>
        </div>
       
      
    </div>
  )
}

export default TempComp
