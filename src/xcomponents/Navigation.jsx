import { Toolbar, Typography } from '@material-ui/core';
import DisconnectIcon from '@material-ui/icons/LinkOff';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-material-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Section from "components/Section";
import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import WbSunnyIcon from "@material-ui/icons/WbSunny";

import { useDarkMode } from "util/theme"

const Navigation = () => {
    const { wallet } = useWallet();
    const darkMode = useDarkMode();
    return (
        <Section bgColor="default" size="auto">
            <AppBar position="static" color="transparent" elevation={0}>
                <Container disableGutters={true}>
                    <Toolbar style={{ display: 'flex' }}>
                        <Typography component="h1" variant="h6" style={{ flexGrow: 1 }}>
                            GM Coin
                        </Typography>
                        <WalletMultiButton />
                        {wallet && <WalletDisconnectButton startIcon={<DisconnectIcon />} style={{ marginLeft: 8 }} />}
                        <IconButton
                            color="inherit"
                            onClick={darkMode.toggle}
                            style={{ opacity: 0.6 }}
                        >
                            {darkMode.value && <NightsStayIcon />}

                            {!darkMode.value && <WbSunnyIcon />}
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>
        </Section>
    );
};

export default Navigation;