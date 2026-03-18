import * as ftp from 'basic-ftp';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Readable } from 'stream';

interface FTPConfig {
  host: string;
  user: string;
  password: string;
  port?: number;
}

function sanitizeFileName(fileName: string): string {
  const ext = path.extname(fileName || '');
  const base = path
    .basename(fileName || 'file', ext)
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return `${base || 'file'}-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
}

async function withClient<T>(ftpConfig: FTPConfig, run: (client: ftp.Client) => Promise<T>): Promise<T> {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: ftpConfig.host,
      user: ftpConfig.user,
      password: ftpConfig.password,
      port: ftpConfig.port || 21,
      secure: false,
    });

    return await run(client);
  } finally {
    client.close();
  }
}

async function ensureRemoteDir(client: ftp.Client, remotePath: string): Promise<void> {
  const normalized = (remotePath || '').replace(/\\/g, '/').replace(/\/+/g, '/');
  if (!normalized) return;
  await client.ensureDir(normalized);
}

export async function uploadFile(
  fileBuffer: Buffer,
  originalName: string,
  _fileType: string,
  ftpConfig: FTPConfig,
  remotePath: string,
): Promise<string> {
  const finalName = sanitizeFileName(originalName);

  await withClient(ftpConfig, async (client) => {
    await ensureRemoteDir(client, remotePath);
    await client.uploadFrom(Readable.from(fileBuffer), `${remotePath}${finalName}`);
  });

  return finalName;
}

export async function uploadFilesStream(
  files: Array<{ fileName: string; buffer: Buffer }>,
  ftpConfig: FTPConfig,
  remotePath: string,
): Promise<string[]> {
  if (!Array.isArray(files) || files.length === 0) return [];

  return withClient(ftpConfig, async (client) => {
    await ensureRemoteDir(client, remotePath);
    const uploaded: string[] = [];

    for (const file of files) {
      const finalName = sanitizeFileName(file.fileName);
      await client.uploadFrom(Readable.from(file.buffer), `${remotePath}${finalName}`);
      uploaded.push(finalName);
    }

    return uploaded;
  });
}

export async function multipleFieldsFileUploadStream(
  filesByField: { [key: string]: Array<{ fileName: string; buffer: Buffer }> },
  ftpConfig: FTPConfig,
  remotePath: string,
): Promise<{ [key: string]: Array<{ filename: string; originalName: string }> }> {
  const result: { [key: string]: Array<{ filename: string; originalName: string }> } = {};

  await withClient(ftpConfig, async (client) => {
    await ensureRemoteDir(client, remotePath);

    for (const fieldName of Object.keys(filesByField || {})) {
      result[fieldName] = [];
      for (const file of filesByField[fieldName]) {
        const finalName = sanitizeFileName(file.fileName);
        await client.uploadFrom(Readable.from(file.buffer), `${remotePath}${finalName}`);
        result[fieldName].push({ filename: finalName, originalName: file.fileName });
      }
    }
  });

  return result;
}
