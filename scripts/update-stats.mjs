const username = (process.env.TIKTOK_USERNAME || "veyrix7").replace(/^@/, "").trim();
if (!username) throw new Error("TIKTOK_USERNAME must be set to a TikTok username.");

const endpoint = `https://www.tikwm.com/api/user/info?unique_id=${encodeURIComponent(username)}`;
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 20_000);

function firstNumber(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

try {
  const response = await fetch(endpoint, {
    signal: controller.signal,
    headers: {
      accept: "application/json",
      "user-agent": "Veyrix7-TikTok-Stats/1.0 (+GitHub Actions scheduled public profile stats)"
    }
  });
  if (!response.ok) throw new Error(`Profile service responded with HTTP ${response.status}.`);

  const result = await response.json();
  if (result?.code !== 0 || !result?.data) {
    throw new Error(`Profile service error: ${result?.msg || `code ${result?.code ?? "unknown"}`}`);
  }

  const data = result.data;
  const info = data.userInfo || data;
  const user = info.user || data.user || {};
  const stats = info.stats || data.stats || user.stats || {};

  const output = {
    username,
    displayName: user.nickname || user.display_name || user.uniqueId || username,
    profileUrl: `https://www.tiktok.com/@${encodeURIComponent(username)}`,
    avatarUrl: user.avatarLarger || user.avatar_large_url || user.avatarMedium || user.avatarThumb || user.avatar_url || user.avatar || null,
    followerCount: firstNumber(stats.followerCount, stats.follower_count, user.follower_count),
    followingCount: firstNumber(stats.followingCount, stats.following_count, user.following_count),
    likeCount: firstNumber(stats.heartCount, stats.heart, stats.likeCount, stats.likes_count, user.total_favorited, user.totalFavorited, user.heart),
    videoCount: firstNumber(stats.videoCount, stats.video_count, user.aweme_count, user.video_count),
    updatedAt: new Date().toISOString(),
    source: "TikWM public profile endpoint",
    message: null
  };

  if ([output.followerCount, output.followingCount, output.likeCount].every(value => value === null)) {
    throw new Error("No usable public counts were returned. Keeping the previous saved data.");
  }

  const fs = await import("node:fs/promises");
  const target = new URL("../stats.json", import.meta.url);
  await fs.writeFile(target, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Updated TikTok stats for @${username}.`);
} finally {
  clearTimeout(timeout);
}
