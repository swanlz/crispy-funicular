# Webapp de Solicitações de Pagamento (IDESAM)

MVP de um sistema web para registrar e aprovar solicitações de pagamento com fluxo em duas etapas:

1. **Gestor** aprova ou rejeita uma solicitação pendente.
2. **Financeiro** aprova (liberação final) ou rejeita solicitações aprovadas pelo gestor.

## Funcionalidades implementadas

- Cadastro de nova solicitação de despesa.
- Listagem em tabela com status da solicitação.
- Filtro por status.
- Ações por papel (Gestor e Financeiro).
- Persistência local com `localStorage`.
- Carga de dados de exemplo para demonstração.

## Fluxo de aprovação

- `PENDENTE` → criado pela área solicitante.
- `APROVADO_GESTOR` → aprovado por gestor.
- `APROVADO_FINANCEIRO` → aprovado pelo financeiro (status final).
- `REJEITADO` → reprovado em qualquer etapa antes da aprovação final.

## Como executar

Como o projeto é estático, basta abrir `index.html` no navegador.

Se preferir rodar via servidor local:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Próximos passos recomendados

- Adicionar autenticação real e perfis de usuário.
- Registrar trilha de auditoria persistente em banco de dados.
- Integrar anexos (nota fiscal, comprovantes).
- Criar notificações por e-mail/WhatsApp corporativo.
- Expor API backend (por exemplo, Node.js/NestJS ou Django/FastAPI).
