# Quick Start: Backblaze B2 Setup for Recruitment SaaS

## 🚀 Steps to Complete

### 1. Create Backblaze Account (5 minutes)
1. Visit: https://www.backblaze.com/b2/sign-up.html
2. Sign up (10GB free!)
3. Verify email

### 2. Create Your Bucket (2 minutes)
1. Dashboard → "Buckets" → "Create a Bucket"
2. Name: `recruitment-saas-files` (or your choice)
3. Privacy: Choose "Private" (more secure)
4. Click "Create"

### 3. Get Your Credentials (3 minutes)
1. Go to "App Keys" → "Add a New Application Key"
2. Settings:
   - Name: `recruitment-backend`
   - Allow access to: Your bucket name
   - Allow: Read and Write
3. Click "Create New Key"
4. **COPY BOTH VALUES NOW** (you won't see them again!):
   - keyID (looks like: `0012345abc67890de`)
   - applicationKey (looks like: `K0012...long...string`)

### 4. Update Your .env File

Open `backend/.env` and replace these lines:

```env
# Backblaze B2 Configuration
B2_APPLICATION_KEY_ID=paste_your_keyID_here
B2_APPLICATION_KEY=paste_your_applicationKey_here
B2_BUCKET_ID=paste_your_bucket_id_here
B2_BUCKET_NAME=recruitment-saas-files
```

**Where to find Bucket ID:**
- Dashboard → Buckets → Click your bucket → Look for "Bucket ID"

### 5. Test It! (2 minutes)

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Then:
1. Login as a candidate
2. Go to Profile
3. Try uploading a CV
4. Check your B2 bucket → Files tab to see it!

## ✅ What's Changed

### Before (Supabase Storage)
- Limited free tier
- Tied to Supabase ecosystem
- Higher costs at scale

### After (Backblaze B2)
- 10GB free forever
- $0.005/GB after that
- Independent, scalable
- S3-compatible

## 📁 File Structure in B2

```
candidates/
  └── {userId}/
      ├── cv-1234567890.pdf
      ├── idCard-1234567891.jpg
      └── militaryStatus-1234567892.pdf
```

## 🔒 Security Features

✅ File type validation (PDF, DOC, DOCX, JPG, PNG only)
✅ File size limit (5MB max)
✅ Authentication required
✅ Unique filenames (prevents overwrites)
✅ Rate limiting on uploads

## 💰 Cost Example

**For 1,000 candidates:**
- Storage: 1,000 × 3 files × 2MB = 6GB
- Cost: 6GB × $0.005 = **$0.03/month**
- Downloads: View-only (minimal cost)

**Total: Less than $1/month for 1,000+ candidates!**

## 🆘 Common Issues

**"Could not authorize"**
→ Check your KEY_ID and KEY match exactly

**"Bucket not found"**
→ Verify BUCKET_ID is correct (from B2 dashboard)

**Upload fails**
→ File too large? Wrong format? Check browser console

**Files not showing in B2**
→ Wait 30 seconds, refresh B2 Files tab

## 📚 Full Documentation

See `BACKBLAZE_SETUP.md` for complete details including:
- Production security recommendations
- CORS configuration
- Encryption setup
- Backup strategies
- API reference

## 🎯 Next Steps

1. Complete the 4 setup steps above
2. Test file uploads
3. Check files appear in B2 bucket
4. Mark task 4.6 as complete in MVP checklist!

---

**Need help?** Check BACKBLAZE_SETUP.md or Backblaze docs: https://www.backblaze.com/b2/docs/
