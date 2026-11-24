import Link from 'next/link';
import { api } from '@/server/caller';
import { ListaTarefas } from '@/components/ListaTarefas';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const primeiraPagina = await api.tarefa.listar({ limit: 10 });

  return (
    <main>
      <h1>Tarefas</h1>
      <Link href="/tarefas/nova">+ Nova tarefa</Link>
      <ListaTarefas inicial={primeiraPagina} />
    </main>
  );
}