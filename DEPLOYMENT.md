# PayLink Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

## Environment Variables (Optional)

If you want to use a dedicated RPC endpoint, add to Vercel:

```env
NEXT_PUBLIC_SOLANA_RPC=https://your-rpc-endpoint.com
```

## Why Localhost Has Issues

- **Rate Limiting**: Public RPC endpoints limit localhost requests
- **IP Restrictions**: Some providers block development IPs
- **Production vs Dev**: RPC providers treat domains differently

## Expected Behavior After Deployment

✅ **Production**: Should work perfectly with public RPC endpoints
✅ **No 403 Errors**: Rate limits are higher for production domains
✅ **Better Performance**: RPC calls work reliably

## Testing After Deployment

1. Connect your wallet
2. Create a PayLink
3. Try to pay (should work without 403 errors)
4. Check transaction on Solana Explorer

## Troubleshooting

If you still get 403 errors in production:
1. Add a dedicated RPC endpoint via environment variable
2. Consider using QuickNode, Helius, or Alchemy
3. Check the console for specific error messages
