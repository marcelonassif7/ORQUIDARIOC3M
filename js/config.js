/* Valores padrão. Quase tudo daqui pode ser alterado depois no painel (aba "Loja"). */
const SCRIPT_URL='https://script.google.com/macros/s/AKfycbwZN9dGfULf4TaI0dGcLch8U3N4mdV2VHqveeFhBnWP7uaNCZ_NMkyc4xBFpSHK0EkoSQ/exec'; // URL /exec gerada pelo Apps Script (único lugar onde ela é colada)
let WHATSAPP='5531999176791';                      // recebe os pedidos: DDI+DDD+número
let FRETE_FIXO=0, FRETE_GRATIS_ACIMA=1000;         // frete padrão (o painel pode alterar)
const LOJA={
  nome:'Orquidário C3M', razao:'Orquidario C3M Ltda', cnpj:'32.204.558/0001-85',
  endereco:'Rua José Viana de Matos, 137, Centro', cidade:'Lagoa Santa/MG', cep:'33400-000',
  telefone:'(31) 99917-6791', email:'orquidarioc3m@outlook.com',
  facebook:'https://www.facebook.com/orquidarioc3mlagoasanta/',
  instagram:'https://www.instagram.com/orquidarioc3m/',
  horario:['Segunda a sexta: 9h às 19h','Sábado: 9h às 15h'],
  obsHorario:'Confirme pelo WhatsApp antes de vir.',
  parcelas:6, avisoTopo:''
};
