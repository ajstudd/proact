export interface Project {
  _id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  location: {
    place: string;
    coordinates?: [number, number];
  };
  budget?: number;
  status: string;
  creator: {
    _id: string;
    name: string;
  };
  contractorId?: string;
  governmentId?: string;
  contractor?: {
    _id: string;
    name: string;
  };
  government?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
}
