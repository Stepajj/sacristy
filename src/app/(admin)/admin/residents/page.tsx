export const dynamic = "force-dynamic";

import { getResidents } from "@/services/resident.service";
import Link from "next/link";
import styles from "../events/Events.module.css";
import Image from "next/image";

export default async function AdminResidentsPage() {
  const residents = await getResidents();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Residents</h1>
        <Link href="/admin/residents/new" className={styles.createBtn}>+ NEW RESIDENT</Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>PHOTO</th>
              <th>NAME</th>
              <th>SLUG</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((res) => (
              <tr key={res.id}>
                <td style={{ width: '80px' }}>
                  {res.photo ? (
                    <Image src={res.photo} alt={res.name} width={40} height={50} style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 40, height: 50, background: '#111' }} />
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{res.name}</td>
                <td className={styles.slug}>/{res.slug}</td>
                <td className={styles.actionsCell}>
                  <Link href={`/admin/residents/${res.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
