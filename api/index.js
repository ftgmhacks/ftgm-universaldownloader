const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const allowedOrigin = 'https://ftgm-universaldownloader.vercel.app';
  
  // Extract request headers for domain validation
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';

  // Clean trailing slashes for accurate matching
  const cleanOrigin = origin.replace(/\/$/, '');
  const cleanReferer = referer.replace(/\/$/, '');

  // Check if request comes from the authorized domain
  const isAllowedOrigin = cleanOrigin === allowedOrigin;
  const isAllowedReferer = cleanReferer === allowedOrigin || cleanReferer.startsWith(`${allowedOrigin}/`);

  // Block unauthorized requests (Direct browser hits, Postman, or external sites)
  if (!isAllowedOrigin && !isAllowedReferer) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(403).send(
      JSON.stringify(
        {
          status: "error",
          message: "ACCESS DENIED",
          notice: "CONTACT TO BUY API : 03104882921 FTGM HACKS OFFICIAL"
        },
        null,
        2
      )
    );
  }

  // Set CORS headers for authorized origin
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).send(
      JSON.stringify(
        {
          status: "error",
          message: "Missing required 'url' parameter"
        },
        null,
        2
      )
    );
  }

  try {
    const targetUrl = `https://multidownapi.vercel.app/?url=${encodeURIComponent(url)}`;
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(response.status).send(
        JSON.stringify(
          {
            status: "error",
            message: "Failed to fetch data from upstream API"
          },
          null,
          2
        )
      );
    }

    const data = await response.json();

    // Construct response payload with FTGM branding
    const transformedData = {
      status: data.status,
      developer: "RANA FAISAL ALI",
      website: "ftgmtools.pages.dev",
      store: "pak-digital.store",
      brand: "FTGM HACKS | FTGM TOOLS",
      video_info: data.video_info
    };

    // Return pretty-printed JSON output
    return res.status(200).send(JSON.stringify(transformedData, null, 2));
  } catch (error) {
    return res.status(500).send(
      JSON.stringify(
        {
          status: "error",
          message: "Internal Server Error",
          error: error.message
        },
        null,
        2
      )
    );
  }
};
