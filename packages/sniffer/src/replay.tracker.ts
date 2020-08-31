import { createWriteStream, WriteStream } from 'fs';

/** Automatically close a write stream after 5 seconds of inactivity */
export class AutoClosingStream {
  _stream: WriteStream | null;
  _streamClose: NodeJS.Timer | null;
  fileName: string;
  closeTimeout: number;

  constructor(fileName: string, closeTimeout = 5 * 1000) {
    this.fileName = fileName;
    this.closeTimeout = closeTimeout;
  }

  closeStream = (): void => {
    this._stream?.close();
    this._stream = null;
    this._streamClose = null;
  };

  write(obj: unknown): void {
    if (this._streamClose != null) clearTimeout(this._streamClose);

    if (this._stream == null) {
      this._stream = createWriteStream(this.fileName, { flags: 'a' });
    }
    this._streamClose = setTimeout(this.closeStream, 5 * 1000);
    this._stream.write(JSON.stringify(obj) + '\n');
  }
}
