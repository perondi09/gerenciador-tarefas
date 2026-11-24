import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TRPCError } from '@trpc/server';
import { api } from '@/server/caller';
import { FormTarefa } from '@/components/FormTarefa';

export const dynamic = 'force-dynamic';

export default async function EditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const tarefa = await api.tarefa.buscarPorId({ id });
    return (
      <main>
        <Link href="/">← Voltar</Link>
        <h1>Editar tarefa</h1>
        <FormTarefa tarefa={tarefa} />
      </main>
    );
  } catch (e) {
    if (e instanceof TRPCError && e.code === 'NOT_FOUND') notFound();
    throw e;
  }
}