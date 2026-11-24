import Link from 'next/link';
import { FormTarefa } from '@/components/FormTarefa';

export default function NovaTarefaPage() {
  return (
    <main>
      <Link href="/">← Voltar</Link>
      <h1>Nova tarefa</h1>
      <FormTarefa />
    </main>
  );
}