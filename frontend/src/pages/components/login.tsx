import { ChangeEvent, ReactElement, useState } from "react";

import {
  Box,
  Button,
  Container,
  FormControl,
  HStack,
  Text,
  Image,
  Input,
  Stack,
  useDisclosure,
  InputGroup,
  InputRightElement,
  Divider,
} from "@chakra-ui/react";
import Footer from "./footer";

function isPhoneNumberOrEmailOrUsername(input: string): string {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex: RegExp = /^\d{10}$/;

  if (emailRegex.test(input)) {
    return "email";
  }
  if (phoneRegex.test(input)) {
    return "phone";
  }
  return "username";
}

function Login(): ReactElement {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [mobileOrEmailOrUsername, setMobileOrEmailOrUsername] =
    useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { isOpen, onToggle } = useDisclosure();

  const onClickReveal: () => void = (): void => {
    onToggle();
  };

  const changePassword: (event: ChangeEvent<HTMLInputElement>) => void = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setIsInputEmpty(event.target.value === "");
    setPassword(event.target.value);
  };

  const handleLogin: () => Promise<void> = async (): Promise<void> => {
    let email: string = "";
    let mobile: string = "";
    let username: string = "";
    const inputType: string = isPhoneNumberOrEmailOrUsername(
      mobileOrEmailOrUsername
    );
    if (inputType === "email") {
      email = mobileOrEmailOrUsername;
    } else if (inputType === "phone") {
      mobile = mobileOrEmailOrUsername;
    } else {
      username = mobileOrEmailOrUsername;
    }
    if (!password || !mobileOrEmailOrUsername) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    const User = {
      email: email,
      mobile: mobile,
      password: password,
      username: username,
    };
    console.log(User);
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(User),
    });
    const data: any = await response.json();
    if (response.status !== 200) {
      setErrorMessage(data.detail);
      return;
    }
    email = "";
    mobile = "";
    username = "";
    setErrorMessage("");
    setMobileOrEmailOrUsername("");
    setPassword("");
  };

  return (
    <>
      <Container
        maxW="lg"
        py={{ base: "0", sm: "8" }}
        px={{ base: "0", sm: "8" }}
      >
        <Box
          bg={{ base: "transparent", sm: "bg.surface" }}
          borderWidth={{ base: "0px", sm: "1px" }}
          boxShadow={{ base: "none", sm: "md" }}
          px={{ base: "4", sm: "10" }}
          py={{ base: "0", sm: "8" }}
        >
          <Image
            alt="logo"
            mx="auto"
            my={6}
            alignSelf={{ base: "center", md: "flex-start" }}
            src="https://cdn2.downdetector.com/static/uploads/c/300/cf7bc/Instagram_Logo_Large.png"
          />
          <Stack spacing="8">
            <Stack spacing="6">
              <FormControl>
                <Input
                  aria-label="Phone number, username, or email"
                  aria-required="true"
                  autoCapitalize="off"
                  autoCorrect="off"
                  id="username"
                  maxLength={75}
                  my={4}
                  name="username"
                  placeholder="Phone number, username, or email"
                  type="email,phone,mobile,username"
                  variant="outline"
                  onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                    setMobileOrEmailOrUsername(event.target.value)
                  }
                  value={mobileOrEmailOrUsername}
                />
                <InputGroup>
                  {!isInputEmpty && (
                    <InputRightElement width="4.5rem">
                      <Button
                        aria-label={isOpen ? "Hide" : "Show"}
                        onClick={onClickReveal}
                        variant="text"
                      >
                        {isOpen ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  )}
                  <Input
                    aria-label="Password"
                    aria-required="true"
                    autoCapitalize="off"
                    autoComplete="current-password"
                    autoCorrect="off"
                    color="fg.muted"
                    id="password"
                    name="password"
                    onChange={changePassword}
                    placeholder="Password"
                    type={isOpen ? "text" : "password"}
                    value={password}
                    variant="outline"
                  />
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack spacing="6">
              <Button
                colorScheme="blue"
                backgroundColor="rgb(0, 149, 246)"
                onClick={handleLogin}
              >
                Log in
              </Button>
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="fg.muted">
                  OR
                </Text>
                <Divider />
              </HStack>
              <Button colorScheme="link" color="rgb(56, 81, 133)">
                Log in with Facebook
              </Button>
              <Text textAlign="center" color="red.500">
                {errorMessage}
              </Text>
              <Button colorScheme="link" color="rgb(0, 55, 107)" size="sm">
                Forgot password?
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Box
          bg={{ base: "transparent", sm: "bg.surface" }}
          borderWidth={{ base: "0px", sm: "1px" }}
          boxShadow={{ base: "none", sm: "md" }}
          px={{ base: "4", sm: "10" }}
          py={{ base: "0", sm: "8" }}
        >
          <HStack spacing="0" justify="center">
            <Text color="fg.muted">Don't have an account?</Text>
            <Button
              variant="text"
              color="rgb(0, 149, 246)"
              onClick={(): void => {
                window.location.href = "/accounts/emailsignup/";
              }}
            >
              Sign up
            </Button>
          </HStack>
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default Login;
