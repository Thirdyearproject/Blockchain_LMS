import {
  MdUploadFile,
  MdMenuBook,
  MdPersonAddAlt,
  MdPublishedWithChanges,
  MdHowToVote,
  MdOutlineDashboard, // Added a proper Home Icon
} from "react-icons/md";

export const adminSidebarLinks = [
  {
    id: 0,
    name: "Home",
    path: "/dashboard/my-dashboard",
    icon: MdOutlineDashboard,
  },
  {
    id: 1,
    name: "Book Upload",
    path: "/dashboard/my-dashboard/upload",
    icon: MdUploadFile,
  },
  {
    id: 2,
    name: "Books",
    path: "/dashboard/my-dashboard/books",
    icon: MdMenuBook,
  },
  {
    id: 3,
    name: "Register User",
    path: "/dashboard/my-dashboard/register-user",
    icon: MdPersonAddAlt,
  },
  {
    id: 4,
    name: "Update Clearance",
    path: "/dashboard/my-dashboard/update-clearance",
    icon: MdPublishedWithChanges,
  },
  {
    id: 5,
    name: "Vote on Books",
    path: "/dashboard/my-dashboard/vote-books",
    icon: MdHowToVote,
  },
];

export const studentSidebarLinks = [
  {
    id: 0,
    name: "Home",
    path: "/dashboard/my-dashboard",
    icon: MdOutlineDashboard,
  },
  {
    id: 1,
    name: "Books",
    path: "/dashboard/my-dashboard/books",
    icon: MdMenuBook,
  },
  {
    id: 2,
    name: "Vote on Books",
    path: "/dashboard/my-dashboard/vote-books",
    icon: MdHowToVote,
  },
];

export const teacherSidebarLinks = [
  {
    id: 0,
    name: "Home",
    path: "/dashboard/my-dashboard",
    icon: MdOutlineDashboard,
  },
  {
    id: 1,
    name: "Book Upload",
    path: "/dashboard/my-dashboard/upload",
    icon: MdUploadFile,
  },
  {
    id: 2,
    name: "Books",
    path: "/dashboard/my-dashboard/books",
    icon: MdMenuBook,
  },
  {
    id: 4,
    name: "Vote on Books",
    path: "/dashboard/my-dashboard/vote-books",
    icon: MdHowToVote,
  },
];

export const guestSidebarLinks = [
  {
    id: 0,
    name: "Home",
    path: "/dashboard/my-dashboard",
    icon: MdOutlineDashboard,
  },
];
