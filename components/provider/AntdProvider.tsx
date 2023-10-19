'use client';

import React from 'react';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

const cache = createCache();
const AntdProvider = ({ children }: { children: React.ReactNode }) => {
    useServerInsertedHTML(() => <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />);
    return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default AntdProvider;
