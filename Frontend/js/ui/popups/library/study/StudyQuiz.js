/**
 * StudyQuiz.js
 * Módulo responsável pela aba de Quiz.
 */
import { StudyState } from './StudyState.js';

export const StudyQuiz = {
    render: (container, data, state, philosopherId) => {
        const progress = StudyState.getProgressPercentage(philosopherId, data.totalPages);

        // Bloqueado se não leu tudo (exemplo: < 100%, ou lógica customizada)
        // A lógica original verificava pagesViewed.size < totalPages
        const viewedCount = StudyState.loadState(philosopherId).pagesViewed?.size || 0; // Hack: acessando via loadState para garantir
        // Mas o ideal é passar o objeto de progresso. Vamos assumir que o state passado já tem o que precisamos ou usamos o StudyState helper.

        // Vamos re-verificar o progresso real via StudyState
        // Precisamos saber quantas paginas foram vistas. O state passado é o 'lastState' (sessão), 
        // mas o progresso persistente está em gameState.studyProgress[id].pagesViewed.
        // O StudyState.isPageViewed ajuda, mas precisamos do count.
        // Vamos simplificar e assumir que o orquestrador passa essa info ou acessamos via StudyState.

        // Acesso direto ao gameState via StudyState seria melhor encapsulado, mas vamos lá:
        // O StudyState não exporta o objeto todo. Vamos confiar na logica do orquestrador ou melhorar o StudyState.
        // Vamos assumir que se o usuário clicou na aba Quiz, o orquestrador já validou ou o Quiz valida agora.

        // Recuperando progresso real
        // Nota: O render não deve ser async, então precisamos dos dados síncronos.

        // Lógica de Bloqueio
        // Como não temos acesso fácil ao "pagesViewed.size" aqui sem importar gameState, 
        // vamos assumir que o orquestrador passa `isUnlocked` ou similar.
        // Se não, importamos gameState (mas gera acoplamento).
        // Vamos importar StudyState e adicionar um método `getPagesViewedCount`.

        // Adicionando helper no StudyState (mentalmente, ou editando o arquivo se precisar).
        // O StudyState.loadState retorna o 'lastState', não o 'pagesViewed' que fica na raiz do progress.
        // Vamos usar o gameState global importado no StudyState se precisarmos, mas aqui vamos tentar ser puros.
        // Vou assumir que 'state' tem uma flag 'isQuizUnlocked' injetada pelo pai, OU
        // vou renderizar o bloqueio baseado em dados passados.

        // Melhor abordagem: O pai decide se mostra o Quiz ou o Bloqueio? 
        // Não, o pai delega "Renderize a aba Quiz". O módulo Quiz decide o que mostrar (Bloqueio, Intro, Questão, Resultado).

        // Vamos importar gameState aqui também para ler o progresso global, já que é uma dependência de dados.
        // Ou melhor, o StudyState já tem `isPageViewed`. Vamos adicionar `getViewedCount` lá?
        // Por agora, vou usar uma verificação simples baseada no que temos.

        // ... Pensando melhor, vou renderizar assumindo que o pai passou `quizUnlocked` no objeto `state` (hack) ou `data`.
        // Mas para ser robusto, vou importar o gameState indiretamente ou pedir ao StudyState.

        // Vou usar o StudyState.loadState(id) que retorna o state da sessão.
        // O pagesViewed está fora do lastState.
        // Vou assumir que o pai passa `progress` como argumento extra ou dentro de `state`.
        // Vou alterar a assinatura do render para receber `progress`.

        // Mas espere, a assinatura é `render(container, data, state)`.
        // Vou usar `state.quizUnlocked` que o pai deve setar.

        if (!state.quizUnlocked) {
            container.innerHTML = `
                <div class="quiz-placeholder animate__animated animate__fadeIn">
                    <i class="fas fa-lock" style="font-size: 3rem; color: #8d6e63;"></i>
                    <h3 style="font-family: 'Cinzel', serif;">Conteúdo Bloqueado</h3>
                    <p style="text-align:center;">Leia todas as páginas para liberar o quiz.</p>
                    <button class="nav-btn" id="btn-goto-study">Continuar Leitura</button>
                </div>`;
            return;
        }

        if (state.quizState.completed) {
            const percentage = Math.round((state.quizState.score / data.quiz.length) * 100);
            const passed = percentage >= 80;

            container.innerHTML = `
                <div class="quiz-placeholder animate__animated animate__fadeIn">
                    <i class="fas ${passed ? 'fa-trophy' : 'fa-book-reader'}" style="font-size: 4rem; color: ${passed ? '#FFD700' : '#8d6e63'};"></i>
                    <h3 style="font-family: 'Cinzel', serif;">${passed ? 'Aprovado!' : 'Estude Mais'}</h3>
                    <div style="font-size: 3rem; font-weight: bold; color: ${passed ? '#2e7d32' : '#c62828'};">${percentage}%</div>
                    <button class="nav-btn secondary" id="btn-retry-quiz">Tentar Novamente</button>
                </div>`;
            return;
        }

        if (!state.quizState.started) {
            container.innerHTML = `
                <div class="quiz-placeholder animate__animated animate__fadeIn">
                    <i class="fas fa-scroll" style="font-size: 3rem; color: #8d6e63;"></i>
                    <h3 style="font-family: 'Cinzel', serif;">Teste do Conhecimento</h3>
                    <button class="nav-btn" id="btn-start-quiz">Começar Quiz</button>
                </div>`;
            return;
        }

        // Render Questão
        const currentQ = data.quiz[state.quizState.currentQuestionIndex];
        const existingAnswer = state.quizState.answers.find(a => a.question === state.quizState.currentQuestionIndex);

        const optionsHtml = currentQ.options.map(opt => {
            let extraClass = '';
            if (existingAnswer) {
                extraClass = 'disabled';
                if (opt === currentQ.answer) extraClass += ' correct';
                else if (opt === existingAnswer.selected) extraClass += ' wrong';
            }
            return `<button class="quiz-option-btn ${extraClass}" data-opt="${opt}">${opt}</button>`;
        }).join('');

        container.innerHTML = `
            <div class="quiz-container animate__animated animate__fadeIn">
                <div style="margin-bottom: 2rem; color: #8d6e63; display:flex; justify-content:space-between;">
                    <span>Questão ${state.quizState.currentQuestionIndex + 1} de ${data.quiz.length}</span>
                </div>
                <h3 style="font-family: 'Merriweather', serif; color: #3e2723; margin-bottom: 2rem; line-height: 1.6;">${currentQ.question}</h3>
                <div class="quiz-options">${optionsHtml}</div>
            </div>`;
    },

    setup: (container, data, state, onUpdate) => {
        // Listeners para botões de fluxo
        const btnGoto = container.querySelector('#btn-goto-study');
        if (btnGoto) {
            btnGoto.onclick = () => onUpdate({ tab: 'theory' }); // Volta para teoria
            return;
        }

        const btnStart = container.querySelector('#btn-start-quiz');
        if (btnStart) {
            btnStart.onclick = () => {
                state.quizState.started = true;
                onUpdate({ quizState: state.quizState }); // Força re-render
            };
            return;
        }

        const btnRetry = container.querySelector('#btn-retry-quiz');
        if (btnRetry) {
            btnRetry.onclick = () => {
                state.quizState = { started: true, currentQuestionIndex: 0, score: 0, answers: [], completed: false };
                onUpdate({ quizState: state.quizState });
            };
            return;
        }

        // Listeners das opções
        const options = container.querySelectorAll('.quiz-option-btn');
        if (options.length) {
            options.forEach(btn => {
                if (btn.classList.contains('disabled')) return;

                btn.onclick = async () => {
                    // Lógica de resposta
                    const currentQ = data.quiz[state.quizState.currentQuestionIndex];
                    const selected = btn.dataset.opt;
                    const isCorrect = selected === currentQ.answer;

                    // Atualiza UI localmente (feedback instantâneo)
                    options.forEach(b => b.classList.add('disabled'));
                    btn.classList.add(isCorrect ? 'correct' : 'wrong');
                    if (!isCorrect) {
                        const correctBtn = Array.from(options).find(b => b.dataset.opt === currentQ.answer);
                        if (correctBtn) correctBtn.classList.add('correct');
                    }

                    // Atualiza State
                    if (isCorrect) state.quizState.score++;
                    state.quizState.answers.push({
                        question: state.quizState.currentQuestionIndex,
                        selected: selected,
                        correct: isCorrect
                    });

                    // Salva estado (sem re-render ainda)
                    // onUpdate({ quizState: state.quizState }, false); // false = no re-render? O pai decide.

                    // Delay
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Avança
                    if (state.quizState.currentQuestionIndex < data.quiz.length - 1) {
                        state.quizState.currentQuestionIndex++;
                    } else {
                        state.quizState.completed = true;
                    }

                    // Agora sim re-render
                    onUpdate({ quizState: state.quizState });
                };
            });
        }
    }
};
