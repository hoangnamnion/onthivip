/**
 * Logic học Tự Luận - Mỗi trang 1 câu (Single-Question View)
 * Đa môn học: KTCQ (23 câu) & KCXDCB (27 câu)
 * Tối ưu hiệu năng 120 FPS không giật lag, hỗ trợ đánh dấu "Đã đọc rùi".
 */

(function () {
    'use strict';

    // State
    let activeCourseId = 'NLQH';
    let currentCourse = null;
    let currentIndex = 0; // 0 to questions.length - 1
    let questions = [];
    let readQuestions = new Set();
    let answerHidden = false;

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
        const courses = window.TULUAN_COURSES || (window.TULUAN_DATA ? { 'NLQH': window.TULUAN_DATA } : null);
        if (!courses) {
            console.error('Không tìm thấy dữ liệu TULUAN_COURSES!');
            return;
        }

        // 1. Xác định môn học đang chọn
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get('id');

        if (urlId && courses[urlId.toUpperCase()]) {
            activeCourseId = urlId.toUpperCase();
        } else {
            const savedCourse = localStorage.getItem('tuluan_last_active_course');
            if (savedCourse && courses[savedCourse] && savedCourse === 'NLQH') {
                activeCourseId = savedCourse;
            } else {
                activeCourseId = courses['NLQH'] ? 'NLQH' : Object.keys(courses)[0];
            }
        }

        setCourse(activeCourseId, false);
        setupKeyboardNav();
    }

    function setCourse(courseId, resetIndex = true) {
        const courses = window.TULUAN_COURSES;
        if (!courses || !courses[courseId]) return;

        activeCourseId = courseId;
        currentCourse = courses[courseId];
        questions = currentCourse.questions || [];

        localStorage.setItem('tuluan_last_active_course', activeCourseId);

        // Load danh sách "Đã đọc rùi" của môn này
        loadReadStatus();

        if (resetIndex) {
            currentIndex = 0;
        } else {
            const params = new URLSearchParams(window.location.search);
            const qParam = parseInt(params.get('q'), 10);
            if (!isNaN(qParam) && qParam >= 1 && qParam <= questions.length) {
                currentIndex = qParam - 1;
            } else {
                const lastSavedIndex = parseInt(localStorage.getItem(`tuluan_last_q_${activeCourseId}`) || '0', 10);
                if (!isNaN(lastSavedIndex) && lastSavedIndex >= 0 && lastSavedIndex < questions.length) {
                    currentIndex = lastSavedIndex;
                } else {
                    currentIndex = 0;
                }
            }
        }

        updateCourseUI();
        setupBackButton();
        renderProgress();
        renderChapterChips();
        renderNavGrid();
        renderCurrentQuestion();
    }

    function updateCourseUI() {
        const titleEl = document.getElementById('tuluanPageTitle');
        if (titleEl && currentCourse) {
            titleEl.innerHTML = `<span>${currentCourse.icon || '📖'}</span> TỰ LUẬN: ${currentCourse.shortName || currentCourse.id}`;
        }

        const drawerTitle = document.querySelector('.drawer-title');
        if (drawerTitle && currentCourse) {
            drawerTitle.textContent = `📑 Chọn Câu Hỏi (${questions.length} câu)`;
        }

        // Active state trên Course Switcher Pills
        const courseBtns = document.querySelectorAll('.course-switch-btn');
        courseBtns.forEach(btn => {
            if (btn.getAttribute('data-course') === activeCourseId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function setupBackButton() {
        const btnBack = document.getElementById('btnNavBack');
        if (!btnBack || !currentCourse) return;

        btnBack.href = `product.html?id=${currentCourse.id}&name=${encodeURIComponent(currentCourse.name)}`;
    }

    // Load & Save Read Status
    function loadReadStatus() {
        readQuestions = new Set();
        try {
            const raw = localStorage.getItem(`tuluan_read_questions_v2_${activeCourseId}`);
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
            localStorage.setItem(`tuluan_read_questions_v2_${activeCourseId}`, JSON.stringify(Array.from(readQuestions)));
        } catch (e) {}
    }

    // Render Chapter Filter Chips động theo môn
    function renderChapterChips() {
        const container = document.getElementById('chapterChipsRow');
        if (!container || !currentCourse) return;

        let html = `<button type="button" class="chapter-chip active" data-chapter="0" onclick="window.filterByChapter(0)">Tất cả (${questions.length})</button>`;

        if (Array.isArray(currentCourse.chapters)) {
            currentCourse.chapters.forEach(ch => {
                html += `
                    <button type="button" class="chapter-chip" data-chapter="${ch.id}" onclick="window.filterByChapter(${ch.id})">
                        ${escapeHtml(ch.title.split(':')[0] || ch.title)} (${ch.count})
                    </button>
                `;
            });
        }

        container.innerHTML = html;
    }

    // Render thanh tiến độ "Đã đọc rùi"
    function renderProgress() {
        const count = readQuestions.size;
        const total = questions.length;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;

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

            const label = q.qCode ? q.qCode.replace('Câu ', '') : (q.id < 10 ? '0' + q.id : q.id);

            html += `
                <button type="button" class="${classes.join(' ')}" onclick="window.goToQuestion(${idx})" title="${q.qCode || 'Câu ' + q.id}: ${escapeHtml(q.title)}">
                    <span class="q-pill-num">${label}</span>
                    ${isRead ? '<span class="q-pill-check">✓</span>' : ''}
                </button>
            `;
        });

        if (grid) grid.innerHTML = html;
        if (drawerGrid) drawerGrid.innerHTML = html;
    }

    // Render câu hỏi hiện tại (1 câu duy nhất)
    function renderCurrentQuestion() {
        const stage = document.getElementById('singleQuestionStage');
        if (!stage) return;

        const q = questions[currentIndex];
        if (!q) return;

        localStorage.setItem(`tuluan_last_q_${activeCourseId}`, currentIndex.toString());

        const isRead = readQuestions.has(q.id);
        const qCodeLabel = q.qCode || `CÂU ${q.id < 10 ? '0' + q.id : q.id}`;
        const chapterLabel = q.chapterTitle ? q.chapterTitle.split('–')[0].split(':')[0] : `Chương ${q.chapterId}`;

        stage.innerHTML = `
            <article class="tuluan-card" id="currentCard">
                <!-- Card Header -->
                <div class="card-meta-header">
                    <div class="card-pill-group">
                        <span class="pill-qnum">${escapeHtml(qCodeLabel)} (${currentIndex + 1}/${questions.length})</span>
                        <span class="pill-chapter">${escapeHtml(chapterLabel)}</span>
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

        // Cuộn nhẹ lên đầu nội dung
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
            showToast(`↩ Đã bỏ đánh dấu ${q.qCode || 'Câu ' + q.id}!`);
        } else {
            readQuestions.add(q.id);
            showToast(`🎉 Đã điền: ${q.qCode || 'Câu ' + q.id} đã đọc rùi!`);
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

        const textToCopy = `【${q.qCode || 'CÂU ' + q.id}: ${q.title}】\n\n❓ CÂU HỎI:\n${q.question}\n\n💡 ĐÁP ÁN:\n${q.plainAnswer}\n\n(Nguồn: Đề Cương Tự Luận ${currentCourse.shortName} VIP 2026)`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`📋 Đã sao chép ${q.qCode || 'Câu ' + q.id} vào clipboard!`);
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = textToCopy;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(`📋 Đã sao chép!`);
        });
    };

    // Đổi môn học trực tiếp
    window.switchCourse = function (courseId) {
        if (courseId === activeCourseId) return;

        const url = new URL(window.location.href);
        url.searchParams.set('id', courseId);
        url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());

        setCourse(courseId, true);
        showToast(`📚 Đã chuyển sang môn: ${currentCourse.name}`);
    };

    // Lọc theo chương
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

        const targetIdx = questions.findIndex(q => q.chapterId === chapterId);
        if (targetIdx !== -1) {
            window.goToQuestion(targetIdx);
        }
    };

    // Phím tắt bàn phím
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
