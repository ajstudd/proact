export interface TrimmedProject {
  _id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  budget?: number;
  status?: string;
  contractorId?: string;
  governmentId?: string;
  contractor?: string;
  government?: string;
  createdAt: string;
  updatedAt: string;
  associatedProfiles: string[];
  likes: string[];
  dislikes: string[];
  expenditure?: number;
  comments?: string[];
}

export interface TrimmedProjectsResponse {
  projects: TrimmedProject[];
}

export interface InventoryItem {
  name: string;
  quantity: number;
  price: number;
  totalSpent: number;
}

export interface UsedItem {
  name: string;
  quantity: number;
}

export interface ProjectUpdate {
  content: string;
  media?: string[];
  date?: Date;
  purchasedItems?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  utilisedItems?: {
    name: string;
    quantity: number;
  }[];
}

export interface Project {
  _id: string;
  title: string;
  bannerUrl: string;
  pdfUrl?: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  budget: number;
  expenditure: number;
  likes: string[];
  dislikes: string[];
  comments: string[];
  updates: ProjectUpdate[];
  associatedProfiles: string[];
  contractor: string;
  government: string;
  createdAt: Date;
  updatedAt: Date;
  inventory?: InventoryItem[];
  usedItems?: UsedItem[];
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface BookmarkedProject {
  _id: string;
  title: string;
  description?: string;
  bannerUrl: string;
  location: {
    lat: number;
    lng: number;
    place: string;
  };
  budget: number;
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

export interface BookmarkedProjectsResponse {
  bookmarks: BookmarkedProject[];
}
