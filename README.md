# Serubin.net
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSerubin%2FSerubin-net.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FSerubin%2FSerubin-net?ref=badge_shield)


This is the public source code for Solomon Rubin's Serubin.net. It serves as an online portfolio and resume.

Please direct questions and comments to the issues section.

# Running/Viewing
Available at https://serub.in

**or**

run and view:
```shell
yarn
yarn dev
# => Now browse to http://localhost:3000
```

## Environment

- **`PORTFOLIO_COOKIE_SECRET`** — Secret used to sign the HttpOnly `portfolio_view` cookie set by [middleware.ts](middleware.ts). Browsers that receive this cookie get unwatermarked portfolio images from `/api/portfolio/...`; requests without a valid cookie (e.g. hotlinking) are watermarked. Required in production. In development, a non-secure default is used if unset. Copy [.env.example](.env.example) to `.env.local` and set a long random value.

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSerubin%2FSerubin-net.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FSerubin%2FSerubin-net?ref=badge_large)
