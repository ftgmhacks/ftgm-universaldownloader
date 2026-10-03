const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers so your web clients can access the endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: "error",
      message: "Missing required 'url' parameter"
    });
  }

  try {
    const targetUrl = `https://multidownapi.vercel.app/?url=${encodeURIComponent(url)}`;
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({
        status: "error",
        message: "Failed to fetch data from upstream API"
      });
    }

    const data = await response.json();

    // Remove unwanted developer and group metadata
    delete data.developer;
    delete data.join_group;

    // Construct transformed payload with custom metadata
    const transformedData = {
      status: data.status,
      developer: "RANA FAISAL ALI",
      website: "ftgmtools.pages.dev",
      store: "pak-digital.store",
      brand: "FTGM HACKS | FTGM TOOLS",
      video_info: data.video_info
    };

    return res.status(200).json(transformedData);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: error.message
    });
  }
};
