import Cookies from 'cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    code: number;
    message: string;
};

export const config = {
    api: {
        bodyParser: false
    }
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') {
        return res.status(404).json({ code: 1, message: 'Method not supported' });
    }

    const cookies = new Cookies(req, res);
    cookies.set('access_token');

    res.status(200).json({ code: 0, message: 'Logout successfully' });
}
