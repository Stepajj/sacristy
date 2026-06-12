import ResidentForm from "../ResidentForm";
import styles from "../../events/Events.module.css";

export default async function NewResidentPage() {
  return (
    <div>
      <h1 className={styles.title}>New Resident</h1>
      <ResidentForm />
    </div>
  );
}
