import { CHALLENGES } from "@/lib/data/challenges";
import { ChallengePlayView } from "@/components/play/ChallengePlayView";

export function generateStaticParams() {
  return CHALLENGES.map((c) => ({
    challengeId: c.id,
  }));
}

export default function PlayChallengePage() {
  return <ChallengePlayView />;
}
