declare module 'formidable' {
  export interface File {
    filepath: string;
    originalFilename: string;
    // ... other properties
  }
}