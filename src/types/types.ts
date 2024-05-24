export interface FormData {
  profilePicture?: string;
  username: string;
  email: string;
  password: string;
}

export type PostType = {
  category: string;
  content: string;
  createdAt: string;
  image: string;
  slug: string;
  title: string;
  updatedAt: string;
  userId: string;
  __v: string;
  _id: string;
};
export type UserType = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: string;
};
export type CommentType = {
  content: string;
  createdAt: string;
  likes: string[];
  numberOfLikes: number;
  postId: string;
  updatedAt: string;
  userId: string;
  _id: string;
  __v: string;
};
