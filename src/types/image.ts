export interface ImageResponse {
  message: string;
  image: ImageDetails;
}

interface ImageDetails {
  image: string;
  localPath: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
