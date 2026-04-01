export default async (request, context) => {
  const url = new URL(request.url);
  
  let targetUrl = '';
  let targetHost = '';
  if (url.pathname.startsWith('/proxy-lando/')) {
    targetHost = 'lando.itsoffbrand.io';
    targetUrl = 'https://' + targetHost + url.pathname.replace('/proxy-lando', '');
  } else if (url.pathname.startsWith('/proxy-assets/')) {
    targetHost = 'assets.itsoffbrand.io';
    targetUrl = 'https://' + targetHost + url.pathname.replace('/proxy-assets', '');
  } else if (url.pathname.startsWith('/proxy-website-files/')) {
    targetHost = 'cdn.prod.website-files.com';
    targetUrl = 'https://' + targetHost + url.pathname.replace('/proxy-website-files', '');
  } else if (url.pathname.startsWith('/models/') || url.pathname.startsWith('/textures/') || url.pathname.startsWith('/hdri/') || url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/dev-js/')) {
    // These are fetched relatively by lando-by-OFF+BRAND.js but actually reside on lando.itsoffbrand.io/gl/ or lando.itsoffbrand.io/
    targetHost = 'lando.itsoffbrand.io';
    targetUrl = 'https://' + targetHost + '/gl' + url.pathname;
  } else {
    return context.next();
  }

  if (url.search) {
    targetUrl += url.search;
  }

  // Clone the request headers, but omit Host so fetch uses the target URL's host
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('Referer', 'https://landonorris.com/');
  headers.set('Origin', 'https://landonorris.com');

  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(newRequest);
    
    // Clone the response so we can modify its headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    
    return newResponse;
  } catch (error) {
    return new Response('Proxy Error: ' + error.message, { status: 500 });
  }
};