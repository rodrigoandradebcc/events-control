import {
  child,
  DataSnapshot,
  get,
  getDatabase,
  ref,
  remove,
  set,
} from "firebase/database";
import "./../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
export interface BandData {
  id?: string;
  name: string;
  logoUrl: string;
}
export function writeBandData(band: BandData) {
  const db = getDatabase();

  const bandId = uuidv4();
  set(ref(db, "bands/" + bandId), {
    id: bandId,
    name: band.name,
    logoUrl: band.logoUrl,
  })
    .then(() => console.log("banda cadastrada"))
    .catch((error) => {
      console.log(error);
    });
}

export async function getAllBands(): Promise<BandData[]> {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, "bands/"))
    .then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const bandsObject = snapshot.val();
        const bandsArray: BandData[] = Object.values(bandsObject);
        console.log(bandsArray);
        return bandsArray;
      } else {
        console.log("No data available");
        return [];
      }
    })
    .catch((error: Error) => {
      console.error(error);
      throw error;
    });
}
export async function deleteBandById(bandId: string): Promise<void> {
  const dbRef = ref(getDatabase());
  const bandRef = child(dbRef, `bands/${bandId}`);
  try {
    await remove(bandRef);
    console.log(`Band with ID ${bandId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting band with ID ${bandId}:`, error);
    throw error;
  }
}
