import implode from 'implode-decoder';

export async function decompressPkWare(sector: Buffer, offset: number, size: number): Promise<Buffer> {
  const buf = sector.slice(offset, offset + size);

  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    const decode = new implode();
    decode.push = (buffer: Buffer): unknown => buffers.push(buffer);
    decode.on('error', reject);
    decode._transform(buf, null, () => {
      decode._flush(() => resolve(Buffer.concat(buffers)));
    });
  });
}
