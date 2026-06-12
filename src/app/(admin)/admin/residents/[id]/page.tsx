import { getResidentById } from "@/services/resident.service";
import { notFound } from "next/navigation";
import ResidentForm from "../ResidentForm";
import styles from "../../events/Events.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditResidentPage({ params }: Props) {
  const { id } = await params;
  const resident = await getResidentById(parseInt(id));

  if (!resident) notFound();

  return (
    <div>
      <h1 className={styles.title}>Edit Resident</h1>
      <ResidentForm initialData={resident} />
    </div>
  );
}
