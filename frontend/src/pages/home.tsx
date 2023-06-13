import { ChakraProvider } from "@chakra-ui/react";
import { ReactElement, useEffect, useState } from "react";
import MainPage from "./components/home";
import Login from "./components/login";

async function IsLoggedIn(): Promise<boolean> {
  const token: string | null = localStorage.getItem("jwtToken");
  if (!token) {
    return false;
  }
  const response = await fetch(`http://localhost:8000/check_token`, {
    method: "GET",
    headers: { token: token },
  });
  if (response.status !== 200) {
    return false;
  }
  return true;
}

function Home(): ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): void => {
    const checkLogin: () => Promise<void> = async (): Promise<void> => {
      const loggedIn: boolean = await IsLoggedIn();
      setIsLoggedIn(loggedIn);
      setIsLoading(false);
    };

    checkLogin();
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <ChakraProvider>{isLoggedIn ? <MainPage /> : <Login />}</ChakraProvider>
  );
}

export default Home;
