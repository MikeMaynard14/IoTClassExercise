import { useEffect, useState } from "react";
import TempComp from "./components/TempComp";

function App() {

  const studentNames = [
    "Mike Maynard",
    "Carmie Arpin",
    "Anchen Ayres",
    "Anneke Barnard",
    "Reinhardt DeBeer",
    "Vian Du Plessis",
    "Wiaan Duvenhage",
    "Cameron Godwin",
    "Justin Koster",
    "Carlo Kuyper",
    "Tsebo Ramonyalioa",
    "Simon Riley",
    "Shanre Scheepers",
    "Leander Van Aarde",
    "Cornel van der Vyver",
    "Monica Venter",
    "Marissa Wessels"
  ];

const [components, setComponents] = useState();

useEffect(()=>{
    const render = studentNames.map((item) => <TempComp key={item} name={item} />);
    setComponents(render);
},[]);

  return (
    <div className="App">
      {components}

    </div>
  );
}

export default App;
