import TempComp from "./components/TempComp";

function App() {
  return (
    <div className="App">
      <TempComp key="1" name="Mike" />
      <TempComp key="2" name="Leo Kuyper" />
      <TempComp key="3" name="Paul" />
      <TempComp key="4" name="Leander Aarde" />


      {/* <TempComp key="2" name="Paul" />
      <TempComp key="3" name="James" />
      <TempComp key="4" name="Tim" /> */}
    </div>
  );
}

export default App;
