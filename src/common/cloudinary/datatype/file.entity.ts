export interface File {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => any;
}
