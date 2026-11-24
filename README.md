# Gerenciador de Tarefas

Aplicação simples de gerenciamento de tarefas feita com **Next.js 15**, **tRPC** e **React Query**.

As tarefas ficam salvas em memória no servidor, então ao reiniciar o projeto a lista volta vazia.

## Funcionalidades

- Listar tarefas (primeira página carregada via SSR)
- Infinite scroll para carregar mais tarefas ao rolar a página
- Criar tarefa
- Editar tarefa
- Excluir tarefa direto na listagem, com mensagem de sucesso ou erro
- Validação do título no formulário e no backend (com Zod)
- Erro `NOT_FOUND` ao tentar editar ou excluir uma tarefa que não existe

## Tecnologias

- Next.js 15 (App Router)
- React 19
- tRPC 11
- TanStack React Query
- Zod
- SuperJSON
- Vitest

## Como rodar

Pré-requisito: Node.js 18.18 ou superior.

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

### Build de produção

```bash
npm run build
npm start
```

### Testes

```bash
npm test
```

## Estrutura

```
src/
  app/
    page.tsx                    listagem de tarefas (SSR)
    tarefas/nova/page.tsx       criação de tarefa
    tarefas/[id]/editar/page.tsx edição de tarefa
    api/trpc/[trpc]/route.ts    endpoint do tRPC
  components/
    ListaTarefas.tsx            lista com infinite scroll e exclusão
    FormTarefa.tsx              formulário de criar/editar
  server/
    trpc.ts                     configuração do tRPC
    store.ts                    lista de tarefas em memória
    caller.ts                   chama o tRPC direto no servidor (SSR)
    routers/tarefa.ts           endpoints: listar, buscarPorId, criar, atualizar, deletar
  trpc/
    client.tsx                  cliente tRPC + React Query
```

## Modelo da tarefa

| Campo        | Tipo   | Obrigatório |
| ------------ | ------ | ----------- |
| id           | string | gerado automaticamente |
| titulo       | string | sim |
| descricao    | string | não |
| dataCriacao  | Date   | gerado automaticamente |
