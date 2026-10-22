/**
 * Logic học Tự Luận - Mỗi trang 1 câu (Single-Question View)
 * Tối ưu hiệu năng 120 FPS không giật lag, hỗ trợ đánh dấu "Đã đọc rùi".
 */

(function () {
    'use strict';

    // State
    let currentIndex = 0; // 0 to questions.length - 1
    let questions = [];
    let readQuestions = new Set(); // Set of question IDs marked as "Đã đọc rùi"
    let answerHidden = false;

    // LocalStorage Key
    const STORAGE_KEY_READ = 'tuluan_read_questions_v2';

    // Helper: Bỏ dấu tiếng Việt
    function removeVietnameseTones(str) {
        if (!str) return '';
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
        str = str.replace(/\u02C6|\u0306|\u031B/g, '');
        return str.trim();
    }

    function init() {
        if (!window.TULUAN_DATA || !Array.isArray(window.TULUAN_DATA.questions)) {
            console.error('Không tìm thấy dữ liệu TULUAN_DATA!');
            return;
        }

        questions = window.TULUAN_DATA.questions;

        // Load danh sách câu "Đã đọc rùi" từ localStorage
        loadReadStatus();

        // Xử lý query param ?q= hoặc vị trí câu đã lưu
        const params = new URLSearchParams(window.location.search);
        const qParam = parseInt(params.get('q'), 10);
        if (!isNaN(qParam) && qParam >= 1 && qParam <= questions.length) {
            currentIndex = qParam - 1;
        } else {
            // Mở câu chưa đọc đầu tiên hoặc câu gần nhất
            const lastSavedIndex = parseInt(localStorage.getItem('tuluan_last_viewed_q') || '0', 10);
            if (!isNaN(lastSavedIndex) && lastSavedIndex >= 0 && lastSavedIndex < questions.length) {
                currentIndex = lastSavedIndex;
            }
        }

        setupBackButton();
        renderProgress();
        renderNavGrid();
        renderCurrentQuestion();
        setupKeyboardNav();
    }

    function setupBackButton() {
        const btnBack = document.getElementById('btnNavBack');
        if (!btnBack) return;

        const params = new URLSearchParams(window.location.search);
        const courseId = params.get('id') || 'KTCQ';
        const courseName = params.get('name') || 'Kiến Trúc Cảnh Quan';

        btnBack.href = `product.html?id=${courseId}&name=${encodeURIComponent(courseName)}`;
    }

    // Load & Save Read Status
    function loadReadStatus() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_READ);
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) {
                    readQuestions = new Set(arr);
                }
            }
        } catch (e) {
            readQuestions = new Set();
        }
    }

    function saveReadStatus() {
        try {
            localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(Array.from(readQuestions)));
        } catch (e) {}
    }

    // Render thanh tiến độ "Đã đọc rùi"
    function renderProgress() {
        const count = readQuestions.size;
        const total = questions.length;
        const percent = Math.round((count / total) * 100);

        const countText = document.getElementById('readProgressText');
        const fillBar = document.getElementById('readProgressFill');
        const badge = document.getElementById('readCountBadge');

        if (countText) {
            countText.innerHTML = `Đã đọc rùi: <b>${count}/${total} câu</b> (${percent}%)`;
        }
        if (fillBar) {
            fillBar.style.width = `${percent}%`;
        }
        if (badge) {
            badge.textContent = `${count}/${total} đã đọc`;
        }
    }

    // Render danh sách số câu (Navigation Grid)
    function renderNavGrid() {
        const grid = document.getElementById('questionNavGrid');
        const drawerGrid = document.getElementById('drawerNavGrid');
        if (!grid && !drawerGrid) return;

        let html = '';
        questions.forEach((q, idx) => {
            const isRead = readQuestions.has(q.id);
            const isCurrent = idx === currentIndex;

            let classes = ['q-nav-pill'];
            if (isCurrent) classes.push('current');
            if (isRead) classes.push('is-read');

            html += `
                <button type="button" class="${classes.join(' ')}" onclick="window.goToQuestion(${idx})" title="Câu ${q.id}: ${escapeHtml(q.title)}">
                    <span class="q-pill-num">${q.id < 10 ? '0' + q.id : q.id}</span>
                    ${isRead ? '<span class="q-pill-check">✓</span>' : ''}
                </button>
            `;
        });

        if (grid) grid.innerHTML = html;
        if (drawerGrid) drawerGrid.innerHTML = html;
    }

    // Render câu hỏi hiện tại (chỉ 1 câu trên trang -> mượt mà 120 FPS không lag)
    function renderCurrentQuestion() {
        const stage = document.getElementById('singleQuestionStage');
        if (!stage) return;

        const q = questions[currentIndex];
        if (!q) return;

        // Lưu câu vừa xem
        localStorage.setItem('tuluan_last_viewed_q', currentIndex.toString());

        const isRead = readQuestions.has(q.id);
        const qNumFormatted = q.id < 10 ? '0' + q.id : q.id;

        stage.innerHTML = `
            <article class="tuluan-card" id="currentCard">
                <!-- Card Header -->
                <div class="card-meta-header">
                    <div class="card-pill-group">
                        <span class="pill-qnum">CÂU ${qNumFormatted} / ${questions.length}</span>
                        <span class="pill-chapter">${escapeHtml(q.chapterTitle.split('.')[0])}</span>
                        <span class="pill-tag">${escapeHtml(q.title)}</span>
                    </div>

                    <div class="card-action-btns">
                        <button type="button" class="btn-card-tool" onclick="window.toggleCurrentAnswer()" title="Ẩn hoặc hiện đáp án câu này">
                            <span id="btnAnswerIcon">${answerHidden ? '👁️' : '🙈'}</span>
                            <span id="btnAnswerText">${answerHidden ? 'Hiện đáp án' : 'Ẩn đáp án'}</span>
                        </button>
                        <button type="button" class="btn-card-tool" onclick="window.copyCurrentQuestion()" title="Sao chép câu hỏi và đáp án vào clipboard">
                            <span>📋</span>
                            <span>Sao chép</span>
                        </button>
                    </div>
                </div>

                <!-- Phần CÂU HỎI -->
                <div class="question-section">
                    <div class="section-badge question-badge">
                        <span>❓</span> CÂU HỎI TỰ LUẬN
                    </div>
                    <h1 class="question-prompt-text">${escapeHtml(q.question)}</h1>
                </div>

                <!-- Phần ĐÁP ÁN -->
                <div class="answer-section ${answerHidden ? 'is-hidden' : ''}" id="currentAnswerSection">
                    <div class="section-badge answer-badge">
                        <span>💡</span> ĐÁP ÁN CHI TIẾT
                    </div>
                    <div class="answer-content-body">
                        ${q.answerHtml}
                    </div>
                </div>

                <!-- Thanh Điều Hướng & Đánh Dấu ĐÃ ĐỌC RÙI -->
                <div class="single-q-footer">
                    <button type="button" class="btn-neo btn-nav-step" onclick="window.prevQuestion()" ${currentIndex === 0 ? 'disabled' : ''}>
                        ← CÂU TRƯỚC
                    </button>

                    <button type="button" class="btn-neo btn-mark-read ${isRead ? 'is-marked' : ''}" onclick="window.toggleReadCurrent()">
                        <span class="read-icon">${isRead ? '✅' : '📖'}</span>
                        <span class="read-label">${isRead ? 'ĐÃ ĐỌC RÙI ✓' : 'ĐIỀN LÀ ĐÃ ĐỌC RÙI'}</span>
                    </button>

                    <button type="button" class="btn-neo btn-nav-step" onclick="window.nextQuestion()" ${currentIndex === questions.length - 1 ? 'disabled' : ''}>
                        CÂU TIẾP THEO →
                    </button>
                </div>
            </article>
        `;

        renderNavGrid();
        renderProgress();

        // Cuộn nhẹ lên đầu trang bài học
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Chuyển câu hỏi
    window.goToQuestion = function (index) {
        if (index < 0 || index >= questions.length) return;
        currentIndex = index;
        renderCurrentQuestion();
        window.closeMobileDrawer();
    };

    window.nextQuestion = function () {
        if (currentIndex < questions.length - 1) {
            currentIndex++;
            renderCurrentQuestion();
        }
    };

    window.prevQuestion = function () {
        if (currentIndex > 0) {
            currentIndex--;
            renderCurrentQuestion();
        }
    };

    // Đánh dấu "ĐÃ ĐỌC RÙI"
    window.toggleReadCurrent = function () {
        const q = questions[currentIndex];
        if (!q) return;

        const isCurrentlyRead = readQuestions.has(q.id);
        if (isCurrentlyRead) {
            readQuestions.delete(q.id);
            showToast(`↩ Đã bỏ đánh dấu Câu ${q.id}!`);
        } else {
            readQuestions.add(q.id);
            showToast(`🎉 Đã điền: Câu ${q.id} đã đọc rùi!`);
        }

        saveReadStatus();
        renderCurrentQuestion();
    };

    // Ẩn/Hiện đáp án
    window.toggleCurrentAnswer = function () {
        answerHidden = !answerHidden;
        const ansSec = document.getElementById('currentAnswerSection');
        const icon = document.getElementById('btnAnswerIcon');
        const text = document.getElementById('btnAnswerText');

        if (ansSec) {
            if (answerHidden) {
                ansSec.classList.add('is-hidden');
                if (icon) icon.textContent = '👁️';
                if (text) text.textContent = 'Hiện đáp án';
            } else {
                ansSec.classList.remove('is-hidden');
                if (icon) icon.textContent = '🙈';
                if (text) text.textContent = 'Ẩn đáp án';
            }
        }
    };

    // Sao chép câu hỏi & đáp án
    window.copyCurrentQuestion = function () {
        const q = questions[currentIndex];
        if (!q) return;

        const textToCopy = `【CÂU ${q.id}: ${q.title}】\n\n❓ CÂU HỎI:\n${q.question}\n\n💡 ĐÁP ÁN:\n${q.plainAnswer}\n\n(Nguồn: Đề Cương Tự Luận KTCQ VIP 2026)`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`📋 Đã sao chép Câu ${q.id} vào bộ nhớ tạm!`);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = textToCopy;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(`📋 Đã sao chép Câu ${q.id}!`);
        });
    };

    // Chuyển theo chương
    window.filterByChapter = function (chapterId) {
        const chips = document.querySelectorAll('.chapter-chip');
        chips.forEach(c => {
            if (parseInt(c.getAttribute('data-chapter'), 10) === chapterId) {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });

        if (chapterId === 0) {
            window.goToQuestion(0);
            return;
        }

        // Tìm câu đầu tiên của chương
        const targetIdx = questions.findIndex(q => q.chapterId === chapterId);
        if (targetIdx !== -1) {
            window.goToQuestion(targetIdx);
        }
    };

    // Điều hướng bằng phím mũi tên
    function setupKeyboardNav() {
        window.addEventListener('keydown', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
                return;
            }
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                window.nextQuestion();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                window.prevQuestion();
            } else if (e.key === ' ' || e.key.toLowerCase() === 'd') {
                // Phím Space hoặc D: toggle đã đọc rùi
                window.toggleReadCurrent();
                e.preventDefault();
            }
        });
    }

    // Drawer Mobile
    window.openMobileDrawer = function () {
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('drawerOverlay');
        if (drawer && overlay) {
            drawer.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeMobileDrawer = function () {
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('drawerOverlay');
        if (drawer && overlay) {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    // Toast
    function showToast(message) {
        let toast = document.getElementById('tuluanGlobalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'tuluanGlobalToast';
            toast.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#0f172a; color:#fef08a; padding:10px 22px; border-radius:999px; font-weight:800; font-size:0.88rem; z-index:999999; box-shadow:0 6px 18px rgba(0,0,0,0.3); border:2.5px solid #000000; transition:opacity 0.25s; pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.innerHTML = message;
        toast.style.opacity = '1';
        toast.style.display = 'block';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 250);
        }, 2200);
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
