// =====================================================
// DANH SÁCH ĐỀ THI HỆ THỐNG (ĐÃ TỔNG HỢP TOÀN BỘ 30 MÔN HỌC)
// =====================================================
const DEFAULT_EXAMS = [
    {
        file: 'NLQH',
        ten: 'Nguyên Lý Quy Hoạch (NLQH)',
        questions: 127,
        desc: '113 câu trắc nghiệm cốt lõi & 14 câu lý thuyết đề cương chuẩn',
        zone: 'public',
        category: 'utt', hasTuluan: true
    },
    {
        file: 'chu-nghia-xa-hoi-khoa-hoc-k76-utt',
        ten: 'Chủ Nghĩa Xã Hội Khoa Học (K76 UTT)',
        questions: 366,
        desc: 'Trọn bộ 366 câu trắc nghiệm chuẩn ngân hàng K76 UTT 7 chương',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'chu-nghia-xa-hoi-khoa-hoc-utt',
        ten: 'Chủ Nghĩa Xã Hội Khoa Học (UTT Chuẩn)',
        questions: 347,
        desc: '347 câu trắc nghiệm cốt lõi theo đề cương chuẩn Đại học UTT',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'dclg-qlccc-k76-utt',
        ten: 'Đại Cương Logistics & Quản Lý Chuỗi Cung Ứng (UTT)',
        questions: 199,
        desc: '199 câu trắc nghiệm 5 chương nền tảng Logistics và SCM',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'dia-ly-van-tai-utt',
        ten: 'Địa Lý Vận Tải (UTT)',
        questions: 100,
        desc: '100 câu trắc nghiệm 4 chương mạng lưới giao thông & địa lý vận tải',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'hoc-phan-1-quan-su-utt',
        ten: 'Quân Sự HP1: Đường Lối Quốc Phòng & An Ninh (UTT)',
        questions: 210,
        desc: '210 câu trắc nghiệm chuẩn thi kết thúc học phần 1 Quốc phòng - An ninh',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'hoc-phan-2-quan-su-utt',
        ten: 'Quân Sự HP2: Công Tác Quốc Phòng & An Ninh (UTT)',
        questions: 198,
        desc: '198 câu trắc nghiệm chuẩn thi kết thúc học phần 2 Quân sự',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'ke-toan-quan-tri-k76-utt',
        ten: 'Kế Toán Quản Trị (KTQT K76 UTT)',
        questions: 301,
        desc: '301 câu trắc nghiệm 6 chương chi phí, điểm hòa vốn & dự toán',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'khoa-hoc-quan-ly-utt',
        ten: 'Khoa Học Quản Lý (UTT)',
        questions: 361,
        desc: '361 câu trắc nghiệm toàn diện nguyên lý & nghệ thuật quản lý',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'kinh-te-chinh-tri-k76-utt',
        ten: 'Kinh Tế Chính Trị Mác - Lênin (K76 UTT)',
        questions: 301,
        desc: '301 câu trắc nghiệm 6 chương hàng hóa, giá trị thặng dư & kinh tế thị trường',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'kinh-te-hoc',
        ten: 'Kinh Tế Học Đại Cương',
        questions: 163,
        desc: '163 câu trắc nghiệm quy luật cung cầu, co dãn, chi phí & thị trường',
        zone: 'public',
        category: 'chung'
    },
    {
        file: 'kinh-te-vi-mo-ulsa',
        ten: 'Kinh Tế Vĩ Mô (ULSA)',
        questions: 245,
        desc: '245 câu trắc nghiệm GDP, lạm phát, thất nghiệp & chính sách tài khóa/tiền tệ',
        zone: 'public',
        category: 'ulsa'
    },
    {
        file: 'lich-su-dang-utt',
        ten: 'Lịch Sử Đảng Cộng Sản Việt Nam (UTT)',
        questions: 362,
        desc: '362 câu trắc nghiệm 3 chương từ thời kỳ tiền khởi nghĩa đến đổi mới',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'lsvm-the-gioi-utt',
        ten: 'Lịch Sử Văn Minh Thế Giới (LSVM UTT)',
        questions: 150,
        desc: '150 câu trắc nghiệm các nền văn minh phương Đông & phương Tây cổ - trung đại',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'marketing-can-ban-ulsa',
        ten: 'Marketing Căn Bản (ULSA)',
        questions: 329,
        desc: '329 câu trắc nghiệm hành vi người tiêu dùng, STP & 4P',
        zone: 'public',
        category: 'ulsa'
    },
    {
        file: 'na-tath-ulsa',
        ten: 'Ngữ Âm Tiếng Anh Thực Hành (ULSA)',
        questions: 192,
        desc: '192 câu trắc nghiệm ngữ âm, trọng âm, ngữ điệu & nối âm',
        zone: 'public',
        category: 'ulsa'
    },
    {
        file: 'nguyen-li-thong-ke-utt',
        ten: 'Nguyên Lý Thống Kê & TKKD (UTT)',
        questions: 45,
        desc: '45 câu trắc nghiệm trọng tâm các chỉ tiêu phân tích thống kê kinh doanh',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'phap-luat-dai-cuong-k76-utt',
        ten: 'Pháp Luật Đại Cương (PLVN K76 UTT)',
        questions: 390,
        desc: '390 câu trắc nghiệm 24 chương nhà nước, pháp luật và các ngành luật',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'phap-luat-dai-cuong-utt',
        ten: 'Pháp Luật Đại Cương (UTT Chuẩn)',
        questions: 312,
        desc: '312 câu trắc nghiệm 9 chương hệ thống pháp luật Việt Nam',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'phap-luat-kinh-te-utt',
        ten: 'Pháp Luật Kinh Tế (UTT)',
        questions: 451,
        desc: '451 câu trắc nghiệm 6 chương luật doanh nghiệp, hợp đồng & phá sản',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'quan-tri-hoc-ulsa',
        ten: 'Quản Trị Học (ULSA)',
        questions: 196,
        desc: '196 câu trắc nghiệm 4 chức năng: hoạch định, tổ chức, lãnh đạo & kiểm tra',
        zone: 'public',
        category: 'ulsa'
    },
    {
        file: 'tai-chinh-tien-te-utt',
        ten: 'Tài Chính Tiền Tệ (UTT)',
        questions: 404,
        desc: '404 câu trắc nghiệm tiền tệ, hệ thống ngân hàng, lạm phát & thị trường tài chính',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'tcbm-ptcv-ulsa',
        ten: 'Tổ Chức Bộ Máy & Phân Tích Công Việc (ULSA)',
        questions: 199,
        desc: '199 câu trắc nghiệm thiết kế cơ cấu tổ chức & bản mô tả công việc',
        zone: 'public',
        category: 'ulsa'
    },
    {
        file: 'thuong-mai-dien-tu-utt',
        ten: 'Thương Mại Điện Tử (UTT)',
        questions: 51,
        desc: '51 câu trắc nghiệm mô hình B2B, B2C, thanh toán số & logistics TMĐT',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'tien-te-ngan-hang-k76-utt',
        ten: 'Tiền Tệ Ngân Hàng (K76 UTT)',
        questions: 270,
        desc: '270 câu trắc nghiệm nghiệp vụ ngân hàng thương mại & chính sách tiền tệ',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'tin-hoc-co-ban-utt',
        ten: 'Tin Học Cơ Bản (IC3 / Tin Đại Cương UTT)',
        questions: 714,
        desc: '714 câu trắc nghiệm 6 chương Word, Excel, PowerPoint & kiến thức máy tính',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'triet-hoc-ptit',
        ten: 'Triết Học Mác - Lênin (PTIT Chuẩn)',
        questions: 511,
        desc: '511 câu trắc nghiệm 3 chương chủ nghĩa duy vật biện chứng & lịch sử',
        zone: 'public',
        category: 'ptit'
    },
    {
        file: 'triet-hoc-ulsa',
        ten: 'Triết Học Mác - Lênin (ULSA Chuẩn)',
        questions: 751,
        desc: '751 câu trắc nghiệm ngân hàng đề thi chuẩn ĐH Lao Động Xã Hội',
        zone: 'public',
        category: 'ulsa'
    },
    {
        file: 'tu-tuong-hcm-utt',
        ten: 'Tư Tưởng Hồ Chí Minh (UTT)',
        questions: 475,
        desc: '475 câu trắc nghiệm 6 chương độc lập dân tộc, CNXH & xây dựng Đảng',
        zone: 'public',
        category: 'utt'
    },
    {
        file: 'van-hoa-doanh-nghiep-ulsa',
        ten: 'Văn Hóa Doanh Nghiệp (ULSA)',
        questions: 301,
        desc: '301 câu trắc nghiệm 5 chương xây dựng bản sắc & đạo đức kinh doanh',
        zone: 'public',
        category: 'ulsa'
    },
];

