import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Layout from "./layout";
import Datatable from "./view/Datatable";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Layout>
        <Datatable/>
      </Layout>
    </div>
  );
}

export default App;
