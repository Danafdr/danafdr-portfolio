import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';

export async function uploadFileLocally(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create unique filename
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const filePathName = `${folder}/${filename}`;

  // If Vercel Blob is configured, upload to Blob Storage
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filePathName, file, { access: 'public' });
    return blob.url;
  }

  // Fallback to local filesystem (works in development, but fails on Vercel)
  const dirPath = join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(dirPath, { recursive: true });
  
  const filePath = join(dirPath, filename);
  await writeFile(filePath, buffer);
  
  return `/uploads/${folder}/${filename}`;
}
