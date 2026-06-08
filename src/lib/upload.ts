import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';

export async function uploadFileLocally(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const filePathName = `${folder}/${filename}`;

  // Use the token explicitly
  const token = process.env.BLOB_READ_WRITE_TOKEN || "vercel_blob_rw_vd7zIPCrNq3m44X1_TFW1x0EwsNm9NHR04NKL7x0mqfPvJg";

  try {
    const blob = await put(filePathName, file, { 
      access: 'public',
      token: token
    });
    return blob.url;
  } catch (error) {
    console.error("Vercel Blob Upload Error:", error);
    
    // Only try local fs fallback if NOT on Vercel
    if (!process.env.VERCEL) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const dirPath = join(process.cwd(), 'public', 'uploads', folder);
      await mkdir(dirPath, { recursive: true });
      const filePath = join(dirPath, filename);
      await writeFile(filePath, buffer);
      return `/uploads/${folder}/${filename}`;
    }
    
    throw error;
  }
}
