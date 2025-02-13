interface GithubAccessToken {
  error: string | null;
  access_token: string;
}

interface GithubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
}

interface GithubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export async function accssTokenGithub(
  code: string,
): Promise<GithubAccessToken> {
  const accessTokenParams = new URLSearchParams([
    ['client_id', process.env.GITHUB_CLIENT_ID!],
    ['client_secret', process.env.GITHUB_CLIENT_SECRET!],
    ['code', code],
  ]).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  return await accessTokenResponse.json();
}

export async function getUserProfileGithub(
  access_token: string,
): Promise<GithubUserProfile> {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache',
  });
  return await userProfileResponse.json();
}

export async function getUserEmailGithub(
  access_token: string,
): Promise<GithubUserEmail> {
  const userEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache',
  });
  if (!userEmailResponse.ok) {
    throw new Error('Failed to fetch user Email');
  }

  const userEmailData = await userEmailResponse.json();
  const primaryEmailData = userEmailData.find(
    (email: GithubUserEmail) => email.primary && email.verified,
  );
  return primaryEmailData;
}
