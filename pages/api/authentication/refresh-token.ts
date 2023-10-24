import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxy from 'http-proxy';
export const config = {
    api: {
        bodyParser: false
    }
};

const proxy = httpProxy.createProxyServer();

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method !== 'POST') {
        return res.status(404).json({ message: 'Method not supported' });
    }

    return new Promise(() => {
        proxy.web(req, res, {
            target: process.env.API_URL,
            changeOrigin: true,
            selfHandleResponse: false
        });
    });
}
