import { beforeEach, describe, expect, it } from 'vitest';
import { createCallerFactory } from '../trpc';
import { appRouter } from './_app';
import { tarefas } from '../store';

const api = createCallerFactory(appRouter)({});

describe('tarefas', () => {
  beforeEach(() => {
    tarefas.clear();
  });

  it('cria uma tarefa', async () => {
    const tarefa = await api.tarefa.criar({ titulo: 'Estudar tRPC', descricao: 'Ler a documentação' });

    expect(tarefa.id).toBeTruthy();
    expect(tarefa.titulo).toBe('Estudar tRPC');
    expect(tarefa.descricao).toBe('Ler a documentação');
    expect(tarefa.dataCriacao).toBeInstanceOf(Date);
  });

  it('não cria tarefa sem título', async () => {
    await expect(api.tarefa.criar({ titulo: '   ' })).rejects.toThrow('O título é obrigatório');
  });

  it('lista as tarefas mais recentes primeiro com paginação', async () => {
    for (let i = 1; i <= 12; i++) {
      tarefas.set(String(i), { id: String(i), titulo: `Tarefa ${i}`, dataCriacao: new Date(2025, 0, i) });
    }

    const pagina1 = await api.tarefa.listar({ limit: 10 });
    expect(pagina1.itens).toHaveLength(10);
    expect(pagina1.itens[0].titulo).toBe('Tarefa 12');
    expect(pagina1.nextCursor).toBe(10);

    const pagina2 = await api.tarefa.listar({ limit: 10, cursor: pagina1.nextCursor });
    expect(pagina2.itens).toHaveLength(2);
    expect(pagina2.nextCursor).toBeNull();
  });

  it('atualiza uma tarefa', async () => {
    const tarefa = await api.tarefa.criar({ titulo: 'Antigo' });

    const atualizada = await api.tarefa.atualizar({ id: tarefa.id, titulo: 'Novo', descricao: 'Editada' });

    expect(atualizada.titulo).toBe('Novo');
    expect(atualizada.descricao).toBe('Editada');
  });

  it('retorna erro ao atualizar tarefa que não existe', async () => {
    await expect(api.tarefa.atualizar({ id: 'nao-existe', titulo: 'Teste' })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('deleta uma tarefa', async () => {
    const tarefa = await api.tarefa.criar({ titulo: 'Apagar' });

    await api.tarefa.deletar({ id: tarefa.id });

    expect(tarefas.has(tarefa.id)).toBe(false);
  });

  it('retorna erro ao deletar tarefa que não existe', async () => {
    await expect(api.tarefa.deletar({ id: 'nao-existe' })).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
