import { useEffect, useState } from "react";
import { managementApi } from "@/lib/api/endpoints/management";

interface LastOneOnOneStatus {
  hasRecentOneOnOne: boolean; // True if there's a 1:1 in the last 7 days
  lastOneOnOneDate: Date | null;
  nextEligibleDate: Date | null; // Date when XP can be earned again
  daysUntilEligible: number; // Days remaining until next XP-eligible 1:1
  loading: boolean;
}

/**
 * Hook to check if a subordinate has a 1:1 in the last 7 days
 * Used to determine if XP should be awarded for a new 1:1
 */
export function useLastOneOnOne(
  subordinateId?: string,
  cycleId?: string
): LastOneOnOneStatus {
  const [status, setStatus] = useState<LastOneOnOneStatus>({
    hasRecentOneOnOne: false,
    lastOneOnOneDate: null,
    nextEligibleDate: null,
    daysUntilEligible: 0,
    loading: true,
  });

  useEffect(() => {
    if (!subordinateId || !cycleId) {
      setStatus({
        hasRecentOneOnOne: false,
        lastOneOnOneDate: null,
        nextEligibleDate: null,
        daysUntilEligible: 0,
        loading: false,
      });
      return;
    }

    let active = true;

    (async () => {
      try {
        // Fetch all activities for the subordinate in this cycle
        const activities = await managementApi.getSubordinateActivities(
          subordinateId,
          cycleId
        );

        if (!active) return;

        // Find the most recent 1:1 activity
        const oneOnOneActivities = activities
          .filter((activity) => activity.type === "ONE_ON_ONE")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        if (oneOnOneActivities.length === 0) {
          setStatus({
            hasRecentOneOnOne: false,
            lastOneOnOneDate: null,
            nextEligibleDate: null,
            daysUntilEligible: 0,
            loading: false,
          });
          return;
        }

        const lastActivity = oneOnOneActivities[0];
        const lastDate = new Date(lastActivity.createdAt);
        const now = new Date();
        const daysSinceLastOneOnOne = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        const hasRecentOneOnOne = daysSinceLastOneOnOne < 7;

        // Calculate next eligible date (7 days after last 1:1)
        const nextEligibleDate = new Date(lastDate);
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 7);

        const daysUntilEligible = hasRecentOneOnOne
          ? Math.ceil(
              (nextEligibleDate.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;

        setStatus({
          hasRecentOneOnOne,
          lastOneOnOneDate: lastDate,
          nextEligibleDate: hasRecentOneOnOne ? nextEligibleDate : null,
          daysUntilEligible,
          loading: false,
        });
      } catch (error) {
        console.error("Error checking last 1:1:", error);
        if (!active) return;
        setStatus({
          hasRecentOneOnOne: false,
          lastOneOnOneDate: null,
          nextEligibleDate: null,
          daysUntilEligible: 0,
          loading: false,
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [subordinateId, cycleId]);

  return status;
}
