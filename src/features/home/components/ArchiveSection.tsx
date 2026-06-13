import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/Archive.module.css";
import { ArchiveArtist } from "@/types/archive";

interface ArchiveSectionProps {
  archive: ArchiveArtist[];
}

export const ArchiveSection = ({ archive }: ArchiveSectionProps) => {
  const [archiveYear, setArchiveYear] = useState("ALL");
  const years = ["ALL", "2026", "2025", "2024"];

  return (
    <>
      <h1 className={styles.archiveMeta}>ARTISTS WHO HAVE PLAYED SACRISTY BANGKOK</h1>
      <div className={styles.archiveFilters}>
        {years.map(year => (
          <button 
            key={year} 
            className={`${styles.archiveFilter} ${archiveYear === year ? styles.active : ''}`} 
            onClick={() => setArchiveYear(year)}
          >
            {year}
          </button>
        ))}
      </div>
      <div style={{display:'flex', flexDirection:'column'}}>
        {archive
          .filter(a => archiveYear === "ALL" || a.years.includes(archiveYear))
          .map((a, i) => {
            if (a.isResident && a.slug) {
              return (
                <Link key={i} className={styles.archiveArtist} href={`/residents/${a.slug}`}>
                  {a.name}
                </Link>
              );
            }
            
            return (
              <a key={i} className={styles.archiveArtist} href={a.instagram || "#"} target="_blank" rel="noopener">
                {a.name}
              </a>
            );
          })
        }
      </div>
    </>
  );
};
