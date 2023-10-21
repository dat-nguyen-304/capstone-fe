// import type { NextApiRequest, NextApiResponse } from 'next';
// import httpProxy, { ProxyResCallback } from 'http-proxy';
// import Cookies from 'cookies';
// import jwt_decode from 'jwt-decode';
// import { SafeUser } from '@/types';

// export const config = {
//     api: {
//         bodyParser: false
//     }
// };

// const proxy = httpProxy.createProxyServer();

// export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
//     return new Promise(resolve => {
//         // convert cookies to header Authorization
//         const cookies = new Cookies(req, res);
//         const refreshToken = cookies.get('refresh_token');
//         if (refreshToken) {
//             req.body = {
//                 refreshToken
//             }
//         }

//         const handleRefreshResponse: ProxyResCallback = (proxyRes, req, res) => {
//             let body = '';
//             proxyRes.on('data', function (chunk) {
//                 body += chunk;
//             });

//             proxyRes.on('end', function () {
//                 try {
//                     const isSuccess = proxyRes.statusCode && proxyRes.statusCode >= 200 && proxyRes.statusCode < 300;
//                     if (!isSuccess) {
//                         (res as NextApiResponse).status(proxyRes.statusCode || 500).json(body);
//                         return resolve(true);
//                     }

//                     const { accessToken, refreshToken } = JSON.parse(body);
//                     if (!accessToken) {
//                         return (res as NextApiResponse).status(200).json({ code: 1 });
//                     }

//                     const userSession: SafeUser = jwt_decode(accessToken);
//                     const refresh_token: SafeUser = jwt_decode(refreshToken);

//                     // convert token to cookies
//                     const cookies = new Cookies(req, res, { secure: process.env.NODE_ENV !== 'development' });
//                     cookies.set('access_token', accessToken, {
//                         httpOnly: true,
//                         sameSite: 'lax',
//                         expires: new Date(userSession.exp)
//                     });
//                     cookies.set('refresh_token', refreshToken, {
//                         httpOnly: true,
//                         sameSite: 'lax',
//                         expires: new Date(refresh_token.exp)
//                     });
//                     return (res as NextApiResponse).status(200).json({ userSession, code: 0 });
//                 } catch (error) {
//                     (res as NextApiResponse).status(500);
//                 }

//                 resolve(true);
//             });
//         };

//         proxy.once('proxyRes', handleRefreshResponse);

//         // don't send cookies to API server
//         req.headers.cookie = '';

//         proxy.web(req, res, {
//             target: process.env.API_URL,
//             changeOrigin: true,
//             selfHandleResponse: false
//         });
//     });
// }

import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';

export const config = {
    api: {
        bodyParser: false
    }
};

const proxy = httpProxy.createProxyServer();

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    return new Promise(() => {
        // convert cookies to header Authorization
        const cookies = new Cookies(req, res);
        const accessToken = cookies.get('access_token');
        if (accessToken) {
            req.headers.Authorization = `Bearer ${accessToken}`;
        }

        // don't send cookies to API server
        req.headers.cookie = '';

        proxy.web(req, res, {
            target: process.env.API_URL,
            changeOrigin: true,
            selfHandleResponse: false
        });
    });
}
