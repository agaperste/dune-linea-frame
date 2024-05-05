import { Button, Frog, TextInput } from 'frog'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import dotenv from 'dotenv';
import { getLXPByFID, getLXPByWallet, getLXPRandomly } from './dune.js'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
dotenv.config();

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynar({ apiKey: process.env["NEYNAR_API_KEY"] || 'NEYNAR_FROG_FM' })

})

app.frame('/', async (c) => {
  const { buttonValue, status, frameData, verified } = c
  const option = buttonValue
  let lxp_stats: { key: any; value: any; }[] = [];
  console.log(`loading / ..., status=${status}, option=${option}, verified=${verified}`)
  
  if (status === 'response' && verified && option === 'mine') {
    console.log(`running filter for option ${option}, fid ${frameData?.fid}`)
    lxp_stats = await getLXPByFID(frameData?.fid ?? 0);
  }

  if (status === 'response' && verified && option === 'random') {
    console.log("Fetching a random person's record")
    lxp_stats = await getLXPRandomly();
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #E1E1F9, #FFECEB)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 50,
            fontStyle: 'normal',
            letterSpacing: '-0.020em',
            lineHeight: 1.3,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 'bold'
          }}
        >
          {status === 'response'
            ? option 
              ? (lxp_stats.length > 0 ?
                <div style={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '20px', 
                  fontSize: '38px', 
                  color: '#333', 
                  fontFamily: 'Arial, sans-serif', 
                  textAlign: 'left'  // Ensures that all text is aligned left
                }}>
                  <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: '15px', 
                    fontWeight: 'bold'
                  }}>
                    {`LXP Balance 🧮: ${lxp_stats.find(stat => stat.key === 'current_lxp')?.value || '0'}`}
                  </div>
                  <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: '15px'
                  }}>
                    <div>{`Farcaster Name 🆔: ${lxp_stats.find(stat => stat.key === 'fname')?.value}`}</div>
                    <div>{`Activity Level 👑: ${lxp_stats.find(stat => stat.key === 'L14D_active_tier')?.value}`}</div>
                    <div>{`Top Engagers 👋: ${lxp_stats.find(stat => stat.key === 'top_engagers')?.value}`}</div>
                    <div>{`Top Channels 💬: ${lxp_stats.find(stat => stat.key === 'top_channels')?.value}`}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{`Days on Chain 🧓: ${lxp_stats.find(stat => stat.key === 'days_old_onchain')?.value}`}</div>
                    <div>{`Onchain Transactions 🧾: ${lxp_stats.find(stat => stat.key === 'num_onchain_txns')?.value}`}</div>
                    <div>{`Deployed Contracts 📜: ${lxp_stats.find(stat => stat.key === 'contracts_deployed')?.value}`}</div>
                  </div>
                </div>
                : <div style={{
                    padding: '20px', 
                    fontSize: '48px', 
                    fontWeight: 'bold', 
                    color: '#333', 
                    textAlign: 'left'  // Aligns text left if no LXP data
                  }}>You have no LXP 😢</div>)
              : ''
            : `Get your Linea LXP balance 🧮 w/ \n Fun social and onchain metrics 🤝⛓📈🥇 \n `}


        </div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '150px',
            height: '80px',
          }}
        >
          <img src="/linea_logo.png" alt="Linea Logo" /> 
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '150px',
            height: '80px',
          }}
        >
          <img src="/dune_logo.png" alt="Dune Logo" />
        </div>
      </div>
    ),
    intents: [
      status === 'initial'  && <Button value="mine">Get my LXP 🤗</Button>,
      status === 'initial'  && <Button action="/wallet" value="others">Input wallet 🕵️</Button>,
      (status === 'initial' || status === 'response') && <Button value="random">Surprise me 🎰</Button>,
      status === 'response' && <Button.Link href="https://github.com/agaperste/dune-linea-frame">See Frame Code</Button.Link>,
      status === 'response' && <Button.Reset>Back</Button.Reset>,
    ],
  })
})

app.frame('/wallet', async (c) => {
  const { buttonValue, inputText, status, verified } = c
  const option = buttonValue
  const walletAddress = inputText
  let lxp_stats: { key: any; value: any; }[] = [];
  console.log(`loading /wallet ..., status=${status}, option=${option}, verified=${verified}`)

  if (status === 'response' && verified && option === 'wallet' && walletAddress) {
    console.log("running filter for wallet ", walletAddress)
    lxp_stats = await getLXPByWallet(walletAddress);
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #E1E1F9, #FFECEB)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 50,
            fontStyle: 'normal',
            letterSpacing: '-0.020em',
            lineHeight: 1.3,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 'bold'
          }}
        >
          {status === 'response'
            ? option && walletAddress
              ? (lxp_stats.length > 0 ?
                <div style={{
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '20px', 
                  fontSize: '38px', 
                  color: '#333', 
                  fontFamily: 'Arial, sans-serif', 
                  textAlign: 'left'  // Ensures that all text is aligned left
                }}>
                  <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: '15px', 
                    fontWeight: 'bold'
                  }}>
                    {`LXP Balance 🧮: ${lxp_stats.find(stat => stat.key === 'current_lxp')?.value || '0'}`}
                  </div>
                  <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: '15px'
                  }}>
                    <div>{`Farcaster Name 🆔: ${lxp_stats.find(stat => stat.key === 'fname')?.value}`}</div>
                    <div>{`Activity Level 👑: ${lxp_stats.find(stat => stat.key === 'L14D_active_tier')?.value}`}</div>
                    <div>{`Top Engagers 👋: ${lxp_stats.find(stat => stat.key === 'top_engagers')?.value}`}</div>
                    <div>{`Top Channels 💬: ${lxp_stats.find(stat => stat.key === 'top_channels')?.value}`}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{`Days on Chain 🧓: ${lxp_stats.find(stat => stat.key === 'days_old_onchain')?.value}`}</div>
                    <div>{`Onchain Transactions 🧾: ${lxp_stats.find(stat => stat.key === 'num_onchain_txns')?.value}`}</div>
                    <div>{`Deployed Contracts 📜: ${lxp_stats.find(stat => stat.key === 'contracts_deployed')?.value}`}</div>
                  </div>
                </div>
                : <div style={{
                    padding: '20px', 
                    fontSize: '48px', 
                    fontWeight: 'bold', 
                    color: '#333', 
                    textAlign: 'left'  // Aligns text left if no LXP data
                  }}>The wallet has no LXP 😢</div>)
              : `Check wallet's Linea LXP balance 👛 w/ \n Fun social and onchain metrics 🤝⛓📈🥇 \n`
            : `Check wallet's Linea LXP balance 👛 w/ \n Fun social and onchain metrics 🤝⛓📈🥇 \n`}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            width: '150px',
            height: '80px',
          }}
        >
          <img src="/linea_logo.png" alt="Linea Logo" /> 
        </div>
        <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              width: '150px',
              height: '80px',
            }}
        >
          <img src="/dune_logo.png" alt="Dune Logo" />
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter wallet address..."></TextInput>,
      status === 'response'  && <Button value="wallet">Get wallet LXP and stats 🕵️</Button>,
      status === 'response' && <Button.Reset>Back</Button.Reset>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
