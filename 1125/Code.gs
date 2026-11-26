// 구글 스프레드시트의 [확장 프로그램 → Apps Script]에서 사용합니다.
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('11월25일 저녁 신청 받기');
}

function saveApplication(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('신청 내용을 다시 입력해 주세요.');
  }

  const name = cleanInput(data.name, 40, '이름');
  const food = cleanInput(data.food, 100, '음식');
  const message = cleanInput(data.message, 300, '하고 싶은 말');

  // 동시에 여러 명이 신청해도 헤더와 신청 행을 순서대로 기록합니다.
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('구글 시트에서 [확장 프로그램 → Apps Script]로 프로젝트를 만들어 주세요.');
    }

    const sheet = spreadsheet.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['이름', '음식', '하고 싶은 말']);
    }
    sheet.appendRow([
      safeSheetText(name),
      safeSheetText(food),
      safeSheetText(message)
    ]);

    return '답장 감사합니다.';
  } finally {
    lock.releaseLock();
  }
}

function cleanInput(value, maxLength, label) {
  if (typeof value !== 'string') {
    throw new Error(label + '을(를) 입력해 주세요.');
  }
  const text = value.trim();
  if (!text || text.length > maxLength) {
    throw new Error(label + '을(를) 1~' + maxLength + '자로 입력해 주세요.');
  }
  return text;
}

// 스프레드시트에서 = 등의 입력이 수식으로 실행되지 않도록 문자로 저장합니다.
function safeSheetText(text) {
  return /^[\s\u0000-\u001f]*[=+\-@]/.test(text) ? "'" + text : text;
}
