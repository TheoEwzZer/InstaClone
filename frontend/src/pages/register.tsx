import { ChakraProvider } from "@chakra-ui/react";
import { ReactElement } from "react";
import Register from "./components/register";

function RegisterPage(): ReactElement {
  return (
    <ChakraProvider>
      <Register />
    </ChakraProvider>
  );
}

export default RegisterPage;
