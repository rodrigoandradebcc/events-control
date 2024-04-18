import { useForm, SubmitHandler } from "react-hook-form";
import {
  BandData,
  deleteBandById,
  getAllBands,
  writeBandData,
} from "../../services/bands/bandsService";
import { useEffect, useState } from "react";

type BandForm = {
  name: string;
  logoUrl: string;
};

export function Bands() {
  const [bands, setBands] = useState<BandData[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BandForm>();
  const onSubmit: SubmitHandler<BandForm> = async (data) => {
    console.log(data);
    writeBandData({ name: data.name, logoUrl: data.logoUrl });
    await tryGetAllBands();
  };

  async function tryGetAllBands() {
    const response = await getAllBands();
    setBands(response);
  }

  async function tryRemoveBandById(id: string) {
    await deleteBandById(id);
    await tryGetAllBands();
  }

  useEffect(() => {
    (async () => {
      await tryGetAllBands();
    })();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nome:</label>
        <input {...register("name")} />
        <label htmlFor="logoUrl">Url da Photo:</label>
        <input {...register("logoUrl")} />

        {errors.name && <span>This field is required</span>}

        <input type="submit" />
      </form>

      <div>
        <h1>Bandas:</h1>
        {bands.map((band) => (
          <ul key={band.id}>
            <li>{band.id}</li>
            <li>{band.name}</li>
            <li>{band.logoUrl}</li>
            <li>
              <button onClick={() => tryRemoveBandById(band.id!)}>
                Excluir
              </button>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
}
