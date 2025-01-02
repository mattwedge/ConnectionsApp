/* eslint-disable @typescript-eslint/no-explicit-any */
const COOKIE_DOMAIN = import.meta.env.VITE_COOKIE_DOMAIN;

const cookie = {
  delete (key: string) {
    const date = new Date();
    const expires = date.toUTCString();
    document.cookie = `${key}=;expires=${expires};path=/;domain=${COOKIE_DOMAIN};`;
  },
  set (key: string, val: any, maxAgeHrs: number) {
    const date = new Date();
    const time = date.getTime();
    const expireTime = time + maxAgeHrs * 60 * 60 * 1000;
    date.setTime(expireTime);
    const expires = date.toUTCString();
    document.cookie = `${key}=${val};expires=${expires};path=/;domain=${COOKIE_DOMAIN};`;
  },
  get (key: string) {
    if (document && document.cookie) {
      const foundCookie = (document as any).cookie
        .split("; ")
        .map((c: any) => c.split("="))
        .find((cp: any) => cp[0] === key);

      if (foundCookie) {
        return decodeURIComponent(foundCookie[1]);
      }
    }
    return null;
  }
};

export default cookie;