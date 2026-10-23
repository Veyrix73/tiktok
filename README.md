# Veyrix7 TikTok Stats

A dark-purple dashboard for **[@veyrix7 on TikTok](https://www.tiktok.com/@veyrix7)**. It displays followers, following, total likes, and video count.

## Publish with GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`, then save.
4. When deployment finishes, open **https://veyrix73.github.io/tiktok/**.

## Get stats updating

1. Open the **Actions** tab.
2. Select **Refresh TikTok stats**.
3. Click **Run workflow** and run it on `main`.
4. Open the run and check that it succeeds. The workflow also runs approximately every 30 minutes.

## How it works

GitHub Actions calls an unofficial third-party public-profile endpoint and writes the returned snapshot to `stats.json`. The page reads that file, so it does not need TikTok credentials.

- A dash (`—`) means a metric has not been collected or isn't available.
- No TikTok password, login cookie, or token is needed.
- This is **not an official TikTok API**. The third-party endpoint may change, rate-limit requests, or fail. A failed update keeps the previous saved stats.
- Scheduled GitHub Actions runs can be delayed. Use **Actions → Refresh TikTok stats → Run workflow** to request a manual refresh.

