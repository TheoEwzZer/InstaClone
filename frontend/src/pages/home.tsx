import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import Login from "./components/login";

function Home(): React.ReactElement {
  return (
    <ChakraProvider>
      <Login />
    </ChakraProvider>
  );
}

export default Home;
