import React, { ChangeEvent, useState } from "react";

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
  Heading,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import Footer from "./footer";

function isPhoneNumberOrEmail(input: string): string {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex: RegExp = /^\d{10}$/;

  if (emailRegex.test(input)) {
    return "email";
  }
  if (phoneRegex.test(input)) {
    return "phone";
  }
  return "invalid";
}

function Register(): React.ReactElement {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [mobileOrEmail, setMobileOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { isOpen, onToggle } = useDisclosure();

  const onClickReveal: () => void = (): void => {
    onToggle();
  };

  const changePassword: (event: React.ChangeEvent<HTMLInputElement>) => void = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsInputEmpty(event.target.value === "");
    setPassword(event.target.value);
  };

  const handleRegister: () => Promise<void> = async (): Promise<void> => {
    let email: string = "";
    let mobile: string = "";
    const inputType: string = isPhoneNumberOrEmail(mobileOrEmail);
    if (inputType === "invalid") {
      setErrorMessage("Please enter a valid email or phone number");
      return;
    }
    if (inputType === "email") {
      email = mobileOrEmail;
    } else {
      mobile = mobileOrEmail;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    if (!password || !username || inputType === "invalid") {
      setErrorMessage("Please fill in all fields");
      return;
    }
    const newUser = {
      email: email,
      fullName: fullName,
      mobile: mobile,
      password: password,
      username: username,
    };
    const response = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const data: any = await response.json();
    if (response.status !== 201) {
      email = "";
      mobile = "";
      setErrorMessage(data.detail);
      setMobileOrEmail("");
      setPassword("");
      setUsername("");
      return;
    }
    email = "";
    mobile = "";
    setErrorMessage("");
    setMobileOrEmail("");
    setPassword("");
    setUsername("");
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
            <Heading
              size={{ base: "xs", md: "sm" }}
              color="rgb(115, 115, 115)"
              textAlign="center"
            >
              Sign up to see photos and videos from your friends.
            </Heading>
            <Stack spacing="6">
              <FormControl>
                <Input
                  aria-label="Mobile Number or Email"
                  aria-required="true"
                  autoCapitalize="off"
                  autoComplete="tel"
                  autoCorrect="off"
                  id="emailOrPhone"
                  maxLength={75}
                  my={1}
                  name="emailOrPhone"
                  placeholder="Mobile Number or Email"
                  type="email,phone,mobile"
                  variant="outline"
                  onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                    setMobileOrEmail(event.target.value)
                  }
                  value={mobileOrEmail}
                />
                <Input
                  aria-label="Full Name"
                  aria-required="false"
                  autoCapitalize="off"
                  autoCorrect="off"
                  id="fullName"
                  my={1}
                  name="fullName"
                  placeholder="Full Name"
                  type="text"
                  variant="outline"
                  onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                    setFullName(event.target.value)
                  }
                  value={fullName}
                />
                <Input
                  aria-label="Username"
                  aria-required="true"
                  autoCapitalize="off"
                  autoCorrect="off"
                  id="username"
                  maxLength={30}
                  my={1}
                  name="username"
                  placeholder="Username"
                  type="text"
                  variant="outline"
                  onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                    setUsername(event.target.value)
                  }
                  value={username}
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
                    my={1}
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
              <Text fontSize="xs" textAlign="center" color="rgb(115, 115, 115)">
                People who use our service may have uploaded your contact
                information to Instagram.
              </Text>
              <Text fontSize="xs" textAlign="center" color="rgb(115, 115, 115)">
                By signing up, you agree to our Terms. Learn how we collect, use
                and share your data in our Privacy Policy and how we use cookies
                and similar technology in our Cookies Policy.
              </Text>
              <Button colorScheme="blue" size="lg" onClick={handleRegister}>
                Next
              </Button>
              <Text textAlign="center" color="red.500">
                {errorMessage}
              </Text>
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
            <Text color="rgb(115, 115, 115)">Have an account?</Text>
            <Button
              variant="text"
              color="rgb(0, 149, 246)"
              onClick={(): void => {
                window.location.href = "/accounts/login/";
              }}
            >
              Log in
            </Button>
          </HStack>
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default Register;
