import React, { useState } from 'react';
import logoEnm from '/logo-enm.png';

export default function CalculadoraImposto() {
  const [atividade, setAtividade] = useState('');
  const [faturamento, setFaturamento] = useState('');
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const formatarInput = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros === '') return '';
    const centavos = parseInt(numeros, 10);
    const reais = centavos / 100;
    return reais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const extrairNumero = (valorFormatado) => {
    const numeros = valorFormatado.replace(/\D/g, '');
    if (numeros === '') return 0;
    return parseInt(numeros, 10) / 100;
  };

  const handleFaturamentoChange = (e) => {
    const formatado = formatarInput(e.target.value);
    setFaturamento(formatado);
    setMostrarResultado(false);
  };

  const calcularImpacto = () => {
    const valorFaturamento = extrairNumero(faturamento);
    if (valorFaturamento === 0) return null;

    const LIMITE_ANUAL = 5000000;

    // Alíquotas do contador (IRPJ + CSLL + PIS/COFINS)
    const isBase32 = atividade === 'servicos' || atividade === 'construcao_32';
    const cargaAtual = isBase32 ? 0.1453 : 0.0673;
    const aumentoEfetivo = isBase32 ? 0.01088 : 0.00308;

    const impostoAntigo = valorFaturamento * cargaAtual;

    const excedente = Math.max(valorFaturamento - LIMITE_ANUAL, 0);
    const diferenca = excedente * aumentoEfetivo;

    const impostoNovo = impostoAntigo + diferenca;

    return {
      antigo: impostoAntigo,
      novo: impostoNovo,
      diferenca
    };
  };

  const resultado = calcularImpacto();

  const aoClicarCalcular = () => {
    if (!atividade) {
      alert('Por favor, selecione o ramo de atuação.');
      return;
    }
    const valorFaturamento = extrairNumero(faturamento);
    if (valorFaturamento <= 0) {
      alert('Por favor, insira um valor de faturamento válido.');
      return;
    }
    setMostrarResultado(true);
  };

  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  const falarComEspecialista = () => {
    const diferenca = resultado ? formatarMoeda(resultado.diferenca) : '';
    const texto = encodeURIComponent(
      `Olá! Fiz a simulação no site e vi que meu imposto vai aumentar em ${diferenca} por ano. Gostaria de saber como vocês podem me ajudar com isso.`
    );
    window.open(`https://wa.me/5531988168836?text=${texto}`, '_blank');
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 sm:p-8 box-border" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div
        className="w-full max-w-[780px] min-h-[580px] rounded-2xl px-10 pt-16 pb-12 sm:px-16 sm:pt-20 sm:pb-14"
        style={{ backgroundColor: 'var(--box-bg)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      >
        <div className="flex justify-center mb-6">
          <img src={logoEnm} alt="ENM Auditoria" style={{ height: 60, objectFit: 'contain' }} />
        </div>
        <h2 className="text-center mt-0 mb-2 text-2xl font-extrabold" style={{ color: 'var(--primary-color)' }}>
          Simulador Lucro Presumido 2026
        </h2>
        <p className="text-center text-gray-600 text-[0.9em] mb-10">
          Descubra o impacto da Lei Complementar nº 224/2025 no caixa da sua empresa.
        </p>

        <div className="max-w-[480px] mx-auto">

        <div style={{ marginBottom: 28 }}>
          <label htmlFor="atividade" className="block font-bold text-gray-800" style={{ marginBottom: 10, fontSize: '0.95rem' }}>
            Qual o seu ramo de atuação?
          </label>
          <select
            id="atividade"
            className="input-simulador cursor-pointer"
            value={atividade}
            onChange={(e) => { setAtividade(e.target.value); setMostrarResultado(false); }}
          >
            <option value="" disabled>Selecione</option>
            <option value="servicos">Serviços em Geral</option>
            <option value="comercio">Comércio</option>
            <option value="industria">Indústria</option>
            <option value="construcao_8_12">Construção (Presunção 8%/12%)</option>
            <option value="construcao_32">Construção (Presunção 32%)</option>
          </select>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label htmlFor="faturamento" className="block font-bold text-gray-800" style={{ marginBottom: 10, fontSize: '0.95rem' }}>
            Faturamento Anual Estimado (R$)
          </label>
          <input
            type="text"
            id="faturamento"
            placeholder="Ex: 5.000.000"
            inputMode="numeric"
            className="input-simulador"
            value={faturamento}
            onChange={handleFaturamentoChange}
          />
        </div>

        <button type="button" className="btn-primary" onClick={aoClicarCalcular}>
          Calcular Impacto
        </button>

        {/* Resultados - só após clicar em Calcular Impacto */}
        {mostrarResultado && resultado && (
          <div className="resultado-container">
            <div className="resultado-card">
              <span className="resultado-label">Imposto Anual Estimado (Regra Antiga)</span>
              <strong className="resultado-valor">{formatarMoeda(resultado.antigo)}</strong>
            </div>

            <div className="resultado-card">
              <span className="resultado-label">Novo Imposto Anual (Regra 2026)</span>
              <strong className="resultado-valor">{formatarMoeda(resultado.novo)}</strong>
            </div>

            <div className="resultado-card resultado-destaque">
              <span className="resultado-label">Aumento na Carga Tributária (Prejuízo)</span>
              <strong className="resultado-valor-destaque">{formatarMoeda(resultado.diferenca)}</strong>
            </div>

            {resultado.diferenca > 0 && (
              <>
                <p className="resultado-texto">
                  Já existe liminar favorável contra este tema. Estamos à disposição para ingressar com a ação caso seja vantajoso para sua empresa.
                </p>
                <button type="button" onClick={falarComEspecialista} className="btn-whatsapp">
                  Falar com Especialista
                </button>
              </>
            )}

            {resultado.diferenca === 0 && (
              <div className="resultado-card resultado-ok">
                <strong>Boas notícias!</strong>
                <span className="resultado-label" style={{ marginTop: 4 }}>
                  Seu faturamento está abaixo do limite. Você não sofrerá aumento com a nova regra.
                </span>
              </div>
            )}
          </div>
        )}

        <p className="disclaimer">
          *Cálculo estimado considerando IRPJ, CSLL e PIS/COFINS, com base na lógica simplificada da LC nº 224/2025.
          Aumento aplicado sobre o faturamento excedente a R$ 5.000.000,00/ano.
        </p>

        </div>
      </div>
    </div>
  );
}
