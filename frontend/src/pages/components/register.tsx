import { ChangeEvent, ReactElement, useState } from "react";

import {
  Box,
  Button,
  Container,
  FormControl,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

function Register(): ReactElement {
  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [mobileOrEmail, setMobileOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const { isOpen, onToggle } = useDisclosure();
  const [birthday, setBirthday] = useState<Date>(new Date());

  const handleDateChange: (date: Date | null) => void = (
    date: Date | null
  ): void => {
    if (date) {
      setBirthday(date);
    }
  };

  const onClickReveal: () => void = (): void => {
    onToggle();
  };

  const changePassword: (event: ChangeEvent<HTMLInputElement>) => void = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setIsInputEmpty(event.target.value === "");
    setPassword(event.target.value);
  };

  const handleCheckRegister: () => Promise<void> = async (): Promise<void> => {
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
    const response = await fetch("http://localhost:8000/checkregister", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    const data: any = await response.json();
    if (response.status !== 200) {
      email = "";
      mobile = "";
      setErrorMessage(data.detail);
      setMobileOrEmail("");
      setPassword("");
      setUsername("");
      return;
    }
    setErrorMessage("");
    setStep(2);
  };

  const handleBack: () => void = (): void => {
    setStep(1);
  };

  const handleRegister: () => Promise<void> = async (): Promise<void> => {
    let email: string = "";
    let mobile: string = "";
    const inputType: string = isPhoneNumberOrEmail(mobileOrEmail);
    if (inputType === "email") {
      email = mobileOrEmail;
    } else {
      mobile = mobileOrEmail;
    }
    if (birthday > new Date()) {
      setErrorMessage("Please enter a valid date");
      return;
    }
    const newUser = {
      email: email,
      fullName: fullName,
      mobile: mobile,
      password: password,
      username: username,
      birthday: birthday.toISOString().slice(0, 10),
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
      setBirthday(new Date());
      return;
    }
    email = "";
    mobile = "";
    setErrorMessage("");
    setMobileOrEmail("");
    setPassword("");
    setUsername("");
    setBirthday(new Date());
    setStep(2);
  };

  if (step === 1) {
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
                <Text
                  fontSize="xs"
                  textAlign="center"
                  color="rgb(115, 115, 115)"
                >
                  People who use our service may have uploaded your contact
                  information to Instagram.
                </Text>
                <Text
                  fontSize="xs"
                  textAlign="center"
                  color="rgb(115, 115, 115)"
                >
                  By signing up, you agree to our Terms. Learn how we collect,
                  use and share your data in our Privacy Policy and how we use
                  cookies and similar technology in our Cookies Policy.
                </Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleCheckRegister}
                >
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
  } else {
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
            <Stack spacing="8">
              <Heading size={{ base: "xs", md: "sm" }} textAlign="center">
                Add Your Birthday
              </Heading>
              <Heading
                as="h3"
                size={{ base: "xs", md: "sm" }}
                textAlign="center"
              >
                This won't be a part of your public profile.
              </Heading>
              <DatePicker
                selected={birthday}
                onChange={handleDateChange}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
              <Stack spacing="6">
                <Text
                  fontSize="xs"
                  textAlign="center"
                  color="rgb(115, 115, 115)"
                >
                  You need to enter the date you were born
                </Text>
                <Text
                  fontSize="xs"
                  textAlign="center"
                  color="rgb(115, 115, 115)"
                >
                  Use your own birthday, even if this account is for a business,
                  a pet, or something else
                </Text>
                <Button colorScheme="blue" size="lg" onClick={handleRegister}>
                  Next
                </Button>
                <Button colorScheme="blue" size="lg" onClick={handleBack}>
                  Go Back
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
}

export default Register;
