export const dynamic = "force-dynamic";

import { getPublicSettings } from "@/services/settings.service";
import SettingsPageClient from "./SettingsPageClient";
import styles from "../events/Events.module.css";

export default async function AdminSettingsPage() {
  const settings = await getPublicSettings();

  return (
    <div>
      <h1 className={styles.title}>Settings</h1>
      <SettingsPageClient initialSettings={settings} />
    </div>
  );
}
