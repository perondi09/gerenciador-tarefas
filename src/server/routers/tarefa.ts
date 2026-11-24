import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { randomUUID } from 'crypto';
import { router, publicProcedure } from '../trpc';
import { tarefas, type Tarefa } from '../store';

const titulo = z.string().trim().min(1, 'O título é obrigatório').max(100, 'O título pode ter no máximo 100 caracteres');
const descricao = z.string().trim().max(500, 'A descrição pode ter no máximo 500 caracteres').optional();

function buscarTarefa(id: string) {
  const tarefa = tarefas.get(id);
  if (!tarefa) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Tarefa não encontrada' });
  }
  return tarefa;
}

export const tarefaRouter = router({
  listar: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.number().nullish(),
      }),
    )
    .query(({ input }) => {
      const inicio = input.cursor ?? 0;
      const fim = inicio + input.limit;
      const todas = Array.from(tarefas.values()).sort(
        (a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime(),
      );

      return {
        itens: todas.slice(inicio, fim),
        nextCursor: fim < todas.length ? fim : null,
      };
    }),

  buscarPorId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => buscarTarefa(input.id)),

  criar: publicProcedure
    .input(z.object({ titulo, descricao }))
    .mutation(({ input }) => {
      const nova: Tarefa = {
        id: randomUUID(),
        titulo: input.titulo,
        descricao: input.descricao || undefined,
        dataCriacao: new Date(),
      };
      tarefas.set(nova.id, nova);
      return nova;
    }),

  atualizar: publicProcedure
    .input(z.object({ id: z.string(), titulo, descricao }))
    .mutation(({ input }) => {
      const tarefa = buscarTarefa(input.id);
      tarefa.titulo = input.titulo;
      tarefa.descricao = input.descricao || undefined;
      return tarefa;
    }),

  deletar: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      buscarTarefa(input.id);
      tarefas.delete(input.id);
      return { id: input.id };
    }),
});