// =====================================================
// KHO TÀI NGUYÊN MỞ RỘNG (GOOGLE DRIVE, ĐỀ CƯƠNG AZOTA, DOCS)
// Cào toàn bộ từ tungmarketing.id.vn
// =====================================================
const EXTRA_STUDY_RESOURCES = {
    "BIM-dai-cuong-utt": {
        "title": "Tài liệu BIM đại cương UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/folders/1yfOSxo86y0ENlUdSvmeTupaApqkqSW-o?usp=drive_link",
            "quiz.html?subject=tu-tuong-hcm-utt",
            "https://azota.vn/vi/de-thi/9vccmt"
        ]
    },
    "chu-nghia-xa-hoi-utt": {
        "title": "Tài liệu Chủ nghĩa xã hội khoa học UTT | Đề cương + Azota | Tùng Marketing",
        "links": [
            "https://docs.google.com/document/d/1syEPSoHGWoH2YfG53IwNwGETOWxhG-O4/edit?usp=sharing&ouid=104590982649840774461&rtpof=true&sd=true",
            "quiz.html?subject=chu-nghia-xa-hoi-khoa-hoc-k76-utt",
            "quiz.html?subject=chu-nghia-xa-hoi-khoa-hoc-utt",
            "https://azota.vn/de-thi/9m9pbp",
            "https://azota.vn/de-thi/w7lxan",
            "https://azota.vn/de-thi/wsmxe2",
            "https://azota.vn/de-thi/rwqojn",
            "https://azota.vn/de-thi/lvb8ea"
        ]
    },
    "dai-cuong-logistic-utt": {
        "title": "Tài liệu Đại cương logistics và chuỗi cung ứng UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/3/folders/144kImJ8wSoADJQ0hnVnvQBE4j83aZnUF",
            "quiz.html?subject=dclg-qlccc-k76-utt",
            "https://azota.vn/de-thi/zyqtog"
        ]
    },
    "htgt-va-ptvt-utt": {
        "title": "Tài liệu Hạ tầng giao thông và phương tiện vận tải UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/2/folders/1mBgSNteoj2WoHs2kw3x1WoLLIfk7Tayx",
            "quiz.html?subject=",
            "https://azota.vn/de-thi/mybdda",
            "https://azota.vn/de-thi/bm3kuu",
            "https://azota.vn/de-thi/uzap9f",
            "https://azota.vn/de-thi/wh4zg5"
        ]
    },
    "hvntd-utt": {
        "title": "Hành vi người tiêu dùng UTT | Đề cương (Full miễn phí) | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/2/folders/1JiRKjoqlT3J2WHKjYcT0FGWnILDjueou",
            "https://drive.google.com/file/d/16yyVZdDSHovyd7HgTB_Dmgwddt05Sf3M/view?usp=drive_link",
            "https://azota.vn/de-thi/wrctfn"
        ]
    },
    "ke-toan-doanh-nghiep-utt": {
        "title": "Tài liệu Kế toán doanh nghiệp UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/0/folders/135camsxMivvkM_6Th7efpa7Q4ZyG-C5R",
            "https://drive.google.com/drive/u/0/folders/1Ni8HELz16hA3ZQL9MwCFMAAt0I1SNR_O",
            "https://drive.google.com/file/d/1GnUUAWsWwC9WuzGD3vhAEranw463Ne8i/view?usp=drive_link",
            "https://azota.vn/de-thi/wrctfn"
        ]
    },
    "khdl-ttnt-k75-utt": {
        "title": "Tài liệu Khoa học dữ liệu và trí tuệ nhân tạo UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/3/folders/1cYCqIqegtjjr92I3LHHPQ7cem7hC8m5J",
            "quiz.html?subject=#",
            "https://azota.vn/de-thi/jiuxq7",
            "https://azota.vn/de-thi/i07bev",
            "https://azota.vn/de-thi/lo8nad",
            "https://azota.vn/de-thi/xpz9yp",
            "https://azota.vn/de-thi/mq5npb",
            "https://azota.vn/de-thi/spmlaz",
            "https://azota.vn/de-thi/7vmv0i",
            "https://azota.vn/de-thi/ifqazo",
            "https://azota.vn/de-thi/hmnxyn"
        ]
    },
    "kinh-te-chinh-tri-utt": {
        "title": "Tài liệu Kinh tế chính trị Mác-Lênin UTT | Đề cương + Azota | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/5/folders/11V6aFofwmf8hlEEO6Q-6ST-q12h2pxDA",
            "quiz.html?subject=kinh-te-chinh-tri-k76-utt",
            "https://drive.google.com/file/d/1l83rwK5LcX0stpLEOlPn8rbNCCJQUNnW/view?usp=sharing",
            "https://azota.vn/de-thi/8cvlui",
            "https://azota.vn/de-thi/cqwo5l"
        ]
    },
    "kinh-te-luong-utt": {
        "title": "Kinh tế lượng UTT | Đề cương + Bài tập có giải PDF (Full miễn phí) | Tùng Marketing",
        "links": [
            "https://azota.vn/de-thi/wrctfn"
        ]
    },
    "kinh-te-quoc-te-ulsa": {
        "title": "Tài liệu Kinh tế quốc tế ULSA | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/5/folders/1NzPe27CQyuI4_-HRJW_GTzPXStMwEk9u",
            "quiz.html?subject=",
            "https://azota.vn/de-thi/dnpijs"
        ]
    },
    "li-thuyet-to-chuc-ulsa": {
        "title": "Tài liệu Lí thuyết tổ chức ULSA | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/5/folders/1_fFmYwdY1-DtVGLrzXWUxeIoFzIieO6F",
            "quiz.html?subject=",
            "https://azota.vn/de-thi/dnpijs"
        ]
    },
    "marketing-can-ban-utt": {
        "title": "Tài liệu Marketing căn bản UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/file/d/1dmBVOljTG0qskX4TaJmghtiCIpCj2Ebz/view?usp=drive_link"
        ]
    },
    "nguyen-li-ke-toan-1-ulsa": {
        "title": "Tài liệu Nguyên lí tế toán 1 ULSA | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/5/folders/1BR_amS0Fl2UQUgyZrxFUFNlPqrPjxo-O",
            "quiz.html?subject=nguyen-li-ke-toan-1-ulsa"
        ]
    },
    "nguyen-li-ke-toan-2-ulsa": {
        "title": "Tài liệu Nguyên lí tế toán 2 ULSA | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/5/folders/1kfPXjxt0uUKcAYOO8EjQBB5x8ZwnsvQk",
            "quiz.html?subject=nguyen-li-ke-toan-1-ulsa"
        ]
    },
    "nguyen-li-thong-ke-ulsa": {
        "title": "Tài liệu Nguyên lí thống kê ULSA | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/folders/1qWt4RAq1HutOSJVHghc6Gs2ewF-QcsLf?usp=drive_link",
            "https://azota.vn/de-thi/qw4h76"
        ]
    },
    "nguyen-ly-thong-ke-utt": {
        "title": "Tài liệu Nguyên lý thống kê UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/folders/1B0lYOmeF2kdyf1GNg1k_I0GXPDv9orPa?usp=drive_link",
            "https://drive.google.com/drive/folders/1JCzN1u8ALti-2eUW30ssttF_vsc_kNMA?usp=drive_link",
            "quiz.html?subject=nguyen-li-thong-ke-utt",
            "https://azota.vn/de-thi/zkeyjj"
        ]
    },
    "phap-luat-dai-cuong": {
        "title": "Tài liệu Pháp luật đại cương UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/2/folders/1tUebbQ2rrBUlVckSqhzlicS7V0h36SkX",
            "quiz.html?subject=phap-luat-dai-cuong-k76-utt",
            "quiz.html?subject=phap-luat-dai-cuong-utt",
            "https://azota.vn/de-thi/tzahqc"
        ]
    },
    "quan-su-utt": {
        "title": "Tài liệu Học phần quân sự UTT | Đề cương + Azota | Tùng Marketing",
        "links": [
            "quiz.html?subject=hoc-phan-1-quan-su-utt",
            "quiz.html?subject=hoc-phan-2-quan-su-utt",
            "https://azota.vn/de-thi/2pmb45",
            "https://azota.vn/de-thi/kjebnb"
        ]
    },
    "quan-tri-hoc-utt": {
        "title": "Tài liệu Quản trị học UTT | Đề cương + Azota | Tùng Marketing",
        "links": [
            "https://drive.google.com/file/d/12Qh_PVzDZKXWBYBoaubM0Ex8NW8nlU8L/view?usp=sharing",
            "https://docs.google.com/document/d/1msdnU2qoSRn0mpeeGvnmOa0_lIiw_4FM/edit?usp=sharing&ouid=104590982649840774461&rtpof=true&sd=true",
            "https://drive.google.com/file/d/1dDB3i3Zu8WEN0PTHDYEwKuWOjojb4UT4/view?usp=sharing",
            "https://azota.vn/de-thi/rinekw",
            "https://azota.vn/de-thi/nvdw0a",
            "https://azota.vn/de-thi/ghrgmm",
            "https://azota.vn/de-thi/abtukb",
            "https://azota.vn/de-thi/pbzdkj",
            "https://azota.vn/de-thi/8ovuqo",
            "https://azota.vn/de-thi/jgfmr5"
        ]
    },
    "quan-tri-kho-hang-utt": {
        "title": "Tài liệu Quản trị kho hàng UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/2/folders/1p6ekvb1OW72ViOG1kET16xxoWYkP3y6S",
            "https://azota.vn/de-thi/mybdda",
            "https://azota.vn/de-thi/bm3kuu",
            "https://azota.vn/de-thi/uzap9f",
            "https://azota.vn/de-thi/wh4zg5"
        ]
    },
    "quan-tri-nhan-su-utt": {
        "title": "Quản trị nhân sự UTT | Đề cương (Full miễn phí) | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/5/folders/1y4E8lR0lr8usl8F9o08JkafHzMEqK_16",
            "https://drive.google.com/drive/u/2/folders/1lnuNdS1sOCg7Pe5KK6tymOc72ZR337-X",
            "https://azota.vn/de-thi/wrctfn"
        ]
    },
    "quan-tri-san-xuat-utt": {
        "title": "Quản trị sản xuất UTT | Đề cương (Full miễn phí) | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/2/folders/15Y1owZzqNue-fjW_OexEufAUthFE6bZA",
            "https://docs.google.com/document/d/1_evgs91FccT_g9D5jLKlMSuzaSXx4toD/edit?usp=drive_link&ouid=104590982649840774461&rtpof=true&sd=true",
            "https://azota.vn/de-thi/wrctfn"
        ]
    },
    "tien-te-ngan-hang-utt": {
        "title": "Tài liệu Tiền tệ ngân hàng UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/file/d/1DnU2FrVefXrwOc_AN4BANBUDX4S4y6Ml/view?usp=sharing",
            "quiz.html?subject=tien-te-ngan-hang-k76-utt"
        ]
    },
    "tieng-anh-co-ban-utt": {
        "title": "Tài liệu Tiếng anh cơ bản UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/file/d/1BN2VobPt4bf-isB3tSfcSG8UhuocpEvS/view?usp=sharing",
            "https://drive.google.com/file/d/1nRDDXv0QOuAyRXdxFFClvz1uI41NZjso/view?usp=sharing",
            "https://drive.google.com/file/d/1IOcXSvINens7ZD5_9i_7UCq-YPKpCtBj/view?usp=drive_link"
        ]
    },
    "tieng-anh-nang-cao-utt": {
        "title": "Tài liệu Tiếng anh nâng cao UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/file/d/1kRfrVvx5ynIhGb8IT1q6t06d45g95JzW/view?usp=sharing",
            "https://drive.google.com/drive/folders/1hzbbVr5OlyvWCCFghOp-V4u43eaBZ1DB?usp=sharing",
            "https://drive.google.com/file/d/1IOcXSvINens7ZD5_9i_7UCq-YPKpCtBj/view?usp=drive_link"
        ]
    },
    "toan-dai-cuong-utt": {
        "title": "Tài liệu Toán đại cương UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/folders/1S_29p63-9opnEjdziaNQFPhueTCcs7bY?usp=sharing",
            "https://drive.google.com/file/d/1ypZ9H3dDHJe2_m-U9GkjW-J9N0GrIdA-/view?usp=sharing"
        ]
    },
    "toan-roi-rac-utt": {
        "title": "Toán rời rạc UTT | Đề cương (Full miễn phí) | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/u/2/folders/1BZ8QWFImbylzKwGlIUhbirqLF1WQo6x4",
            "https://azota.vn/de-thi/wrctfn"
        ]
    },
    "triet-hoc": {
        "title": "Tài liệu Triết học UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://docs.google.com/document/d/1mjhUiSokFb8z-SgppQD0C0sWCqD9I6EN/edit?usp=sharing&ouid=104590982649840774461&rtpof=true&sd=true",
            "https://azota.vn/vi/de-thi/34it0t",
            "https://docs.google.com/document/d/1Bf26EvcQNnI150455GaFunCo4rb0PU58/edit#heading=h.d61o8gmi3kbg"
        ]
    },
    "tu-duy-he-thong-utt": {
        "title": "Tài liệu Tư duy hệ thống UTT | Đề cương + Azota | Tùng Marketing",
        "links": [
            "https://docs.google.com/document/d/19tytK6hoNMlZTJ2ObGkZ_YpwA1NkH4N1I-yinog6L_I/edit?usp=sharing",
            "https://docs.google.com/document/d/1P3MX_nEnYyeb86PZKE83cVvyK7a3j4egfwQzAzRtiqA/edit?usp=sharing",
            "https://azota.vn/de-thi/wgo046"
        ]
    },
    "tu-tuong-hcm": {
        "title": "Tài liệu Tư tưởng Hồ Chí Minh UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://docs.google.com/document/d/1BKruMucR7KyfBaK6JhYn9wi9SbIgtMUJ/edit?usp=drive_link&ouid=104590982649840774461&rtpof=true&sd=true",
            "quiz.html?subject=tu-tuong-hcm-utt",
            "https://drive.google.com/file/d/1Kt-YRnsDc6ygTHfLX6wCY0fSfOoU3aPk/view?usp=sharing",
            "https://azota.vn/de-thi/wrctfn"
        ]
    },
    "van-hoa-kinh-doanh-utt": {
        "title": "Tài liệu Văn hóa kinh doanh và tinh thần khởi nghiệp UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://docs.google.com/document/d/1C80bOyAR1x-4t6KmUknXcy98KlVVYIqg/edit?usp=sharing&ouid=104590982649840774461&rtpof=true&sd=true",
            "https://docs.google.com/document/d/1apawsP52HCxRUJtuvNRNk9VMhODe-4Xy/edit?usp=sharing&ouid=104590982649840774461&rtpof=true&sd=true"
        ]
    },
    "xac-suat-thong-ke-ulsa": {
        "title": "Tài liệu Xác suất thống kê ULSA | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/drive/folders/192_h6AYda-8gcMQL_Pli9ROR_0yiXVo9?usp=drive_link",
            "https://azota.vn/de-thi/6usi0i"
        ]
    },
    "xac-suat-thong-ke-utt": {
        "title": "Tài liệu Xác suất thống kê UTT | Đề cương + Bài tập PDF | Tùng Marketing",
        "links": [
            "https://drive.google.com/file/d/1zg088SIiSUlK2pldhhbuFTxuhxwPOsUo/view?usp=sharing",
            "https://drive.google.com/file/d/1tII7sQL6NsZDSOcPN-YD3KqDae0-tgqi/view?usp=sharing",
            "https://drive.google.com/file/d/1wMiLxWXeYiG-nbJ7eEoPeCAcwH2ATsT9/view?usp=drive_link"
        ]
    }
};
