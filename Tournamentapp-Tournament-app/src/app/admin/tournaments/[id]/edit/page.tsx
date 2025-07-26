import { getTournament, getTournaments } from '@/lib/tournaments-service';
import { notFound } from 'next/navigation';
import EditTournamentClient from '@/components/admin/edit-tournament-client';

export async function generateStaticParams() {
  try {
    const tournaments = await getTournaments();
    if (!tournaments || tournaments.length === 0) {
        return [];
    }
    return tournaments.map((tournament) => ({
      id: tournament.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for tournament edit pages:", error);
    return [];
  }
}

export default async function EditTournamentPage({ params }: { params: { id: string } }) {
  const tournament = await getTournament(params.id);

  if (!tournament) {
    notFound();
  }

  return <EditTournamentClient initialTournament={tournament} />;
}
