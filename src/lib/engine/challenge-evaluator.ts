import { Challenge, EvaluationResult } from "@/types";
import { executeUserQuery } from "@/lib/db/pglite-engine";
import { analyzeSqlError } from "@/lib/engine/error-analyzer";

/**
 * Normalizes a database cell value for robust comparison
 * Handles BigInt, numbers, strings, dates, and nulls
 */
function normalizeValue(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number" || typeof val === "bigint") {
    // If it's a number, normalize decimals (e.g. 75000.00 -> 75000)
    const num = Number(val);
    return Number.isFinite(num) ? num.toFixed(2).replace(/\.?0+$/, "") : String(val);
  }
  if (val instanceof Date) {
    return val.toISOString().split("T")[0];
  }
  return String(val).trim().toLowerCase();
}

/**
 * Compares two row objects by checking normalized values across keys
 */
function areRowsEqual(r1: Record<string, any>, r2: Record<string, any>, colKeys: string[]): boolean {
  for (const col of colKeys) {
    // Find matching key case-insensitively
    const k1 = Object.keys(r1).find((k) => k.toLowerCase() === col.toLowerCase());
    const k2 = Object.keys(r2).find((k) => k.toLowerCase() === col.toLowerCase());

    const val1 = k1 ? r1[k1] : undefined;
    const val2 = k2 ? r2[k2] : undefined;

    if (normalizeValue(val1) !== normalizeValue(val2)) {
      return false;
    }
  }
  return true;
}

/**
 * Deterministically sorts rows for order-insensitive dataset matching
 */
function sortRowsDeterministically(rows: Record<string, any>[]): Record<string, any>[] {
  return [...rows].sort((a, b) => {
    const strA = JSON.stringify(a, Object.keys(a).sort());
    const strB = JSON.stringify(b, Object.keys(b).sort());
    return strA.localeCompare(strB);
  });
}

export function calculateXpEarned(baseXp: number, hintsUsed: number, viewedSolution: boolean): number {
  if (viewedSolution) {
    return Math.max(10, Math.round(baseXp * 0.25));
  }
  if (hintsUsed === 0) return baseXp;
  if (hintsUsed === 1) return Math.round(baseXp * 0.9);
  if (hintsUsed === 2) return Math.round(baseXp * 0.75);
  return Math.round(baseXp * 0.5);
}

export async function evaluateChallengeQuery(
  challenge: Challenge,
  userSql: string,
  hintsUsed: number = 0,
  viewedSolution: boolean = false
): Promise<EvaluationResult> {
  // 1. Execute the user's SQL query
  const userOutput = await executeUserQuery(challenge.databaseId, userSql);

  if (!userOutput.success) {
    const errorAnalysis = analyzeSqlError(
      userOutput.error || "Bilinmeyen hata",
      userSql,
      [],
      [],
      [],
      [],
      Boolean(challenge.orderMatters)
    );

    return {
      isCorrect: false,
      userRows: [],
      userColumns: [],
      executionTimeMs: userOutput.executionTimeMs,
      rowCount: 0,
      error: {
        type: userOutput.isSecurityViolation ? "SECURITY_VIOLATION" : errorAnalysis.type,
        message: userOutput.error || errorAnalysis.message,
        suggestion: errorAnalysis.suggestion,
      },
    };
  }

  // 2. Execute the official solution query for truth comparison
  const expectedOutput = await executeUserQuery(challenge.databaseId, challenge.solutionQuery, {
    bypassSecurity: true,
  });

  if (!expectedOutput.success) {
    // Should never happen if solutionQuery is valid
    console.error("Solution query failed:", expectedOutput.error);
  }

  const expRows = expectedOutput.rows || [];
  const expCols = challenge.expectedColumns || expectedOutput.columns || [];
  const userRows = userOutput.rows || [];
  const userCols = userOutput.columns || [];

  // Check columns count
  const normUserCols = userCols.map((c) => c.toLowerCase());
  const normExpCols = expCols.map((c) => c.toLowerCase());

  let isColumnsMatch =
    normUserCols.length === normExpCols.length && normExpCols.every((c) => normUserCols.includes(c));

  // If user selected * and expected has explicit columns, we allow it if column count and values match
  if (!isColumnsMatch && userRows.length > 0 && expRows.length > 0) {
    // check if all expected columns exist in user's result
    const hasAllExpected = normExpCols.every((c) => normUserCols.includes(c));
    if (hasAllExpected && normUserCols.length === normExpCols.length) {
      isColumnsMatch = true;
    }
  }

  // Row count check
  const isRowCountMatch = userRows.length === expRows.length;

  // Row contents check
  let isDataMatch = false;
  if (isRowCountMatch) {
    if (challenge.orderMatters) {
      // Must match row by row in exact order
      isDataMatch = userRows.every((uRow, idx) => areRowsEqual(uRow, expRows[idx], expCols));
    } else {
      // Order doesn't matter: compare sorted versions
      const sortedUser = sortRowsDeterministically(userRows);
      const sortedExp = sortRowsDeterministically(expRows);
      isDataMatch = sortedUser.every((uRow, idx) => areRowsEqual(uRow, sortedExp[idx], expCols));
    }
  }

  const isCorrect = isColumnsMatch && isRowCountMatch && isDataMatch;

  if (isCorrect) {
    const xpEarned = calculateXpEarned(challenge.baseXp, hintsUsed, viewedSolution);
    return {
      isCorrect: true,
      userRows,
      userColumns: userCols,
      expectedRows: expRows,
      expectedColumns: expCols,
      executionTimeMs: userOutput.executionTimeMs,
      rowCount: userRows.length,
      xpEarned,
    };
  }

  // Otherwise, analyze what went wrong
  const errorAnalysis = analyzeSqlError(
    "",
    userSql,
    userRows,
    userCols,
    expRows,
    expCols,
    Boolean(challenge.orderMatters)
  );

  return {
    isCorrect: false,
    userRows,
    userColumns: userCols,
    expectedRows: expRows,
    expectedColumns: expCols,
    executionTimeMs: userOutput.executionTimeMs,
    rowCount: userRows.length,
    error: {
      type: errorAnalysis.type,
      message: errorAnalysis.message,
      suggestion: errorAnalysis.suggestion,
    },
  };
}
