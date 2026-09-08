export interface SecurityCheckResult {
  isSafe: boolean;
  violationMessage?: string;
}

const BLOCKED_COMMANDS = [
  "DROP",
  "DELETE",
  "UPDATE",
  "INSERT",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "GRANT",
  "REVOKE",
  "COPY",
  "VACUUM",
  "REINDEX",
  "EXECUTE",
  "PREPARE",
  "CALL",
  "DO",
];

const BLOCKED_PATTERNS = [
  /pg_read_file/i,
  /pg_write_file/i,
  /pg_sleep/i,
  /pg_terminate_backend/i,
  /pg_cancel_backend/i,
  /dblink/i,
  /current_setting/i,
  /set_config/i,
  /information_schema\.system/i,
];

export function validateSafeQuery(sql: string): SecurityCheckResult {
  if (!sql || !sql.trim()) {
    return { isSafe: false, violationMessage: "Lütfen çalıştırmak için bir SQL sorgusu yazın." };
  }

  // Remove SQL comments (-- comment and /* comment */)
  const sanitized = sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

  if (!sanitized) {
    return { isSafe: false, violationMessage: "Sorgu sadece yorum satırlarından oluşamaz." };
  }

  // Must start with SELECT, WITH, or EXPLAIN
  const startsWithAllowed = /^(SELECT|WITH|EXPLAIN)\b/i.test(sanitized);
  if (!startsWithAllowed) {
    return {
      isSafe: false,
      violationMessage:
        "Güvenlik Politikası: Analiz ortamında yalnızca salt-okunur (SELECT / WITH / EXPLAIN) sorgularına izin verilmektedir.",
    };
  }

  // Check for forbidden DDL/DML tokens outside of string literals
  // Simple token matching on word boundaries
  for (const cmd of BLOCKED_COMMANDS) {
    const regex = new RegExp(`\\b${cmd}\\b`, "i");
    if (regex.test(sanitized)) {
      // Check if it's within quotes or a reserved statement
      // We disallow statements containing DROP, DELETE, UPDATE, etc.
      return {
        isSafe: false,
        violationMessage: `Güvenlik İhlali: '${cmd}' komutu güvenlik sebebiyle engellenmiştir. Yalnızca SELECT sorguları çalıştırılabilir.`,
      };
    }
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(sanitized)) {
      return {
        isSafe: false,
        violationMessage: "Güvenlik İhlali: Sistem seviyesi fonksiyonların veya tabloların çağrılması engellenmiştir.",
      };
    }
  }

  return { isSafe: true };
}
