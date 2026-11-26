/**
 * 조재완 포트폴리오 웹 앱
 * Apps Script에서 이름이 index인 HTML 파일을 함께 만들어 주세요.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('조재완 | 소프트웨어 포트폴리오')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
