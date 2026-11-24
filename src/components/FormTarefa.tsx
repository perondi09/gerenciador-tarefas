'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/trpc/client';

type Props = {
  tarefa?: { id: string; titulo: string; descricao?: string };
};

export function FormTarefa({ tarefa }: Props) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? '');
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? '');
  const [erro, setErro] = useState('');

  async function aoSalvar() {
    await utils.tarefa.listar.invalidate();
    router.push('/');
    router.refresh();
  }

  const criar = trpc.tarefa.criar.useMutation({
    onSuccess: aoSalvar,
    onError: (e) => setErro(e.message),
  });

  const atualizar = trpc.tarefa.atualizar.useMutation({
    onSuccess: aoSalvar,
    onError: (e) => setErro(e.message),
  });

  const salvando = criar.isPending || atualizar.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (titulo.trim() === '') {
      setErro('O título é obrigatório');
      return;
    }

    if (tarefa) {
      atualizar.mutate({ id: tarefa.id, titulo, descricao });
    } else {
      criar.mutate({ titulo, descricao });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      <label>
        Título *
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} style={{ width: '100%' }} />
      </label>
      <label>
        Descrição
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: '100%' }} />
      </label>

      {erro && <p style={{ color: 'crimson' }}>{erro}</p>}

      <button type="submit" disabled={salvando}>
        {salvando ? 'Salvando...' : tarefa ? 'Salvar alterações' : 'Criar tarefa'}
      </button>
    </form>
  );
}
