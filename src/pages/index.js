import React from "react";
import Meta from "components/Meta";
import HeroSection from "components/HeroSection";


function IndexPage(props) {

  return (
    <>
      <Meta />
      <HeroSection
        bgColor="default"
        size="medium"
        bgImage=""
        bgImageOpacity={1}
        title="Earn GM coin on Solana"
        subtitle="Every visit earns a GM coin after a 15 minutes contract enforced lockout"
        image="/gm.svg"
        buttonText="Get Started"
        buttonColor="primary"
        buttonPath="/pricing"
      />
    </>
  );
}

export default IndexPage;
