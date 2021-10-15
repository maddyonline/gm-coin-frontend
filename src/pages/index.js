import React from "react";
import Meta from "components/Meta";
import HeroSection from "components/HeroSection";
import ClientsSection from "components/ClientsSection";
import FeaturesSection from "components/FeaturesSection";
import TestimonialsSection from "components/TestimonialsSection";
import NewsletterSection from "components/NewsletterSection";
import { useContract } from "xcomponents/contract";
import { Button } from "@material-ui/core";



function IndexPage(props) {
  const { mint, visitor, account, create, revisit, accountStatus, refresh } = useContract();
  return (
    <>
      <Meta />
      <div>{mint && mint.toString()}</div>
      <div>{accountStatus}</div>
      <div>{"Visitor: "} {JSON.stringify(visitor)}</div>
      <div>{JSON.stringify(account)}</div>
      <div>
        <Button variant="outlined" onClick={async () => await refresh()}>Refresh</Button>
        <Button variant="outlined" onClick={async () => await create()} disabled={accountStatus !== "Not Found"}>Create Account</Button>
        <Button variant="outlined" onClick={async () => await create()} disabled={visitor && visitor[0] !== "Not Found"}>First Visit</Button>
        <Button variant="outlined" onClick={async () => await revisit()} disabled={visitor && visitor[0] !== "Not Found"}>Revisit</Button>
      </div>
      <HeroSection
        bgColor="default"
        size="medium"
        bgImage=""
        bgImageOpacity={1}
        title="Your landing page title here"
        subtitle="This landing page is perfect for showing off your awesome product and driving people to sign up for a paid plan."
        image="https://uploads.divjoy.com/undraw-japan_ubgk.svg"
        buttonText="Get Started"
        buttonColor="primary"
        buttonPath="/pricing"
      />
      <ClientsSection
        bgColor="light"
        size="normal"
        bgImage=""
        bgImageOpacity={1}
        title=""
        subtitle=""
      />
      <FeaturesSection
        bgColor="default"
        size="medium"
        bgImage=""
        bgImageOpacity={1}
        title="Features"
        subtitle="All the features you need to move faster"
      />
      <TestimonialsSection
        bgColor="light"
        size="medium"
        bgImage=""
        bgImageOpacity={1}
        title="Here's what people are saying"
        subtitle=""
      />
      <NewsletterSection
        bgColor="default"
        size="medium"
        bgImage=""
        bgImageOpacity={1}
        title="Stay in the know"
        subtitle="Receive our latest articles and feature updates"
        buttonText="Subscribe"
        buttonColor="primary"
        inputPlaceholder="Enter your email"
        subscribedMessage="You are now subscribed!"
      />
    </>
  );
}

export default IndexPage;
