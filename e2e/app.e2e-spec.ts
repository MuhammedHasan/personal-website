import { PwPage } from './app.po';

describe('pw App', () => {
  let page: PwPage;

  beforeEach(() => {
    page = new PwPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
