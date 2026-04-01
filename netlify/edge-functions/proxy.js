export default async (request, context) => {
  const url = new URL(request.url);
  
  let targetUrl = '';
  if (url.pathname.startsWith('/proxy-lando/')) {
    targetUrl = 'https://lando.itsoffbrand.io' + url.pathname.replace('/proxy-lando', '');
  } else if (url.pathname.startsWith('/proxy-assets/')) {
    targetUrl = 'https://assets.itsoffbrand.io' + url.pathname.replace('/proxy-assets', '');
  } else if (url.pathname.startsWith('/proxy-website-files/')) {
    targetUrl = 'https://cdn.prod.website-files.com' + url.pathname.replace('/proxy-website-files', '');
  } else {
    return context.next();
  }

  if (url.search) {
    targetUrl += url.search;
  }

  // Create a new request with forged headers
  const newRequest = new Request(targetUrl, request);
  newRequest.headers.set('Referer', 'https://landonorris.com/');
  newRequest.headers.set('Origin', 'https://landonorris.com');

  try {
    const response = await fetch(newRequest);
    
    // Return the response with CORS headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    
    return newResponse;
  } catch (error) {
    return new Response('Proxy Error: ' + error.message, { status: 500 });
  }
};