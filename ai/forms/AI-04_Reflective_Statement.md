# Reflective AI Use Statement — HW04

> Mẫu AI-04 (FIT@HCMUS – AI Policy Templates 2026 v1.0), chuyển sang Markdown. Nộp kèm vì bài khai **AI Category 4** (mẫu: "Required when submitting at AI Category 4 or 5").

## 1. Project & Author Info

| Field | Value |
|---|---|
| Course | CS423 / CSC13003 – Software Testing |
| Project / Capstone title | HW04 – Automation Testing on EShop |
| Team members (if group) | Bài cá nhân |
| Student name | Trần Thanh An |
| Student ID | 23120017 |
| Submission date | 18/11/2026 |

## 2. Reflection Questions

**1. How did AI support your work?**
Tôi dùng Claude Code cho từng bước của quy trình tự động hóa, mỗi bước một prompt:
- chọn 68 test case từ danh mục HW02;
- chuyển dữ liệu test sang file JSON;
- viết Page Object và sinh spec Playwright data-driven;
- chạy thử trên Chromium và phân loại các ca Fail;
- cấu hình chạy 3 trình duyệt kèm báo cáo "Run by";
- đối chiếu các ca Fail với issue HW02, phân tích chỗ AI làm sai;
- soạn Agent Skill, kịch bản video và bản nháp tài liệu.

**2. What did you accept, reject, or revise from AI outputs?**
- **Giữ:** danh sách TC, file dữ liệu, `LoginPage` và `CheckoutPage`, cấu hình báo cáo.
- **Sửa:** 3 spec bản gốc qua 6 commit `[S5]` (bỏ `mode: 'serial'`, dùng `expect.soft`, chờ kết quả rồi mới kiểm `toHaveCount(0)`, viết lại thông báo Fail cho dễ hiểu); `AdminImportPage` (chọn sai khối, chờ không ổn định trên WebKit); file CSV bị Git đổi xuống dòng.
- **Loại / ghi nhận:** assertion `toHaveURL(/login$/)` luôn đúng.
- Trong demo skill FR-05, tôi bổ sung 2 ca mà AI chưa đề xuất (từ khóa chứa HTML, trang chỉ có một thẻ `<h1>`).

**3. What errors, biases, or limitations did you notice in the AI outputs?**
- Chọn chế độ chạy `serial` làm 14 test bị bỏ qua sau một ca Fail.
- Assertion "không tồn tại" có thể Pass giả khi giao diện chưa kịp cập nhật.
- Lệnh chờ chỉ lỗi trên WebKit.
- Sinh assertion "cho đủ bộ" dù assertion đó không có ý nghĩa.
- Thiên về việc script chạy được hơn là chẩn đoán được lỗi.
- Giới hạn về phạm vi: bộ test giao diện không chạm tới được 4 bug nặng nhất của FR-09, vốn nằm ở tầng API.

**4. How did you verify information, sources, or claims provided by AI?**
- Chạy thật trên EShop và trên cả 3 trình duyệt (tự chạy 9 lần chính thức).
- Đọc thông báo lỗi và ảnh chụp của từng ca Fail.
- Đối chiếu với đặc tả README EShop và với issue HW02 (#90–#109).
- Xem diff của từng commit sửa script.
- Kiểm tra metadata "Run by" trong 9 file `results.json`.

**5. What did you learn through this project that you could not have learned by simply accepting AI output?**
- Một bộ test "chạy được" chưa chắc đã đúng. Phải biết vì sao từng ca Fail, và phải xét từng assertion có thực sự phân biệt được đúng/sai không.
- Khác biệt giữa các trình duyệt (WebKit) chỉ lộ ra khi chạy thật.
- Nguyên tắc tôi giữ lại: AI làm từng bước nhỏ, còn tiêu chí đúng/sai do tôi giữ. Mỗi lỗi AI đã mắc được đưa thành một quy tắc trong checklist (đã đóng gói vào Agent Skill).

## 3. AI Categories Used

[ ] Cat. 1 – No AI
[ ] Cat. 2 – AI for preparation only
[x] Cat. 3 – AI for feedback / revision
[x] Cat. 4 – AI-assisted production
[ ] Cat. 5 – AI-integrated work

## 4. Author Signature

By signing below, I confirm that this reflective statement is honest and accurately represents how AI was used in this project. I take full intellectual responsibility for the final submission.

| Field | Value |
|---|---|
| Student name (printed) | Trần Thanh An |
| Student ID | 23120017 |
| Class / Cohort | CSC13003 – Software Testing 2026 |
| Course | CS423 / CSC13003 – Software Testing |
| Instructor | Dr. Lam Quang Vu / Dr. Tran Duy Hoang / MSc. Tran Thi Bich Hanh / MSc. Truong Phuoc Loc / MSc. Ho Tuan Thanh |
| Date | 18/11/2026 |
| Signature | ____________________ |
