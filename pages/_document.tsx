import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const title = "Ilan Ang May COVID Ngayon?";
  const url = "https://ilan-ang-may-covid-ngayon.vercel.app/";
  const description = "Alamin ang bilang ng kaso ng COVID-19 sa Pilipinas 🇵🇭 ngayon";
  return (
    <Html
      lang="ph"
      className={
        typeof window !== "undefined" && localStorage?.getItem("is-dark-mode") === "true"
          ? "dark"
          : undefined
      }>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta
          name="bingbot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="application-name" content={title} />
        <meta name="og:url" content={url} />
        <meta name="og:locale" content={"ph"} />
        <meta name="og:image:width" content={"500"} />
        <meta name="og:image:height" content={"185"} />
        <meta name="og:image:type" content={"image/png"} />
        <meta name="og:site_name" content={title} />
        <meta name="og:image" content={url + "images/page-image.png"} />
        <meta name="twitter:image" content={url + "images/page-image.png"} />
        <meta name="apple-mobile-web-app-capable" content={"yes"} />
        <meta name="og:title" content={title} />
        <meta name="og:image:alt" content={description} />
        <meta name="twitter:title" content={title} />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        <meta name="twitter:description" content={description} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
