import { ChakraProvider } from "@chakra-ui/react";
import { ReactElement } from "react";
import Login from "./components/login";

function Home(): ReactElement {
  return (
    <ChakraProvider>
      <Login />
    </ChakraProvider>
  );
}

export default Home;
