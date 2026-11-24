export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

const globalParaTarefas = globalThis as unknown as { tarefas?: Map<string, Tarefa> };

if (!globalParaTarefas.tarefas) {
  globalParaTarefas.tarefas = new Map<string, Tarefa>();
}

export const tarefas = globalParaTarefas.tarefas;
