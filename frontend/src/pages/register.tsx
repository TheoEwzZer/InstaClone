import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import Register from "./components/register";

function RegisterPage(): React.ReactElement {
  return (
    <ChakraProvider>
      <Register />
    </ChakraProvider>
  );
}

export default RegisterPage;
