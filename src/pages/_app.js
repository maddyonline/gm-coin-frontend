import React from "react";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import { AuthProvider } from "util/auth";
import { ContractProvider } from "xcomponents/contract";
import { ThemeProvider } from "util/theme";
import { QueryClientProvider } from "util/db";
import dynamic from 'next/dynamic';

const WalletConnectionProvider = dynamic(() => import('../xcomponents/Wallet'), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AuthProvider>
          <>
            {/* <Navbar
              color="default"
              logo="https://uploads.divjoy.com/logo.svg"
              logoInverted="https://uploads.divjoy.com/logo-white.svg"
            /> */}
            <WalletConnectionProvider>
              <ContractProvider>
                <Component {...pageProps} />
              </ContractProvider>
            </WalletConnectionProvider>


            <Footer
              bgColor="light"
              size="normal"
              bgImage=""
              bgImageOpacity={1}
              description="A short description of what you do here"
              copyright={`© ${new Date().getFullYear()} Company`}
              logo="https://uploads.divjoy.com/logo.svg"
              logoInverted="https://uploads.divjoy.com/logo-white.svg"
              sticky={true}
            />
          </>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider >
  );
}

export default MyApp;
