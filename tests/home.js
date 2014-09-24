describe('home page', function() {
  it('should load', function() {
    browser.driver.get('http://localhost:8080/');

    var h1 = browser.driver.findElement(by.css('h1'));

    expect(h1.getText()).toEqual('The Detroit Ledger');
  });
});
