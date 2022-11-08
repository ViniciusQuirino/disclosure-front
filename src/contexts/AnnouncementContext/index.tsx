import { createContext, ReactNode, useEffect, useState } from "react";

import { iAddAnnouncement } from "../../components/Modal/ModalCreateAnnouncement";

import api from "../../services/api";
import { iUser } from "../UserContext";

type iAnnouncementProviderProps = {
  children: ReactNode;
};

interface iAnnouncementContext {
  announcements: iAnnouncement[];
  globalLoading: boolean;
  setGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addAnnouncement: (body: iAddAnnouncement) => void;
  openClose: boolean;
  setOpenClose: React.Dispatch<React.SetStateAction<boolean>>;
  profile: boolean;
  setProfile: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAnnouncement: (announcementId: number) => Promise<void>;
}

export interface iAnnouncement {
  body: string;
  id: number;
  type: string;
  user: iUser;
  userId: number;
}

export const AnnouncementContext = createContext({} as iAnnouncementContext);

const AnnouncementProvider = ({ children }: iAnnouncementProviderProps) => {
  const [announcements, setAnnouncements] = useState<iAnnouncement[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [openClose, setOpenClose] = useState(false);
  const [profile, setProfile] = useState(false);

  const getAnnouncement = async () => {
    setGlobalLoading(true);

    try {
      const response = await api.get("/announcement?_expand=user");

      setAnnouncements(response.data);
      setGlobalLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const addAnnouncement = async (body: iAddAnnouncement): Promise<void> => {
    setGlobalLoading(true);

    try {
      await api.post("/announcement", body);

      getAnnouncement();
    } catch (error) {
      console.error(error);
    } finally {
      setGlobalLoading(false);
    }
  };

  const deleteAnnouncement = async (announcementId: number) => {
    setGlobalLoading(true);

    try {
      await api.delete(`/announcement/${announcementId}`);

      getAnnouncement();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnnouncement();
  }, []);

  const value = {
    announcements,
    globalLoading,
    setGlobalLoading,
    addAnnouncement,
    openClose,
    setOpenClose,
    profile,
    setProfile,
    deleteAnnouncement,
  };

  console.log(announcements);

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export default AnnouncementProvider;
