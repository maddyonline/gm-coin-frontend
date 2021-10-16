import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import { useContract } from "xcomponents/contract";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LinkMui from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  // Increase <Container> padding so it's
  // at least half of <Grid> spacing to
  // avoid horizontal scroll on mobile.
  // See https://material-ui.com/components/grid/#negative-margin
  container: {
    padding: `0 ${theme.spacing(3)}px`,
  },
  image: {
    margin: "0 auto",
    maxWidth: 570,
    display: "block",
    height: "auto",
    width: "100%",
  },
}));


const printable = visitor => {
  try {
    const [_, state] = visitor;
    return { visits: state.visitCount.toNumber(), last: state.lastVisit.toNumber() }
  } catch (_) {
    return visitor[0]
  }
}

function HeroSection(props) {
  const classes = useStyles();
  const { mint, visitor, account, create, revisit, visit, accountStatus, refresh } = useContract();

  window.account = account;

  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container className={classes.container}>
        <Grid container={true} alignItems="center" spacing={6}>
          <Grid container={true} item={true} direction="column" xs={12} md={6}>
            <Box textAlign={{ xs: "center", md: "left" }}>
              <SectionHeader
                title={props.title}
                subtitle={props.subtitle}
                size={4}
              />
              <Paper className={classes.paperItems}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  // alignItems="center"
                  padding={2}
                >
                  <div style={{ flex: "1" }}>
                    {mint && <Link href={`https://explorer.solana.com/address/${mint.toString()}?cluster=devnet`} passHref={true}>
                      <LinkMui>Mint</LinkMui>
                    </Link>}

                    <div>{"Account Status:"}{accountStatus}</div>
                    <div>{"Visitor: "} {JSON.stringify(printable(visitor))}</div>
                    <div>{"Account Balance: "}{account && account.amount.toNumber()}</div>
                  </div>
                  <div style={{ flex: "1" }}>
                    <Button variant="outlined" onClick={async () => await refresh()}>Refresh</Button>
                    <Button variant="outlined" onClick={async () => await create()} disabled={accountStatus !== "Not Found"}>Create Account</Button>
                    <Button variant="outlined" onClick={async () => await visit()} disabled={visitor && visitor[0] !== "Not Found"}>First Visit</Button>
                    <Button variant="outlined" onClick={async () => await revisit()} disabled={visitor && visitor[0] !== "found"}>Revisit</Button>
                  </div>
                </Box>

              </Paper>

            </Box>
          </Grid>
          <Grid item={true} xs={12} md={true}>
            <figure>
              <img
                src={props.image}
                alt="illustration"
                className={classes.image}
              />
            </figure>
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
}

export default HeroSection;
