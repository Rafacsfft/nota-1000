"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "./AuthProvider";

export type SavedEssay = {
  id: string;
  theme: string;
  total: number;
  competencies: { code: string; score: number; feedback: string }[];
  summary: string;
  createdAt?: Timestamp;
};

export function useEssayStats() {
  const { user } = useAuth();
  const [essays, setEssays] = useState<SavedEssay[]>([]);

  useEffect(() => {
    if (!db || !user) return;
    const essaysQuery = query(
      collection(db, "users", user.uid, "essays"),
      orderBy("createdAt", "desc"),
      limit(5),
    );
    return onSnapshot(essaysQuery, (snapshot) => {
      setEssays(
        snapshot.docs.map(
          (item) => ({ id: item.id, ...item.data() }) as SavedEssay,
        ),
      );
    });
  }, [user]);

  return useMemo(() => {
    const totals = essays.map((essay) => essay.total);
    const average = totals.length
      ? Math.round(
          totals.reduce((sum, value) => sum + value, 0) / totals.length,
        )
      : 0;
    const competencyAverages = ["C1", "C2", "C3", "C4", "C5"].map((code) => {
      const values = essays.flatMap((essay) =>
        essay.competencies
          .filter((item) => item.code === code)
          .map((item) => item.score),
      );
      return values.length
        ? Math.round(
            values.reduce((sum, value) => sum + value, 0) / values.length,
          )
        : 0;
    });
    return { essays, average, competencyAverages };
  }, [essays]);
}
