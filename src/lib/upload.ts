import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadFileLocally(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create unique filename
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  
  // Make sure directory exists
  const dirPath = join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(dirPath, { recursive: true });
  
  // Write file
  const filePath = join(dirPath, filename);
  await writeFile(filePath, buffer);
  
  // Return public path
  return `/uploads/${folder}/${filename}`;
}
