import Image from "next/image";
import { RichText } from "@/lib/rich-text-view";
import {
  staffInitials,
  staffPhotoSrc,
  type StaffMember as StaffMemberType,
} from "@/lib/staff-data";
import styles from "./staff-member.module.css";

type Props = {
  member: StaffMemberType;
};

export function StaffMemberCard({ member }: Props) {
  const photoSrc = staffPhotoSrc(member.photo);
  const alt = member.photo?.altText?.trim() || member.name;
  const bio = member.biography?.trim() ?? "";

  return (
    <li className={styles.item}>
      <div className={styles.media} aria-hidden={photoSrc ? undefined : true}>
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={alt}
            width={member.photo?.width ?? 320}
            height={member.photo?.height ?? 320}
            className={styles.photo}
            sizes="160px"
            unoptimized
          />
        ) : (
          <span className={styles.initials}>{staffInitials(member.name)}</span>
        )}
      </div>
      <div className={styles.copy}>
        <h2 className={styles.name}>{member.name}</h2>
        <p className={styles.role}>{member.roleTitle}</p>
        {bio ? <RichText text={bio} className={styles.bio} /> : null}
      </div>
    </li>
  );
}
