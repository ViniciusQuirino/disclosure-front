import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StyledModalPost } from "./styles";

const ModalCriarPost = () => {
  const formSchema = yup.object().shape({
    publicationText: yup
      .string()
      .min(6, "No minimo 6 caracteres")
      .max(300, "Máximo de 300 caracteres"),
      announceType: yup
      .string()
      .required()
      .oneOf(["Imóveis", "Finanças", "Autos-peças", "Serviços"]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  return (
    <StyledModalPost>
      <div>
        <p>Olá {}! O que você gostaria de postar?</p>
        {/* <img src={}>/>*/}
        <form onSubmit={handleSubmit()}>
          <input
            type="text"
            placeholder="Digite seu novo nome!"
            {...register("publicationText")}
          />
          <label>Qual o tipo do seu anuncio?</label>
          <select {...register("announceType")}>
            <option>Imóveis</option>
            <option>Finanças</option>
            <option>Autos-peças</option>
            <option>Serviços</option>
          </select>
          <button type="submit">Postar</button>
        </form>
      </div>
    </StyledModalPost>
  );
};

export default ModalCriarPost;
