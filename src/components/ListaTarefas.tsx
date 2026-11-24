'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/server/routers/_app';
import { trpc } from '@/trpc/client';

type PaginaTarefas = inferRouterOutputs<AppRouter>['tarefa']['listar'];

export function ListaTarefas({ inicial }: { inicial: PaginaTarefas }) {
  const utils = trpc.useUtils();
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const fimDaLista = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = trpc.tarefa.listar.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (pagina) => pagina.nextCursor,
      initialData: { pages: [inicial], pageParams: [null] },
    },
  );

  const deletar = trpc.tarefa.deletar.useMutation({
    onSuccess: () => {
      setErro('');
      setMensagem('Tarefa excluída com sucesso!');
      utils.tarefa.listar.invalidate();
    },
    onError: (e) => {
      setMensagem('');
      setErro(e.message);
    },
  });

  useEffect(() => {
    if (!fimDaLista.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(fimDaLista.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const tarefas = data ? data.pages.flatMap((pagina) => pagina.itens) : [];

  return (
    <section>
      {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
      {erro && <p style={{ color: 'crimson' }}>{erro}</p>}

      {tarefas.length === 0 && <p>Nenhuma tarefa cadastrada.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tarefas.map((tarefa) => {
          const excluindo = deletar.isPending && deletar.variables?.id === tarefa.id;

          return (
            <li key={tarefa.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
              <strong>{tarefa.titulo}</strong>
              {tarefa.descricao && <p>{tarefa.descricao}</p>}
              <small>Criada em {tarefa.dataCriacao.toLocaleString('pt-BR')}</small>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <Link href={`/tarefas/${tarefa.id}/editar`}>Editar</Link>
                <button disabled={excluindo} onClick={() => deletar.mutate({ id: tarefa.id })}>
                  {excluindo ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div ref={fimDaLista} />
      {isFetchingNextPage && <p>Carregando mais...</p>}
    </section>
  );
}
