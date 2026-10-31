/* Edite SÓ este arquivo para ligar o site à planilha e atualizar os dados da loja */
const SCRIPT_URL='https://script.google.com/macros/s/AKfycbzjgPpPBnh9z2kGsb7A4JXNYnxxRR1gjUafSUGK2dawus932YWxGyrBou_lCvwiRp-J/exec'; // URL /exec gerada pelo Apps Script
const WHATSAPP='5531999176791';                    // recebe os pedidos: DDI+DDD+número
const FRETE_FIXO=25, FRETE_GRATIS_ACIMA=199;       // iguais aos do Code.gs (confira os valores reais)
const LOJA={
  nome:'Orquidário C3M', razao:'Orquidario C3M Ltda', cnpj:'32.204.558/0001-85',
  endereco:'Rua José Viana de Matos, 137, Centro', cidade:'Lagoa Santa/MG', cep:'33233-540',
  telefone:'(31) 99917-6791', email:'orquidarioc3m@outlook.com',
  facebook:'https://www.facebook.com/orquidarioc3mlagoasanta/',
  instagram:'https://www.instagram.com/orquidarioc3m/',
  horario:['Segunda a sexta: 9h às 19h','Sábado: 9h às 14h'],
  obsHorario:'Confirme pelo WhatsApp antes de vir.',
  parcelas:0                                        // parcelas sem juros exibidas nos preços
};
