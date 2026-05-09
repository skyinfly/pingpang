# Miniapp Device Debug Guide

## Goal

Make one local workflow reliable for both WeChat DevTools and real-device LAN debugging.

## Build With A LAN API Host

Use the helper script when the API is reachable on your local network:

```bash
node tools/mobile/run-mobile-with-api.mjs --platform mp-weixin --command build --api-host 192.168.0.12 --api-port 3000
```

You can inspect the resolved config without relying on the build output:

```bash
node tools/mobile/run-mobile-with-api.mjs --platform mp-weixin --command build --api-host 192.168.0.12 --api-port 3000 --print-config true
```

Expected API base URL:

```text
http://192.168.0.12:3000
```

## Import Into WeChat DevTools

Build output directory:

`apps/mobile/dist/build/mp-weixin`

In WeChat DevTools:

1. Open the project import screen
2. Choose the `mp-weixin` build directory
3. Use the current dev `appid` from [manifest.json](D:\CODE\pingpang\apps\mobile\src\manifest.json)
4. Keep `urlCheck` disabled for local development

## LAN Debug Checklist

1. Start the API on a host reachable from the device
2. Confirm the host machine firewall allows the API port
3. Use the host machine LAN IP, not `localhost`
4. Rebuild miniapp output after changing the API host

## Current Limits

- This flow is for local and staging-style debugging
- Production request-domain registration is still a WeChat console step outside this repo