import { NextRequest, NextResponse } from "next/server"

export const middleware = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host");

  // Extract subdomain from hostname
  const subdomain = process.env.NODE_ENV === "production" && process.env.VERCEL === "1" ?
    hostname?.replace(`.${ process.env.BASE_DOMAIN }`, "") :
    hostname?.replace(`.localhost:3000`, "");

  // If request comes to /_wikis path, we should send 404 request, because this
  // path should only be accessible from subdomains. For example;
  // javascript.localhost:3000 should map to localhost:3000/_wikis/javascript
  if(pathname.startsWith("/_wikis")) {
    return new Response(null, { status: 404 });
  }

  // If current request comes to api route or client requests static
  // files such as image, favicon (those files have . in their pathname)
  // we should not alter or intercept response.
  if(!pathname.includes(".") && !pathname.startsWith("/api")) {
    // TODO: If subdomain is app or something reserved, we should
    // handle it here.
    /*
    if(subdomain === "app") {
      if(pathname === "login") {
        // If logged in, redirect to homepage
      }
      url.pathname = `/app${ pathname }`;
      return NextResponse.rewrite(url);
    }
    */
    if(hostname !== "localhost:3000" && hostname !== process.env.BASE_DOMAIN) {
      url.pathname = `/_wikis/${ subdomain }${ pathname }`;
      return NextResponse.rewrite(url);
    }
  }
}