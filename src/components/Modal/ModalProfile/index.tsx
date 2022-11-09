import { MouseEventHandler, useContext, useState } from "react";
import { HomeModalStyled, EditModalStyled } from "./styles";
import { AnnouncementContext } from "../../../contexts/AnnouncementContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserContext } from "../../../contexts/UserContext";
import { editUserInfoFormSchema } from "../../../validations/editUserInfo";

export interface iEditUserInfoFormValue {
  name?: string;
  description?: string;
  profilePicture?: string;
  link?: string;
}

const ModalProfile = () => {
  const [editProfile, setEditProfile] = useState(false);
  const { setProfile, announcements, deleteAnnouncement, getAnnouncement } =
    useContext(AnnouncementContext);
  const { userData, editUserInfo } = useContext(UserContext);

  const { register, handleSubmit } = useForm<iEditUserInfoFormValue>({
    resolver: yupResolver(editUserInfoFormSchema),
  });

  const onSubmit: SubmitHandler<iEditUserInfoFormValue> = async (formData) => {
    const data = {
      ...(formData.name && { name: formData.name }),
      ...(formData.description && { description: formData.description }),
      ...(formData.profilePicture && {
        profilePicture: formData.profilePicture,
      }),
      ...(formData.link && { link: formData.link }),
    };

    await editUserInfo(data);
    setEditProfile(false);
    getAnnouncement();
  };

  return editProfile ? (
    <EditModalStyled>
      <section className="blueSideForm">
        <figure>
          <img src={userData?.profilePicture} />
        </figure>
        <span className="textDescription">{userData?.description}</span>
      </section>
      <section className="sectionForm">
        <div className="divGreetings">
          <h1>Olá {userData?.name}!</h1>
          <button
            type="button"
            className="returnBtn"
            onClick={() => setEditProfile(false)}
          >
            Voltar
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Editando perfil</h2>
          <label className="label">Novo nome:</label>
          <input
            type="text"
            className="inputPlaceHolder"
            placeholder="Digite o novo nome"
            {...register("name")}
          />
          <label className="label">Nova descrição:</label>
          <input
            type="text"
            placeholder="Digite a nova descrição"
            {...register("description")}
          />
          <label className="label">Novo link para imagem de perfil:</label>
          <input
            type="text"
            placeholder="Digite o novo link da foto"
            {...register("profilePicture")}
          />
          <label className="label">Novo link para saiba mais:</label>
          <input
            type="text"
            placeholder="Digite o novo link do site"
            {...register("link")}
          />
          <div className="divSaveBtn">
            <button className="saveBtn" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </section>
    </EditModalStyled>
  ) : (
    <HomeModalStyled>
      <section className="blueSide">
        <figure>
          <img src={userData?.profilePicture} />
        </figure>
        <span className="textDescription">{userData?.description}</span>
      </section>
      <section className="sectionPosts">
        <div className="divGreetings">
          <div className="divEdit">
            <h1>Olá {userData?.name}!</h1>
            <button onClick={() => setEditProfile(true)}>Editar perfil</button>
          </div>
          <button
            type="button"
            className="returnBtn"
            onClick={() => {
              setProfile(false);
            }}
          >
            Voltar
          </button>
        </div>

        <div className="divContainerPosts">
          <h2>Seus posts</h2>
          <ul className="divPosts">
            {announcements
              .filter((announcement) => announcement.userId === userData?.id)
              .map((announcement, index) => (
                <li key={index}>
                  <div>
                    <img
                      src={announcement?.user.profilePicture}
                      alt={announcement.user.name}
                    />
                    <h2>{announcement?.user.name}</h2>
                  </div>
                  <p>{announcement?.body}</p>
                  <div className="buttonDiv">
                    <a href={announcement.user.link} target="_blank">
                      Saiba mais
                    </a>
                    <button
                      onClick={() => {
                        deleteAnnouncement(announcement.id);
                        setProfile(false);
                      }}
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </HomeModalStyled>
  );
};

export default ModalProfile;
