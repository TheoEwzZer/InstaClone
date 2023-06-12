import React from "react";
import { Button, Wrap } from "@chakra-ui/react";

interface ButtonData {
  text: string;
  link: string;
}

function Footer(): React.ReactElement {
  const children: ButtonData[] = [
    { text: "Meta", link: "https://about.meta.com" },
    { text: "About", link: "https://about.instagram.com" },
    { text: "Blog", link: "https://about.instagram.com" },
    { text: "Jobs", link: "https://about.instagram.com/about-us/careers" },
    { text: "Help", link: "https://help.instagram.com" },
    { text: "API", link: "https://developers.facebook.com/docs/instagram" },
    { text: "Privacy", link: "https://privacycenter.instagram.com/policy" },
    { text: "Terms", link: "https://help.instagram.com/581066165581870/" },
    { text: "Top Accounts", link: "/accounts/login/" },
    { text: "Locations", link: "https://www.instagram.com/explore/locations/" },
    { text: "Instagram Lite", link: "https://www.instagram.com/web/lite/" },
    {
      text: "Contact Uploading & Non-User",
      link: "https://www.facebook.com/help/instagram/261704639352628",
    },
    {
      text: "Meta verified",
      link: "https://about.meta.com/technologies/meta-verified/",
    },
  ];

  const buttons: React.ReactNode[] = [];

  for (let i: number = 0; i < children.length; i++) {
    const data: ButtonData = children[i];
    const button: React.ReactNode = (
      <Button
        key={i}
        colorScheme="link"
        color="rgb(115, 115, 115)"
        size="sm"
        as="a"
        href={data.link}
      >
        {data.text}
      </Button>
    );
    buttons.push(button);
  }

  return (
    <Wrap justify="center" my="16">
      {buttons}
    </Wrap>
  );
}

export default Footer;
