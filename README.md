# Frame with Dune Linea API

This repo showcases how to leverage Dune Linea API with a Farcaster Frame to display LXP points alongside with social and onchain metrics.

### Frame Paths

- **Fetch Your Stats**: Gets LXP and related stats if based in your Farcaster ID.
- **Input Wallet Address**: Allows users to enter a specific wallet address to fetch and display metrics.
- **Random Stats**: A fun "Surprise Me" button that fetches random user stats.

### Resources

👉 Here's a link to a [cast using this frame](https://warpcast.com/agaperste-/0x740618b2).

📚 Here is the [Dune Linea API doc](https://docs.dune.com/api-reference/projects/endpoint/linea_lxp).

📺 Quick tutorial on how to build with Dune API

🫡 This frame is built using the [Frog framework](https://frog.fm/). Please head over to their document to [install](https://frog.fm/installation) Frog. (_For this repo, we followed the [quickstart for bootstrap via Vercel](https://frog.fm/getting-started#bootstrap-via-vercel), feel free to check it out._)

### Running Locally

After git cloning, please fill in secrets within the `.env` file. (_See `.env.sample` to see what are needed._)

Then run repo with below commands:

(_If you haven't, [install Node.js](https://nodejs.org/en/download) and [install pnpm](https://pnpm.io/installation)._)

```
pnpm install
pnpm dev
```

Head to http://localhost:5173/api

### Have questions?

- See [how to turn any Dune query into an API endpoint](https://youtu.be/o29ig849qMY)
- Check out [this tutorial](https://docs.dune.com/learning/how-tos/dune-frames) on how to build a Frame with Dune API (turned from query)
- For a good video on how to build Frame with Frog, [check this out](https://youtu.be/dngMrWsmHBM).
- For an intro video on Frames 101, [check this out](https://www.youtube.com/watch?v=rp9X8rAPzPM).
- [Reach out to me](https://warpcast.com/agaperste-)
