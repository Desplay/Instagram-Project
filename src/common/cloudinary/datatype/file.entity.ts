export interface File {
  file: {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream?: () => any;
  };
  base64?: string;
}
