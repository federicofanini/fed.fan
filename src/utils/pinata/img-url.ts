import { pinata } from "./pinata";

export async function getImgUrl(cid: string) {
  const url = await pinata.gateways
    .createSignedURL({
      cid: cid,
      expires: 600000000, // 10000 years
    })
    .optimizeImage({
      width: 500,
      height: 500,
      format: "webp",
      quality: 70,
    });

  return url;
}
