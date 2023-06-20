import {Route, Routes} from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import {Box} from "@chakra-ui/react";

function App() {
  return (
    <Box padding='4'>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
      </Routes>
    </Box>
  );
}

export default App;
